import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import type { Input } from 'gray-matter';

const md = new MarkdownIt();

interface Doc {
  title: string;
  path: string;
  icon: string;
  description: string;
  content: string;
  children?: Doc[];
}

let docsCache: Doc[] = [];
let docsLoaded = false;
let loadingPromise: Promise<void> | null = null;

async function loadDocs() {
  console.log('Starting to load docs...');
  const modules = import.meta.glob('../routes/docs/**/*.md', { eager: true, query: '?raw', import: 'default' });

  const tempDocs: { [key: string]: Doc } = {};

  for (const path in modules) {
    console.log(`Processing file: ${path}`);
    const rawContent = modules[path] as string;
    const { data, content: markdownContent } = matter(rawContent as Input);
    const htmlContent = md.render(markdownContent);

    const relativePath = path.replace('../routes/docs/', '').replace(/\.md$/, '');
    const segments = relativePath.split('/');

    const doc: Doc = {
      ...data,
      content: htmlContent,
      path: relativePath,
      title: data.title || segments[segments.length - 1],
      icon: data.icon || '',
      description: data.description || '',
      children: []
    };

    if (segments.length === 2 && segments[1].toLowerCase().startsWith('01-')) {
      const parentPath = segments[0];
      tempDocs[parentPath] = {
        ...doc,
        path: parentPath,
        title: doc.title,
        description: doc.description,
        children: tempDocs[parentPath]?.children || [],
      };
    } else {
      tempDocs[relativePath] = doc;

      if (segments.length > 1) {
        const parentPath = segments.slice(0, -1).join('/');
        if (!tempDocs[parentPath]) {
          tempDocs[parentPath] = {
            title: parentPath,
            path: parentPath,
            icon: '',
            description: '',
            content: '',
            children: []
          } as Doc;
        }
        tempDocs[parentPath].children!.push(doc);
      }
    }
  }

  docsCache = Object.values(tempDocs).filter(doc => !doc.path.includes('/'));
  console.log(`Loaded ${docsCache.length} top-level docs`);

  docsCache.forEach(doc => {
    if (doc.children) {
      doc.children.sort((a, b) => {
        const aTitleMatch = a.title.match(/^\d+/);
        const bTitleMatch = b.title.match(/^\d+/);
        const aNum = aTitleMatch ? parseInt(aTitleMatch[0]) : 0;
        const bNum = bTitleMatch ? parseInt(bTitleMatch[0]) : 0;
        return aNum - bNum;
      });
    }
  });

  // Ensure 'getting-started' is first
  docsCache.sort((a, b) => {
    if (a.path === 'getting-started') return -1;
    if (b.path === 'getting-started') return 1;
    return a.title.localeCompare(b.title);
  });

  docsLoaded = true;
  console.log('Docs loading completed');
}

function initDocs() {
  if (!loadingPromise) {
    console.log('Initializing docs loading...');
    loadingPromise = loadDocs().catch(err => {
      console.error("Failed to load docs:", err);
      loadingPromise = null;
    });
  }
  return loadingPromise;
}

export async function getDocs(): Promise<Doc[]> {
  console.log('getDocs called, docsLoaded:', docsLoaded);
  if (!docsLoaded) {
    await initDocs();
  }
  console.log(`Returning ${docsCache.length} docs`);
  return docsCache;
}

export async function searchDocs(query: string): Promise<Doc[]> {
  console.log('searchDocs called, query:', query);
  if (!docsLoaded) {
    await initDocs();
  }

  const searchLower = query.toLowerCase();

  function filterDocs(docs: Doc[], parentTitle = ''): Doc[] {
    return docs
      .map(doc => {
        const fullTitle = `${parentTitle} ${doc.title}`.trim().toLowerCase();
        const children = doc.children ? filterDocs(doc.children, fullTitle) : [];
        const match =
          fullTitle.includes(searchLower) ||
          doc.content.toLowerCase().includes(searchLower) ||
          children.length > 0;

        return match ? { ...doc, children } : null;
      })
      .filter(Boolean) as Doc[];
  }

  const results = filterDocs(docsCache);
  console.log(`Search returned ${results.length} results`);
  return results;
}
