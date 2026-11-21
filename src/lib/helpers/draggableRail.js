// Keep native touch and trackpad scrolling (CSS scroll snap handles those). Mouse drags and
// vertical wheels move the rail by hand with snapping switched off, then glide to a card.
export function draggableRail(node) {
    let pointer = null
    let dragged = false
    let suppressClick = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let animation = 0
    let target = 0
    let previousTime = 0
    let wheelStart = null
    let wheelRaw = 0
    let wheelTimer = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const maximum = () => node.scrollWidth - node.clientWidth
    const setFree = free => node.classList.toggle('is-free', free)

    function snapPoints() {
        const items = node.querySelectorAll('.project-item')
        if (!items.length) return [0]
        const first = items[0].offsetLeft
        const max = maximum()
        return [...new Set(Array.from(items, item => Math.min(max, item.offsetLeft - first)))]
    }

    const closest = (points, x) => points.reduce((best, point) => Math.abs(point - x) < Math.abs(best - x) ? point : best)

    // Past the threshold, always land on a card in the direction of travel, the one nearest to where it was heading.
    function snapFrom(start, heading, threshold) {
        const points = snapPoints()
        const distance = heading - start
        if (Math.abs(distance) < threshold) return closest(points, start)
        const ahead = points.filter(point => (point - start) * Math.sign(distance) > 4)
        return closest(ahead.length ? ahead : points, heading)
    }

    function stopScroll() {
        cancelAnimationFrame(animation)
        animation = 0
        node.scrollTo({ left: node.scrollLeft, behavior: 'instant' })
    }

    function glideTo(left) {
        target = left
        setFree(true)
        if (!animation) {
            previousTime = performance.now()
            animation = requestAnimationFrame(animateScroll)
        }
    }

    function animateScroll(time) {
        const elapsed = Math.min(64, Math.max(0, time - previousTime))
        previousTime = time
        target = Math.max(0, Math.min(target, maximum()))
        const remaining = target - node.scrollLeft
        if (reducedMotion.matches || Math.abs(remaining) < .75) {
            node.scrollTo({ left: target, behavior: 'instant' })
            animation = 0
            if (pointer === null && !wheelTimer) setFree(false)
            return
        }
        const distance = Math.min(Math.abs(remaining), Math.max(1, Math.abs(remaining) * (1 - Math.exp(-elapsed / 65))))
        node.scrollTo({ left: node.scrollLeft + Math.sign(remaining) * distance, behavior: 'instant' })
        animation = requestAnimationFrame(animateScroll)
    }

    // Native input takes over: hand the rail back to CSS snapping.
    function interruptNativeInput() {
        if (!animation) return
        stopScroll()
        setFree(false)
    }

    function pointerDown(event) {
        if (event.pointerType !== 'mouse' || event.button !== 0) return
        setFree(true)
        stopScroll()
        pointer = event.pointerId
        startX = lastX = event.clientX
        lastTime = event.timeStamp
        startScroll = node.scrollLeft
        velocity = 0
        dragged = false
        suppressClick = false
    }

    function pointerMove(event) {
        if (event.pointerId !== pointer) return
        const distance = event.clientX - startX
        if (!dragged && Math.abs(distance) < 6) return
        if (!dragged) {
            dragged = true
            node.classList.add('is-dragging')
            node.setPointerCapture(pointer)
        }
        event.preventDefault()
        const dt = Math.max(1, event.timeStamp - lastTime)
        velocity = velocity * .6 + (event.clientX - lastX) / dt * .4
        lastX = event.clientX
        lastTime = event.timeStamp
        node.scrollTo({ left: startScroll - distance, behavior: 'instant' })
    }

    function finishPointer(event) {
        if (event.pointerId !== pointer) return
        const capturedPointer = pointer
        const wasDragged = dragged
        pointer = null
        suppressClick = dragged && event.type === 'pointerup'
        dragged = false
        node.classList.remove('is-dragging')
        if (node.hasPointerCapture(capturedPointer)) node.releasePointerCapture(capturedPointer)
        if (!wasDragged) return setFree(false)
        // A recent flick carries the rail further before it settles.
        const fling = event.timeStamp - lastTime < 80 ? velocity * 180 : 0
        glideTo(snapFrom(startScroll, node.scrollLeft - fling, 40))
    }

    function click(event) {
        if (!suppressClick || event.detail === 0) return
        event.preventDefault()
        event.stopImmediatePropagation()
        suppressClick = false
    }

    function wheel(event) {
        if (event.ctrlKey || event.metaKey || pointer !== null) return
        if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return interruptNativeInput()
        const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientWidth : 1
        const delta = event.deltaY * multiplier
        const max = maximum()
        const current = animation ? target : node.scrollLeft
        if ((delta < 0 && current <= 0) || (delta > 0 && current >= max)) return
        event.preventDefault()
        // One gesture (a wheel notch, or a trackpad swipe with its momentum) moves at least one card.
        if (wheelStart === null) {
            wheelStart = node.scrollLeft
            wheelRaw = node.scrollLeft
        }
        wheelRaw = Math.max(0, Math.min(max, wheelRaw + delta))
        clearTimeout(wheelTimer)
        wheelTimer = setTimeout(() => {
            wheelTimer = 0
            wheelStart = null
            if (!animation) setFree(false)
        }, 180)
        glideTo(snapFrom(wheelStart, wheelRaw, 8))
    }

    function preventNativeDrag(event) {
        event.preventDefault()
    }

    node.addEventListener('pointerdown', pointerDown)
    node.addEventListener('touchstart', interruptNativeInput, { passive: true })
    node.addEventListener('keydown', interruptNativeInput)
    window.addEventListener('pointermove', pointerMove, { passive: false })
    window.addEventListener('pointerup', finishPointer)
    window.addEventListener('pointercancel', finishPointer)
    node.addEventListener('lostpointercapture', finishPointer)
    node.addEventListener('click', click, true)
    node.addEventListener('dragstart', preventNativeDrag)
    node.addEventListener('wheel', wheel, { passive: false })

    return {
        destroy() {
            cancelAnimationFrame(animation)
            clearTimeout(wheelTimer)
            if (pointer !== null && node.hasPointerCapture(pointer)) node.releasePointerCapture(pointer)
            node.classList.remove('is-dragging', 'is-free')
            node.removeEventListener('pointerdown', pointerDown)
            node.removeEventListener('touchstart', interruptNativeInput)
            node.removeEventListener('keydown', interruptNativeInput)
            window.removeEventListener('pointermove', pointerMove)
            window.removeEventListener('pointerup', finishPointer)
            window.removeEventListener('pointercancel', finishPointer)
            node.removeEventListener('lostpointercapture', finishPointer)
            node.removeEventListener('click', click, true)
            node.removeEventListener('dragstart', preventNativeDrag)
            node.removeEventListener('wheel', wheel)
        },
    }
}
