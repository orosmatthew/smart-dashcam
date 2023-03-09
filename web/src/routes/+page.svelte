<script lang="ts" context="module">
  export type Video = PageData['videos'][number];
</script>

<script lang="ts">
  import Counter from '$lib/Counter.svelte';
  import VideoPlayer from '$lib/VideoPlayer.svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { currentVideo } from './stores';

  export let data: PageData;
</script>

<svelte:head>
  <title>Smart Dashcam</title>
</svelte:head>

<body class="container mt-2">
  <h1>Smart Dashcam</h1>
  <Counter />
  <div class="mt-3">
    <a href="/login">Demo login page</a>
  </div>
  <div class="mt-4">
    <div class="mb-2">
      {#each data.videos as video}
        <button
          class="m-1 btn btn-secondary"
          on:click={() => {
            $currentVideo = video;
          }}>{video.friendly}</button
        >
      {/each}
    </div>
    {#if browser && $currentVideo}
      <VideoPlayer
        thumbnail={$currentVideo.thumbnail || ''}
        url={$currentVideo.url}
        type={$currentVideo.type}
      />
    {/if}
  </div>
</body>
