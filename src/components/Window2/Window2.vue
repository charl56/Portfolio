<template>
    <div class="window2-div">
        <div class="sub-window2-div window-div__first"></div>
        <div class="sub-window2-div window-div__second"></div>
        <div class="sub-window2-div window-div__third"></div>
        <div class="sub-window2-div window-div__fourth"></div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Window3 from "../Window3/Window3.vue";

export default {
    name: 'Window2',
    components: {
        Window3
    },
    mounted() {
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;

        gsap.registerPlugin(ScrollTrigger);

        // Move bottom text to the right
        gsap.timeline({
            scrollTrigger: {
                trigger: ".window2-div",      // Element where trigger actions
                start: "top top",             // Where trigger start : top of component, top of screen
                end: "bottom 70%",            // Where trigger end : bottom of component, 70% of top of screen
                pin: true,                    // Stay on component during animations
                scrub: 1,
            }
        })
            // Frame 1 : close in 2 parts : left & right
            .to('.window-div__first', { height: 0, width: innerWidth / 2, duration: 3, stagger: 1 })
            .to('.window-div__second', { height: innerHeight, width: innerWidth / 2, duration: 3, stagger: 1 }, "<")
            .to('.window-div__third', { height: innerHeight, width: innerWidth / 2, duration: 3, stagger: 1 }, "<")
            .to('.window-div__fourth', { height: 0, width: innerWidth / 2, duration: 3, stagger: 1 }, "<")
            // Change side of border color
            .to('.window-div__first', { borderBottomWidth: 0, borderRight: "1px solid var(--border-color)" })
            .to('.window-div__second', { borderBottom: "2px solid var(--border-color)" }, "<")
            .to('.window-div__third', { borderTop: "2px solid var(--border-color)" }, "<")
            .to('.window-div__fourth', { borderTopWidth: 0, borderLeft: "1px solid var(--border-color)" }, "<")
            // Frame 2 : setup for next
            .to('.window-div__first', { height: innerHeight, duration: 0, borderRight: 2 })
            .to('.window-div__second', { height: 0, duration: 0 }, "<")
            .to('.window-div__third', { height: 0, duration: 0, visibility: "visible" }, "<")
            .to('.window-div__fourth', { height: innerHeight, duration: 0, borderLeft: 2 }, "<")
            // Frame 3 : Separation, little top right et bottom left         
            .to('.window-div__first', { height: innerHeight * 0.9, duration: 3, stagger: 1 })
            .to('.window-div__second', { height: innerHeight * 0.1, duration: 3, stagger: 1, borderLeft: "2px solid var(--border-color)" }, "<")
            .to('.window-div__third', { height: innerHeight * 0.1, duration: 3, stagger: 1, borderRight: "2px solid var(--border-color)" }, "<")
            .to('.window-div__fourth', { height: innerHeight * 0.9, duration: 3, stagger: 1 }, "<")
            .to('.projects-div__background-color', { clipPath: "polygon(0vh 40vh, 50vw 40vh, 50vw 100vh, 0vh 100vh)", duration: 3, stagger: 1 }, "<")
            // Before separate, remove border
            .to('.window-div__second', { borderLeftWidth: 0 }, "<")
            .to('.window-div__third', { borderRightWidth: 0 }, "<")
            // Frame 4 : opening in the middle
            .to('.window-div__first', { height: innerHeight * 0.65, width: innerWidth * 0.35, duration: 3, stagger: 1 })
            .to('.window-div__second', { height: innerHeight * 0.35, width: innerWidth * 0.65, duration: 3, stagger: 1, borderLeft: null }, "<")
            .to('.window-div__third', { height: innerHeight * 0.35, width: innerWidth * 0.65, duration: 3, stagger: 1, borderRight: null }, "<")
            .to('.window-div__fourth', { height: innerHeight * 0.65, width: innerWidth * 0.35, duration: 3, stagger: 1 }, "<")
            .to('.projects-div__background-color', { clipPath: "polygon(0vh 15vh, 65vw 15vh, 65vw 100vh, 0vh 100vh)", duration: 3, stagger: 1 }, "<")
            // Frame 5 : close horizontally
            .to('.window-div__first', { height: innerHeight * 0.5, width: 0, duration: 3, stagger: 0 })
            .to('.window-div__second', { height: innerHeight * 0.5, width: innerWidth, duration: 3, stagger: 0 }, "<")
            .to('.window-div__third', { height: innerHeight * 0.5, width: innerWidth, duration: 3, stagger: 0 }, "<")
            .to('.window-div__fourth', { height: innerHeight * 0.5, width: 0, duration: 3, stagger: 0 }, "<")
            .to('.projects-div__background-color', { clipPath: "polygon(0vh 0vh, 100vw 0vh, 100vw 100vh, 0vh 100vh)", duration: 3, stagger: 0 }, "<")

            // Remove side border color
            .to('.window-div__first', { borderRight: null })
            .to('.window-div__fourth', { borderLeft: null }, "<")
            // Remove middle border color
            .to('.window-div__second', { borderBottom: null })
            .to('.window-div__third', { borderTop: null, height: 'auto' }, "<")


    }
}
</script>


<style scoped>
.window2-div {
    position: relative;
    height: 100dvh;
    /* margin-bottom: 20vh; */
    --border-color: #ad8f2d;
}

.sub-window2-div {
    position: absolute;
}

.window-div__first {
    top: 0;
    left: 0;
    width: 65vw;
    height: 35vh;
    border-bottom: 2px solid var(--border-color);
}

.window-div__second {
    top: 0;
    right: 0;
    width: 35vw;
    height: 65vh;
    border-left: 2px solid var(--border-color);
}

.window-div__third {
    bottom: 0;
    left: 0;
    width: 35vw;
    height: 65vh;
    border-right: 2px solid var(--border-color);
    overflow: hidden;
}

.window-div__fourth {
    bottom: 0;
    right: 0;
    width: 65vw;
    height: 35vh;
    border-top: 2px solid var(--border-color);
}
</style>