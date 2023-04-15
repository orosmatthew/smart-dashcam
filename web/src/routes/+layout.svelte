<script lang="ts">
  import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css';
  import { onMount } from 'svelte';
  import { PageCategory, pageCategory } from './stores';
  onMount(async () => {
    await import('bootstrap');
  });
</script>

<svelte:head>
  <title>Smart Dashcam</title>
</svelte:head>

<body class="container mt-2">
  <h1>Smart Dashcam</h1>
  <div class="row mt-4 mb-4">
    <div class="btn-group" role="group">
      <a
        draggable="false"
        href="/"
        class="btn btn-outline-primary {$pageCategory == PageCategory.Recordings ? 'active' : ''}"
        >Recordings</a
      >
      <a
        draggable="false"
        href="/live/accel"
        class="btn btn-outline-primary {$pageCategory == PageCategory.Live ? 'active' : ''}">Live</a
      >
    </div>
  </div>
  <slot />
</body>
