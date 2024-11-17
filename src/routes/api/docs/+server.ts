import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDocs, searchDocs } from '$lib/docsIndex';

export const GET: RequestHandler = async ({ url }) => {
  const searchQuery = url.searchParams.get('search') || '';
  const type = url.searchParams.get('type') as 'user' | 'dev' | null;

  try {
    const docs = await searchDocs(searchQuery, type || undefined);
    return json(docs);
  } catch (error) {
    console.error('Error fetching docs:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
