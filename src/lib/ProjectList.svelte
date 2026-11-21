<script>
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import { projects } from '$lib/projects'
    import { hoverPreview } from '$lib/hoverPreview'
    import { rise, stagger } from '$lib/transitions'
    import Reveal from '$lib/Reveal.svelte'

    // Live projects first, work in progress at the end.
    const ordered = [...projects].sort((a, b) => Number(!!a.disabled) - Number(!!b.disabled))
    const isMotion = src => /\.(webm|mp4|gif)$/i.test(src)
    const isVideo = src => /\.(webm|mp4)$/i.test(src)

    // Touch screens can't hover, so there a button beside the row opens the preview inline.
    let open = null
    const toggle = project => { open = open === project ? null : project }

    onMount(() => {
        // Warm the cache for image previews so they appear instantly on first hover.
        for (const project of projects) {
            if (project.preview && !/\.(webm|mp4)$/i.test(project.preview)) new Image().src = project.preview
        }
    })
</script>

<Reveal>
<ul class='project-list'>
    {#each ordered as project, index}
        <li in:rise|global={{ delay: stagger(index) }}>
            <svelte:element this={project.disabled ? 'div' : 'a'}
                href={project.disabled ? undefined : project.href}
                target={project.disabled ? undefined : '_blank'}
                rel={project.disabled ? undefined : 'noopener noreferrer'}
                use:hoverPreview={project}
                data-no-link-preview
                class='project-row' class:wip={project.disabled}>
                <span class='title heading'>
                    {project.title}
                    {#if project.disabled}<span class='status'>wip</span>{/if}
                    {#if project.preview}
                        <!-- Hints that hovering shows a preview; hidden where there's no hover. -->
                        <svg class='has-preview' width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.25' stroke-linejoin='round' aria-hidden='true'>
                            <rect x='1.5' y='3' width='13' height='10' rx='2' />
                            {#if isMotion(project.preview)}
                                <path d='M6.75 6.1v3.8L9.9 8z' fill='currentColor' stroke='none' />
                            {:else}
                                <circle cx='5.5' cy='6.5' r='1' fill='currentColor' stroke='none' />
                                <path d='M1.75 11.5 5.5 8.5l2.5 2 2.5-2.5 3.75 3.5' />
                            {/if}
                        </svg>
                    {/if}
                </span>
                <span class='description'>{project.description}</span>
            </svelte:element>
            {#if project.preview}
                <button class='touch-preview' class:open={open === project} onclick={() => toggle(project)}
                    aria-expanded={open === project} aria-label={(open === project ? 'Hide' : 'Show') + ' preview of ' + project.title}>
                    <svg width='18' height='18' viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.25' stroke-linejoin='round' aria-hidden='true'>
                        <rect x='1.5' y='3' width='13' height='10' rx='2' />
                        {#if isMotion(project.preview)}
                            <path d='M6.75 6.1v3.8L9.9 8z' fill='currentColor' stroke='none' />
                        {:else}
                            <circle cx='5.5' cy='6.5' r='1' fill='currentColor' stroke='none' />
                            <path d='M1.75 11.5 5.5 8.5l2.5 2 2.5-2.5 3.75 3.5' />
                        {/if}
                    </svg>
                </button>
                {#if open === project}
                    <div class='inline-preview' transition:slide={{ duration: 250 }}>
                        <div class='inline-frame'>
                            {#if isVideo(project.preview)}
                                <video src={project.preview} poster={project.poster} muted playsinline autoplay loop disablepictureinpicture></video>
                            {:else}
                                <img src={project.preview} alt='' decoding='async' />
                            {/if}
                        </div>
                    </div>
                {/if}
            {/if}
        </li>
    {/each}
</ul>
</Reveal>

<style>
    .project-list li { position: relative; }
    /* Touch only: a button on the row's right edge, and the preview opening under the row. */
    .touch-preview { display: none; }
    @media (hover: none) {
        .touch-preview {
            position: absolute; top: 0; right: -.5rem;
            display: grid; place-items: center;
            width: 2.75rem; height: 2.75rem;
            padding: 0; border: none; border-radius: 999px; background: none;
            color: var(--faint); cursor: pointer;
            transition: color .15s ease, background-color .15s ease;
        }
        .touch-preview.open { color: var(--accent); background: var(--surface); }
        .project-list li:has(.touch-preview) .project-row { padding-right: 3rem; }
    }
    .inline-preview { padding-top: .75rem; }
    .inline-frame { overflow: hidden; aspect-ratio: 720 / 440; border-radius: 8px; background: var(--surface); box-shadow: 0 0 0 1px var(--border); }
    .inline-frame video, .inline-frame img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .project-list { display: flex; flex-direction: column; gap: var(--gap-item); margin: 0; padding: 0; list-style: none; }
    .project-row { display: flex; flex-direction: column; margin-inline: -1rem; padding-inline: 1rem; border-radius: 6px; color: inherit; text-decoration: none; transition: background-color .15s ease; }
    a.project-row:hover { background: var(--surface); }
    a.project-row:focus-visible { outline: 2px solid var(--muted); outline-offset: 0; }
    .title { display: inline-flex; align-items: center; gap: .5rem; }
    .description { color: var(--muted); }
    .wip .title { color: var(--muted); }
    .wip .description { color: var(--faint); }
    .has-preview { flex: none; color: var(--faint); transition: color .15s ease; }
    a.project-row:hover .has-preview, a.project-row:focus-visible .has-preview { color: var(--muted); }
    @media (hover: none) { .has-preview { display: none; } }
    .status { padding: 0 .375rem; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-size: .6875rem; line-height: 1.5; font-style: oblique; }
    /* With hover backgrounds the space between entries moves into the rows: same distance, bigger targets. */
    @media (min-width: 640px) {
        .project-list { gap: 0; margin-block: calc(var(--gap-item) / -2); }
        .project-row { padding-block: calc(var(--gap-item) / 2); }
    }
    @media (prefers-reduced-motion: reduce) { .project-row, .has-preview { transition: none; } }
</style>
