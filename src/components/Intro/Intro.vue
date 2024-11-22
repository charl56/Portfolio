<template>
    <div class="background-image">
        <img src="@/assets/background/zoro.jpg" alt="">
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'Intro',
    mounted() {
        gsap.registerPlugin(ScrollTrigger);

        this.$nextTick(() => {
            ScrollTrigger.create({
                trigger: ".projects-div",
                start: "top top",
                end: "bottom bottom",
                snap: {
                    snapTo: 1, // snap to the start of the element
                    duration: { min: 0.2, max: 0.3 },
                    delay: 0.1,
                    ease: "power1.inOut"
                }
            });
        });
    }
}
</script>


<style scoped>
.background-image {
    position: relative;
    width: 100vw;
    height: 100dvh;
    background-color: var(--second-color);

    display: flex;
    align-items: flex-end;
    justify-content: center;

    img {
        width: 50%;
    }

    @media (max-width: 768px) {
        img {
            width: 100%;
        }
    }

}
</style>