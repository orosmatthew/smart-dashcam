import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';

const bookmarkPostData = z
  .object({
    timestamp: z.string().datetime()
  })
  .strict();

export const POST = (async ({ request }) => {
  let result = bookmarkPostData.safeParse(await request.json());
  if (!result.success) {
    throw error(400, 'Invalid data');
  }
  try {
    await db.bookmark.create({ data: { timestamp: result.data.timestamp } });
  } catch {
    return json({ success: false });
  }

  return json({ success: true });
}) satisfies RequestHandler;
