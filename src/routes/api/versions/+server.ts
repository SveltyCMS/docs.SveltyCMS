import { json } from '@sveltejs/kit';

async function fetchLatestVersions() {
  try {
    const nodeResponse = await fetch('https://nodejs.org/dist/index.json');
    const nodeData = await nodeResponse.json();
    const latestStable = nodeData.find(version => version.lts);
    
    const npmResponse = await fetch('https://registry.npmjs.org/npm/latest');
    const npmData = await npmResponse.json();

    return {
      node: latestStable ? latestStable.version.slice(1) : 'Unable to fetch',
      npm: npmData.version || 'Unable to fetch'
    };
  } catch (error) {
    console.error('Error fetching versions:', error);
    return {
      node: 'Unable to fetch',
      npm: 'Unable to fetch'
    };
  }
}

export async function GET() {
  const versions = await fetchLatestVersions();
  return json(versions);
}
