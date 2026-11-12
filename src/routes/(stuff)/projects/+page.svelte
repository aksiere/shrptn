<script>
    import { onMount } from 'svelte'
    import { fade, fly } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    const items = [
        { href: '/', title: 'Cine', desc: 'work in progress', stack: 'sveltekit, js, nodejs, paraglide, supabase, tmdb api', disabled: true },
        // { href: '/frasera', title: 'Frasera', desc: 'библиотека детально проработанных UI компонентов', stack: '', disabled: false },
	{ href: 'https://eusto.ma', title: 'Eustoma', desc: 'коммерческий телеграм-бот на веб-воркере', stack: 'js, grammy, telegram api', target: '_blank' },
        // { href: 'https://github.com/aksiere/eustoma-proxy-tool', title: 'Eustoma Proxy Tool', desc: 'прокси-сервер на Go с поддержкой динамических ключей (ssconf://)', target: '_blank' },
        { href: 'https://icebergify.vercel.app/', title: 'Icebergify', desc: 'интерпретатор популярности твоих музыкальных предпочтений', stack: 'sveltekit, js, nodejs, spotify api', target: '_blank' },
        // { href: 'https://github.com/aksiere/paeonia', title: 'Paeonia', desc: 'utility-first CSS фреймворк на базе UnoCSS', target: '_blank' },
        { href: 'https://new.fips.ru/registers-doc-view/fips_servlet?DB=EVM&DocNumber=2022660896&TypeFile=html', title: 'Бонч.РИД', desc: 'веб-приложение внутреннего пользования для цифровизации учета результатов интеллектуальной деятельности', stack: 'php, js', target: '_blank' },
    ]

    let show = $state(false)
    onMount(() => show = true)
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME} / projects</title>
</svelte:head>

<div>
    {#each items as { href, title, desc, stack, target, disabled }, i}
        {#if show}
            <p class='mb-.25 pj' in:animate={{ y: i * 10 + 10, duration: 500 }} class:disabled={disabled}>
                <span style='color: #555;'>{String(i + 1).padStart(2, '0')}</span>
                <a target={target || '_self'} {href}>{title}</a>
                <br>
                <span>&nbsp;&nbsp;&nbsp;{desc}</span>
                <br>
                <span style='color: #777;'>&nbsp;&nbsp;&nbsp;{stack}</span>
            </p>
        {/if}
    {/each}
</div>

<style>
    .pj {
        tab-size: 1rem;

		&.disabled {
			pointer-events: none;
			opacity: .25;
		}
    }
</style>
