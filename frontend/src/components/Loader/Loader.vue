<template>
    <!-- Dialog d'attente de chargement -->
    <v-dialog v-model="open" persistent class="modal-loading my-0 mx-0 justify-center" fullscreen :scrim="false" v-bind:transition="getTransition()">
        <!-- Présentation -->
        <v-row class="my-0 d-flex align-end justify-center">
            <p class="px-3 py-1 loader-text" :class="titleSize()">{{ loaderData['welcome'] }}</p>
        </v-row>
        <!-- Présentation -->
        <v-row class="my-0 d-flex align-center justify-center">
            <div class="d-flex flex-column loader-text">
                <p class="px-3 py-1 text-center" :class="textSize()">{{ loaderData['presentation1'] }}</p>
                <p class="px-3 py-1 text-center" :class="textSize()">{{ loaderData['presentation2'] }}</p>
            </div>
        </v-row>
        <!-- Jeu -->
        <v-row class="my-0 d-flex align-start justify-center">
            <p v-if="loaded" @click="open = !open" class="px-3 py-1 btn-open loaded" :class="textSize()">{{ loaderData['loading2'] }}</p>
            <div v-else class="d-flex flex-column align-center">
                <p class="px-3 py-1 btn-open no-loaded" :class="textSize()">{{ percentage }}%</p>
            </div>
        </v-row>      
    </v-dialog>
</template>

<script>
import { eventBus } from "../../plugins/eventBus";

export default {
    name: 'AppLoader',
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
    z-index: 999 !important;
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

.btn-open:hover{
    cursor: pointer;
}


.btn-open{
    border-right: 2px solid black;
    border-left: 2px solid black;
    border-radius: 3px;
    animation-name: clignoter;
    animation-iteration-count: infinite;
    transition: none;
}.no-loaded{
    animation-duration: 3s;
}.loaded{
    animation-duration: 3s;
}
@keyframes clignoter {
  0%   { opacity:1; rotate: 0deg; }
  40%   {opacity:0.3; }
  100% { opacity:1; rotate: 360deg; transform: }
}
</style>

