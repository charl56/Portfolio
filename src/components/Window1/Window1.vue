<template>
    <div class="window1-div">
        <p class="window1-p__top" @mouseover="onHoverTop">{{ textTop }}</p>
        <p class="window1-p__bottom" @mouseover="onHoverBottom">{{ textBottom }}</p>
        <Models3dLoader :modelPath="modelPath" :idIs="'model_spacesword'" />
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Models3dLoader from "../Models3dLoader/Models3dLoader.vue";

export default {
    name: 'Window1',
    components: {
        Models3dLoader
    },
    data() {
        return {
            textTop: "ARE YOU LIVING IN THE REAL WORLD?",
            textBottom: "SEE YOU IN SPACE COWBOY...",
            originalTextTop: "ARE YOU LIVING IN THE REAL WORLD?",
            originalTextBottom: "SEE YOU IN SPACE COWBOY...",
            shuffledTextTop: "",
            shuffledTextBottom: "",
            intervalIdTop: null,
            intervalIdBottom: null,
            isAnimatingTop: false,
            isAnimatingBottom: false,
            modelPath: "../../../../../images/model/swordfish2/scene.gltf"
        }
    },
    methods: {
        onHoverTop() {
            if (!this.isAnimatingTop) {
                this.shuffleAndReorganize('Top');
            }
        },
        onHoverBottom() {
            if (!this.isAnimatingBottom) {
                this.shuffleAndReorganize('Bottom');
            }
        },
        shuffleAndReorganize(textType) {
            this[`isAnimating${textType}`] = true;

            // Shuffle instant
            this.shuffleText(textType);

            // Reorganize during 1 sec
            let index = 0;
            const originalText = this[`originalText${textType}`];
            const intervalId = setInterval(() => {
                if (index < originalText.length) {
                    this[`text${textType}`] = originalText.slice(0, index + 1) + this[`shuffledText${textType}`].slice(index + 1);
                    index++;
                } else {
                    clearInterval(this[`intervalId${textType}`]);
                    this[`isAnimating${textType}`] = false;
                }
            }, 1000 / originalText.length); 

            this[`intervalId${textType}`] = intervalId;
        },
        shuffleText(textType) {
            const shuffled = this[`text${textType}`].split('').sort(() => 0.5 - Math.random()).join('');
            this[`shuffledText${textType}`] = shuffled;
            this[`text${textType}`] = shuffled;
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);

        // Move bottom text to the right
        gsap.timeline({
            scrollTrigger: {
                trigger: ".window1-div",      // Element where trigger actions
                start: "top top",             // Where trigger start : top of component, top of screen
                end: "bottom 70%",            // Where trigger end : bottom of component, 70% of top of screen
                pin: true,                    // Stay on component during animations
                scrub: 1,
            }
        })
            .to('.window1-p__top', { y: 200, duration: 3, stagger: 1 })
            .to('#model_spacesword', { y: -(2 * window.innerHeight), duration: 3, stagger: 1 }, "<")
            .to('.window1-p__bottom', { y: -200, duration: 3, stagger: 1 }, "<")
    }
}
</script>


<style scoped>
p {
    font-size: xx-large;
    font-weight: 600;
    font-style: italic;
}

.window1-div {
    height: 100dvh;
}


.window1-p__top {
    align-self: flex-start;
    padding: 10px 20px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: start;
    z-index: 22;
}

#model_spacesword {
    width: 100vw;
    height: 100vh;
    left: 10vw;
    bottom: -100vh;
    position: absolute;
    left: 0;
    z-index: 21;
}

.window1-p__bottom {
    align-self: flex-end;
    padding: 10px 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: end;
    z-index: 20;
}


#text span {
    display: inline-block;
}
</style>