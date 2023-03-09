import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    const { username, password } = await request.json();
    if (username === 'hello' && password === 'world') {
        return json({ success: 200 });
    }
    return json({ error: 403 });
}) satisfies RequestHandler;
