<template>
	<v-app id="app">
		<div>
			<Particles />
			<Loader />
			<Intro />
			<Projets />
			<Skills />
			<End />


			<!-- <MenuButton /> -->

		</div>
	</v-app>
</template>

<script>

import Particles from "./components/Particles/Particles.vue";
import Loader from "./components/Loader/Loader.vue";
import Intro from "./components/Intro/Intro.vue";
import Projets from './components/Projets/Projets.vue';
import Skills from "./components/Skills/Skills.vue";
import End from "./components/End/End.vue";


import MenuButton from "./components/MenuButton/MenuButton.vue";



export default {
	name: 'App',
	components: {
		Particles,
		Loader,
		Intro,
		Projets,
		Skills,
		End,

		MenuButton,
	},
	mounted() {
		document.addEventListener('contextmenu', this.disableClick);
	},
	beforeUnmount() {
		document.removeEventListener('contextmenu', this.disableClick);
	},
	methods: {
		disableClick(event) {
			event.preventDefault();
		}
	}
}
</script>

<style></style>