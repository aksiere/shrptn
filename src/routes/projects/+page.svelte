<script>
    import { onMount } from 'svelte'
    import { fade, fly } from 'svelte/transition'

    const items = [
        { href: 'https://eusto.ma', title: 'Eustoma', desc: 'телеграм-бот на веб-воркере, продающий випиэн' },
        { href: 'https://icebergify.vercel.app', title: 'Icebergify', desc: 'интерпретатор популярности вашего музыкального вкуса' },
        { href: 'https://github.com/aksiere/paeonia', title: 'Paeonia', desc: 'утилити-фреймворк на базе unocss' },
    ]

    let show = $state(false)
    onMount(() => show = true)
</script>

<div>
    {#each items as { href, title, desc }, i}
        {#if show}
            <div class='mb-.25 pj' in:fly={{ y: i * 10 + 10, duration: 500 }}>
                <span style='color: #555;'>{String(i + 1).padStart(2, '0')}</span>
                <span>{title}</span>
                <a target='_blank' {href}>↪</a>
                <br>
                <span style='color: #555;'>&nbsp;&nbsp;&nbsp;{desc}</span>
            </div><br>
        {/if}
    {/each}
</div>

<style>
    .pj {
        tab-size: 1rem;

        a {
            text-decoration: none;
            color: #6374ce;
        }
    }
</style>
