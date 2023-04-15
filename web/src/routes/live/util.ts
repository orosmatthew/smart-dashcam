import type { ImuGetData } from '../api/imu/[start]/[end]/+server';

export async function fetchImuData(): Promise<ImuGetData> {
  let imuRes = await fetch(
    '/api/imu/' +
      encodeURI(new Date(new Date().valueOf() - 1 * 60000).toJSON()) +
      '/' +
      encodeURI(new Date().toJSON()),
    { method: 'GET' }
  );
  let imuData: ImuGetData = (await imuRes.json()).data;
  return imuData;
}
