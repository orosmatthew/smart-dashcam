<script lang="ts">
    import VideoPlayer from "./VideoPlayer.svelte";

    let thumbnail: string;
    let url: string;
    let type: string;
    let player: VideoPlayer;

    let ready: boolean = false;
    let error: boolean = false;
    let time = 0;

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
    <VideoPlayer
        bind:this={player}
        on:timeChange={(e) => {
            time = e.detail;
        }}
        {thumbnail}
        {url}
        {type}
    />
    <p>{time}</p>
{:else if error}
    <div class="alert alert-danger" role="alert">Failed to fetch video</div>
{:else}
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
{/if}
