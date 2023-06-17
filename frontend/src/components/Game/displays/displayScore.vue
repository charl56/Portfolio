<template>
    <div class="score d-flex align-center justify-center">
        <p class="text-h6 p-score px-6 py-0">Score : {{ score }}</p>
    </div>   
</template>

<script>

export default {
    name: 'AppProjetComponent',
    created(){
    }
    ,
    props: {
        score: Number,
    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {

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
}
.p-score{
    background-color: rgb(169, 169, 169);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
</style>