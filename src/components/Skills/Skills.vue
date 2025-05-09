<template>
    <div class="skills-div">
        <div class="skills-div__title">
            <p>Compétences</p>
        </div>
        <div class="skills-div__content">
            <p>J'ai pas eu le temps de finir, je fais de l'argent</p>
            <Models3dLoader />
        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Models3dLoader from "./Models3dLoader.vue";

export default {
    name: 'Skills',
    components: {
        Models3dLoader
    },
    mounted() {
        document.documentElement.style.overflow = 'hidden'; // Disable scroll during loading

        gsap.registerPlugin(ScrollTrigger);

        // Move texts and rocket during scroll
        gsap.timeline({
            scrollTrigger: {
                trigger: ".skills-div",        // Element where trigger actions
                start: "top top",               // Where trigger start : top of component, top of screen
                end: "bottom top",              // Where trigger end : bottom of component, 70% of top of screen
                pin: false,                      // Stay on component during animations
                scrub: 3,                       // Sscrubbing, takes 0.3 second to "catch up" to the scrollbar
            }
        })
        .to('#model_spacesword', { top: "120vh", left: "170vw", duration: 1, stagger: 1 }, "<")

    },
}
</script>


<style scoped>
.skills-div {
    position: relative;
    width: 100vw;
    height: 100vh;
    padding: 0px 5px;
}

.skills-div__title {
    height: 10vh;
    width: 100%;

    p {
        font-size: 4em;
        color: white;
    }
}

.skills-div__content {
    height: 90vh;
    width: 100%;

    p {
        font-size: 2em;
        color: white;
    }
}


#model_spacesword {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: -50vh;
    left: -90vw;
    z-index: 2;
}
</style>