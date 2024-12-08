<template>
    <div class="window4-div">
        <div class="window4__sub-div"></div>
        <div class="window4__sub-div"></div>
        <div class="window4__sub-div"></div>
        <div class="window4__sub-div"></div>
        <div class="window4__sub-div"></div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default {
    name: 'Window4',
    mounted() {


    },
}
</script>


<style scoped>
.window4-div {
    position: relative;
    width: 100%;
    height: 100lvh;
    display: flex;

    margin-bottom: 50vh;

    div {
        background-color: var(--fourth-color);
        height: 100%;
        width: 20%;
        margin: 5px 10px;
    }
}


@media (max-width: 768px) {
    .window4-div {
        flex-direction: column;

        div {
            width: 100%;
            height: 20%;
            margin: 5px 0;
        }
    }
}
</style>