<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'

    let show = $state(false)
    onMount(() => show = true)
</script>

Home
<!-- {#if show}
    <div in:fly={{ y: 10, duration: 500 }}>
        Home
    </div>
{/if} -->
