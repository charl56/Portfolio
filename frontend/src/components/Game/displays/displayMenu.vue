<template>  
    <v-dialog v-model="gameStop" v-if="gameStop" persistent class="menu d-flex" style="opacity: 1">
        <v-row class="d-flex align-start justify-center mt-3">
            <p class="text-h5">Jeu en pause</p>
        </v-row>
        <v-row class="justify-center">
            <p class="text-h5"></p>
            <v-switch v-model="sound" :value="sound" label="Sond du jeu" color="success" @change="changeValue()" :true-value="true" :false-value="false" inset hide-details></v-switch>
        </v-row>
        <v-row class="justify-center mt-10">
            <p class="txt-h6">Appuiez de nouveau sur 'Echap' pour revenir en jeu</p>
        </v-row>
        <v-row class="justify-center mt-10">
            <v-btn class="btn-restart" variant="outlined" @click="restart()">Recommencer</v-btn>
        </v-row>
    </v-dialog> 
</template>

<script>
import { eventBus } from '../../../plugins/eventBus';

export default {
    name: 'AppProjetComponent',
    created(){
        // MAJ balles restantes
        eventBus.on('gameStop', (data) => {
            this.gameStop = data
        })
    }
    ,

    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
            gameStop: false,
            sound: false,
        }
    },
    methods:{
        changeValue(){
            eventBus.emit("isSound",this.sound)
        },
        restart(){
            eventBus.emit("restartGame",true)
        }
    },
    computed: {
    }

}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu{
    top: 0;
    left: 0;
    width: 60vw;
    height: 50vh;
    border-radius: 5px;
    background-color: rgb(218, 217, 217);
    position: fixed;
    z-index: 999;
}

.btn-restart:hover{
    color: aliceblue;
}
</style>