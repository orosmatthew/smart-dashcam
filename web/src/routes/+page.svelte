<script lang="ts">
    import Counter from '$lib/Counter.svelte';
    import VideoPlayer from '$lib/VideoPlayer.svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    let thumbnail = $page.data.video.thumbnail;
    let url = $page.data.video.url;
    let type = $page.data.video.type;
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
        {#if browser && url}
            <VideoPlayer {thumbnail} {url} {type} />
        {:else}
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        {/if}
    </div>
</body>
