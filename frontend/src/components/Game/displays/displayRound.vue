<template>
    <div class="round d-flex">
        <div class="round-img">
            <v-img cover :src="firstDigitImg"></v-img>
        </div>
        <div class="round-img">
            <v-img cover :src="secondDigitImg"></v-img>
        </div>        
    </div>   
</template>

<script>

import { eventBus } from '../../../plugins/eventBus'

export default {
    name: 'AppProjetComponent',
    created(){
        // MAJ round number
        eventBus.on('roundNumber', (data) => {
            this.round = data.toString()
            // Affiche le numero de la manche 
            this.setRoundDigit()
        })
    }
    ,
    props: {
    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
            round: "",
            firstDigit: "",         // Premier chiffre
            firstDigitImg: null,    // Image premier chiffre
            secondDigit: "",
            secondDigitImg: null,
        }
    },
    methods:{
        setRoundDigit(){
            // Si 1 ou 2 chiffre dans le nombre de la manche
            if(this.round.length == 1){
                this.firstDigitImg = new URL('../../../assets/Game/Round_'+this.round[0]+'.png', import.meta.url).href
            } else {
                this.firstDigitImg = new URL('../../../assets/Game/Round_'+this.round[0]+'.png', import.meta.url).href
                this.secondDigitImg = new URL('../../../assets/Game/Round_'+this.round[1]+'.png', import.meta.url).href
            }


            
        }
    },
    computed: {
    }

}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.round{
    left: 0;
    bottom: 0;
    position: fixed;
}

.round-img{
    width: 3vw;
}



</style>