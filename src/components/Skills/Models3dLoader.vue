<template>
    <div id="model_spacesword" class="scene">
    </div>
</template>

<script>
import { Models3DVisualisation } from './script.js';
import getAssetSrc from '@/utils/imageUtils';

export default {
    mounted() {
        this.container = document.getElementById("model_spacesword");
        this.initVizualisation();
    },
    methods: {
        initVizualisation() {
            this.container.innerHTML = '';
            new Models3DVisualisation(getAssetSrc("models/swordfish2/scene.glb"), this.container);
        },
    },

};
</script>

<style scoped>
.scene {
    height: 100vh;
    width: 100vw !important;
}

</style>