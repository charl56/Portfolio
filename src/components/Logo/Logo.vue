<template>
    <div class="logo">
        <img v-if="showLogo" :src="getAssetSrc('logo.png')" alt="Logo">
    </div>
</template>

<script>
import { EventBus } from '@/utils/eventBus';
import getAssetSrc from '@/utils/imageUtils';

export default {
  created () {
  },
    name: 'Logo',
    data() {
        return {
            showLogo: false
        };
    },
    mounted() {
        EventBus.on('showLogo', (valeur) => {
            this.showLogo = valeur;
        });
    },
    beforeUnmount() {
        EventBus.off('showLogo');
    },
    methods: {
        getAssetSrc
    }
}
</script>

<style scoped>
.logo {
    position: fixed;
    z-index: 4;
    top: 10px;
    right: 10px;
    width: 40px;
    /* Ajuste la taille selon ton besoin */
    height: auto;
}

.logo img {
    width: 100%;
    height: auto;
}
</style>
