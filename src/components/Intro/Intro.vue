<template>
    <div class="intro-div">
        <!-- <p ref="text">BONJOUR</p> -->
        <svg width="200" height="100">
            <text  class="svg-text">Bienvenue</text>
        </svg>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default {
    name: 'Intro',
    mounted() {
        this.$nextTick(() => {
            this.initAnimation();
        });
    },
    methods: {
        initAnimation() {
            gsap.to(this.$refs.text, {
                opacity: 0,
                scrollTrigger: {
                    trigger: ".intro-div",
                    start: "bottom top", // Bottom of component and top of screen
                    toggleActions: "play none none reverse", // Animation en avant/arrière
                },
            });
        },

    }
}
</script>


<style scoped>
.intro-div {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--second-color);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    svg {
        position: absolute;
        top: 43px;
        left: 51px;
        width: 100%;
        height: 100%;
        transform: scale(5, 25);
        transform-origin: 0 0;
    }
}

p {
    font-size: 10vh;
    text-transform: uppercase;
    position: fixed;
    -webkit-text-stroke: 1px white;
    -webkit-text-fill-color: transparent;
    color: transparent;
    transform-origin: center center;
}
</style>