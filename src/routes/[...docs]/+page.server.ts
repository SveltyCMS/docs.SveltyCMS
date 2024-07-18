import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

export const load: PageServerLoad = async ({ params }) => {
  const docsPathArray = Array.isArray(params.docs) ? params.docs : [params.docs];
  let docsPath = docsPathArray.join('/');

  console.log('Docs path:', docsPath);  // Debug log

  // Remove 'docs/' from the beginning of the path if it exists
  docsPath = docsPath.replace(/^docs\//, '');

  // Handle empty path, 'getting-started', or other top-level sections
  if (docsPath === '' || !docsPath.includes('/')) {
    const dirPath = path.resolve('src/routes/docs', docsPath);
    try {
      const files = await fs.readdir(dirPath);
      const sortedFiles = files
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
          const aNum = parseInt(a.split('-')[0]) || Infinity;
          const bNum = parseInt(b.split('-')[0]) || Infinity;
          return aNum - bNum;
        });
      if (sortedFiles.length > 0) {
        docsPath = `${docsPath}/${sortedFiles[0].replace(/\.md$/, '')}`.replace(/^\//, '');
      } else {
        throw error(404, `No markdown files found in ${dirPath}`);
      }
    } catch (err) {
      console.error(`Error reading directory: ${dirPath}`, err);
      throw error(500, 'Server error');
    }
  }

  // Construct the file path
  let filePath = path.resolve('src/routes/docs', `${docsPath}.md`);
  console.log('File path:', filePath);  // Debug log

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      // If it's a directory, look for a default file
      const files = await fs.readdir(filePath);
      const defaultFile = files.find(file => file.toLowerCase().startsWith('01-')) || files.find(file => file.match(/^\d+-/));
      if (defaultFile) {
        filePath = path.join(filePath, defaultFile);
      } else {
        throw error(404, `No default file found in ${filePath}`);
      }
    }
  } catch (err) {
    // If the file doesn't exist, try adding .md extension
    if (!filePath.endsWith('.md')) {
      filePath += '.md';
    }
  }

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContent);
    let renderedContent = md.render(content);

    // Remove the first <h1> tag from the rendered content
    renderedContent = renderedContent.replace(/<h1[^>]*>.*?<\/h1>/, '');

    // Resolve relative links
    const basePath = path.dirname(docsPath);
    renderedContent = renderedContent.replace(/(\.\/[^\s)]+)/g, (match) => {
      return path.join(basePath, match).replace(/\\/g, '/');
    });

    // Fix relative links to use the full path
    renderedContent = renderedContent.replace(/href="(\.\/[^\"]+)"/g, (match, p1) => {
      const fullPath = path.join('/docs', basePath, p1).replace(/\\/g, '/');
      return `href="${fullPath}"`;
    });

    return {
      content: renderedContent,
      frontMatter,
      path: docsPath
    };
  } catch (err) {
    console.error(`Failed to load markdown file from: ${filePath}`, err);
    throw error(404, `Could not load ${docsPath}`);
  }
};
