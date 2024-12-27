<template>
    <div id="model_spacesword" class="scene">
    </div>
</template>

<script>
import { Models3DVisualisation } from './script.js';

export default {
    mounted() {
        this.container = document.getElementById("model_spacesword");
        this.initVizualisation();
    },
    methods: {
        initVizualisation() {
            this.container.innerHTML = '';
            new Models3DVisualisation(this.getModelUrl("models/swordfish2/scene.gltf"), this.container);
        },
        getModelUrl(src) {
            return import.meta.env.DEV
                ? new URL(`../../../images/${src}`, import.meta.url).href
                : `images/${src}`;
        },
    },

};
</script>

<style scoped>
.scene {
    height: 100dvh;
    width: 100vw !important;
}

</style>