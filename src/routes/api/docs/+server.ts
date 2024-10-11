import type { RequestHandler } from '@sveltejs/kit';
import { getDocs, searchDocs } from '$lib/docsIndex';

export const GET: RequestHandler = async ({ url }) => {
  try {
    console.log('API endpoint called');
    const searchQuery = url.searchParams.get('search') || '';
    console.log('Search query:', searchQuery);

    let docs;
    if (searchQuery) {
      docs = await searchDocs(searchQuery);
    } else {
      docs = await getDocs();
    }

    console.log(`Returning ${docs.length} docs from API`);

    return new Response(JSON.stringify(docs), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in API endpoint:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
