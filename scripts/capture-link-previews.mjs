// Screenshots every external link used on the site for the hover previews.
// Run from the repository root after adding or changing links:  node scripts/capture-link-previews.mjs
// Needs a local Chrome/Chromium/Edge; set CHROME_PATH if it isn't found. Node 22+ (built-in WebSocket).
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { tmpdir } from 'node:os'

const ROOT = process.cwd()
const OUT = join(ROOT, 'static/links')
const MANIFEST = join(ROOT, 'src/lib/linkPreviews.js')
const PORT = 9341
const VIEWPORT = { width: 1440, height: 880 } // same 720:440 ratio as project previews
const SETTLE_MS = 2500

// Links on pages that use the main layout (routes with @ reset the layout, so they're skipped).
function findLinks(dir, found = new Set()) {
    for (const name of readdirSync(dir)) {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) findLinks(path, found)
        else if (name.endsWith('.svelte') && !name.includes('@')) {
            for (const [, href] of readFileSync(path, 'utf8').matchAll(/href=['"](https?:\/\/[^'"]+)['"]/g)) found.add(href)
        }
    }
    return found
}

const slug = href => {
    const url = new URL(href)
    return `${url.hostname}${url.pathname}`.replace(/^www\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
}

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ]
    const chrome = candidates.find(path => path && existsSync(path))
    if (!chrome) throw new Error('Chrome not found, set CHROME_PATH')
    return chrome
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function connect() {
    for (let attempt = 0; attempt < 50; attempt++) {
        try {
            const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
            const socket = new WebSocket(target.webSocketDebuggerUrl)
            await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
            return socket
        } catch { await sleep(200) }
    }
    throw new Error('Could not connect to Chrome')
}

// Cookie banners and chat bubbles float over the page; drop them before the shot.
function hideOverlays() {
    for (const element of document.querySelectorAll('body *')) {
        const style = getComputedStyle(element)
        if (style.position !== 'fixed' && style.position !== 'sticky') continue
        const text = element.textContent || ''
        const isConsent = /cookie|consent|gdpr|privacy/i.test(text + element.id + element.className)
        const isWidget = element.tagName === 'IFRAME' || /chat|help|support|intercom|jivo|crisp/i.test(element.id + element.className + text.slice(0, 40))
        const rect = element.getBoundingClientRect()
        if (isConsent && rect.top > 0) element.remove()
        else if (isWidget && rect.width < 500 && rect.height < 300) element.remove()
    }
}

const links = [...findLinks(join(ROOT, 'src/routes'))].sort()
console.log(`Capturing ${links.length} link(s)`)

const profile = join(tmpdir(), `link-previews-${process.pid}`)
const chrome = spawn(findChrome(), [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: 'ignore' })

const socket = await connect()
let nextId = 0
const pending = new Map()
const listeners = new Set()
socket.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id)
        pending.delete(message.id)
        message.error ? reject(new Error(message.error.message)) : resolve(message.result)
    } else if (message.method) listeners.forEach(listener => listener(message))
}
const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
})
const loaded = () => new Promise(resolve => {
    const timeout = setTimeout(done, 15000)
    function done() { clearTimeout(timeout); listeners.delete(listener); resolve() }
    const listener = message => { if (message.method === 'Page.loadEventFired') done() }
    listeners.add(listener)
})

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 1, mobile: false })
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] })

mkdirSync(OUT, { recursive: true })
const manifest = {}
for (const href of links) {
    const file = `${slug(href)}.webp`
    try {
        const load = loaded()
        await send('Page.navigate', { url: href })
        await load
        await sleep(SETTLE_MS)
        await send('Runtime.evaluate', { expression: `(${hideOverlays})()` })
        await sleep(200)
        const { data } = await send('Page.captureScreenshot', {
            format: 'webp', quality: 82,
            clip: { x: 0, y: 0, ...VIEWPORT, scale: .5 },
        })
        writeFileSync(join(OUT, file), Buffer.from(data, 'base64'))
        manifest[href] = `/links/${file}`
        console.log(`  ✓ ${href} → static/links/${file}`)
    } catch (error) {
        console.log(`  ✗ ${href}: ${error.message}`)
    }
}

writeFileSync(MANIFEST, `// Generated by scripts/capture-link-previews.mjs. Re-run it after changing links.\nexport const linkPreviews = ${JSON.stringify(manifest, null, 4)}\n`)
console.log(`Wrote ${relative(ROOT, MANIFEST)}`)

socket.close()
chrome.kill()
await sleep(500)
try { rmSync(profile, { recursive: true, force: true }) } catch {}
