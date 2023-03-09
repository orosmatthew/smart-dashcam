<script lang="ts">
    import Counter from '$lib/Counter.svelte';
    import VideoPlayer from '$lib/VideoPlayer.svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import type { Video } from './+page.server';

    let videos: Video[] = $page.data.videos;

    let currentVideo: Video;
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
        {#each videos as video}
            <button
                class="m-1 btn btn-secondary"
                on:click={() => {
                    currentVideo = video;
                }}>{video.url}</button
            >
        {/each}
        {#if browser && currentVideo}
            <VideoPlayer
                thumbnail={currentVideo.thumbnail}
                url={currentVideo.url}
                type={currentVideo.type}
            />
        {:else}
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        {/if}
    </div>
</body>
