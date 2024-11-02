<template>
    <div class="div-circle">
        <svg :width="svgWidth" :height="svgHeight">
            <circle :cx="circlePosX" :cy="circlePosY" />
        </svg>
    </div>
</template>


<script>
export default {
    data() {
        return {
            svgWidth: window.innerWidth,
            svgHeight: window.innerHeight,
            circlePosX: 0,
            circlePosY: 0,
        };
    },
    methods: {
        updateCirclePosition(event) {
            this.circlePosX = event.clientX;
            this.circlePosY = event.clientY;
        },
    },
    mounted() {
        window.addEventListener('mousemove', this.updateCirclePosition);
    },
    beforeDestroy() {
        window.removeEventListener('mousemove', this.updateCirclePosition);
    },
};
</script>


<style scoped>
.div-circle{
    height: 100dvh;
    width: 100dvw;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 2000;
    pointer-events: none;
}

circle {
    /* stroke: black; */
    stroke-width: 2px;
    fill: gray;
    r: 20;
    filter: blur(5px);
    
}
</style>