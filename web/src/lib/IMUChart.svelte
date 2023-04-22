<script lang="ts">
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';
  import { onMount } from 'svelte';
  import type { ImuGetData } from '../routes/api/imu/[start]/[end]/+server';
  import { SensorType } from './SensorButtonGroup.svelte';

  function tempCToF(c: number): number {
    return 1.8 * c + 32;
  }

  export let imuData: ImuGetData;

  let currentSensorType = SensorType.Accel;

  export function setDatasetTo(sensorType: SensorType) {
    switch (sensorType) {
      case SensorType.Accel:
        chart.data.datasets = [
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
        ];
        break;
      case SensorType.Gyro:
        chart.data.datasets = [
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
        ];
        break;
      case SensorType.Mag:
        chart.data.datasets = [
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
        ];
        break;
      case SensorType.Temp:
        chart.data.datasets = [
          {
            label: 'Temperature (F)',
            data: imuData.map((row) => tempCToF(row.temp)),
            cubicInterpolationMode: 'monotone'
          }
        ];
        break;
    }
    chart.update();
    currentSensorType = sensorType;
  }

  export function updateImuDate(data: ImuGetData) {
    imuData = data;
    setDatasetTo(currentSensorType);
  }

  let chart: Chart;
  function createChart() {
    chart = new Chart(document.getElementById('chart_canvas') as HTMLCanvasElement, {
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
        datasets: []
      }
    });
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }

  onMount(async () => {
    Chart.defaults.borderColor = '#777777';
    Chart.defaults.color = '#E1E1E1';
    createChart();
    setDatasetTo(currentSensorType);
  });
</script>

<canvas id="chart_canvas" />
