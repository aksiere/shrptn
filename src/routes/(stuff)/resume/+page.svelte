<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
	import { PUBLIC_USERNAME, PUBLIC_LAST_UPDATED } from '$env/static/public'
	import { TRANSITION_DURATION } from '$lib/settings'
	import { toast, Toaster } from 'svelte-sonner'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)

	const name = 'Олег Широпатин'
	
	const items = [
		{ title: 'Почта', value: 'kittila@duck.com', copiable: true },
		{ title: 'Телеграм', value: `<a target='_blank' href='https://t.me/shrptn'>@shrptn</a>` },
		{ title: 'Телефон', value: '+79118452242', copiable: true },
		{ title: 'Дата рождения', value: '27.04.2000' },
		{ title: 'Гражданство', value: 'Россия' },
		{ title: 'Место жительства', value: 'Санкт-Петербург' }
	]

	const educations = [
		{ title: 'Безопасность информационных систем', code: '09.03.02', quali: 'Прикладной бакалавр', university: 'СПбГУТ им. проф. М.А. Бонч-Бруевича', started: 2018, ended: 2022 },
		{ title: 'Ассистент (отдел маркетинга и рекламы)', university: 'АВТОПОЛЕ', quali: 'Поддержка и администрирование сайта (1С-Битрикс); Разработка лендингов (PHP, Tilda)', started: 2020, ended: 2021 },
		{ title: 'Интеллектуальные технологии в автоматизации', code: '15.04.04', quali: 'Магистр', university: 'СПбГУТ им. проф. М.А. Бонч-Бруевича', started: 2022, ended: 2024 },
	]

	const jobs = [
		
	]

	const skills = [
		{ title: 'Фронт', items: ['HTML', 'CSS', 'JavaScript', 'SvelteKit', 'Vue', 'Tailwind CSS', 'SCSS', 'UnoCSS'] },
		{ title: 'Бэк', items: ['Bun', 'Node.js', 'SvelteKit (BFF)', 'Supabase', 'Pocketbase', 'Redis', 'Prisma', 'PostgreSQL', 'SQLite'] },
		{ title: 'Прочее', items: ['Vite', 'Elysia', 'PHP', 'Go', '1С', 'Figma', 'Photoshop', 'Tilda', 'Telegram Bot API (Grammy, Telegraf)', 'Serverless'] },
	]

	const copy = async (text) => {
		await navigator.clipboard.writeText(text)
		toast('Текст скопирован', {
			duration: 3000,
			description: text
		})
	}
</script>

<svelte:head>
	<title>{PUBLIC_USERNAME} / résumé</title>
</svelte:head>

<Toaster toastOptions={{
	unstyled: true,
	classes: {
		toast: 'toast',
		title: 'toast-title',
		description: 'toast-description'
	}
}} />

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
				<p in:animate={{ y: 80, duration: TRANSITION_DURATION }} class='text-justify'>Привет!</p>
				<p in:animate={{ y: 90, duration: TRANSITION_DURATION }} class='text-justify'>Меня зовут Олег, я разработчик и тестировщик. Занимаюсь фронтендом, бэкендом, тестированием и всем, что с этим связано. Основной разработческий стек - это JavaScript и всё к нему прилегающее. Но считаю, что в конкретных ситуациях разработчик должен приходить в незнакомую для себя среду и разбираться в проблемах там.</p>
				<p in:animate={{ y: 100, duration: TRANSITION_DURATION }} class='text-justify'>Начинал когда-то с PHP, а сейчас пишу фулстэк вокруг Bun, SvelteKit, Tailwind и Supabase/Pocketbase. Основная деятельность сейчас вокруг этого стека. Считаю Svelte очень перспективным. Также умею писать ботов для телеграма на Grammy. Немного знаком с Java - писал моды для игры. </p>
				<p in:animate={{ y: 110, duration: TRANSITION_DURATION }} class='text-justify'>Также рассматриваю тестирование в качестве основного направления деятельности, потому что мне чуждо выражение done is better than perfect и я люблю все доводить до идеала, из-за чего некоторые мои идеи так и не были реализованы. Но если в случае с разработкой я скорее согласен с выражением, то с тестированием, на мой взгляд, как раз наоборот, поэтому я стал знакомиться с теорией, т.к. я всегда скрупулезно тестирую свои пет-проекты и мне интересно искать изъяны в продукте и делать его лучше.</p>
			{/if}
		</div>

		<!-- СТЕК -->

		<div class='1/1'>
			{#if show}
				<p class='article' in:animate={{ y: 120, duration: TRANSITION_DURATION }}>Стек</p>
			{/if}

			<ul>
				{#each skills as { title, items }, i}
					{#if show}
						<li class='d-flex' style='gap: 2ch;' in:animate={{ y: 130 + ((i + 1) * 10), duration: TRANSITION_DURATION }}>
							<div style='min-width: {Math.max(...skills.map(s => s.title.length))}ch; text-align: right;'>
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
				<p class='article' in:animate={{ y: 140 + (skills.length * 10), duration: TRANSITION_DURATION }}>Образование / работа</p>
			{/if}

			<div style='display: flex; flex-direction: column; gap: 1rem;'>
				{#each educations.reverse() as { code, title, university, quali, started, ended }, i}
					{#if show}
						<div class='pj' in:animate={{ y: 150 + (skills.length * 10) + ((i + 1) * 10), duration: 500 }} style='display: flex; flex-direction: column; gap: 2px;'>
							<span style='color: #555;'>{started} - {ended}</span>
							<span>{university}</span>
							<div style='display: flex;'>
								<span>{title}</span>
								<span style='color: #555; margin-left: auto; text-align: right;'>{@html quali}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- РАБОТА -->

		<!-- <div class='1/1'>
			{#if show}
				<p class='article' in:animate={{ y: 160 + (skills.length * 10) + (educations.length * 10), duration: TRANSITION_DURATION }}>Работа</p>
			{/if}

			{#each jobs.reverse() as { company, title: position, desc, started, ended }, i}
				{#if show}
					<p class='mb-.25 pj' in:animate={{ y: 170 + (skills.length * 10) + (educations.length * 10) + ((i + 1) * 10), duration: 500 }}>
						<span style='color: #555;'>{started} - {ended}</span>
						<br>
						{company} <span style='color: #555;'>{position}</span>
						<br>
						<span style='color: #555;'></span> {desc}
					</p>
				{/if}
			{/each}

			<p></p>
		</div> -->

		<!-- ИНФО -->
		<div class='1/1 text-center mb-0 mt-3'>
			{#if show}
				<p class='m-0' in:animate={{ y: 180 + (skills.length * 10) + (educations.length * 10) + (jobs.length * 10), duration: TRANSITION_DURATION }} style='color: #555;'>актуально на {new Date(PUBLIC_LAST_UPDATED).toLocaleString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric',})}</p>
				<p class='m-0' in:animate={{ y: 190 + (skills.length * 10) + (educations.length * 10) + (jobs.length * 10), duration: TRANSITION_DURATION }} style='color: #555;'><a target='_blank' href='/resume.pdf'>pdf-версия</a></p>
			{/if}
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

	@media (prefers-reduced-motion) {
		.copiable {
			&::before, &::after {
				transition: none;
			}
		}
	}
</style>
