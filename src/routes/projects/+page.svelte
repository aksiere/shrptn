<script>
    import { onMount } from 'svelte'
    import { fade, fly } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    const items = [
        { href: 'https://eusto.ma', title: 'Eustoma', desc: 'телеграм-бот на веб-воркере, продающий випиэн' },
        { href: 'https://github.com/aksiere/eustoma-proxy-tool', title: 'Eustoma Proxy Tool', desc: 'прокси-сервер на Go с поддержкой динамических ключей (ssconf://)' },
        { href: 'https://icebergify.vercel.app', title: 'Icebergify', desc: 'интерпретатор популярности твоих музыкальных предпочтений' },
        { href: 'https://github.com/aksiere/paeonia', title: 'Paeonia', desc: 'утилити-фёрст css фреймворк на базе unocss' },
    ]

    let show = $state(false)
    onMount(() => show = true)
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME} / projects</title>
</svelte:head>

<div>
    {#each items as { href, title, desc }, i}
        {#if show}
            <p class='mb-.25 pj' in:animate={{ y: i * 10 + 10, duration: 500 }}>
                <span style='color: #555;'>{String(i + 1).padStart(2, '0')}</span>
                <a target='_blank' {href}>{title}</a>
                <br>
                <span style='color: #555;'>&nbsp;&nbsp;&nbsp;{desc}</span>
            </p>
        {/if}
    {/each}
</div>

<style>
    .pj {
        tab-size: 1rem;
    }
</style>
