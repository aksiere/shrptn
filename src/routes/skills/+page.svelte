<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME} / skills</title>
</svelte:head>

{#if show}
    <p in:animate={{ y: 10, duration: 500 }}>
        скиллы
    </p>
{/if}
