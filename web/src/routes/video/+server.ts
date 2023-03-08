import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (() => {
    return json({
        video: {
            thumbnail: '',
            url: '/sample-5s.mp4',
            type: 'video/mp4'
        }
    });
}) satisfies RequestHandler;
