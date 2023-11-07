<template>
  <v-app id="app">
      <!-- Portfolio -->
      <div>
        <Loader/>
        <Header />
        <Table />
        <Footer />
      </div>
  </v-app>
</template>

<script>
import Loader from './components/Loader/Loader.vue'
import Header from './components/Header/Header.vue'
import Table from './components/Table/Table.vue'
import Footer from './components/Footer/Footer.vue'

export default {
  name: 'App',
  components: {
    Loader,
    Header,
    Table,
    Footer,
  },
}
</script>

<style>
:root {
  --background-color-1: #f5f9ff;
  --font-color: #2c3e50;
}
/* Hide scrollbar for Chrome, Safari and Opera */
html::-webkit-scrollbar {
  display: none;
}

html {
  margin: 0;
  height: 100%;
  background-color: var(--background-color-1);
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--font-color) !important;
  background-color: var(--background-color-1) !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
/* Surlignage du texte */
::selection{
  background-color: var(--background-color-1);
  color: #7eb3e8;
}
::-moz-selection{
  background-color: var(--background-color-1);
  color: #2c3e50;
}
</style>