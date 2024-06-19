<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'

    let show = $state(false)
    onMount(() => show = true)
</script>

{#if show}
    <p in:fly={{ y: 10, duration: 500 }}>
        скиллы
    </p>
{/if}
