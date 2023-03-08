<script lang="ts">
    import { defineCustomElements } from "@vime/core";
    defineCustomElements();

    export let thumbnail: string;
    export let url: string;
    export let type: string;
</script>

<vm-player controls>
    <vm-video crossorigin="" poster={thumbnail}>
        <source data-src={url} type={type} />
    </vm-video>
</vm-player>
