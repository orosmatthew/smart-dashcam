import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';
import { VIDEO_DIR } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const GET = (async (event) => {
  const videoFileName = event.params.video;

  try {
    const filePath = path.join(VIDEO_DIR, videoFileName);

    await fs.promises.access(filePath, fs.constants.R_OK);

    const videoStat = await fs.promises.stat(filePath);
    const fileMime = 'video/mp4';
    const fileSize = videoStat.size;

    const range = event.request.headers.get('range');
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = fileSize - 1;
    const chunkSize = end - start + 1;

    const headers = {
      'Content-Type': fileMime,
      'Content-Length': chunkSize.toString(),
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes'
    };

    const videoStream = fs.createReadStream(filePath, { start, end });

    const stream = new ReadableStream({
      start(controller) {
        videoStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        videoStream.on('end', () => {
          controller.close();
        });
        videoStream.on('error', (err) => {
          controller.error(err);
        });
      },
      cancel() {
        videoStream.destroy();
      }
    });
    return new Response(stream, {
      status: range ? 206 : 200,
      headers
    });
  } catch (err) {
    throw error(404, 'video not found');
  }
}) satisfies RequestHandler;
