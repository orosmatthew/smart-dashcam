import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = (async () => {
    let data = await prisma.video.findFirst({where: {id: {equals: 2}}});
    return { video: data };
}) satisfies PageServerLoad;
