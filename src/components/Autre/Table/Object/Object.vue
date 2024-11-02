<template>
    <div class="div-object">
        <div class="top"></div>
        <div class="middle">
            <div id="scene-object" class="scene-object d-flex justify-center align-center"></div>
            <div class="scene-content" v-for="data in titles" :data-content="data.title">
                <p v-html="data.title"></p>
            </div>
        </div>

        <div class="bottom"></div>
    </div>
</template>

<script>
import { ObjectVisualisation } from './script.js';
import data from './data.json'

export default {
    name: 'AppTable',
    data() {
        return {
            titles: data.titles
        }
    },
    mounted() { // Lance la fonction au chargement de la page
        this.container = document.getElementById("scene-object");
        this.container.innerHTML = '';

        new ObjectVisualisation(this.container, () => {
        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Div total */
.div-object {
    height: 300vh;

    .top {
        height: 100vh;
        background: linear-gradient(var(--background-color-1) 10%, #000000);
    }

    .middle {
        height: 125vh;
        background-color: #000000;
    }

    .bottom {
        height: 75vh;
        background: linear-gradient(#000000, #ef000000);
    }


    .scene-object {
        height: 100%;
        width: 100% !important;
    }
}

.scene-content {
    position: relative;
    bottom: 90vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;


    p {
        font-size: xxx-large;
        font-weight: bold;
        border-top: 0.5px solid #474e544f;
        width: 100%;
        padding: 5px 30px;
        display: flex;
    }

    p:last-child {
        border-bottom: 1px solid #474e544f;
    }

    &:hover{
        cursor: pointer;
    }

    &:before,
    &:after {
        transition: all 0.3s ease;
        width: 0%;
    }

    /* Background color */
    &:before {
        content: " ";
        height: 100%;
        position: absolute;
        right: -5%;
        background: #cccccc6a;
        z-index: -1;
    }

    &:hover:before {
        width: 130%;
        background: #cccccc6a;
        z-index: 1;
    }

    /* Text */
    &:after {
        content: attr(data-content);
        position: absolute;
        top: 0;
        left: 0;
        padding: 5px 30px;
        border-radius: 2000px;
        font-weight: bold;
        font-size: xxx-large;
        color: #b1b1b1;
        display: flex;
        overflow: hidden;
        white-space: nowrap;
        visibility: hidden;
    }

    &:hover:after {
        width: 100%;
        visibility: visible;
    }

}
</style>