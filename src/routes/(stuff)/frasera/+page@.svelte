<script>
	import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)

	const components = [
		{ href: '/frasera/drawer', title: 'Drawer', desc: 'выдвигающийся компонент, может использоваться в качестве замены модальному окну на мобильных устройствах.' },
	]
</script>

<main class='px-1 xl:my-3'>
	<div style='max-width: var(--layout-width);' class='mx-auto'>
		<div class='flex'>
			{#each components as { href, title, desc }, i}
				<div class='1/1 md:1/2' class:text-right={i % 2 === 1} class:text-left={i % 2 === 0}>
					{#if show}
						<p class='mb-.25 pj' in:animate={{ y: 10, duration: 500 }}>
							<span style='color: #555;'>{String(i + 1).padStart(2, '0')}</span>
							<a {href}>{title}</a><br>
							<span style='color: #555;'>{desc}</span><br>
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</main>
