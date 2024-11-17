import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import type { Input } from 'gray-matter';

const md = new MarkdownIt();

export interface Doc {
  title: string;
  path: string;
  icon: string;
  description: string;
  content: string;
  published?: boolean;
  type?: 'user' | 'dev';
  section?: string;
  order?: number;
}

let docsCache: Doc[] = [];
let docsLoaded = false;
let loadingPromise: Promise<void> | null = null;

function extractOrder(path: string): number {
  const match = path.match(/(\d+)[_-]/);
  return match ? parseInt(match[1]) : 999;
}

function cleanTitle(title: string): string {
  return title
    .replace(/^\d+[_-]/, '') // Remove leading numbers and underscore/hyphen
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\.md$/, ''); // Remove .md extension
}

function getSection(path: string): string {
  const parts = path.split('/');
  // For dev docs, get the parent directory name (e.g., "01_Getting_Started")
  if (parts.includes('Developer_Guide') && parts.length > 2) {
    const sectionPath = parts[parts.length - 2];
    return cleanTitle(sectionPath);
  }
  // For user docs, get the immediate parent directory
  if (parts.length > 1) {
    return cleanTitle(parts[parts.length - 2]);
  }
  return '';
}

async function loadDocs() {
  console.log('Starting to load docs...');
  const modules = import.meta.glob('../routes/Docs/**/*.md', { eager: true, query: '?raw', import: 'default' });

  const tempDocs: Doc[] = [];

  for (const path in modules) {
    const rawContent = modules[path] as string;
    const { data, content: markdownContent } = matter(rawContent as Input);
    const htmlContent = md.render(markdownContent);

    const relativePath = path.replace('../routes/Docs/', '').replace(/\.md$/, '');
    
    // Skip README files from the sidebar
    if (relativePath.toLowerCase() === 'readme.md' || relativePath.toLowerCase().endsWith('/readme.md')) {
      continue;
    }

    // Get the section name from the path
    const section = getSection(relativePath);
    const order = extractOrder(relativePath);

    const doc: Doc = {
      ...data,
      content: htmlContent,
      path: relativePath,
      title: data.title || cleanTitle(relativePath.split('/').pop() || ''),
      icon: data.icon || 'mdi:file-document',
      description: data.description || '',
      published: data.published !== false,
      type: data.type || 'user',
      section,
      order
    };

    tempDocs.push(doc);
  }

  // Sort docs by section and order
  docsCache = tempDocs.sort((a, b) => {
    if (a.section !== b.section) {
      // Sort by order first for sections
      const aOrder = extractOrder(a.section);
      const bOrder = extractOrder(b.section);
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.section.localeCompare(b.section);
    }
    return (a.order || 999) - (b.order || 999);
  });

  docsLoaded = true;
}

async function initDocs() {
  if (!docsLoaded && !loadingPromise) {
    loadingPromise = loadDocs().catch(error => {
      console.error('Error loading docs:', error);
      loadingPromise = null;
    });
  }
  return loadingPromise;
}

export async function getDocs(): Promise<Doc[]> {
  await initDocs();
  return docsCache;
}

export async function getDocsByType(type: 'user' | 'dev'): Promise<Doc[]> {
  await initDocs();
  return docsCache.filter(doc => doc.type === type);
}

export async function searchDocs(query: string, type?: 'user' | 'dev'): Promise<Doc[]> {
  await initDocs();
  
  if (!query.trim()) {
    return type ? await getDocsByType(type) : docsCache;
  }

  const searchTerms = query.toLowerCase().split(' ');
  
  function matchesSearch(doc: Doc): boolean {
    const text = `${doc.title} ${doc.description} ${doc.section}`.toLowerCase();
    return searchTerms.every(term => text.includes(term));
  }
  
  const filteredDocs = docsCache.filter(doc => {
    if (type && doc.type !== type) {
      return false;
    }
    return matchesSearch(doc);
  });

  return filteredDocs;
}

initDocs();
