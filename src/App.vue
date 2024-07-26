<template>
	<v-app id="app">
		<!-- Portfolio -->
		<div>
			<Header />
			<Loader />
			<Table />
			<Footer />

			<!-- <Cursor /> -->
		</div>
	</v-app>
</template>

<script>
import Loader from './components/Loader/Loader.vue'
import Header from './components/Header/Header.vue'
import Table from './components/Table/Table.vue'
import Footer from './components/Footer/Footer.vue'
import Cursor from './components/Cursor/Cursor.vue'

export default {
	name: 'App',
	components: {
		Loader,
		Header,
		Table,
		Footer,
		Cursor
	},
	created() {
	}
}
</script>

<style>
:root {
	--background-color-1: #f5f9ff;
	--font-color: #2c3e50;
}

@font-face {
	font-family: 'Noto_Sans_Tifinagh';
	src: url('@assets/fonts/Noto_Sans_Tifinagh/NotoSansTifinagh-Regular.ttf') format('opentype');
	font-family: 'JockeyOne-Regular';
	src: url('@/assets/fonts/JockeyOne-Regular.ttf') format('opentype');
}

/* Hide scrollbar for Chrome, Safari and Opera */
html::-webkit-scrollbar {
	display: none;
}

html {
	margin: 0;
	height: 100dvh;
	background-color: var(--background-color-1);
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none;
	/* IE and Edge */
	scrollbar-width: none;
	/* Firefox */
	/* font-family: Verdana, Geneva, Tahoma, sans-serif; */
	font-family: 'Noto_Sans_Tifinagh';
	/* font-family: 'JockeyOne-Regular'; */
	/* cursor: none; */
}


#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: var(--font-color) !important;
	background-color: var(--background-color-1) !important;
	top: 0;
	right: 0;
}

/* Surlignage du texte */
::selection {
	background-color: var(--background-color-1);
	color: #7eb3e8;
}

::-moz-selection {
	background-color: var(--background-color-1);
	color: #2c3e50;
}

</style>