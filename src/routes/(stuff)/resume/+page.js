import { redirect } from '@sveltejs/kit'

// The CV moved to /cv; keep old /resume links working.
export function load() {
    redirect(308, '/cv')
}
