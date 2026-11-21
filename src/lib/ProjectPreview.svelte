<script>
    import { onMount } from 'svelte'

    // Floats the hovered project's preview just under the cursor. Mouse/trackpad only.
    // An item may set its own size: { preview, width?, aspect? } (aspect = width / height).
    export let project = null

    const WIDTH = 240
    const HEIGHT = Math.round(WIDTH * 440 / 720)
    const OFFSET = 24
    const REWIND_MS = 1200
    // Frames kept for the rewind; when the cap is hit every other one is dropped and sampling
    // halves, so any length of video ends up with 30–60 evenly spaced frames.
    const MAX_FRAMES = 60
    let element
    let video
    let canvas
    let rewindShown = false
    let shown = null
    let visible = false
    let x = 0, y = 0, targetX = 0, targetY = 0
    let frame = 0
    let rewinding = 0
    let canHover = false
    let reducedMotion = false

    $: show(project)
    $: width = shown?.width ?? WIDTH
    $: aspect = shown?.aspect ?? 720 / 440

    function show(next) {
        if (next?.preview && canHover) {
            if (!visible) { x = targetX; y = targetY }
            shown = next
            visible = true
            schedule()
        } else {
            visible = false
        }
    }

    function place() {
        if (!element) return
        const height = width / aspect
        const left = Math.min(Math.max(8, x - width / 2), window.innerWidth - width - 8)
        const top = y + OFFSET + height > window.innerHeight - 8 ? y - OFFSET - height : y + OFFSET
        element.style.transform = `translate3d(${left}px, ${top}px, 0)`
    }

    function tick() {
        frame = 0
        const ease = reducedMotion ? 1 : .22
        x += (targetX - x) * ease
        y += (targetY - y) * ease
        place()
        if (visible && (Math.abs(targetX - x) > .3 || Math.abs(targetY - y) > .3)) schedule()
    }

    function schedule() {
        if (!frame) frame = requestAnimationFrame(tick)
    }

    // Seeking backwards is slow and many webm files (e.g. MediaRecorder output) can't be seeked at
    // all, so instead the frames are sampled while the video plays and drawn in reverse on a canvas.
    let frames = []
    let sampleStep = 1 / 30
    let lastSample = -Infinity
    let complete = false
    let watched = null

    function resetFrames() {
        frames = []
        sampleStep = 1 / 30
        lastSample = -Infinity
        complete = false
    }

    function sample(force = false) {
        if (!video || !canvas || complete || !video.videoWidth) return
        const time = video.currentTime
        if (!force && time - lastSample < sampleStep) return
        lastSample = time
        const frame = document.createElement('canvas')
        frame.width = canvas.width
        frame.height = canvas.height
        // Same crop as object-fit: cover.
        const scale = Math.max(frame.width / video.videoWidth, frame.height / video.videoHeight)
        const sw = frame.width / scale, sh = frame.height / scale
        frame.getContext('2d').drawImage(video, (video.videoWidth - sw) / 2, (video.videoHeight - sh) / 2, sw, sh, 0, 0, frame.width, frame.height)
        frames.push(frame)
        if (frames.length >= MAX_FRAMES) {
            frames = frames.filter((_, index) => index % 2 === 0)
            sampleStep *= 2
        }
    }

    function watch(target) {
        const next = () => {
            if (target !== video) return
            if (!target.paused) sample()
            'requestVideoFrameCallback' in target ? target.requestVideoFrameCallback(next) : requestAnimationFrame(next)
        }
        next()
    }

    // When the video ends while shown, run it quickly back to the start frame by frame, then play again.
    function ended() {
        if (!visible || !video) return
        sample(true)
        complete = true
        const id = ++rewinding
        const target = video
        const restart = () => {
            if (id !== rewinding || !visible) return
            target.currentTime = 0
            target.play().catch(() => {})
            // Keep the first frame on the canvas until the video has actually painted one.
            const reveal = () => { if (id === rewinding) rewindShown = false }
            'requestVideoFrameCallback' in target ? target.requestVideoFrameCallback(reveal) : target.addEventListener('playing', () => requestAnimationFrame(reveal), { once: true })
        }
        if (reducedMotion || frames.length < 2) return restart()
        const list = frames
        const context = canvas.getContext('2d')
        context.drawImage(list[list.length - 1], 0, 0)
        rewindShown = true
        const start = performance.now()
        const step = now => {
            if (id !== rewinding) return
            const t = Math.min(1, (now - start) / REWIND_MS)
            const eased = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
            context.drawImage(list[Math.round((list.length - 1) * (1 - eased))], 0, 0)
            t < 1 ? requestAnimationFrame(step) : restart()
        }
        requestAnimationFrame(step)
    }

    // Called with explicit arguments so only these values (not the frame state) re-run them.
    $: attach(video)
    $: playback(video, visible, reducedMotion)

    function attach(next) {
        if (next === watched) return
        watched = next
        resetFrames()
        if (next) watch(next)
    }

    function playback(target, isVisible, isReduced) {
        if (!target) return
        rewinding++
        rewindShown = false
        if (isVisible && !isReduced) {
            // A pass cut short by leaving would leave gaps, so sample again from the start.
            if (!complete) resetFrames()
            target.currentTime = 0
            target.play().catch(() => {})
        } else target.pause()
    }

    onMount(() => {
        const hover = window.matchMedia('(hover: hover) and (pointer: fine)')
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => { canHover = hover.matches; reducedMotion = motion.matches }
        sync()
        const density = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(WIDTH * density)
        canvas.height = Math.round(HEIGHT * density)
        hover.addEventListener('change', sync)
        motion.addEventListener('change', sync)
        const move = event => {
            targetX = event.clientX
            targetY = event.clientY
            if (visible) schedule()
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => {
            cancelAnimationFrame(frame)
            rewinding++
            hover.removeEventListener('change', sync)
            motion.removeEventListener('change', sync)
            window.removeEventListener('pointermove', move)
        }
    })
</script>

<div class='preview' bind:this={element} class:visible aria-hidden='true' style='--width: {width}px; --aspect: {aspect}'>
    <div class='frame'>
        {#if shown}
            {#key shown}
                {#if /\.(webm|mp4)$/i.test(shown.preview)}
                    <video bind:this={video} src={shown.preview} poster={shown.poster} muted playsinline preload='auto' disablepictureinpicture on:ended={ended}></video>
                {:else}
                    <img src={reducedMotion && shown.poster ? shown.poster : shown.preview} alt='' decoding='async' draggable='false' />
                {/if}
            {/key}
        {/if}
        <canvas bind:this={canvas} class:shown={rewindShown}></canvas>
        <!-- While rewinding: the frames blur and dim a little, with a rewind sign in the middle. -->
        <div class='rewind' class:shown={rewindShown}>
            <svg width='28' height='28' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                <path d='M11 6.5v11a.75.75 0 0 1-1.18.61l-7.5-5.5a.75.75 0 0 1 0-1.22l7.5-5.5A.75.75 0 0 1 11 6.5Z' />
                <path d='M21 6.5v11a.75.75 0 0 1-1.18.61l-7.5-5.5a.75.75 0 0 1 0-1.22l7.5-5.5A.75.75 0 0 1 21 6.5Z' />
            </svg>
        </div>
    </div>
</div>

<style>
    .preview { position: fixed; top: 0; left: 0; z-index: 20; width: var(--width); pointer-events: none; }
    .frame {
        position: relative;
        overflow: hidden;
        aspect-ratio: var(--aspect);
        border-radius: 8px;
        background: var(--surface);
        box-shadow: 0 0 0 1px var(--border), 0 12px 32px -8px rgb(0 0 0 / .6);
        opacity: 0;
        transform: scale(.94);
        transform-origin: 50% 0;
        transition: opacity .15s ease, transform .2s cubic-bezier(.2, 0, 0, 1);
    }
    .visible .frame { opacity: 1; transform: none; }
    video, img { display: block; width: 100%; height: 100%; object-fit: cover; }
    canvas { position: absolute; inset: 0; width: 100%; height: 100%; visibility: hidden; filter: blur(1.5px); transform: scale(1.03); }
    canvas.shown { visibility: visible; }
    .rewind {
        position: absolute; inset: 0;
        display: grid; place-items: center;
        background: rgb(0 0 0 / .28);
        color: rgb(255 255 255 / .92);
        opacity: 0;
        transition: opacity .2s ease;
    }
    .rewind.shown { opacity: 1; }
    .rewind svg { filter: drop-shadow(0 1px 6px rgb(0 0 0 / .4)); transform: scale(.85); transition: transform .25s cubic-bezier(.2, 0, 0, 1); }
    .rewind.shown svg { transform: none; }
    @media (prefers-reduced-motion: reduce) { .rewind, .rewind svg { transition: none; } }
    @media (prefers-reduced-motion: reduce) { .frame { transition: opacity .15s ease; transform: none; } }
</style>
