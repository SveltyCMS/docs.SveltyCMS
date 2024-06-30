import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

const md = new MarkdownIt();

export const load: PageServerLoad = async ({ params }) => {
    const docsPathArray = Array.isArray(params.docs) ? params.docs : [params.docs];
    let docsPath = docsPathArray.join('/');

    if (docsPath === '') {
        docsPath = 'docs/getting-started/README';
    } else if (!docsPath.endsWith('.md')) {
        // Check if the path exists as a directory
        const dirPath = path.resolve('src/routes', docsPath);
        try {
            await fs.access(dirPath);
            // If it's a directory, append README.md
            docsPath = path.join(docsPath, 'README');
        } catch {
            // If it's not a directory, assume it's a file without .md extension
            docsPath = `${docsPath}`;
        }
    }

    const filePath = path.resolve('src/routes', `${docsPath}.md`);

    console.log(`Requested docs path: ${docsPath}`);
    console.log(`Full resolved file path: ${filePath}`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);
        const renderedContent = md.render(content);
        
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