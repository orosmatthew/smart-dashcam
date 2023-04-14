import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';

const imuPostData = z.object({
  timestamp: z.string().datetime(),
  gyroX: z.number(),
  gyroY: z.number(),
  gyroZ: z.number(),
  accelY: z.number(),
  accelZ: z.number(),
  accelX: z.number(),
  magX: z.number(),
  magY: z.number(),
  magZ: z.number(),
  temp: z.number()
});

export const POST = (async (event) => {
  let result = imuPostData.safeParse(await event.request.json());
  if (!result.success) {
    throw error(400, 'Invalid data format');
  }
  await db.iMU.create({ data: result.data });
  return json({ success: true });
}) satisfies RequestHandler;

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

export const GET = (async (event) => {
  let query: ImuGetData = await db.iMU.findMany();
  return json({ success: true, data: query });
}) satisfies RequestHandler;
