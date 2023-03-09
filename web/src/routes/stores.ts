import { writable } from 'svelte/store';
import type { Video } from './+page.svelte';

export const currentVideo = writable<Video>();
