<script>
	import Drawer from '$lib/Drawer.svelte'
	
	let show = $state(false)
	const onclose = () => {
		show = false
	}

	let showInteractiveArea = $state(false)
</script>

<div style='height: 100%; background: #121212; display: flex; flex-direction: column; align-items: center; justify-content: center;'>
	<div style='margin-bottom: 6rem; text-align: center;'>
		<span style="color: #333; font-weight: 500; font-size: 20px; margin: 0;">frasera</span><br>
		<span style='color: #aaa; font-size: 4.5rem; line-height: 1; font-weight: 500; margin: 0;'>drawer</span>
	</div>
	
	<div>
		<button onclick={() => show = !show}>show</button>
	</div>

	<Drawer {show} {onclose} options={{
		height: 90,
		opacity: 60,
	}}>
		<div class:debug={showInteractiveArea} class='content' data-pullable='false'>
			<p>drawer for svelte</p>
			<p>this component can be used as a dialog replacement on mobile and tablet devices.</p>
			<p>it comes unstyled, has gesture-driven animations, and <u>was rewritten from scratch</u>, inspired by the work of <a href='https://vaul.emilkowal.ski/'>emil kowalski</a>.</p>
			<p>it doesn't use any dependencies under the hood and written in the most optimized way possible (5,070 bytes uncompressed). or almost, who knows...</p>
			<hr>
			<p>will be part of frasera.<br>docs later...</p>
			<!-- <p>you can control what content doesn't need to be interacted with and can be pulled by user. by default, this is the entire child container, but you can add <code class='mono'>data-pullable='false'</code> to prevent this behavior, as here.</p> -->
			<!-- <p onclick={() => showInteractiveArea = !showInteractiveArea} style='cursor: pointer; user-select: none; -webkit-user-select: none;'><u class='mono'>click here to {showInteractiveArea ? 'hide' : 'show'} the area protected from being 'grabbed'</u></p> -->
			<!-- <pre class='mono'>{`options={{\n\tpadding: 16; // padding of scaled parent (px)\n\tradius:  10; // radius of scaled parent (px)\n\topacity: 40; // opacity of dim (%)\n\theight: 92; // height of drawer (%)\n}}`}</pre> -->
		</div>
	</Drawer>
</div>

<style>
	.content {
		max-width: 28rem;
		margin-inline: auto;
		padding: 1rem;
		border: 1px dashed transparent;
		border-radius: 10px;
		text-align: justify;
	
		&.debug {
			border-color: #aaa;
		}

		& p:first-child {
			font-weight: 500;
			margin-top: 0;
		}

		& p:last-child {
			margin-bottom: 0;
		}

		& p:nth-child(n + 2) {
			color: #777;
		}
	}

	code {
		background: black;
		color: white;
		font-size: 14px;
		border-radius: 4px;
		white-space: nowrap;
		padding: 2px 4px;
	}

	pre {
		background: black;
		color: white;
		font-size: 14px;
		border-radius: 4px;
		tab-size: 1rem;
		padding: .5rem;
		margin-bottom: 0;
	}

	hr {
		border: none;
		border-bottom: 1px solid #222;
	}

	button {
		padding: .75rem 1.25rem;
		background: #121212;
		border: 1px solid #242424;
		border-radius: 132rem;
		color: white;
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;

		&:hover {
			background: #161616;
		}
	}
</style>

