<script>
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'
    import { GAP, doStuff } from '$lib'
    
    const links = doStuff([
        { href: '/', title: '/' },
        { href: '/about', title: 'обо мне', color: '#6374ce' },
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

    const far = (href) => Math.abs(links.findIndex(l => l.href === $page.url.pathname) - links.findIndex(l => l.href === href)) >= 2 
</script>

<div class='app'>
    <header class='p-1 xl:mt-5' style='--offset: {links.find(l => l.href === $page.url.pathname).offset}ch; --active-color: {links.find(l => l.href === $page.url.pathname).color || 'var(--color)'}'>
        <div class='maxw-65 mx-auto'>
            <div class='d-flex' style='gap: {GAP}ch'>
                {#each links as { href, title }}
                    <a
                        {href}
                        class:active={$page.url.pathname === href}
                        class:near={links.findIndex(l => l.href === $page.url.pathname) - links.findIndex(l => l.href === href) === 1}
                        class:far={links.findIndex(l => l.href === $page.url.pathname) - links.findIndex(l => l.href === href) >= 2}
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
        animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out; /* 400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left; */
    }

    :root::view-transition-new(root) {
        animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in; /* 400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right; */
    }

    header {
        view-transition-name: header;
        transform: translateX(var(--offset));

        a {
            text-decoration: none;
            color: #555;
            transition: all 150ms ease-in-out;
            user-select: none;
            -webkit-user-select: none;

            &:hover {
                color: #aaa;
            }

            &.active {
                pointer-events: none;
                color: var(--active-color);
            }

            &.near {
                filter: blur(.75px);
            }

            &.far {
                filter: blur(1.5px);
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

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes fade-out {
        to {
            opacity: 0;
        }
    }

    @keyframes slide-from-right {
        from {
            transform: translateX(1000px);
        }
    }

    @keyframes slide-to-left {
        to {
            transform: translateX(-1000px);
        }
    }
</style>
