<script context="module" lang="ts">
  export enum SensorType {
    Accel,
    Gyro,
    Mag,
    Temp
  }
</script>

<script lang="ts">
  export let activeSensor: SensorType;
</script>

<div class="row mt-4 mb-4">
  <div class="btn-group" role="group">
    <a
      draggable="false"
      href="/live/accel"
      class="btn btn-outline-primary {activeSensor == SensorType.Accel ? 'active' : ''}"
      >Accelerometer</a
    >
    <a
      draggable="false"
      href="/live/gyro"
      class="btn btn-outline-primary {activeSensor == SensorType.Gyro ? 'active' : ''}">Gyroscope</a
    >
    <a
      draggable="false"
      href="/live/mag"
      class="btn btn-outline-primary {activeSensor == SensorType.Mag ? 'active' : ''}"
      >Magnotometer</a
    >
    <a
      draggable="false"
      href="/live/temp"
      class="btn btn-outline-primary {activeSensor == SensorType.Temp ? 'active' : ''}"
      >Temperature</a
    >
  </div>
</div>
