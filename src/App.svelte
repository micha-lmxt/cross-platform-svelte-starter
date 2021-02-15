<script lang="ts">
	import { getAdapter } from "./API/api";

	export let type: "web" | "electron" | "capacitor";

	const api = getAdapter();

	let images: {
		filename: string;
		content: string;
		ext: string;
	}[] = [];

	let file = "";

	function handleFiles(files: Blob[]) {
		if (files.length === 0) {
			return;
		}
		const file = files[0];
		console.log(file);

		if (!file.type.startsWith("image/")) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			images = [
				...images,
				{
					content: (e.target.result as Buffer).toString("base64"),
					filename: file["name"],
					ext: file["name"] && file["name"].split(".").slice(-1),
				},
			];
		};

		reader.readAsDataURL(file);
	}
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<main>
	<h1>Hello {type === 'electron' ? 'electron' : type==="capacitor" ? "capacitor" : 'browser'}!</h1>

	<div>
		{#each images as image}
			<img src={image.content} style="height:200px;" alt={image.filename}/>
		{/each}
	</div>
	
	{#if api.getFile === undefined}
		<input
			type="file"
			on:change={(f) => {
				if (f && f.target && f.target['files']) {
					handleFiles(f.target['files']);
				}
			}} />
	{:else}
		<button
			on:click={() => api.getFile().then((v) => {
					if (v !== 'failed' && v !== 'cancelled') {
						images = [...images, v];
					}
				})}>Get Image</button>
	{/if}
	
</main>
