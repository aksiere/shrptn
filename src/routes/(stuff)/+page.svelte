<script>
    import { PUBLIC_USERNAME } from '$env/static/public'
    import ProjectList from '$lib/ProjectList.svelte'
    import { rise, stagger } from '$lib/transitions'
    import Reveal from '$lib/Reveal.svelte'
</script>

<svelte:head><title>{PUBLIC_USERNAME.toLowerCase()}</title></svelte:head>

<!-- <header class='intro-header'>
    <h1>Oleg Shiropatin</h1>
    <span class='role'>Developer &amp; QA Engineer</span>
</header> -->

<Reveal>
<img class='signature' src='/sign.svg' alt='' width='273' height='241' draggable='false' in:rise|global={{ delay: stagger(5), duration: 900, x: 0, y: 0 }}>

<!-- A résumé in the French sense: the CV told as a short summary. The full CV is on /cv. -->
<section class='section' aria-label='Résumé'>
    <!-- <h2 id='resume-title' class='section-title'>Résumé</h2> -->
    <div class='summary'>
        <p in:rise|global={{ delay: stagger(0) }}>Developer and QA engineer from Saint Petersburg.</p>
        <p in:rise|global={{ delay: stagger(1) }}>Writing SvelteKit since 2020: tried React and Vue, chose Svelte back in the Sapper days, and every experiment since has been built on it.</p>
        <p in:rise|global={{ delay: stagger(2) }}>Most recently in test automation at <a href='https://www.onlyoffice.com/' target='_blank' rel='noopener noreferrer'>ONLYOFFICE</a>, extending the testing library with new modules and tests. AI tools like Claude Code and Codex are part of the everyday workflow.</p>
    </div>
</section>

<!-- <section class='section' aria-labelledby='projects-title'>
    <h2 id='projects-title' class='section-title'>Projects</h2>
    <ProjectList />
</section> -->

<section class='section' aria-labelledby='contact-title' in:rise|global={{ delay: stagger(3) }}>
    <h2 id='contact-title' class='section-title'>Contact</h2>
    <p class='muted'>You can reach me on <a href='https://t.me/shrptn' target='_blank' rel='noopener noreferrer'>Telegram</a> or by <a href='mailto:shiropatin@gmail.com'>email</a>.</p>
</section>
</Reveal>

<style>
    .intro-header { display: flex; flex-direction: column; align-items: flex-start; }
    h1 { margin: 0; }
    .role { color: var(--muted); font-weight: 500; line-height: 1; }
    .muted { margin: 0; color: var(--muted); }
    .muted a { color: var(--color); }
    .summary { color: var(--muted); }
    .summary p { margin: 0 0 var(--gap-text); text-wrap: pretty; }
    .summary p:last-child { margin-bottom: 0; }
    .summary a { color: var(--color); }
    /* Pinned to the corner, behind the content, so it stays put while the page scrolls. */
    .signature {
        position: fixed;
        right: max(clamp(1rem, 3vw, 2rem), env(safe-area-inset-right));
        bottom: max(clamp(1rem, 3vw, 2rem), env(safe-area-inset-bottom));
        z-index: -1;
        width: clamp(4.5rem, 10vw, 6.25rem);
        height: auto;
        opacity: .5;
        pointer-events: none;
        user-select: none;
    }
    @media (max-width: 640px) { .signature { opacity: .25; } }
</style>
