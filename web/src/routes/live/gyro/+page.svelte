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
    gyroChart.data.labels = imuData.map((row) => row.timestamp);
    gyroChart.data.datasets[0].data = imuData.map((row) => row.gyroX);
    gyroChart.data.datasets[1].data = imuData.map((row) => row.gyroY);
    gyroChart.data.datasets[2].data = imuData.map((row) => row.gyroZ);
    gyroChart.update();
  }

  let gyroChart: Chart;
  function createGyroChart() {
    gyroChart = new Chart(document.getElementById('gyro_chart') as HTMLCanvasElement, {
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
            label: 'Gyro (X)',
            data: imuData.map((row) => row.gyroX),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Gyro (Y)',
            data: imuData.map((row) => row.gyroY),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Gyro (Z)',
            data: imuData.map((row) => row.gyroZ),
            cubicInterpolationMode: 'monotone'
          }
        ]
      }
    });
    window.addEventListener('resize', () => {
      gyroChart.resize();
    });
  }

  let imuUpdateInterval: NodeJS.Timer;
  onMount(async () => {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    imuData = data.imu;
    createGyroChart();
    imuUpdateInterval = setInterval(updateChartImuData, 5000);
  });

  onDestroy(() => {
    clearInterval(imuUpdateInterval);
  });
</script>

<SensorButtonGroup activeSensor={SensorType.Gyro} />

<canvas id="gyro_chart" />
