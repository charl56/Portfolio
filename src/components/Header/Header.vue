<template>
    <div class="header-div my-1" id="header-div">
        <div class="marquee d-flex align-center">
            <div class="marquee--inner">
                <span class="d-flex justify-space-around">
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                </span>
                <span class="d-flex justify-space-around">
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                    <p class="header-text">Portfolio</p>
                </span>
            </div>
        </div>
    </div>
</template>
  

<script>
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'AppHeader',
    mounted() {
        // GSAP Animation to show/hide header
            gsap.registerPlugin(ScrollTrigger);
            gsap.to(".header-div", {
                scrollTrigger: {
                    trigger: ".header-div",                             // Where it declenche action
                    toggleActions: "restart complete reverse pause",       // "list" of action to do
                    start: "top top ",                             // Where trigger start : center of component, center of screen
                    end: "bottom top",                                  // Where trigger end : bottom of component, top of screen            
                    scrub: 1,                                           // Move every scroll
                },
                duration: 3,
                x: () => -window.innerWidth,
                y: -100,
            })
    }
}
</script>
  
<style scoped>
/* Div */
#header-div {
    top: 100px;
    left: 100vw;
    position: fixed;
    height: min-content;
    width: 100vw;
    z-index: 1006;
    cursor: none;
}

/* Banderol */
.marquee {
    height: 5dvh;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}

.marquee--inner {
    display: block;
    width: 200%;
    position: absolute;
    animation: marquee 10s linear infinite;
}

@keyframes marquee {
    0% {
        right: 0;
    }

    100% {
        right: -100%;
    }
}

span {
    float: left;
    width: 50%;
}

/* Text */
.header-text {
    font-size: 3em;
    margin: 5px 0px;
}

@media (max-width: 700px) {
    .header-text {
        font-size: 2em;
    }
}
</style>
  
  