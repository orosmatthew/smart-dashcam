import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = (async () => {
  let data = await prisma.video.findMany({ where: { public: { equals: true } } });
  return { videos: data };
}) satisfies PageServerLoad;
