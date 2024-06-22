import type { RequestHandler } from '@sveltejs/kit';
import { getDocs, searchDocs } from '$lib/docsIndex';

export const GET: RequestHandler = async ({ url }) => {
  const searchQuery = url.searchParams.get('search') || '';
  const docs = searchQuery ? searchDocs(searchQuery) : getDocs();
  return new Response(JSON.stringify(docs), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};