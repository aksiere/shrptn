<script>
	import { page } from '$app/stores'
    import { onMount } from 'svelte'
    import { fly, fade } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'
	import { getTextWidth } from '$lib'
	import { TRANSITION_DURATION } from '$lib/settings'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)
	
	// renameeeeee
	let stack_new = $state([[], []])
	let stack = $state(['JavaScript', 'NodeJS', 'SvelteKit', 'SCSS', 'UnoCSS', 'Prisma ORM', 'PostgreSQL', 'Serverless', 'Supabase', 'Web Workers', 'Grammy'])
	let stack_width = $state(0)
	let stack_items_offset = $state.frozen(2)

	const get_stack_rows = () => {
		if (stack_width === 0) return

		let arr = [[]]
		let count = 0

		for (const item of stack) {
			const width = getTextWidth(item + ' '.repeat(stack_items_offset), '16px monospace')
			
			if (count + width <= stack_width) {
				count += width
				arr.at(-1).push(item)
			} else {
				count = 0
				arr.push([])
				arr.at(-1).push(item)
			}
		}

		console.log(arr)
		stack_new = arr
		// return arr
	}

	const name = 'Олег Широпатин'
	const items = [
		{ title: 'Почта', value: 'helge@duck.com', copiable: true },
		{ title: 'Телеграм', value: `<a target='_blank' href='https://t.me/shrptn'>@shrptn</a>` },
		{ title: 'Телефон', value: '+79118452242', copiable: true },
		{ title: 'Дата рождения', value: '27.04.2000' },
		{ title: 'Гражданство', value: 'Россия' },
		{ title: 'Место жительства', value: 'Санкт-Петербург' }
	]

	const educations = [
		{ code: '09.03.02', title: 'Безопасность информационных систем', quali: 'Прикладной бакалавр', university: 'СПбГУТ им. проф. М.А. Бонч-Бруевича', started: 2018, ended: 2022 },
		{ code: '15.04.04', title: 'Интеллектуальные технологии в автоматизации', quali: 'Магистр', university: 'СПбГУТ им. проф. М.А. Бонч-Бруевича', started: 2022, ended: 2024 },
	]

	const jobs = [
		{ company: 'АВТОПОЛЕ', position: 'Ассистент (отдел маркетинга и рекламы)', desc: 'Битрикс-1С, администрирование сайта, лендинги (самописные + тильда)', started: 2020, ended: 2021 }
	]

	const skills = [
		{ title: 'Фронт', items: ['JavaScript', 'SvelteKit', 'SCSS', 'UnoCSS'] },
		{ title: 'Бэк', items: ['Node', 'Bun', 'MongoDB', 'PostgreSQL', 'Serverless'] },
		{ title: 'Прочее', items: ['Supabase', 'Pocketbase'] },
	]

	const copy = async (text) => {
		await navigator.clipboard.writeText(text)
		alert('copied')
	}
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME} / cv</title>
</svelte:head>

<div>
	<div class='flex align-flex-end'>
		<!-- КРАТКО -->

		<div class='1/1 md:1/2'>
			{#if show}
				<p class='article' in:animate={{ y: 10, duration: TRANSITION_DURATION }}>{name}</p>
			{/if}

			<ul>
				{#each items as { title, value, copiable, divider }, i}
					{#if divider}
						<li style='margin-bottom: 2ch;'></li>
					{:else}
						{#if show}
							<li class='d-flex' style='gap: 2ch;' in:animate={{ y: 10 + ((i + 1) * 10), duration: TRANSITION_DURATION }}>
								<div style='width: {Math.max(...items.map(s => s.title.length))}ch; text-align: right;'>
									<span style='color: #555;'>{title}</span>
								</div>
								<div>
									<span class:copiable={copiable} onclick={() => copiable && copy(value)}>{@html value}</span>
								</div>
							</li>
						{/if}
					{/if}
				{/each}
			</ul>
		</div>

		<!-- ФОТО -->

		<div class='1/2 d-none md:d-flex' style='padding-top: 2ch;'>
			{#if show}
				<img style='-webkit-user-drag: none;' class='my-auto ml-auto' src='/me.png' alt='я' height={200} in:animate={{ y: 10, duration: TRANSITION_DURATION }}>
			{/if}
		</div>

		<!-- ОБО МНЕ -->

		<div class='1/1'>
			{#if show}
				<p in:animate={{ y: 80, duration: TRANSITION_DURATION }} class='text-justify'>Привет! Меня зовут Олег, я разработчик и дизайнер. Занимаюсь фронтендом, бэкендом и всем, что с этим связано. Основной разработческий стек - это JavaScript и всё к нему прилегающее. Помимо этого начал изучать Go. Но считаю, что в конкретных ситуациях разработчик должен приходить в незнакомую для себя среду и разбираться в проблемах там.</p>
				<p in:animate={{ y: 90, duration: TRANSITION_DURATION }} class='text-justify'>Основной пет-проект <a href='https://eusto.ma'>eusto.ma</a> – телеграм-бот на веб-воркере, у которого можно купить випиэн, получив персонализированный доступ по протоколу shadowsocks к качественным и высокоскоростным серверам (арендованным у локальных зарубежных провайдеров) всего в пять кликов.</p>
				<p in:animate={{ y: 100, duration: TRANSITION_DURATION }} class='text-justify'>Стараюсь вкладываться в опенсорс <a href='https://github.com/aksiere'>здесь</a>.</p>
			{/if}
		</div>

		<!-- СТЕК -->

		<div class='1/1'>
			{#if show}
				<p class='article' in:animate={{ y: 110, duration: TRANSITION_DURATION }}>Стек</p>
			{/if}

			<ul>
				{#each skills as { title, items }, i}
					{#if show}
						<li class='d-flex' style='gap: 2ch;' in:animate={{ y: 110 + ((i + 1) * 10), duration: TRANSITION_DURATION }}>
							<div style='width: {Math.max(...skills.map(s => s.title.length))}ch; text-align: right;'>
								<span style='color: #555;'>{title}</span>
							</div>
							<div>
								{@html items.join(`<span style='color: #555;'>, </span>`)}
							</div>
						</li>
					{/if}
				{/each}
			</ul>

			<p></p>
		</div>

		<!-- ОБРАЗОВАНИЕ -->

		<div class='1/1'>
			{#if show}
				<p class='article' in:animate={{ y: 120 + (skills.length * 10), duration: TRANSITION_DURATION }}>Образование</p>
			{/if}

			{#each educations.reverse() as { code, title, university, quali, started, ended }, i}
				{#if show}
					<p class='mb-.25 pj' in:animate={{ y: 120 + (skills.length * 10) + ((i + 1) * 10), duration: 500 }}>
						<span style='color: #555;'>{started} - {ended}</span>
						<br>
						{title} <span style='color: #555;'>{quali}</span>
						<br>
						{university}
					</p>
				{/if}
			{/each}

			<p></p>
		</div>

		<!-- РАБОТА -->

		<div class='1/1'>
			{#if show}
				<p class='article' in:animate={{ y: 130 + (skills.length * 10) + (educations.length * 10), duration: TRANSITION_DURATION }}>Работа</p>
			{/if}

			{#each jobs.reverse() as { company, position, desc, started, ended }, i}
				{#if show}
					<p class='mb-.25 pj' in:animate={{ y: 130 + (skills.length * 10) + (educations.length * 10) + ((i + 1) * 10), duration: 500 }}>
						<span style='color: #555;'>{started} - {ended}</span>
						<br>
						{company} <span style='color: #555;'>{position}</span>
						<br>
						<span style='color: #555;'></span> {desc}
					</p>
				{/if}
			{/each}

			<p></p>
		</div>
	</div>
</div>

<style>
	ul {
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			margin-bottom: .25rem;
		}
	}

	.copiable {
		cursor: pointer;

		&::before, &::after {
			color: #222;
			transition: all var(--transition-duration) var(--transition-type);
		}

		&:hover {
			&::before, &::after {
				color: var(--primary);
			}
		}

		&::after {
			content: ' ↩';
		}
	}

	p.article {
		position: relative;
		font-size: 20px;
		margin-bottom: 2ch;

		&:hover {
			&::before {
				content: '—';
				position: absolute;
				left: -2ch;
				color: #555;
			}
		}
	}

	@media (prefers-reduced-motion) {
		.copiable {
			&::before, &::after {
				transition: none;
			}
		}
	}
</style>
