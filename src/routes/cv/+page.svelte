<script>
	import { page } from '$app/stores'
    import { onMount } from 'svelte'
    import { fly, fade } from 'svelte/transition'
	import { PUBLIC_USERNAME } from '$env/static/public'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
	const animate = (node, args) => isReduced ? null : fly(node, args)

    let show = $state(false)
    onMount(() => show = true)

	let show_details = $state(false)

	const name = 'Олег Широпатин'
	const items = [
		{ name: 'Почта', value: 'helge@duck.com', copiable: true },
		{ name: 'Телеграм', value: `<a target='_blank' href='https://t.me/shrptn'>@shrptn</a>` },
		{ name: 'Телефон', value: '+79118452242', copiable: true },
		{ name: 'Дата рождения', value: '27.04.2000', spoiler: true },
		{ name: 'Гражданство', value: 'Россия', spoiler: true },
		{ name: 'Место жительства', value: 'Санкт-Петербург', spoiler: true }
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
	<div class='flex align-flex-start'>
		<div class='1/1 md:1/2'>
			{#if show}
				<p style='margin-bottom: 2ch;' in:animate={{ y: 10, duration: 500 }}>{name}</p>
			{/if}

			<ul>
				{#each items.filter(i => !i.spoiler) as { name, value, copiable, divider }, i}
					{#if divider}
						<li style='margin-bottom: 2ch;'></li>
					{:else}
						{#if show}
							<li in:animate={{ y: i * 10 + 10, duration: 500 }}>
								<span style='color: #555;'>{name}</span>
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<span class:copiable={copiable} onclick={() => copiable && copy(value)}>{@html value}</span>
							</li>
						{/if}
					{/if}
				{/each}
							
				{#if show_details}
					<div style='margin-top: 2ch;'>
						{#each items.filter(i => i.spoiler) as { name, value, copiable }, i}
							{#if show_details}
								<li in:animate={{ y: i * 10 + 10, duration: 500 }}>
									<span style='color: #555;'>{name}</span>
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<span class:copiable={copiable} onclick={() => copiable && copy(value)}>{@html value}</span>
								</li>
							{/if}
						{/each}
					</div>
				{:else}
					{#if show}
						<div style='margin-top: 2ch; color: #444; cursor: pointer;' in:animate={{ y: items.filter(i => !i.spoiler).length * 10 + 10, duration: 500 }} onclick={(e) => show_details = true}>показать больше...</div>
					{/if}
				{/if}
			</ul>

			{#if show}
				<p>Привет!</p>
			{/if}
		</div>

		<div class='1/2 d-none md:d-flex' style='padding-top: 2ch;'>
			{#if show}
				<img style='-webkit-user-drag: none;' class='my-auto ml-auto' src='/me.png' alt='я' height={200} in:animate={{ y: 10, duration: 500 }}>
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

	details {
		user-select: none;
		-webkit-user-select: none;

		summary {
			color: #555;
			cursor: pointer;
			list-style-type: '';

			&::before {
				content: '→ ';
				display: inline-block;
				color: #222;
				margin-right: 1ch;
				transition: all var(--transition-duration) var(--transition-type);
			}
		}

		&[open] {
			summary {
				&::before {
					display: inline-block;
					transform: rotate(90deg);
					transform-origin: center;
				}
			}
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

		details {
			summary {
				&::before {
					transition: none;
				}
			}

			&[open] {
				summary {
					&::before {
						transform: none;
					}
				}
			}
		}
	}
</style>
