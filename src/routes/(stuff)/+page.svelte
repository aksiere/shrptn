<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'
	import { TRANSITION_DURATION } from '$lib/settings'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME}</title>
</svelte:head>

{#if show}
	<div class='flex'>
		<div class='1/1'>
			<p in:animate={{ y: 10, duration: TRANSITION_DURATION }} style='text-align: justify;'>Привет! Я Олег. Мне нравится придумывать и продумывать. Касательно как пользовательского интерфейса (того, как он выглядит, ощущается, ведет себя), так и клиент-серверной логики (того, как оптимизировать и сделать шустрее).</p>
			<p in:animate={{ y: 20, duration: TRANSITION_DURATION }} style='text-align: justify;'>Помимо этого, увлекаюсь фотографией, музыкой и кино. Так что найти меня можно в самых разных соцсетях, заблокированных и не очень:</p>
			<p in:animate={{ y: 30, duration: TRANSITION_DURATION }} style='text-align: justify;'><a target='_blank' href='https://www.instagram.com/shrptn/'>nstgrm</a> <a target='_blank' href='https://www.last.fm/user/aksiere'>lstfm</a> <a target='_blank' href='https://letterboxd.com/aksiere/'>lttrbxd</a> <a target='_blank' href='https://t.me/shrptn'>tlgrm</a></p>
			<p in:animate={{ y: 40, duration: TRANSITION_DURATION }} style='text-align: justify;'>А написать можно <a href='mailto:yie@tuta.io'>сюда</a> и <a target='_blank' href='https://t.me/shrptn'>сюда</a>.</p>
		</div>

		<!-- <div class='1/1'>
			<p class='article' in:animate={{ y: 50, duration: TRANSITION_DURATION }}>Статьи</p>
			<p style='color: #555;' in:animate={{ y: 60, duration: TRANSITION_DURATION }}>попозже...</p>
		</div> -->
	</div>
{/if}

<style>
	
</style>
