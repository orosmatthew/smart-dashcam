<script lang="ts" context="module">
  export type Video = PageData['videos'][number];
</script>

<script lang="ts">
  import Counter from '$lib/Counter.svelte';
  import VideoPlayer from '$lib/VideoPlayer.svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { currentVideo } from './stores';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';
  import type { ImuGetData } from './api/imu/[start]/[end]/+server';

  export let data: PageData;

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

  let imuData: ImuGetData;
  async function updateChartImuData() {
    let imuRes = await fetch(
      '/api/imu/' +
        encodeURI(new Date(new Date().valueOf() - 1 * 60000).toJSON()) +
        '/' +
        encodeURI(new Date().toJSON()),
      { method: 'GET' }
    );
    let imuData: ImuGetData = (await imuRes.json()).data;
    chart.data.labels = imuData.map((row) => row.timestamp);
    chart.data.datasets[0].data = imuData.map((row) => row.accelX);
    chart.data.datasets[1].data = imuData.map((row) => row.accelY);
    chart.data.datasets[2].data = imuData.map((row) => row.accelZ);
    chart.update();
  }

  let chart: Chart;
  function createChart() {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
      type: 'line',
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second'
            }
          }
        }
      },
      data: {
        labels: imuData.map((row) => row.timestamp),
        datasets: [
          {
            label: 'Acceleration (X)',
            data: imuData.map((row) => row.accelX),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Acceleration (Y)',
            data: imuData.map((row) => row.accelY),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Acceleration (Z)',
            data: imuData.map((row) => row.accelZ),
            cubicInterpolationMode: 'monotone'
          }
        ]
      }
    });
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  let mounted = false;
  onMount(async () => {
    mounted = true;
    imuData = data.imu;
    createChart();
    setInterval(updateChartImuData, 5000);
  });

  $: if (browser && $currentVideo && mounted) {
    updateVideoButtons();
  }
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
  <div>
    <h2>Chart</h2>
    <div style="width: 100%"><canvas id="chart" /></div>
  </div>
</body>
