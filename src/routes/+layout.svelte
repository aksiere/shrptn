<script>
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'
    import { GAP, doStuff } from '$lib'
    
    const links = doStuff([
        { href: '/', title: 'обо мне', color: '#6374ce' },
        { href: '/skills', title: 'что умею', color: '#96f605' },
        { href: '/projects', title: 'что делаю' },
    ])

    onNavigate((navigation) => {
        if (!document.startViewTransition) return

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })
</script>

<div class='app'>
    <header class='p-1 xl:mt-5' style='--offset: {links.find(l => l.href === $page.url.pathname).offset}ch; --active-color: {links.find(l => l.href === $page.url.pathname).color || 'var(--color)'}'>
        <div class='maxw-65 mx-auto'>
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
    </header>
    
    <main class='px-1 xl:mt-3'>
        <div class='maxw-65 mx-auto'>
            <slot />
        </div>
    </main>
    
    <footer>
    
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
        view-transition-name: header;
        transform: translateX(var(--offset));
        transition: all .2s ease-in-out;

        a {
            text-decoration: none;
            color: #555;
            transition: all 150ms ease-in-out;
            opacity: var(--opacity);

            &:hover {
                color: #aaa;
            }

            &.active {
                pointer-events: none;
                color: var(--color);
            }

            &::before,
            &::after {
                color: #222;
            }

            &::before {
                /* content: '[ '; */
            }

            &::after {
                /* content: ' ]'; */
            }
        }
    }

    /* */

    @keyframes in {
        from {
            transform: translateX(100px);
            opacity: 0;
            filter: blur(2px);
        }
    }

    @keyframes out {
        to {
            transform: translateX(-100px);
            opacity: 1;
            filter: blur(2px);
        }
    }
</style>
