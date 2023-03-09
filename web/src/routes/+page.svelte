<script lang="ts">
    import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css';
    import Counter from '$lib/Counter.svelte';
    import VideoPlayer from '$lib/VideoPlayer.svelte';
    import { browser } from '$app/environment';

    let videoDataReady = false;
    let thumbnail: string;
    let url: string;
    let type: string;
    let error: boolean;

    if (browser) {
        fetch('/video')
            .then((response) => response.json())
            .then((data) => {
                thumbnail = data.video.thumbnail;
                url = data.video.url;
                type = data.video.type;
                videoDataReady = true;
            })
            .catch(() => {
                error = true;
            });
    }
</script>

<svelte:head>
    <title>Smart Dashcam</title>
</svelte:head>

<body class="container mt-2">
    <h1>Smart Dashcam</h1>
    <Counter />
    <div class="mt-4">
        {#if browser && videoDataReady}
            <VideoPlayer {thumbnail} {url} {type} />
        {:else if browser && error}
            <div class="alert alert-danger" role="alert">Failed to load video</div>
        {:else}
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        {/if}
    </div>
</body>
