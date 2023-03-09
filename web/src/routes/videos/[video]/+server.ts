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

    const videoStream = fs.createReadStream(filePath);
    const fileMime = 'video/mp4';

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
      }
    });
    return new Response(stream, {
      headers: {
        'content-type': fileMime
      }
    });
  } catch (err) {
    throw error(404, 'video not found');
  }
}) satisfies RequestHandler;
