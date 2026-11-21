<script>
    import { onMount } from 'svelte'
    import { projects } from '$lib/projects'
    import { hoverPreview } from '$lib/hoverPreview'
    import { rise, stagger } from '$lib/transitions'
    import Reveal from '$lib/Reveal.svelte'

    // Live projects first, work in progress at the end.
    const ordered = [...projects].sort((a, b) => Number(!!a.disabled) - Number(!!b.disabled))
    const isMotion = src => /\.(webm|mp4|gif)$/i.test(src)

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
        </li>
    {/each}
</ul>
</Reveal>

<style>
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
