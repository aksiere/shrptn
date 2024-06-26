<script>
	import { clickoutside } from '$lib/utils'
	import { cubicOut } from 'svelte/easing'
	
	let { show = false, options = {}, onclose = () => {}, children, ...stuff } = $props()

	let drawer = $state()
	let dim = $state()

	const DURATION = options.duration || 400
	const EASING = 'cubic-bezier(0, 0.2, 0, 1)'
	const EASING_DURATION = DURATION

	const MAX_PADDING = options.padding || 16
	const MAX_RADIUS = options.radius || 10
	const MAX_DIM_OPACITY = options.opacity || 40

	const setParentTransitions = () => {
		document.body.style.transition = `padding ${EASING_DURATION}ms ${EASING}`
		drawer.parentNode.style.transition = `border-radius ${EASING_DURATION}ms ${EASING}`
		dim.style.transition = `opacity ${EASING_DURATION}ms ${EASING}`
	}

	const setParentValues = (v1 = MAX_PADDING, v2 = MAX_RADIUS, v3 = MAX_DIM_OPACITY) => {
		document.body.style.padding = `${Math.round(v1)}px`
		drawer.parentNode.style.borderRadius = `${Math.round(v2)}px`
		dim.style.opacity = `${v3}%`
	}

	$effect(() => {
		if (show) {
			setParentTransitions()
		}
	})

	const close = () => {
		if (show) {
			show = false
			onclose()
		}
	}

	const onclickoutside = (e) => {
		close()
	}

	const onkeydown = (e) => {
		switch (e.code) {
			case 'Escape':
				close()
				break
			default:
				break
		}
	}

	let is_down = $state(false)
	let point_when_down = $state(false)
	let point_when_up = $state(false)

	const onmousedown = (e) => {
		if (e.target.dataset.pullable !== 'true') return

		is_down = true
		point_when_down = { x: e.x, y: e.y, timestamp: performance.now() }

		dim.style.transition = 'none'
		drawer.style.transition = 'none'
		document.body.style.transition = 'none'
		drawer.parentNode.style.transition = 'none'
	}

	const onmouseup = (e) => {
		if (is_down) {
			is_down = false
			point_when_up = { x: e.x, y: e.y, timestamp: performance.now() }
			
			setParentTransitions()
			if (((point_when_up.y - point_when_down.y) > (point_when_up.timestamp - point_when_down.timestamp)) || ((point_when_up.y - drawer.offsetTop) > ((window.innerHeight - drawer.offsetTop) / 2))) {
				close()
			} else {
				drawer.style.transition = `transform ${EASING_DURATION}ms ${EASING}`
				drawer.style.transform = 'translateY(0%)'
				setParentValues()
			}
		}
	}

	const onmousemove = (e) => {
		if (is_down) {
			if ((e.y - point_when_down.y) * -1 < 0) {
				drawer.style.transform = `translateY(${e.y - point_when_down.y}px`
				
				const t = (e.y - point_when_down.y) / (window.innerHeight - drawer.offsetTop)
				setParentValues((1 - t) * MAX_PADDING, (1 - t) * MAX_RADIUS, (1 - t) * MAX_DIM_OPACITY)
			}
		}
	}

	function split_css_unit(value) {
		const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/)
		return split ? [parseFloat(split[1]), split[2] || 'px'] : [/** @type {number} */ (value), 'px']
	}

	function fly(node, { delay = 0, duration = DURATION, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
		const style = getComputedStyle(node)
		const target_opacity = +style.opacity
		const transform = style.transform === 'none' ? '' : style.transform
		const od = target_opacity * (1 - opacity)
		const [x_value, x_unit] = split_css_unit(x)
		const [y_value, y_unit] = split_css_unit(y)

		return {
			delay,
			duration,
			easing,
			css: (t, u) => {
				setParentValues(t * MAX_PADDING, t * MAX_RADIUS, t * MAX_DIM_OPACITY)

				return `transform: ${transform} translate(${(1 - t) * x_value}${x_unit}, ${(1 - t) * y_value}${y_unit});`
			}
		}
	}
</script>

<svelte:window {onkeydown} />

{#if show}
	<div bind:this={dim} class='dim'></div>
	<div bind:this={drawer} data-pullable='true' class='drawer' style='--height: {options.height || 92}%' transition:fly={{ y: '100%', duration: DURATION, easing: cubicOut, opacity: 1 }} use:clickoutside {onclickoutside} onpointerdown={onmousedown} onpointerup={onmouseup} onpointermove={onmousemove}>
		<div class='pull' data-pullable='true'></div>
		<div class='content' {...stuff} data-pullable='true'>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.dim {
		position: fixed;
		width: 100%;
		height: 100%;
		background: black;
		opacity: 0;
		top: 0;
		left: 0;
	}

	.drawer {
		touch-action: none;
		padding: 1rem;
		background: #fff;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		/* border: 1px solid #222; */
		position: fixed;
		height: var(--height);
		width: 100%;
		left: 0;
		bottom: 0;
		transform: translateY(var(--translate));
		transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;

		& > .pull {
			display: block;
			background: #ddd;
			width: 3rem;
			height: .375rem;
			border-radius: 10px;
			margin-bottom: 2rem;
			margin-inline: auto;
		}
	}

	:global([data-pullable='false']) {
		cursor: text !important;
		user-select: text !important;
		-webkit-user-select: text !important;
	}
</style>
