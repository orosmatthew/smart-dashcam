import { writable } from 'svelte/store';
import type { Video } from './+page.svelte';

export enum PageCategory {
  Recordings,
  Live
}

export const currentVideo = writable<Video>();
export const pageCategory = writable<PageCategory>();
