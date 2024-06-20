<script>
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'
    import { GAP, doStuff } from '$lib'

	const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
    
    const links = doStuff([
        { href: '/', title: 'главная' },
        { href: '/projects', title: 'проекты' },
        { href: '/resume', title: 'résumé' },
    ])

	if (!isReduced) {
		onNavigate((navigation) => {
			if (!document.startViewTransition) return

			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve()
					await navigation.complete
				})
			})
		})
	}
</script>

<div class='app'>
    <header class='p-1 xl:mt-5' style='--offset: {links.find(l => l.href === $page.url.pathname).offset}ch;'>
        <div style='max-width: var(--layout-width);' class='mx-auto'>
            <div class='d-flex'>
				<div class='d-flex' style='gap: {GAP}ch'>
					{#each links as { href, title }}
						<a
							{href}
							class:active={$page.url.pathname === href}
							style='--opacity: {(1 - (links.findIndex(l => l.href === $page.url.pathname) - links.findIndex(l => l.href === href)) / links.length) >= 1 ? 1 : (1 - (links.findIndex(l => l.href === $page.url.pathname) - links.findIndex(l => l.href === href)) / links.length) / 1.5}'
						>
							{title}
						</a>
					{/each}
				</div>
            </div>
        </div>
    </header>
    
    <main class='px-1 xl:my-3'>
        <div style='max-width: var(--layout-width);' class='mx-auto'>
            <slot />
        </div>
    </main>
    
    <footer class='p-1 xl:mb-5'>
		<div style='max-width: var(--layout-width);' class='mx-auto text-center'>
            {#if isReduced}
				<span style='color: #555;'>все анимации и переходы были отключены</span>
			{/if}
        </div>
    </footer>
</div>


<style>
    .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
    }

    :root::view-transition-old(root) {
        animation: .2s ease-in-out both out;
    }

    :root::view-transition-new(root) {
        animation: .2s ease-in-out both in;
    }

    header {
		& > div > div > div {
			view-transition-name: header;
			transform: translateX(var(--offset));
		}

        a {
			color: #777;
			border-bottom: none;
            opacity: var(--opacity);

			&:hover {
				color: #aaa;
			}

			&.active {
				color: #fff;
				pointer-events: none;
			}

			user-select: none;
			-webkit-user-select: none;
        }
    }

	@media (prefers-reduced-motion) {
		:root::view-transition-old(root) {
			animation: none !important;
		}

		:root::view-transition-new(root) {
			animation: none !important;
		}

		a {
			transition: none !important;
		}

		header {
			transition: none !important;
		}
	}

    /* */

    @keyframes in {
        from {
            transform: translateX(100px);
            opacity: 0;
            /* filter: blur(2px); */
        }
    }

    @keyframes out {
        to {
            transform: translateX(-100px);
            opacity: 1;
            /* filter: blur(2px); */
        }
    }
</style>
