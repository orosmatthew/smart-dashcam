import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import type { ImuGetData } from './api/imu/[start]/[end]/+server';

export const load = (async ({ fetch }) => {
  let data = await db.video.findMany({ where: { public: { equals: true } } });
  let imuRes = await fetch(
    '/api/imu/' +
      encodeURI(new Date(new Date().valueOf() - 1 * 60000).toJSON()) +
      '/' +
      encodeURI(new Date().toJSON()),
    { method: 'GET' }
  );
  let imuData: ImuGetData = (await imuRes.json()).data;
  return { videos: data, imu: imuData };
}) satisfies PageServerLoad;
