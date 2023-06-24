<template>
    <div v-if="!playerDeath" class="score d-flex align-center justify-center">
        <p class="text-h6 p-score px-6 py-0">Score : {{ score }}</p>
    </div>   
    <div v-else class="death-score mt-7 d-flex align-start justify-center">
        <p class="p-death-score px-6 py-0">Score : {{ score }}</p>
    </div>  
</template>

<script>
import { eventBus } from '../../../plugins/eventBus';


export default {
    name: 'AppProjetComponent',
    created(){
        eventBus.on("playerDeath", () => {
            this.playerDeath = true
        })
    }
    ,
    props: {
        score: Number,
    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
            playerDeath: false
        }
    },
    methods:{

    },
    computed: {
    }

}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.score{
    top: 0;
    width: 100%;
}.death-score{
    left: 0;
    top: 0;
    position: fixed;
    height: 50%;
    width: 100%;
}
.p-score{
    background-color: rgb(169, 169, 169);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}.p-death-score{
    background-color: rgb(169, 169, 169);
    border-radius: 10px;
    font-size: 200%;
    animation-name: changeSize;
    animation-iteration-count: infinite;
    transition: none;
    animation-duration: 1.5s;
}
@keyframes changeSize {
  0%   { font-size: 200%; }
  40%   { font-size: 220%; }
  100% { font-size: 200%; }
}

</style>