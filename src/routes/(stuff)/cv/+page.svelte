<script>
    import { onDestroy, onMount } from 'svelte'
    import { PUBLIC_USERNAME, PUBLIC_LAST_UPDATED } from '$env/static/public'
    import { hoverPreview } from '$lib/hoverPreview'
    import { slide } from 'svelte/transition'
    import { rise, stagger } from '$lib/transitions'
    import Reveal from '$lib/Reveal.svelte'

    const name = 'Oleg Shiropatin'
    const role = 'Developer & QA Engineer'
    // Shown under the cursor while hovering the name (mouse/trackpad only).
    const photo = { preview: '/me.png', width: 180, aspect: 3 / 4 }

    // Work, study and own projects in one list, so it's clear what filled each period.
    // start/end: a year (2022) or an exact date ('2020-05-25'); end: null means ongoing.
    const timeline = [
        {
            kind: 'work', start: '2025-10-15', end: '2026-11-13',
            title: 'QA Engineer, test automation · ONLYOFFICE',
            // minor: secondary work, shown quieter.
            points: [
                { text: 'Extended the automated testing library with new modules' },
                { text: 'Wrote automated tests on top of it' },
                { text: 'Manual testing, to a lesser extent', minor: true },
            ],
        },
        {
            kind: 'study', start: '2022-09-01', end: '2024-08-31',
            title: 'Master of Science, Intelligent Technologies in Automation', code: '15.04.04',
            note: 'Bonch-Bruevich Saint Petersburg State University of Telecommunications',
        },
        {
            kind: 'projects', start: '2020-11-01', end: null,
            title: 'Experiments on SvelteKit',
            note: 'Picked Svelte over React and Vue in 2020, while its server side was still Sapper; building and growing with SvelteKit ever since',
        },
        {
            kind: 'work', start: '2020-05-25', end: '2020-12-31',
            title: 'Marketing and Advertising Assistant · AUTOPOLE',
            note: 'Website support and administration (1C-Bitrix); landing page development (PHP, JS)',
        },
        {
            kind: 'study', start: '2018-09-01', end: '2022-08-31',
            title: 'Bachelor of Applied Science, Information Systems Security', code: '09.03.02',
            note: 'Bonch-Bruevich Saint Petersburg State University of Telecommunications',
        },
    ]
    const kindLabel = { work: 'Work', study: 'Study', projects: 'Own projects' }

    // Drawn like `git log --graph` on a true time scale: time runs upwards along `main` at a constant
    // number of pixels per year, from the earliest start (level with the oldest entry) to today. Each
    // kind of entry is a branch that forks off main where it starts and stops with an open dot where
    // it ends; ongoing ones run on to the top. Entries that follow each other without a pause
    // (bachelor's, then master's) stay on one branch. Every entry is a commit at its exact start, with
    // its text right beside it; where entries are too close in time for their text, the whole scale
    // grows taller until everything fits.
    // Dates as fractional years, so the graph can place them precisely.
    const toYear = value => {
        if (typeof value === 'number') return value
        const date = new Date(value + 'T00:00:00')
        const start = new Date(date.getFullYear(), 0, 1)
        return date.getFullYear() + (date - start) / (new Date(date.getFullYear() + 1, 0, 1) - start)
    }
    // Exact dates are shown to the month: 05.2020.
    const formatPoint = value => {
        if (value === null) return 'now'
        if (typeof value === 'number') return String(value)
        const [year, month] = value.split('-')
        return `${month}.${year}`
    }
    const entries = [...timeline].sort((a, b) => toYear(b.start) - toYear(a.start))
    const laneOf = { projects: 1, work: 2, study: 3 } // lane 0 is main
    const LANE = 14
    const GRAPH_WIDTH = 4 * LANE
    const HEAD = 48       // room above the newest entry; today sits halfway up it
    const FIRST_LINE = 12 // middle of an entry's first line of text
    const BEND = 14       // height of the curve where a branch leaves main
    const GAP = 24        // least space between entries (--gap-item)
    const MIN_PER_YEAR = 48 // the scale never gets flatter than this
    const CONTIGUOUS = .05 // entries less than ~2 weeks apart (31.08 -> 01.09) continue one branch
    const laneX = lane => LANE / 2 + lane * LANE

    let list
    let graph = { height: 0, lines: [], dots: [], rows: [] }

    function layoutGraph() {
        if (!list) return
        const heights = [...list.children].map(row => row.offsetHeight)
        const today = toYear(new Date().toISOString().slice(0, 10))
        const starts = entries.map(entry => toYear(entry.start))
        const top = HEAD / 2
        // Pixels per year: enough that every entry's text fits above the next (older) one, and that
        // the newest entry clears the head room.
        let perYear = MIN_PER_YEAR
        starts.forEach((t, index) => {
            const older = starts[index + 1]
            if (older !== undefined) perYear = Math.max(perYear, (heights[index] + GAP) / Math.max(t - older, .01))
        })
        perYear = Math.max(perYear, (HEAD + FIRST_LINE - top) / Math.max(today - starts[0], .01))
        const yAt = t => top + (today - Math.min(t, today)) * perYear
        // Each entry's first line sits level with its commit.
        const rows = starts.map(t => yAt(t) - FIRST_LINE)
        const height = rows.at(-1) + heights.at(-1)
        const curve = (x1, y1, x2, y2) => `C ${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`

        const lines = []
        const ends = []
        let root = 0
        for (const kind of Object.keys(laneOf)) {
            const x = laneX(laneOf[kind])
            // Oldest first; back-to-back entries are grouped into one branch.
            const own = entries.filter(entry => entry.kind === kind).reverse()
            const branches = []
            for (const entry of own) {
                const last = branches.at(-1)
                if (last && last.end !== null && toYear(entry.start) - toYear(last.end) < CONTIGUOUS) last.end = entry.end
                else branches.push({ start: entry.start, end: entry.end })
            }
            for (const branch of branches) {
                // The curve sits just below the start, so the branch reaches its lane exactly at it.
                const startY = yAt(toYear(branch.start))
                root = Math.max(root, startY + BEND)
                let d = `M ${laneX(0)} ${startY + BEND} ${curve(laneX(0), startY + BEND, x, startY)}`
                if (branch.end === null) d += ` L ${x} 0`
                else {
                    const endY = yAt(toYear(branch.end))
                    d += ` L ${x} ${endY}`
                    ends.push({ kind, x, y: endY, end: true })
                }
                lines.push({ kind, d })
            }
        }
        lines.unshift({ kind: 'main', d: `M ${laneX(0)} ${root + 6} L ${laneX(0)} 0` })
        const dots = entries.map(entry => ({ kind: entry.kind, x: laneX(laneOf[entry.kind]), y: yAt(toYear(entry.start)) }))
        dots.push({ kind: 'main', x: laneX(0), y: root + 6 }, ...ends)
        graph = { height, lines, dots, rows }
    }

    // Re-measure whenever an entry reflows (fonts loading, resizing, wrapping).
    let observer
    $: if (list && !observer) {
        observer = new ResizeObserver(layoutGraph)
        for (const row of list.children) observer.observe(row)
    }
    onDestroy(() => observer?.disconnect())

    // One pile, the core stack first (highlighted).
    const mainSkills = ['Svelte', 'SvelteKit', 'Test automation', 'Claude Code']
    const otherSkills = [
        'JavaScript', 'HTML', 'CSS', 'Vue', 'Tailwind CSS', 'UnoCSS', 'SCSS',
        'Bun', 'Node.js', 'Elysia', 'Supabase', 'Pocketbase', 'PostgreSQL', 'SQLite', 'Redis', 'Prisma',
        'Puppeteer', 'Manual testing', 'Codex',
        'Git', 'GitHub', 'Vite', 'Figma', 'PHP', 'Telegram Bot API', 'Grammy', 'Telegraf', 'Serverless',
    ]
    const skills = [...mainSkills.map(title => ({ title, main: true })), ...otherSkills.map(title => ({ title, main: false }))]

    // Placeholder values (like 1/1/1 in a local .env) are ignored.
    const updated = new Date(PUBLIC_LAST_UPDATED)
    const showUpdated = !Number.isNaN(updated.getTime()) && updated.getFullYear() >= 2020

    // Touch screens can't hover: tapping the name shows the photo under the header instead.
    let photoOpen = false
    const togglePhoto = () => { if (matchMedia('(hover: none)').matches) photoOpen = !photoOpen }

    // Load the photo ahead so it's there on the first hover.
    onMount(() => { new Image().src = photo.preview })
</script>

<svelte:head><title>{PUBLIC_USERNAME.toLowerCase()} / cv</title></svelte:head>

<Reveal>
<header class='intro-header cv-header' in:rise|global={{ delay: stagger(0) }}>
    <h1 class='name' use:hoverPreview={photo}><button class='name-button' onclick={togglePhoto} aria-expanded={photoOpen}>{name}</button></h1>
    <span class='role'>{role}</span>
    {#if photoOpen}
        <div class='photo' transition:slide={{ duration: 250 }}><img src={photo.preview} alt={name} width='180' height='240' /></div>
    {/if}
</header>

<section class='section' aria-labelledby='profile-title' in:rise|global={{ delay: stagger(1) }}>
    <h2 id='profile-title' class='section-title'>Profile</h2>
    <div class='prose'>
        <p>SvelteKit developer at heart. Started with JavaScript web frameworks in 2020, tried React and Vue, and chose Svelte, back when its server side was still Sapper. Since then every experiment has been written in SvelteKit, and it’s the stack I’ve grown with.</p>
        <p>Most recently in test automation at ONLYOFFICE: new modules for the automated testing library and the tests built on them. AI is part of the daily workflow: Claude Code and Codex speed up development, testing and routine work.</p>
    </div>
</section>

<section class='section' aria-labelledby='timeline-title' in:rise|global={{ delay: stagger(2) }}>
    <h2 id='timeline-title' class='section-title'>Experience &amp; education</h2>
    <div class='graph-wrap' style='--graph-width: {GRAPH_WIDTH}px; --graph-head: {HEAD}px'>
    <svg class='graph' width={GRAPH_WIDTH} height={graph.height} viewBox='0 0 {GRAPH_WIDTH} {graph.height || 1}' aria-hidden='true'>
        {#each graph.lines as line}<path d={line.d} class='line {line.kind}' />{/each}
        {#each graph.dots as dot}<circle cx={dot.x} cy={dot.y} r={dot.end ? 3.5 : 4} class='dot {dot.kind}' class:end={dot.end} />{/each}
    </svg>
    <ul class='timeline' bind:this={list} class:ready={graph.height > 0} style='height: {graph.height}px'>
        {#each entries as entry, index}
            <li style='top: {graph.rows[index] ?? 0}px'>
                <div class='when'>
                    <span class='period numeric'>{formatPoint(entry.start)} -&gt; {formatPoint(entry.end)}</span>
                    <span class='kind {entry.kind}'>{kindLabel[entry.kind]}</span>
                </div>
                <div>
                    <span class='entry-title heading'>{entry.title}{#if entry.code}{' '}<span class='code'>({entry.code})</span>{/if}</span>
                    {#if entry.points}
                        <ul class='points'>
                            {#each entry.points as point}<li class:minor={point.minor}>{point.text}</li>{/each}
                        </ul>
                    {:else}
                        <p class='entry-note'>{entry.note}</p>
                    {/if}
                </div>
            </li>
        {/each}
    </ul>
    </div>
</section>

<section class='section' aria-labelledby='skills-title' in:rise|global={{ delay: stagger(3) }}>
    <h2 id='skills-title' class='section-title'>Skills</h2>
    <ul class='chips'>
        {#each skills as { title, main }, index}
            <li class='chip' class:main in:rise|global={{ delay: stagger(3) + 60 + index * 15, duration: 450, x: 12, y: 6 }}>{title}</li>
        {/each}
    </ul>
</section>

{#if showUpdated}
    <p class='updated' in:rise|global={{ delay: stagger(4) }}>Updated {updated.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
{/if}
</Reveal>

<style>
    .cv-header { display: flex; flex-direction: column; align-items: flex-start; }
    h1 { margin: 0; }
    .role { color: var(--muted); font-weight: 500; line-height: 1; }
    /* A quiet hint that the name hides something: a photo on hover, or on tap on touch screens. */
    .name { cursor: default; }
    .name-button { text-decoration: underline dotted var(--underline); text-decoration-thickness: 1px; text-underline-offset: 5px; }
    .name-button { padding: 0; border: none; background: none; color: inherit; font: inherit; text-align: left; cursor: inherit; }
    @media (hover: none) { .name { cursor: pointer; } .name-button { -webkit-tap-highlight-color: transparent; } }
    .photo { padding-top: .75rem; }
    .photo img { display: block; width: 180px; height: 240px; border-radius: 8px; object-fit: cover; box-shadow: 0 0 0 1px var(--border); }

    .prose { color: var(--muted); }
    .prose p { margin: 0 0 var(--gap-text); text-wrap: pretty; }
    .prose p:last-child { margin-bottom: 0; }

    .graph-wrap { position: relative; }
    .graph {
        position: absolute; top: 0; left: 0; overflow: visible;
        /* Branches fade out towards "now", and the graph draws itself from the bottom up. */
        -webkit-mask-image: linear-gradient(to bottom, transparent, #000 calc(var(--graph-head) / 2));
        mask-image: linear-gradient(to bottom, transparent, #000 calc(var(--graph-head) / 2));
        animation: draw-graph 1.4s cubic-bezier(.4, 0, .2, 1) .35s both;
    }
    @keyframes draw-graph { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
    .line { fill: none; stroke-width: 2; stroke-linecap: round; }
    .line.main { stroke: var(--faint); }
    .line.work { stroke: var(--accent); }
    .line.study { stroke: var(--strong); }
    .line.projects { stroke: var(--muted); stroke-dasharray: 4 4; stroke-linecap: butt; }
    .dot { stroke: var(--background); stroke-width: 3; paint-order: stroke; }
    /* Where a finished branch stops: an open ring in the branch's colour. */
    .graph .dot.end { fill: var(--background); stroke-width: 2; paint-order: normal; }
    .dot.end.work { stroke: var(--accent); }
    .dot.end.study { stroke: var(--strong); }
    .dot.main { fill: var(--faint); }
    .dot.work { fill: var(--accent); }
    .dot.study { fill: var(--strong); }
    .dot.projects { fill: var(--muted); }
    /* Entries are placed on the time scale by the graph layout; hidden until it has run. */
    .timeline { position: relative; margin: 0; padding: 0; list-style: none; visibility: hidden; }
    .timeline.ready { visibility: visible; }
    .timeline > li { position: absolute; left: calc(var(--graph-width) + var(--gap-column)); right: 0; }
    .timeline > li { display: grid; grid-template-columns: 10.5rem minmax(0, 1fr); column-gap: var(--gap-column); }
    .when { display: flex; flex-direction: column; }
    .period { color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .kind { color: var(--faint); font-size: .8125rem; }
    /* Labels take their branch's colour. */
    .kind.work { color: var(--accent); }
    .kind.study { color: var(--strong); }
    .kind.projects { color: var(--muted); }
    .entry-note { margin: 0; color: var(--muted); }
    .code { color: var(--faint); font-weight: 400; font-variant-numeric: tabular-nums; }
    /* Plain lines under the title, no markers; secondary work is quieter. */
    .points { display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; color: var(--muted); }
    .points .minor { color: var(--faint); font-style: oblique; }

    .chips { display: flex; flex-wrap: wrap; gap: .375rem; margin: 0; padding: 0; list-style: none; }
    .chip {
        padding: .1875rem .625rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--muted);
        font-size: .8125rem;
        line-height: 1.25rem;
        white-space: nowrap;
        transition: border-color .15s ease, color .15s ease, background-color .15s ease;
    }
    .chip:hover { border-color: var(--underline); color: var(--color); }
    /* The core stack, in the accent colour. */
    .chip.main {
        border-color: rgb(97 253 239 / .45);
        background: rgb(97 253 239 / .1);
        color: var(--accent);
        font-weight: 500;
        font-variation-settings: 'ROND' 100;
    }
    .updated { margin: var(--gap-section) 0 0; color: var(--faint); font-size: .8125rem; font-style: oblique; }

    @media (max-width: 480px) {
        .timeline > li { grid-template-columns: minmax(0, 1fr); }
        .when { flex-direction: row; gap: .5rem; align-items: baseline; }
    }
    @media (prefers-reduced-motion: reduce) { .chip { transition: none; } .graph { animation: none; } }
</style>
