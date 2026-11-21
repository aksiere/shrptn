import { writable } from 'svelte/store'
import { linkPreviews as manifest } from '$lib/linkPreviews'

// One floating preview for the whole site (rendered by ProjectPreview in the layout).
// An item is { preview, poster? }; keep item objects stable so the preview isn't re-created.
export const activePreview = writable(null)

let leaveTimer = 0

export function showPreview(item) {
    clearTimeout(leaveTimer)
    activePreview.set(item)
}

// Leaving anything hides whatever is shown, unless another preview takes over within a short
// grace period (keeps it from blinking when moving between neighbours). Entering an element
// without a preview doesn't cancel this, so a fast pass over several rows can't leave it stuck.
export function hidePreview() {
    clearTimeout(leaveTimer)
    leaveTimer = setTimeout(() => activePreview.set(null), 80)
}

// For a single element with a known preview, e.g. a project row.
export function hoverPreview(node, item) {
    const enter = () => { if (item?.preview) showPreview(item) }
    const leave = () => hidePreview()
    node.addEventListener('pointerenter', enter)
    node.addEventListener('pointerleave', leave)
    return {
        update(next) { item = next },
        destroy() {
            node.removeEventListener('pointerenter', enter)
            node.removeEventListener('pointerleave', leave)
            activePreview.update(current => current === item ? null : current)
        },
    }
}

const normalize = href => { try { return new URL(href, location.href).href } catch { return href } }
const linkItems = new Map(Object.entries(manifest).map(([href, preview]) => [normalize(href), { preview }]))

// For every link inside a container, including ones rendered with {@html}: shows the captured
// screenshot of the page it points to (see scripts/capture-link-previews.mjs).
export function linkPreviews(node) {
    const itemFor = target => {
        const link = target instanceof Element && target.closest('a[href]')
        if (!link || !node.contains(link) || link.closest('[data-no-link-preview]')) return null
        const item = linkItems.get(normalize(link.getAttribute('href')))
        return item ? { link, item } : null
    }
    const over = event => {
        const found = itemFor(event.target)
        if (found) showPreview(found.item)
    }
    const out = event => {
        const found = itemFor(event.target)
        if (found && !found.link.contains(event.relatedTarget)) hidePreview()
    }
    node.addEventListener('pointerover', over)
    node.addEventListener('pointerout', out)
    return {
        destroy() {
            node.removeEventListener('pointerover', over)
            node.removeEventListener('pointerout', out)
        },
    }
}
