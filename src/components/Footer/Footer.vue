<template>
    <div class="footer-div my-1" id="footer-div">
        <v-row class="d-flex justify-space-around">
            <p class="footer-text"><a class="px-2 py-0" href="https://www.linkedin.com/in/charles-pichou/" target="_blank">LinkedIn</a></p>
            <p class="footer-text-date">2022 - {{ new Date().getFullYear() }}</p>
            <p class="footer-text"><a class="px-2 pa-0" href="https://github.com/charl56" target="_blank">GitHub</a></p>
        </v-row>
    </div>
</template>
  

<script>
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'AppFooter',
    mounted() {
        // GSAP Animation to show/hide header
            gsap.registerPlugin(ScrollTrigger);
            gsap.to(".footer-div", {
                scrollTrigger: {
                    trigger: ".footer-div",                             // Where it declenche action
                    toggleActions: "restart complete reverse pause",       // "list" of action to do
                    start: "top bottom",                             // Where trigger start : center of component, center of screen
                    scrub: 1,     
                },
                duration: 3,
                y: 200,
            })
    }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Div */
#footer-div {
    height: 4dvh;
    width: 100vw;
    padding: 5px 0;
    display: flex;
    align-items: center;
    z-index: 1006;

}
@media (max-width: 1200px) {
    #footer-div {
        height: 5dvh;
    }
}

/* Elements */
a {
    color: #2c3e50 !important;
    text-decoration: none !important;
}

a:hover {
    cursor: pointer !important;
}

/* Text */
.footer-text, .footer-text-date {
    font-size: 2em;
    font-weight: lighter;
}.footer-text:hover {
    transform: scale(1.05);
}

</style>
  
  