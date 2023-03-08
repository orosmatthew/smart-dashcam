<script lang="ts">
    let count = 0;
</script>

<p>Count: {count}</p>

<button
    class="btn btn-primary"
    on:click={() => {
        count += 1;
    }}>Add</button
>

<button
    class="btn btn-secondary"
    on:click={() => {
        count -= 1;
    }}>Remove</button
>
