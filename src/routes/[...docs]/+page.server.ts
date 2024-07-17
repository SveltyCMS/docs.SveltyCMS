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

    // Handle empty path by defaulting to the main introduction file
    if (docsPath === '') {
        docsPath = 'getting-started/01-introduction.md';
    } else if (!docsPath.endsWith('.md')) {
        const dirPath = path.resolve('src/routes/docs', docsPath);
        try {
            const stat = await fs.stat(dirPath);
            if (stat.isDirectory()) {
                // Default to README.md or the first prefixed file like '01-'
                const files = await fs.readdir(dirPath);
                const defaultFile = files.find(file => file.toLowerCase() === 'readme.md') || files.find(file => file.match(/^\d+-/));
                if (defaultFile) {
                    docsPath = path.join(docsPath, defaultFile);
                } else {
                    throw error(404, `No default file found in ${dirPath}`);
                }
            } else {
                docsPath = `${docsPath}.md`;
            }
        } catch {
            docsPath = `${docsPath}.md`;
        }
    }

    const filePath = path.resolve('src/routes/docs', docsPath);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);
        let renderedContent = md.render(content);

        // Remove the first <h1> tag from the rendered content
        renderedContent = renderedContent.replace(/<h1[^>]*>.*?<\/h1>/, '');

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