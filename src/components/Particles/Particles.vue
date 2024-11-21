<template>
    <div ref="particlesContainer" class="particles-container">
        <Particles id="tsparticles" :options="options" :particlesInit="particlesInit" />
    </div>
</template>

<script>
import { loadSlim } from "tsparticles-slim"; // loads tsparticles-slim
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    mounted() {
        gsap.registerPlugin(ScrollTrigger);


        // Move texts and rocket during scroll
        gsap.to('.particles-container', {
            y: () => -(window.innerHeight * 0.75),
            scrollTrigger: {
                trigger: '.particles-container',
                start: "top top",
                end: "bottom top",
                scrub: 2,
                markers: true,
            },
        });


    },
    data() {
        return {
            options: {
                background: {
                    color: "#000", // couleur de fond noire pour simuler l'espace
                },
                fullScreen: {
                    enable: true,
                    zIndex: -1,
                },
                interactivity: {
                    events: {
                        onClick: {
                            enable: false, // désactiver les interactions pour un effet de ciel calme
                        },
                        onHover: {
                            enable: false, // désactiver l'effet de survol
                        },
                        resize: true,
                    },
                },
                particles: {
                    color: {
                        value: "#FFF", // couleur des particules blanche pour simuler des étoiles
                    },
                    links: {
                        enable: false, // désactiver les liaisons pour un effet plus naturel
                    },
                    move: {
                        enable: true,
                        speed: { min: 0.02, max: 0.1 }, // vitesse lente pour un effet de scintillement subtil
                        direction: "none",
                        outModes: {
                            default: "bounce", // rebondir aux bords de l'écran
                        },
                    },
                    shape: {
                        type: "circle", // utiliser uniquement des cercles
                    },
                    number: {
                        value: 200, // augmenter le nombre pour un effet étoilé dense
                        density: {
                            enable: true,
                            area: 800, // densité pour bien répartir les étoiles
                        },
                    },
                    opacity: {
                        value: { min: 0.3, max: 0.8 }, // opacité variable pour simuler différentes intensités
                        animation: {
                            enable: true,
                            speed: 0.5,
                            minimumValue: 0.3,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 0.5, max: 1.5 }, // petites particules pour simuler des étoiles
                    },
                },
            },
        };
    },
    methods: {
        async particlesInit(engine) {
            await loadSlim(engine);
        },
    },
};
</script>


<style scoped>
.particles-container {
    position: fixed;
    width: 100%;
    height: 500dvh;
    top: 40vh;
    left: 0;
    pointer-events: none; /* Block interactions */
}
</style>