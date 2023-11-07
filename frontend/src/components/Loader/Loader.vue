<script setup>
</script>

<template>
    <!-- Dialog d'attente de chargement -->
    <v-dialog v-model="open" persistent class="modal-loading my-0 mx-0 justify-center" fullscreen :scrim="false" v-bind:transition="getTransition()">
        <!-- Présentation -->
        <v-row class="my-0 d-flex align-end justify-center row-welcome">
            <p class="px-3 py-0 loader-text" :class="titleSize()">{{ loaderData['welcome'] }}</p>
        </v-row>
        <!-- Présentation -->
        <v-row class="my-0 py-0 d-flex align-center justify-center">
            <div class="d-flex flex-column loader-text">
                <p class="px-2 py-1 text-center" :class="textSize()">{{ loaderData['presentation1'] }}</p>
                <p class="px-2 py-0 text-center" :class="textSize()">{{ loaderData['presentation2'] }}</p>
            </div>
        </v-row>
        <!-- Enter -->
        <v-row class="my-0 d-flex align-start justify-center row-loading">
            <!-- Entrance -->
            <!-- <p @click="open = !open" class="px-3 py-1 btn-open loaded" :class="textSize()">{{ loaderData['loading2'] }}</p> -->
            <div v-if="loaded" @click="open = !open" class="d-flex flex-column align-center justify-center div-enter">
                <div class="lds-ripple"><div></div><div></div></div>
            </div>
            <!-- Loader -->
            <div v-else class="d-flex flex-column align-center justify-center div-loading">
                <p class="px-3 py-1 no-loaded show-loader" :class="textSize()">{{ percentage }}%</p>
                <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>            
            </div>
        </v-row>
</v-dialog>
</template>

<script>
import { eventBus } from "../../plugins/eventBus";
import {Path, Point, SymbolDefinition, view} from 'paper'

export default {
    name: 'AppLoader',
    // mounted(){  // Space mood

    //     document.addEventListener('mousemove', (e) => onMouseMove(e), false)

    //     // The amount of symbol we want to place;
    //     var count = 150;

    //     // Create a symbol, which we will use to place instances of later:
    //     var path = new Path.Circle({
    //         center: new Point(0, 0),
    //         radius: 5,
    //         fillColor: 'white',
    //         strokeColor: 'black'
    //     });

    //     var symbol = new SymbolDefinition(path);

    //     // Place the instances of the symbol:
    //     for (var i = 0; i < count; i++) {
    //         // The center position is a random point in the view:
    //         var center = Point.random() * view.size;
    //         var placed = symbol.place(center);
    //         var scale = (i + 1) / count;
    //         placed.scale(scale);
    //         placed.data.vector = new Point({
    //             angle: Math.random() * 360,
    //             length : scale * Math.random() / 5
    //         });
    //     }

    //     var vector = new Point({
    //         angle: 45,
    //         length: 0
    //     });

    //     var mouseVector = vector.clone();

    //     function onMouseMove(event) {
    //         mouseVector = view.center - event.point;
    //     }

    //     // The onFrame function is called up to 60 times a second:
    //     function onFrame(event) {
    //         console.log(event)

    //         vector = vector + (mouseVector - vector) / 30;

    //         // Run through the active layer's children list and change
    //         // the position of the placed symbols:
    //         for (var i = 0; i < count; i++) {
    //             var item = project.activeLayer.children[i];
    //             var size = item.bounds.size;
    //             var length = vector.length / 10 * size.width / 10;
    //             item.position += vector.normalize(length) + item.data.vector;
    //             keepInView(item);
    //         }
    //     }

    //     function keepInView(item) {
    //         var position = item.position;
    //         var itemBounds = item.bounds;
    //         var bounds = view.bounds;
    //         if (itemBounds.left > bounds.width) {
    //             position.x = -item.bounds.width;
    //         }

    //         if (position.x < -itemBounds.width) {
    //             position.x = bounds.width + itemBounds.width;
    //         }

    //         if (itemBounds.top > view.size.height) {
    //             position.y = -itemBounds.height;
    //         }

    //         if (position.y < -itemBounds.height) {
    //             position.y = bounds.height  + itemBounds.height / 2;
    //         }
    //     }
    // },
    created(){
        // Permet de la vue entre sections, s-s et fiches
        eventBus.on('dataLoad', (data) => {
            if(data){
                this.loaded = true
                this.value = this.dataFr['loading2']
            } else {
                this.loaded = false
                this.value = 'Patienter...'
            }
        });
        // Charge différentes langues
        eventBus.on('languageLoad', (data) => {
            this.dataFr = data[0][0]
            this.dataEng = data[1][0]
            this.loaderData = data[0][0]
        });
        eventBus.on('languageChange', (data) => {
            if(data == 'Fr'){
                this.loaderData = this.dataEng
            } else {
                this.loaderData = this.dataFr
            }
        });
        // Pourcentage chargement
        eventBus.on('progressValue', (data) => {
            this.percentage = parseInt(data)
        });
    },
    data () {
        return {
        loaded: false,
        open: true,
        value: 'Patienter... Chargement des photos',
        loaderData: {},
        dataFr: {},
        dataEng: {},
        percentage: 0
        }
    },
    methods:{
        getTransition(){
            if(this.open){
                return 'dialog-bottom-transition'
            } else {
                return 'dialog-top-transition'
            }
        },
        titleSize(){
            if(window.outerWidth < 400){
                return 'text-h1'
            } else if(window.outerWidth < 600){
                return 'text-h2'
            } else {   
                return 'text-h4' 
            }
        },
        textSize(){            
            if(window.outerWidth < 400){
                return 'text-h2'
            } else if(window.outerWidth < 600){
                return 'text-h3'
            } else {   
                return 'text-h5' 
            }
        },
        
    },
    computed: {
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.modal-loading::-webkit-scrollbar {
  display: none;
}.modal-loading{
    z-index: 1003 !important;
    background-color: var(--background-color-1) !important;
    overflow: hidden;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}.modal-loading ::selection{    /* Surlignage du texte */
    background-color: var(--background-color-1);
    color: #7eb3e8;
}.modal-loading ::-moz-selection{   /* Surlignage du texte */
    background-color: var(--background-color-1);
    color: #2c3e50;
}

/* Welcome part */
.row-loading{
    height: 10vh;
}


/* Btn & animation*/
.btn-open:hover{
    cursor: pointer;
}.btn-open{
    border-right: 2px solid black;
    border-left: 2px solid black;
    border-radius: 3px;
    animation-name: clignoter;
    animation-iteration-count: infinite;
    transition: none;
}.no-loaded{
    animation-duration: 1.2s;
}.loaded{
    animation-duration: 3s;
}
@keyframes clignoter {
  0%   { opacity:1; rotate: 0deg; }
  40%   {opacity:0.3; }
  100% { opacity:1; rotate: 360deg; transform: }
}

/* Animation loading */
/* Animation loading */
.div-loading{
    position: absolute;
    width: 120px;
    height: 120px;
}
.show-loader{
    display: inline-block;
    position: absolute;
    animation-name: clignoter;
    animation-iteration-count: infinite;
    transition: none;
}
.lds-spinner {
  display: inline-block;
  position: absolute;
  width: 120px;
  height: 120px;
}
.lds-spinner div {
  transform-origin: 60px 60px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 6px;
  left: 55px;
  width: 6px;
  height: 20px;
  border-radius: 20%;
  background: black;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Animation loaded */
/* Animation loaded */
.div-enter{
    position: absolute;
    width: 120px;
    height: 120px;
}.div-enter:hover{
    cursor: pointer;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid black;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 50px;
    left: 50px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  2.9% {
    top: 50px;
    left: 50px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  3% {
    top: 50px;
    left: 50px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100%{
    top: 0px;
    left: 0px;
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}


</style>