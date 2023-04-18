import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { z } from 'zod';

export type BookmarkGetData = {
  timestamp: Date;
}[];

export const GET = (async ({ params }) => {
  let startResult = z.string().datetime().safeParse(params.start);
  let endResult = z.string().datetime().safeParse(params.end);
  if (!startResult.success || !endResult.success) {
    throw error(400, 'Invalid request format');
  }
  let query: BookmarkGetData = await db.bookmark.findMany({
    where: { timestamp: { gte: startResult.data, lte: endResult.data } }
  });
  return json({ success: true, data: query });
}) satisfies RequestHandler;
