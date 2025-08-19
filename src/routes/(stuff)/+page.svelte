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
			<p in:animate={{ y: 10, duration: TRANSITION_DURATION }} style='text-align: justify;'>Привет! Я Олег. Люблю придумывать и продумывать, что угодно и очень дотошно, скрупулезно: структура текста, выделение основных деталей, какой взять ракурс для фото, в каком месте расположить объект, какого цвета сделать кнопку у формы, насколько удобно пользоваться таким интерфейсом, как сделать его тактильным, как оптимизировать серверный код и не заставлять пользователя чего-то ждать на пустом экране. Всё это меня всегда очень сильно волнует в моих проектах или том, что я "потребляю".</p>
			<p in:animate={{ y: 20, duration: TRANSITION_DURATION }} style='text-align: justify;'>Увлекаюсь фотографией, музыкой и кино. Так что найти меня можно в самых разных соцсетях, заблокированных и не очень:</p>
			<p in:animate={{ y: 30, duration: TRANSITION_DURATION }} style='text-align: justify;'><a target='_blank' href='https://www.instagram.com/shrptn/'>nstgrm</a> <a target='_blank' href='https://www.last.fm/user/aksiere'>lstfm</a> <a target='_blank' href='https://letterboxd.com/aksiere/'>lttrbxd</a></p>
			<p in:animate={{ y: 40, duration: TRANSITION_DURATION }} style='text-align: justify;'>А написать можно <a href='mailto:kittila@duck.com'>на почту</a> и в <a target='_blank' href='https://t.me/shrptn'>телеграм</a>.</p>
		</div>

		<!-- <div class='1/1'>
			<p class='article' in:animate={{ y: 50, duration: TRANSITION_DURATION }}>Статьи</p>
			<p style='color: #555;' in:animate={{ y: 60, duration: TRANSITION_DURATION }}>попозже...</p>
		</div> -->
	</div>
{/if}

<style>
	
</style>
