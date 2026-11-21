<script>
    import { onMount } from 'svelte'
    import { draggableRail } from '$lib/helpers/draggableRail'
    import { fadeProjectRail } from '$lib/helpers/fadeProjectRail'
    import { projects } from '$lib/projects'
    import ProjectCard from '$lib/ProjectCard.svelte'

    // Work in progress sits first, already scrolled past, so the first live project lines up with the column.
    const ordered = [...projects].sort((a, b) => Number(!!b.disabled) - Number(!!a.disabled))
    const firstLive = Math.max(0, ordered.findIndex(project => !project.disabled))

    let rail
    let track
    onMount(() => {
        // Size cards so a whole number of them fits from the column edge to the screen edge,
        // with a sliver of the next one showing so it's clear the rail scrolls.
        const measure = () => {
            const inset = rail.parentElement.getBoundingClientRect().left
            const width = document.documentElement.clientWidth
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0
            const visible = width - inset
            const peek = 2.5 * rem
            const count = Math.max(1, Math.floor((visible - peek + gap) / (17.5 * rem + gap)))
            const card = Math.min(22 * rem, (visible - peek - count * gap) / count)
            rail.style.setProperty('--rail-inset', `${inset}px`)
            rail.style.setProperty('--rail-width', `${width}px`)
            rail.style.setProperty('--card-width', `${Math.floor(card)}px`)
        }
        const observer = new ResizeObserver(measure)
        observer.observe(rail.parentElement)
        observer.observe(document.documentElement)
        measure()
        const items = rail.querySelectorAll('.project-item')
        if (firstLive > 0) rail.scrollTo({ left: items[firstLive].offsetLeft - items[0].offsetLeft, behavior: 'instant' })
        return () => observer.disconnect()
    })
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (the scroll container must be reachable for native keyboard scrolling) -->
<div class='project-rail' bind:this={rail} use:draggableRail use:fadeProjectRail role='region' aria-label='Projects, scroll horizontally' tabindex='0'>
    <div class='project-track' bind:this={track}>
        {#each ordered as project}
            <div class='project-item'>
                <ProjectCard {project} />
            </div>
        {/each}
    </div>
</div>

<style>
    .project-rail {
        --rail-inset: calc((100vw - min(var(--layout-width), 100vw - 3rem)) / 2);
        width: var(--rail-width, 100vw);
        margin-left: calc(-1 * var(--rail-inset));
        padding-left: var(--rail-inset);
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scroll-padding-left: var(--rail-inset);
        scroll-behavior: smooth;
        scrollbar-width: none;
        padding-block: 6px;
        cursor: grab;
        user-select: none;

    }
    .project-rail:global(.is-free) { scroll-snap-type: none; scroll-behavior: auto; }
    .project-rail:global(.is-dragging), .project-rail:global(.is-dragging) :global(*) { cursor: grabbing; }
    .project-rail :global(a) { cursor: inherit; }
    .project-rail::-webkit-scrollbar { display: none; }
    .project-rail:focus-visible { outline: 1px solid var(--muted); outline-offset: 4px; }
    .project-track {
        display: flex;
        width: max-content;
        gap: clamp(1rem, 4vw, 2rem);
        padding-right: calc(var(--rail-width, 100vw) - var(--rail-inset) - var(--card-width, min(17.5rem, 100vw - 4.5rem)));
    }
    .project-item {
        flex: 0 0 auto;
        width: var(--card-width, min(17.5rem, calc(100vw - 4.5rem)));
        scroll-snap-align: start;
    }
    @media (prefers-reduced-motion: reduce) {
        .project-rail { scroll-behavior: auto; }
    }
</style>
