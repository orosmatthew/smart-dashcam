<script lang="ts">
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';
  import { onDestroy, onMount } from 'svelte';
  import type { ImuGetData } from '../../api/imu/[start]/[end]/+server.js';
  import { fetchImuData } from '../util.js';
  import SensorButtonGroup, { SensorType } from '$lib/SensorButtonGroup.svelte';

  export let data;

  let imuData: ImuGetData;
  async function updateChartImuData() {
    imuData = await fetchImuData();
    accelChart.data.labels = imuData.map((row) => row.timestamp);
    accelChart.data.datasets[0].data = imuData.map((row) => row.accelX);
    accelChart.data.datasets[1].data = imuData.map((row) => row.accelY);
    accelChart.data.datasets[2].data = imuData.map((row) => row.accelZ);
    accelChart.update();
  }

  let accelChart: Chart;
  function createAccelChart() {
    accelChart = new Chart(document.getElementById('accel_chart') as HTMLCanvasElement, {
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
      accelChart.resize();
    });
  }

  let imuUpdateInterval: NodeJS.Timer;
  onMount(async () => {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    imuData = data.imu;
    createAccelChart();
    imuUpdateInterval = setInterval(updateChartImuData, 5000);
  });

  onDestroy(() => {
    clearInterval(imuUpdateInterval);
  });
</script>

<SensorButtonGroup activeSensor={SensorType.Accel} />

<canvas id="accel_chart" />
