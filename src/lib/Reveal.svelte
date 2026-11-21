<script>
    import { onMount } from 'svelte'

    // Renders a page's content right after mount so its in: transitions (see $lib/transitions) play.
    // Needed in dev: Svelte's HMR wrapper creates each component with intros turned off, so blocks
    // rendered straight away wouldn't animate there (production builds are fine either way).
    let mounted = false
    onMount(() => { mounted = true })
</script>

{#if mounted}<slot />{/if}
