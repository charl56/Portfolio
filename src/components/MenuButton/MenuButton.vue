<template>
    <img class="menuButton-img__rocket" src="@/assets/svg/rocket.svg" alt="Rocket" @click="toggleMenuFunction"
    :class="{ 'menuButton-img__rocket--expanded': toggleMenu }" ref="menuButton" />
    <div class="menuButton-div__info">
        <p>MENU</p>
    </div>
    <div v-if="toggleMenu" class="menuButton-div" ref="menuDiv">
        <p>Ouai me menu ic</p>
        <a href="#projects-div">Projets</a>

    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'MenuButton',
    data() {
        return {
            toggleMenu: false
        }
    },
    mounted() {

        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
            '.menuButton-div__info',
            { opacity: 1 },
            {
                opacity: 0,
                scrollTrigger: {
                    trigger: '.menuButton-div__info',
                    start: "bottom top",
                    end: "+=100",
                    scrub: true,
                }
            }
        );

        // Add events listener 'Escape' and clic
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        // Delete events listener 'Escape' and clic
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleMenuFunction() {
            this.toggleMenu = !this.toggleMenu;
        },
        handleKeydown(event) {
            if (event.key === 'Escape' && this.toggleMenu) {
                this.toggleMenu = false;
            }
        },
        handleClickOutside(event) {
            const menuButton = this.$refs.menuButton;
            const menuDiv = this.$refs.menuDiv;
            if (
                this.toggleMenu &&
                !menuButton.contains(event.target) &&
                (!menuDiv || !menuDiv.contains(event.target))
            ) {
                this.toggleMenu = false;
            }
        }
    },
}
</script>

<style scoped>
p {
    font-size: xx-large;
    font-weight: 600;
    font-style: italic;
}

.menuButton-img__rocket {
    height: 100px;
    width: 100px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
}

.menuButton-img__rocket:hover {
    cursor: pointer;
    transform: scale(1.05);
}

.menuButton-div__info {
    position: fixed;
    top: 100px;
    right: 0;
    z-index: 100;
    width: 100px;
    display: flex;
    justify-content: center;

    p {
        font-size: x-large;
    }
}

.menuButton-div {
    position: fixed;
    top: 10px;
    right: 100px;
    z-index: 100;
}
</style>
