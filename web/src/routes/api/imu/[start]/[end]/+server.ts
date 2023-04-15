import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { z } from 'zod';

export type ImuGetData = {
  timestamp: Date;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  accelY: number;
  accelZ: number;
  accelX: number;
  magX: number;
  magY: number;
  magZ: number;
  temp: number;
}[];

export const GET = (async ({ params }) => {
  let startResult = z.string().datetime().safeParse(params.start);
  let endResult = z.string().datetime().safeParse(params.end);
  if (!startResult.success || !endResult.success) {
    throw error(400, 'Invalid request format');
  }
  let query: ImuGetData = await db.iMU.findMany({
    where: { timestamp: { gte: startResult.data, lte: endResult.data } }
  });
  return json({ success: true, data: query });
}) satisfies RequestHandler;
