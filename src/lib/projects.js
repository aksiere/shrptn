// preview: path to a file in /static, e.g. '/projects/frasera.gif' or '/projects/frasera.webm' (webm/mp4 are muted and looped). Animated previews stay on
// their first frame until hovered; set poster: '/projects/frasera.png' to use your own still instead.
export const projects = [
	{ href: '/', title: 'Cine.nu', description: 'cinephile`s project', stack: 'sveltekit, js, nodejs, paraglide, supabase, tmdb api', disabled: true },
    { href: 'https://black-surf-9443.9jwk9c3h.workers.dev/', title: 'Frasera', description: 'Visual experiments', stack: 'js, web api', preview: '/projects/frasera-1795286663490.webm' },
	{ href: 'https://icebergify.vercel.app/', title: 'Icebergify', description: 'Your music taste, mapped by popularity', stack: 'sveltekit, js, nodejs, spotify api', preview: '/projects/icebergify.mp4' },
    { href: 'https://t.me/eustomabot', title: 'Eusto.ma', description: 'A commercial telegram bot running on a web worker', stack: 'js, grammy, telegram api' },
    { href: 'https://new.fips.ru/registers-doc-view/fips_servlet?DB=EVM&DocNumber=2022660896&TypeFile=html', title: 'Bonch.RID', description: 'An internal registry for intellectual property', stack: 'php, js' },
]
