import { buildId } from '../build';
export const GET = () => new Response(buildId, { headers: { 'Content-Type': 'text/plain' } });
