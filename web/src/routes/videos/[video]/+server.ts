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

    const fileMime = 'video/mp4';

    const stats = await fs.promises.stat(filePath);
    const fileSize = stats.size;

    const range = event.request.headers.get('range');
    if (range) {
      const [start, end] = range.replace(/bytes=/, '').split('-');
      const startRange = parseInt(start, 10);
      const endRange = end ? parseInt(end, 10) : fileSize - 1;
      const contentLength = endRange - startRange + 1;

      const videoStream = fs.createReadStream(filePath, { start: startRange, end: endRange });

      const stream = new ReadableStream({
        start(controller) {
          let streamClosed = false;
          videoStream.on('data', (chunk) => {
            controller.enqueue(chunk);
          });
          videoStream.on('end', () => {
            if (!streamClosed) {
              streamClosed = true;
              controller.close();
            }
          });
          videoStream.on('error', (err) => {
            if (!streamClosed) {
              streamClosed = true;
              controller.error(err);
            }
          });
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': fileMime,
          'Content-Range': `bytes ${startRange}-${endRange}/${fileSize}`,
          'Content-Length': contentLength.toString(),
          'Accept-Ranges': 'bytes'
        },
        status: 206 // Partial content
      });
    } else {
      const videoStream = fs.createReadStream(filePath);

      const stream = new ReadableStream({
        start(controller) {
          let streamClosed = false;
          videoStream.on('data', (chunk) => {
            controller.enqueue(chunk);
          });
          videoStream.on('end', () => {
            if (!streamClosed) {
              streamClosed = true;
              controller.close();
            }
          });
          videoStream.on('error', (err) => {
            if (!streamClosed) {
              streamClosed = true;
              controller.error(err);
            }
          });
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': fileMime,
          'Content-Length': fileSize.toString(),
          'Accept-Ranges': 'bytes'
        },
        status: 200 // OK
      });
    }
  } catch (err) {
    throw error(404, 'video not found');
  }
}) satisfies RequestHandler;
