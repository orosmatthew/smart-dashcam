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
    magChart.data.labels = imuData.map((row) => row.timestamp);
    magChart.data.datasets[0].data = imuData.map((row) => row.magX);
    magChart.data.datasets[1].data = imuData.map((row) => row.magY);
    magChart.data.datasets[2].data = imuData.map((row) => row.magZ);
    magChart.update();
  }

  let magChart: Chart;
  function createMagChart() {
    magChart = new Chart(document.getElementById('mag_chart') as HTMLCanvasElement, {
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
            label: 'Magnetic (X)',
            data: imuData.map((row) => row.magX),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Magnetic (Y)',
            data: imuData.map((row) => row.magY),
            cubicInterpolationMode: 'monotone'
          },
          {
            label: 'Magnetic (Z)',
            data: imuData.map((row) => row.magZ),
            cubicInterpolationMode: 'monotone'
          }
        ]
      }
    });
    window.addEventListener('resize', () => {
      magChart.resize();
    });
  }

  let imuUpdateInterval: NodeJS.Timer;
  onMount(async () => {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    imuData = data.imu;
    createMagChart();
    imuUpdateInterval = setInterval(updateChartImuData, 5000);
  });

  onDestroy(() => {
    clearInterval(imuUpdateInterval);
  });
</script>

<SensorButtonGroup activeSensor={SensorType.Mag} />

<canvas id="mag_chart" />
