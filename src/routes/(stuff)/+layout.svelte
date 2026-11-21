<script>
    import { onMount } from 'svelte'
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'
    import { activePreview, linkPreviews } from '$lib/hoverPreview'
    import ProjectPreview from '$lib/ProjectPreview.svelte'
    import { rise, setDirection } from '$lib/transitions'

    const SHOW_NAV = true // set to false to hide the sliding nav

    const links = [
        { href: '/', title: 'accueil' },
        { href: '/projects', title: 'projets' },
        { href: '/cv', title: 'cv' },
    ]

    // The row slides so the current page sits on the column edge; earlier links drift off to the left.
    let anchors = []
    let offset = 0
    $: activeIndex = links.findIndex(link => link.href === $page.url.pathname)
    $: if (anchors.length) offset = activeIndex > 0 ? -anchors[activeIndex].offsetLeft : 0
    const opacity = index => activeIndex < 0 || index >= activeIndex ? 1 : (1 - (activeIndex - index) / links.length) / 1.5

    // Svelte skips intro transitions on the first render, so the content is rendered right after
    // mount instead; that way the blocks of the first page animate in too.
    let ready = false

    onMount(() => {
        ready = true
        // Proportional type: re-measure once the font is in and whenever the layout changes.
        const measure = () => { anchors = anchors }
        document.fonts?.ready.then(measure)
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    })

    // Moving right through the nav pushes the old page out to the left and brings the new one in
    // from the right; moving left does the opposite. Other navigations blur away vertically.
    const indexOf = url => url ? links.findIndex(link => link.href === url.pathname) : -1
    onNavigate(navigation => {
        const from = indexOf(navigation.from?.url)
        const to = indexOf(navigation.to?.url)
        const direction = from < 0 || to < 0 ? 0 : Math.sign(to - from)
        setDirection(direction) // read by the new page's blocks as they come in
        if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        document.documentElement.dataset.nav = direction > 0 ? 'forward' : direction < 0 ? 'back' : ''
        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })
</script>

<div class='app'>
    {#if ready}
    {#if SHOW_NAV}
    <header in:rise|global>
        <nav aria-label='Main'>
            <div class='links' style='--offset: {offset}px'>
                {#each links as { href, title }, index}
                    <a {href} bind:this={anchors[index]} class:active={index === activeIndex}
                        aria-current={index === activeIndex ? 'page' : undefined}
                        style='--opacity: {opacity(index)}'>{title}</a>
                {/each}
            </div>
        </nav>
    </header>
    {/if}
    <main use:linkPreviews><slot /></main>
    {/if}
</div>

<ProjectPreview project={$activePreview} />

<style>
    .app { width: min(var(--layout-width), calc(100% - 2 * var(--gap-page))); margin-inline: auto; padding-block: var(--gap-section) 8rem; }
    header { margin-bottom: var(--gap-section); }
    .links { position: relative; display: flex; gap: 1.5rem; width: max-content; transform: translateX(var(--offset)); view-transition-name: header; }
    .links a { color: var(--muted); text-decoration: none; opacity: var(--opacity); user-select: none; -webkit-user-select: none; }
    .links a:hover { color: var(--color); }
    .links a.active { color: var(--color); pointer-events: none; }
    main { min-width: 0; }
</style>
