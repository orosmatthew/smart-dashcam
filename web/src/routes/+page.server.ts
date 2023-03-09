import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const videoQuery = await prisma.video.findMany();

export const load = (async () => {
    let data = videoQuery;
    return { videos: data };
}) satisfies PageServerLoad;

export type Video = typeof videoQuery;
