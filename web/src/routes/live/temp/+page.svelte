<script lang="ts">
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';
  import { onDestroy, onMount } from 'svelte';
  import type { ImuGetData } from '../../api/imu/[start]/[end]/+server.js';
  import { fetchImuData } from '../util.js';
  import SensorButtonGroup, { SensorType } from '$lib/SensorButtonGroup.svelte';

  export let data;

  function tempCToF(c: number): number {
    return 1.8 * c + 32;
  }

  let imuData: ImuGetData;
  async function updateChartImuData() {
    imuData = await fetchImuData();
    tempChart.data.labels = imuData.map((row) => row.timestamp);
    tempChart.data.datasets[0].data = imuData.map((row) => tempCToF(row.temp));
    tempChart.update();
  }

  let tempChart: Chart;
  function createTempChart() {
    tempChart = new Chart(document.getElementById('temp_chart') as HTMLCanvasElement, {
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
            label: 'Temperature (F)',
            data: imuData.map((row) => tempCToF(row.temp)),
            cubicInterpolationMode: 'monotone'
          }
        ]
      }
    });
    window.addEventListener('resize', () => {
      tempChart.resize();
    });
  }

  let imuUpdateInterval: NodeJS.Timer;
  onMount(async () => {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    imuData = data.imu;
    createTempChart();
    imuUpdateInterval = setInterval(updateChartImuData, 5000);
  });

  onDestroy(() => {
    clearInterval(imuUpdateInterval);
  });
</script>

<SensorButtonGroup activeSensor={SensorType.Temp} />

<canvas id="temp_chart" />
