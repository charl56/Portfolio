<template>
	<v-app id="app">
		<div>
			<Particles />
			<MenuButton />
			<!-- <ScrollLottie /> -->
			
			<Window1 />
			<Window2 />
			<Window3 />

            <div class="end-end"></div>

			<!-- <Header />
			<Loader />
			<Table />
			<Footer /> -->

			<!-- <Cursor /> -->
		</div>
	</v-app>
</template>

<script>
// import Loader from './components/Loader/Loader.vue'
// import Header from './components/Header/Header.vue'
// import Table from './components/Table/Table.vue'
// import Footer from './components/Footer/Footer.vue'
// import Cursor from './components/Cursor/Cursor.vue'

import Particles from "./components/Particles/Particles.vue";
import MenuButton from "./components/MenuButton/MenuButton.vue";
import ScrollLottie from "./components/ScrollLottie/ScrollLottie.vue";
import Window1 from './components/Window1/Window1.vue';
import Window2 from './components/Window2/Window2.vue';
import Window3 from './components/Window3/Window3.vue';



export default {
	name: 'App',
	components: {
		Particles,
		MenuButton,
		ScrollLottie,
		Window1,
		Window2,
		Window3,
	},
}
</script>

<style>
.end-end{
	height: 100vh;
	background-color: rgba(255, 0, 0, 0.351);
}

</style>