<script lang="ts" context="module">
  export type Video = PageData['videos'][number];
</script>

<script lang="ts">
  import VideoPlayer from '$lib/VideoPlayer.svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { PageCategory, pageCategory } from './stores';
  import { onMount } from 'svelte';
  import type { BookmarkGetData } from './api/bookmark/[start]/[end]/+server';
  import ImuChart from '$lib/IMUChart.svelte';
  import { SensorType } from '$lib/SensorButtonGroup.svelte';
  import type { ImuGetData } from './api/imu/[start]/[end]/+server';

  export let data: PageData;

  $pageCategory = PageCategory.Recordings;

  let currentImuData: ImuGetData;
  let currentVideo: Video;
  let imuChart: ImuChart;
  let activeSensor = SensorType.Accel;

  function formatSeconds(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
        return `${minutes} minutes`;
      } else {
        return `${minutes} minutes, ${remainingSeconds} seconds`;
      }
    }
  }

  async function fetchCurrentImuData() {
    let res = await fetch(
      '/api/imu/' +
        encodeURI(new Date(currentVideo.timeBegin).toJSON()) +
        '/' +
        encodeURI(new Date(currentVideo.timeEnd).toJSON()),
      { method: 'GET' }
    );
    currentImuData = (await res.json()).data;
    if (imuChart) {
      imuChart.updateImuDate(currentImuData);
    }
  }

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  function updateVideoButtons() {
    document.querySelectorAll('.video-btn').forEach((element) => {
      const dataId = parseInt(element.getAttribute('data-id') || '');
      if (dataId === currentVideo.id) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  let bookmarksData: BookmarkGetData;
  async function updateBookmarks(beginTime: Date, endTime: Date) {
    let res = await fetch(
      '/api/bookmark/' + encodeURI(beginTime.toJSON()) + '/' + encodeURI(endTime.toJSON()),
      { method: 'GET' }
    );
    bookmarksData = (await res.json()).data;
  }

  let mounted = false;
  onMount(async () => {
    mounted = true;
  });

  let videoPlayer: VideoPlayer;
</script>

<h2>Recordings</h2>
<div class="mt-4 row">
  <div class="col-md-12 col-lg-8">
    {#if browser && currentVideo}
      <VideoPlayer
        thumbnail={currentVideo.thumbnail || ''}
        url={currentVideo.url}
        type={currentVideo.type}
        bind:this={videoPlayer}
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
          on:click={async () => {
            currentVideo = video;
            await updateBookmarks(new Date(video.timeBegin), new Date(video.timeEnd));
            await fetchCurrentImuData();
          }}>{formatDate(new Date(video.timeBegin))}</button
        >
      {/each}
    </div>
    <div>
      {#if bookmarksData && bookmarksData.length != 0}
        <h3 class="mt-3">Bookmarks</h3>
        <div class="list-group">
          {#each bookmarksData as bookmark}
            <button
              type="button"
              class="list-group-item list list-group-item-action"
              on:click={() => {
                videoPlayer.setTime(
                  new Date(bookmark.timestamp).getSeconds() -
                    new Date(currentVideo.timeBegin).getSeconds()
                );
              }}
              >{formatSeconds(
                new Date(bookmark.timestamp).getSeconds() -
                  new Date(currentVideo.timeBegin).getSeconds()
              )}</button
            >
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
<div>
  {#if currentImuData}
    <h2 class="mt-4">Sensor Data</h2>
    <div class="btn-group" role="group">
      <button
        class="btn btn-outline-primary {activeSensor == SensorType.Accel ? 'active' : ''}"
        on:click={async () => {
          activeSensor = SensorType.Accel;
          imuChart.setDatasetTo(activeSensor);
        }}>Accelerometer</button
      >
      <button
        class="btn btn-outline-primary {activeSensor == SensorType.Gyro ? 'active' : ''}"
        on:click={async () => {
          activeSensor = SensorType.Gyro;
          imuChart.setDatasetTo(activeSensor);
        }}>Gyroscope</button
      >
      <button
        class="btn btn-outline-primary {activeSensor == SensorType.Mag ? 'active' : ''}"
        on:click={async () => {
          activeSensor = SensorType.Mag;
          imuChart.setDatasetTo(activeSensor);
        }}>Magnotometer</button
      >
      <button
        class="btn btn-outline-primary {activeSensor == SensorType.Temp ? 'active' : ''}"
        on:click={async () => {
          activeSensor = SensorType.Temp;
          imuChart.setDatasetTo(activeSensor);
        }}>Temperature</button
      >
    </div>
    <ImuChart imuData={currentImuData} bind:this={imuChart} />
  {/if}
</div>
