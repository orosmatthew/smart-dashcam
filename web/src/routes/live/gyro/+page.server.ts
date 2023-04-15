import type { ImuGetData } from '../../api/imu/[start]/[end]/+server';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  let imuRes = await fetch(
    '/api/imu/' +
      encodeURI(new Date(new Date().valueOf() - 1 * 60000).toJSON()) +
      '/' +
      encodeURI(new Date().toJSON()),
    { method: 'GET' }
  );
  let imuData: ImuGetData = (await imuRes.json()).data;
  return { imu: imuData };
}) satisfies PageServerLoad;
