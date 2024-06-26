<script>
	import Drawer from '$lib/Drawer.svelte'
	
	let show = $state(false)
	const onclose = () => {
		show = false
	}

	let showInteractiveArea = $state(false)
</script>

<div style='height: 100%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;'>
	<div style='margin-bottom: 6rem; text-align: center;'>
		<span style="color: #aaa; font-weight: 500; font-size: 20px; margin: 0;">frasera</span><br>
		<span style='color: #111; font-size: 4.5rem; line-height: 1; font-weight: 500; margin: 0;'>drawer</span>
	</div>
	
	<div>
		<button onclick={() => show = !show}>показать</button>
	</div>

	<Drawer {show} {onclose} options={{
		height: 90,
		opacity: 60,
	}}>
		<div class:debug={showInteractiveArea} class='content' data-pullable='true'>
			<p style="color: black;" data-pullable='true'>"выдвижной ящик"</p>
			<p data-pullable='true'>компонент может использоваться как альтернатива модальному окну на мобильных устройствах</p>
			<p data-pullable='true'>стилизованный "из коробки"; имеет жестовые анимации; написан с нуля, вдохновляясь работой <a href='https://vaul.emilkowal.ski/'>эмиля ковальски</a>.</p>
			<p data-pullable='true'>нет зависимостей и написан максимально ёмко (5,070 байт до компрессии).</p>
			<hr>
			<p data-pullable='true'>будет частью библиотеки frasera.<br>документация и исходники когда-нибудь...</p>
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
			border-color: #ddd;
		}

		& p:first-child {
			font-weight: 500;
			margin-top: 0;
		}

		& p:last-child {
			margin-bottom: 0;
		}

		& p:nth-child(n + 2) {
			color: #555;
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
		border-bottom: 1px solid #eee;
	}

	button {
		padding: .75rem 1.25rem;
		background: #fff;
		border: 1px solid #eaeaea;
		border-radius: 132rem;
		color: #000;
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;

		&:hover {
			background: #f8f8f8;
		}
	}
</style>

