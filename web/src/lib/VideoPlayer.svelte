<script lang="ts">
  import { defineCustomElements } from '@vime/core';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  defineCustomElements();

  export let thumbnail: string;
  export let url: string;
  export let type: string;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const player: any = document.querySelector('.player');
    player.addEventListener('vmCurrentTimeChange', (event: CustomEvent<number>) => {
      dispatch('timeChange', event.detail);
    });
  });

  export function setTime(seconds: number) {
    const player: any = document.querySelector('.player');
    player.currentTime = seconds;
  }
</script>

<vm-player class="player" autoplay controls>
  <vm-video crossorigin="" poster={thumbnail}>
    <source data-src={url} {type} />
  </vm-video>
</vm-player>
