<script>
    import { onMount } from 'svelte'

    export let project

    // An animated preview (gif, animated webp, webm, mp4) stays on its first frame until the card is
    // hovered or focused. A video quickly scrubs back to the start when the pointer leaves (slightly
    // blurred) and when it reaches its end while hovered (sharp, then it plays again).
    const isVideo = /\.(webm|mp4)$/i.test(project.preview ?? '')
    const BLUR_MS = 160
    const REWIND_MS = 450
    let canvas
    let video
    let ready = false
    let gifShown = false
    let blurred = false
    let hovered = false
    let timer = 0
    let frame = 0
    let rewindId = 0

    function cancelRewind() {
        rewindId++
        clearTimeout(timer)
        cancelAnimationFrame(frame)
    }

    function rewind(then) {
        cancelRewind()
        const id = rewindId
        video.pause()
        const from = video.currentTime
        if (!from) return then?.()
        // Blur only when the preview is going back to rest; a hovered loop rewinds sharp.
        blurred = !hovered
        const done = () => {
            if (id !== rewindId) return
            cancelRewind()
            blurred = false
            then?.()
        }
        const toStart = () => {
            video.addEventListener('seeked', done, { once: true })
            timer = setTimeout(done, 300)
            video.currentTime = 0
        }
        // Files straight from MediaRecorder have no duration or seek index, so they can't be
        // scrubbed: jump to the start under the blur instead.
        if (!Number.isFinite(video.duration)) {
            timer = setTimeout(() => { if (id === rewindId) toStart() }, BLUR_MS)
            return
        }
        const start = performance.now()
        const step = now => {
            if (id !== rewindId) return
            const t = Math.min(1, (now - start) / REWIND_MS)
            const eased = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
            if (t === 1) return toStart()
            if (!video.seeking) video.currentTime = from * (1 - eased)
            frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
    }

    function ended() {
        if (hovered) rewind(() => { if (hovered) video.play().catch(() => {}) })
    }

    onMount(() => {
        if (!project.preview || project.poster || isVideo) return
        const image = new Image()
        image.decoding = 'async'
        image.onload = () => {
            if (!canvas) return
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            canvas.getContext('2d').drawImage(image, 0, 0)
            ready = true
        }
        image.src = project.preview
        return () => { image.onload = null }
    })

    function hoverPlay(node) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

        function play() {
            if (!project.preview || reducedMotion.matches || hovered) return
            cancelRewind()
            hovered = true
            blurred = false
            if (video) video.play().catch(() => {})
            else gifShown = true
        }

        function stop() {
            if (node.matches(':hover, :focus-within')) return
            hovered = false
            if (video) return rewind()
            if (!gifShown) return
            // A gif can't be scrubbed, so it swaps back to its first frame under a short blur.
            cancelRewind()
            blurred = true
            timer = setTimeout(() => { if (!hovered) { gifShown = false; blurred = false } }, BLUR_MS)
        }

        node.addEventListener('pointerenter', play)
        node.addEventListener('pointerleave', stop)
        node.addEventListener('focusin', play)
        node.addEventListener('focusout', stop)
        return {
            destroy() {
                cancelRewind()
                node.removeEventListener('pointerenter', play)
                node.removeEventListener('pointerleave', stop)
                node.removeEventListener('focusin', play)
                node.removeEventListener('focusout', stop)
            },
        }
    }
</script>

<svelte:element this={project.disabled ? 'div' : 'a'}
    href={project.disabled ? undefined : project.href}
    target={project.disabled ? undefined : '_blank'}
    rel={project.disabled ? undefined : 'noopener noreferrer'}
    use:hoverPlay
    class='project-card' class:in-progress={project.disabled}>
    <div class='preview-frame'>
    <div class='preview' class:blurred style='--blur-ms: {BLUR_MS}ms'>
        {#if isVideo}
            <video class='animated' bind:this={video} src={project.preview} poster={project.poster} muted playsinline on:ended={ended} preload='auto' disablepictureinpicture aria-hidden='true'></video>
        {:else if project.preview}
            {#if project.poster}
                <img class='poster' src={project.poster} alt='' decoding='async' draggable='false' />
            {:else}
                <canvas class='poster' class:ready bind:this={canvas} aria-hidden='true'></canvas>
            {/if}
            {#if gifShown}
                <img class='animated' src={project.preview} alt='' decoding='async' draggable='false' />
            {/if}
        {/if}
    </div>
    {#if project.disabled}<span class='status' aria-label='work in progress'><span class='status-dot' aria-hidden='true'></span>wip</span>{/if}
    </div>
    <div class='project-heading'>
        <h3>{project.title}</h3>
        {#if !project.disabled}<span class='arrow' aria-hidden='true'>↗</span>{/if}
    </div>
    <p class='description'>{project.description}</p>
</svelte:element>

<style>
    .project-card { display: block; min-width: 0; text-decoration: none; }
    .preview-frame { position: relative; margin-bottom: .75rem; }
    .in-progress .preview { filter: brightness(.5) saturate(.25); }
    .in-progress h3 { color: var(--muted); }
    .status { position: absolute; top: .75rem; right: .75rem; display: inline-flex; align-items: center; gap: .375rem; padding: .125rem .5rem; border: 1px solid #38352c; border-radius: 999px; background: #171612; color: #b6aa89; font-size: .6875rem; line-height: 1.5; }
    .status-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
    .preview { position: relative; display: block; overflow: hidden; aspect-ratio: 720 / 440; border: 1px solid #202020; border-radius: 8px; background: #0b0b0b; }
    .poster, .animated { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .poster, .animated { transition: filter var(--blur-ms) ease; }
    .blurred .poster, .blurred .animated { filter: blur(1px); }
    canvas.poster { visibility: hidden; }
    canvas.poster.ready { visibility: visible; }
    .project-heading { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
    h3 { margin: 0; font-size: 1rem; font-weight: 500; line-height: 1.625; }
    .description { color: var(--muted); margin: 0; line-height: 1.625; text-wrap: pretty; }
    .arrow { color: var(--muted); opacity: 0; transform: translate(-3px, 3px); transition: transform .15s ease-out, opacity .15s ease-out; }
    a:hover .arrow, a:focus-visible .arrow { opacity: 1; transform: none; }
    @media (hover: none) { .arrow { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .arrow, .poster, .animated { transition: none; } }
</style>
