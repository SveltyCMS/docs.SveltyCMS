import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';

export const load: PageServerLoad = async ({ params }) => {
    // Ensure params.docs is handled correctly as an array or string
    const docsPathArray = Array.isArray(params.docs) ? params.docs : [params.docs];
    let docsPath = docsPathArray.join('/');

    // If no specific file is provided, default to README.md
    if (!docsPathArray[docsPathArray.length - 1].endsWith('.md')) {
        docsPath = path.join(docsPath, 'README');
    }

    // Resolve the full path to the markdown file
    const filePath = path.resolve('src/routes/docs', `${docsPath}.md`);

    try {
        // Log the resolved file path for debugging
        console.log(`Loading markdown file from: ${filePath}`);
        const text = await fs.readFile(filePath, 'utf-8');
        return {
            content: text,
            path: docsPath
        };
    } catch (err) {
        console.error(`Failed to load markdown file from: ${filePath}`, err);
        throw error(404, `Could not load ${docsPath}`);
    }
};
