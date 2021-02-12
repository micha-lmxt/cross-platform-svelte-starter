import App from './App.svelte';

const runtimetype : "electron"|"web"|"capacitor" = ("~~~platform~~~" as any);

const app = new App({
	target: document.body,
	props: {
		type: runtimetype
	}
});

export default app;