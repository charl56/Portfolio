<template>
    <div class="intro-div">
        <p>Intro</p>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'Intro',
    mounted() {

    }
}
</script>


<style scoped>
.intro-div {
    position: relative;
    width: 100vw;
    height: 100dvh;
    background-color: var(--second-color);
}
</style>