<template>
    <div class="div-scroll-down">
        <div id="lottie-scroll-down"></div>
    </div>
</template>

<script>
import '../../plugins/body-movin'
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'ScrollLotie',
    components: {
    },
    mounted() { // Lance la fonction au chargement de la page

        document.getElementById("lottie-scroll-down").style.visibility = "hidden";
        // Lottie animation
        bodymovin.loadAnimation({
            container: document.getElementById('lottie-scroll-down'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: new URL('../../assets/Json/scroll-down2.json', import.meta.url).href
        })

        // GSAP hide/show loffie animation
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(".div-scroll-down", {
            scrollTrigger: {
                trigger: ".div-scroll-down",                             // Where it declenche action
                toggleActions: "restart pause reverse pause",       // "list" of action to do
                start: "bottom center ",                             // Where trigger start : center of component, center of screen
                end: "bottom bottom",                                  // Where trigger end : bottom of component, top of screen            
                scrub: 1,                                           // Move every scroll
                pin: true,                                           // Pin the element to the top
                onEnter: () => { },
                onLeave: () => {
                    document.querySelector('.div-scroll-down').style.position = 'absolute';
                    document.querySelector('.div-scroll-down').style.display = 'none';
                },
                onEnterBack: () => { },
                onLeaveBack: () => {
                    document.querySelector('.div-scroll-down').style.position = 'fixed';
                    document.querySelector('.div-scroll-down').style.display = '';
                },
            },
            opacity: 0,
            ease: "none"
        })
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* GIF scroll down */
.div-scroll-down {
    z-index: 1001;
    height: 100vh;
    width: 100vw;
    position: fixed;
    bottom: 0;
    background-color: transparent;
}

#lottie-scroll-down {
    height: 45%;
    width: 45%;
}

</style>