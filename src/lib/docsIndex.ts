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

async function loadDocs() {
  //console.log("Loading documentation files...");

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
    };

    if (segments.length === 2 && segments[1].toLowerCase() === 'readme') {
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
        tempDocs[parentPath] = tempDocs[parentPath] || { title: parentPath, path: parentPath, children: [] };
        tempDocs[parentPath].children = tempDocs[parentPath].children || [];
        tempDocs[parentPath].children!.push(doc);
      }
    }
  }

  docsCache = Object.values(tempDocs).filter(doc => !doc.path.includes('/'));
  docsCache.forEach(doc => {
    if (doc.children) {
      doc.children.sort((a, b) => {
        if (a.title.startsWith('01-')) return -1;
        if (b.title.startsWith('01-')) return 1;
        return a.title.localeCompare(b.title);
      });
    }
  });

  // Ensure 'getting-started' is first
  docsCache.sort((a, b) => {
    if (a.path === 'getting-started') return -1;
    if (b.path === 'getting-started') return 1;
    return a.title.localeCompare(b.title);
  });

  // console.log("Finished loading documentation files.");
  // console.log("docsCache:", JSON.stringify(docsCache, null, 2));
}

function initDocs() {
  if (docsCache.length === 0) {
    loadDocs().catch(err => console.error("Failed to load docs:", err));
  }
}

initDocs();

export function getDocs(): Doc[] {
  // console.log("Fetching docs from cache:", JSON.stringify(docsCache, null, 2));
  return docsCache;
}

export function searchDocs(query: string): Doc[] {
  const searchLower = query.toLowerCase();
  // console.log(`Searching docs with query: ${query}`);

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
  // console.log("Search results:", JSON.stringify(results, null, 2));
  return results;
}