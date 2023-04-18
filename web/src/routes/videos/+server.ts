import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import path from 'path';

const videoPostData = z.object({
  timeBegin: z.string().datetime(),
  timeEnd: z.string().datetime(),
  filename: z.string()
});

export const POST = (async (event) => {
  let result = videoPostData.safeParse(await event.request.json());
  if (!result.success) {
    throw error(400, 'Invalid request');
  } else {
    await db.video.create({
      data: {
        timeBegin: result.data.timeBegin,
        timeEnd: result.data.timeEnd,
        url: path.join('/videos', result.data.filename),
        type: 'video/mp4',
        public: true
      }
    });
  }
  return json({ success: true });
}) satisfies RequestHandler;
