<template>
	<v-app id="app">
		<div>
			<Loader />
			<Projets />
			<Cursor />
			<Particles />
			<Skills />
			<End />


			<!-- <MenuButton /> -->

		</div>
	</v-app>
</template>

<script>


import { defineAsyncComponent } from 'vue';

import Loader from "./components/Loader/Loader.vue";
import Projets from "./components/Projets/Projets.vue";
import Cursor from './components/Cursor/Cursor.vue';

const Particles = defineAsyncComponent(() => 
  import('./components/Particles/Particles.vue')
)
const Skills = defineAsyncComponent(() => 
  import('./components/Skills/Skills.vue')
)
const End = defineAsyncComponent(() => 
  import('./components/End/End.vue')
)

// import MenuButton from "./components/MenuButton/MenuButton.vue";



export default {
	name: 'App',
	components: {
		Loader,
		Projets,
		Cursor,
		Particles,
		Skills,
		End,
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