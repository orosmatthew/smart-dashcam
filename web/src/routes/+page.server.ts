import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load = (async () => {
  let data = await db.video.findMany({ where: { public: { equals: true } } });
  return { videos: data };
}) satisfies PageServerLoad;
