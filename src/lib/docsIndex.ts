import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

interface Doc {
  title: string;
  content: string;
  file: string;
  path: string;
  // Assume front matter can have optional properties like author and date
  author?: string;
  date?: string;
}

let docsCache: Doc[] = [];

async function loadDocs() {
 
  const modules = import.meta.glob('../routes/docs/**/*.md', { eager: true, as: 'raw' });
 
  docsCache = Object.entries(modules).map(([path, content]) => {
    const { data, content: markdownContent } = matter(content);
    const htmlContent = md.render(markdownContent);
    return {
      ...data,
      content: htmlContent,
      file: path,
      path: path.replace('../routes/docs/', '').replace(/\.md$/, '').replace(/\\/g, '/')
    } as Doc;
  });
}

// Function to initialize the docsCache when the module is imported
function initDocs() {
  if (docsCache.length === 0) {
    loadDocs().catch(err => console.error("Failed to load docs:", err));
  }
}

initDocs();

export function getDocs(): Doc[] {
  return docsCache;
}

export function searchDocs(query: string): Doc[] {
  return docsCache.filter(doc => {
    return (
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase())
    );
  });
}