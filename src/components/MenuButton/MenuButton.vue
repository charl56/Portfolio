<template>
    <img class="menuButton-img__rocket" src="@/assets/svg/rocket.svg" alt="Rocket" @click="toggleMenuFunction" ref="menuButton" />
    <div v-if="toggleMenu" class="menuButton-div" ref="menuDiv">
        <p>Ouai me menu ic</p>
    </div>
</template>

<script>
export default {
    name: 'MenuButton',
    data() {
        return {
            toggleMenu: false
        }
    },
    mounted() {
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

.menuButton-div {
    position: fixed;
    top: 100px;
    right: 0;
    z-index: 100;
}
</style>
