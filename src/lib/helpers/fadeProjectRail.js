// Fade each card uniformly, without a gradient across its dark background.
export function fadeProjectRail(node) {
    const cards = Array.from(node.querySelectorAll('.project-item'))
    let positions = []
    let painted = []
    let step = 1
    let frame = 0

    // Paint in the scroll event itself so opacity never lags a frame behind the scroll position,
    // and only touch cards whose value actually changed.
    function paint() {
        cancelAnimationFrame(frame)
        frame = 0
        cards.forEach((card, index) => {
            const distance = Math.abs(positions[index] - node.scrollLeft)
            const opacity = Math.round(Math.max(.16, 1 - distance / step * .28) * 100) / 100
            if (painted[index] === opacity) return
            painted[index] = opacity
            card.style.opacity = opacity === 1 ? '' : String(opacity)
        })
    }

    function schedulePaint() {
        if (!frame) frame = requestAnimationFrame(paint)
    }

    function measure() {
        const start = node.getBoundingClientRect().left + parseFloat(getComputedStyle(node).paddingLeft)
        positions = cards.map(card => card.getBoundingClientRect().left - start + node.scrollLeft)
        step = positions.length > 1 ? Math.max(1, positions[1] - positions[0]) : 1
        schedulePaint()
    }

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    cards.forEach(card => observer.observe(card))
    node.addEventListener('scroll', paint, { passive: true })
    measure()

    return {
        destroy() {
            cancelAnimationFrame(frame)
            observer.disconnect()
            node.removeEventListener('scroll', paint)
            cards.forEach(card => card.style.removeProperty('opacity'))
        },
    }
}
