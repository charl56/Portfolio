<template>
	<v-app id="app">
		<div>
			<Particles />
			<MenuButton />
			
			<Window1 />
			<Window2 />
			<Window3 />
			<Window4 />
			<Window5 />

            <div class="end-end"></div>

		</div>
	</v-app>
</template>

<script>

import Particles from "./components/Particles/Particles.vue";
import MenuButton from "./components/MenuButton/MenuButton.vue";
import Window1 from './components/Window1/Window1.vue';
import Window2 from './components/Window2/Window2.vue';
import Window3 from './components/Window3/Window3.vue';
import Window4 from './components/Window4/Window4.vue';
import Window5 from './components/Window5/Window5.vue';



export default {
	name: 'App',
	components: {
		Particles,
		MenuButton,
		Window1,
		Window2,
		Window3,
		Window4,
		Window5,
	},
}
</script>

<style>
.end-end{
	position: relative;
	height: 100vh;
	background-color: rgb(255, 0, 0);
}

</style>