<script>
    import { PUBLIC_USERNAME } from '$env/static/public'
    import ProjectList from '$lib/ProjectList.svelte'
</script>

<svelte:head><title>{PUBLIC_USERNAME.toLowerCase()} / projects</title></svelte:head>

<ProjectList />
