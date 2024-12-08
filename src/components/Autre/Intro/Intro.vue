<template>
    <div class="intro-div">
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
            <text x="50%" y="0%" text-anchor="middle" ref="text">
                webstoryboy
            </text>
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
                scaleY: 0.1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".intro-div",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }
}
</script>

<style scoped>
.intro-div {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #e3f2fd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

svg {
    position: absolute;
    width: 100%;
    height: 100%;
}

text {
    font-family: 'Russo One', sans-serif;
    text-transform: uppercase;
    stroke-width: 2;
    stroke: #365fa0;
    font-size: 2vw;
    fill: rgba(72, 138, 204, 1);
}
</style>