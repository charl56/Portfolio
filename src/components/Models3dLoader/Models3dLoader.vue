<template>
    <div :id="idIs" class="scene">
    </div>
</template>

<script>
import { Models3DVisualisation } from './script.js';

export default {
    props: {
        modelPath: {
            type: String,
            required: true,
        },
        idIs: {
            type: String,
            required: true
        }
    },
    watch: {
        modelPath: 'initVizualisation',
    },
    mounted() {
        this.container = document.getElementById(this.idIs);
        this.initVizualisation();
    },
    methods: {
        initVizualisation() {
            this.container.innerHTML = '';
            new Models3DVisualisation(this.modelPath, this.container);
        }
    },

};
</script>

<style scoped>
.scene {
    height: 100%;
    width: 100vw !important;
}
</style>