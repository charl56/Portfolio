<template>
    <!-- Dialog d'attente de chargement -->
    <v-dialog v-model="open" persistent class="modal-loading my-0 mx-0 justify-center" fullscreen :scrim="false" v-bind:transition="getTransition()">
        <!-- Présentation -->
        <v-row class="my-0 d-flex align-end justify-center">
            <p class="text-h5 px-3 py-1 loader-text">{{ loaderData['welcome'] }}</p>
        </v-row>
        <!-- Présentation -->
        <v-row class="my-0 d-flex align-center justify-center">
            <div class="d-flex flex-column loader-text">
                <p class="text-h5 px-3 py-1 text-center">{{ loaderData['presentation1'] }}</p>
                <p class="text-h5 px-3 py-1 text-center">{{ loaderData['presentation2'] }}</p>
            </div>
        </v-row>
        <!-- Jeu -->
        <v-row class="my-0 d-flex align-start justify-center">
            <p v-if="loaded" @click="open = !open" class="text-h5 px-3 py-1 btn-open loaded">{{ loaderData['loading2'] }}</p>
            <div v-else class="d-flex flex-column align-center">
                <p class="text-h5 px-3 py-1 btn-open no-loaded" >{{ loaderData['loading1'] }}</p>
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
        // eventBus.on('progressValue', (data) => {
        //     this.percentage = data
        //     console.log(this.percentage)
        // });
    },
    mounted(){ // Lance la fonction au chargement de la page

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
        }
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
    background-color: #FFF2DC !important;
    overflow: hidden;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}.modal-loading ::selection{    /* Surlignage du texte */
  background-color: #FFF2DC;
  color: #7eb3e8;
}.modal-loading ::-moz-selection{   /* Surlignage du texte */
  background-color: #FFF2DC;
  color: #2c3e50;
}

.btn-open:hover{
    cursor: pointer;
}


.btn-open, .loader-text{
    border-right: 1px solid black;
    border-left: 1px solid black;
    border-radius: 3px;
    animation-name: clignoter;
    animation-iteration-count: infinite;
    transition: none;
}.no-loaded{
    animation-duration: 1s;
}.loaded{
    animation-duration: 2s;
}
@keyframes clignoter {
  0%   { opacity:1; }
  40%   {opacity:0; }
  100% { opacity:1; }
}
</style>

