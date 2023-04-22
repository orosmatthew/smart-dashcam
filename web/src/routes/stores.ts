import { writable } from 'svelte/store';

export enum PageCategory {
  Recordings,
  Live
}

export const pageCategory = writable<PageCategory>();
