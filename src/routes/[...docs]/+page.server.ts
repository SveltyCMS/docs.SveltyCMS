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
        const dirPath = path.resolve('src/routes', docsPath);
        try {
            await fs.access(dirPath);
            docsPath = path.join(docsPath, 'README');
        } catch {
            docsPath = `${docsPath}`;
        }
    }

    const filePath = path.resolve('src/routes', `${docsPath}.md`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);
        let renderedContent = md.render(content);
        
        // Remove the first <h1> tag from the rendered content
        renderedContent = renderedContent.replace(/<h1>.*?<\/h1>/, '');

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
