<template>
    <div class="logo">
        <img v-if="showLogo" src="@/assets/icons/logo.png" alt="Logo">
    </div>
</template>

<script>
import { EventBus } from '@/utils/eventBus';

export default {
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
