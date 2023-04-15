<script lang="ts" context="module">
  export type Video = PageData['videos'][number];
</script>

<script lang="ts">
  import VideoPlayer from '$lib/VideoPlayer.svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { PageCategory, currentVideo, pageCategory } from './stores';
  import { onMount } from 'svelte';

  export let data: PageData;

  $pageCategory = PageCategory.Recordings;

  function updateVideoButtons() {
    document.querySelectorAll('.video-btn').forEach((element) => {
      const dataId = parseInt(element.getAttribute('data-id') || '');
      if (dataId === $currentVideo.id) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  let mounted = false;
  onMount(async () => {
    mounted = true;
  });

  $: if (browser && $currentVideo && mounted) {
    updateVideoButtons();
  }
</script>

<h2>Recordings</h2>
<div class="mt-4 row">
  <div class="col-md-12 col-lg-8">
    {#if browser && $currentVideo}
      <VideoPlayer
        thumbnail={$currentVideo.thumbnail || ''}
        url={$currentVideo.url}
        type={$currentVideo.type}
      />
    {/if}
  </div>
  <div class="col-md-12 col-lg-4 mb-2 mt-md-2 mt-lg-0">
    <div class="list-group">
      {#each data.videos as video}
        <button
          type="button"
          data-id={video.id}
          class="video-btn list-group-item list list-group-item-action"
          on:click={() => {
            $currentVideo = video;
          }}>{video.friendly ? video.friendly : video.url}</button
        >
      {/each}
    </div>
  </div>
</div>
