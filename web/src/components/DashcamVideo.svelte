<script lang="ts">
    import VideoPlayer from "./VideoPlayer.svelte";

    let thumbnail: string;
    let url: string;
    let type: string;

    let ready: boolean = false;
    let error: boolean = false;

    fetch("//localhost:3001/video")
        .then((response) => response.json())
        .then((data) => {
            thumbnail = data.video.thumbnail;
            url = data.video.url;
            type = data.video.type;
            ready = true;
        })
        .catch(() => {
            error = true;
        });
</script>

{#if ready}
    <VideoPlayer {thumbnail} {url} {type} />
{:else if error}
    <div class="alert alert-danger" role="alert">Failed to fetch video</div>
{:else}
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
{/if}
