import { cubicOut } from 'svelte/easing'

const isReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Phones and tablets get one light animation per navigation: no page snapshot sliding out
// (see the layout) and no blur, which is expensive to animate on many blocks at once.
export const isLite = () => typeof matchMedia === 'function' && matchMedia('(hover: none), (max-width: 640px)').matches

// 1 when moving right through the nav, -1 when moving left, 0 otherwise (first load, other links).
// Set by the layout before the new page renders, so its blocks come in from the matching side.
let direction = 0
export const setDirection = value => { direction = value }

// Fades a block in while it comes into focus: rising a few pixels on first load, or sliding in from
// the side when navigating through the nav (the old page leaves the other way, see global.css).
// Use with |global so it also plays when a page is opened.
export function rise(node, { delay = 0, duration = 550, x = 24, y = 10, blur = 4, easing = cubicOut } = {}) {
    if (isReduced()) return { duration: 0 }
    // Ends at the element's own opacity (e.g. the half-transparent signature), not at 1.
    const opacity = +getComputedStyle(node).opacity
    if (isLite()) { blur = 0; x = Math.min(x, 12) }
    const dx = direction * x
    const dy = direction ? 0 : y
    // The delay is part of the animation itself: with Svelte's own `delay` the element is fully
    // visible until the animation starts, so it would flash before fading in.
    const total = delay + duration
    return {
        duration: total,
        css: t => {
            const p = easing(Math.max(0, (t * total - delay) / duration))
            const u = 1 - p
            return `opacity: ${p * opacity}; transform: translate(${u * dx}px, ${u * dy}px)${blur ? `; filter: blur(${u * blur}px)` : ''}`
        },
    }
}

// Delay for the n-th block on a page, so blocks come in one after another (after the nav).
export const stagger = index => 80 + index * 70
