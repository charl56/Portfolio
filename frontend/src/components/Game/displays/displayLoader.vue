<template>
    <div class="loader mx-2 my-2 px-3 py-2 d-flex align-center">
        <v-progress-circular class="mr-2" color="white" :model-value="loaderValue"></v-progress-circular>
        <p class="text-h5 font-weight-bold">{{ remainBullets }} </p>
        <p class="text-h6 font-weight-bold">/ {{ loader * remainLoaders }}</p>
    </div>   
</template>

<script>

export default {
    name: 'AppProjetComponent',
    created(){
    }
    ,
    props: {
        remainBullets: Number,
        loader: Number,
        remainLoaders: Number,
        loadTimer: Number,
    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
            loaderValue: 0
        }
    },
    watch: {        // Listener sur une props, ici le nombre de balles restantes 
        remainBullets: function(val){
            // Si plus de balles, affiche chargement
            if(val == 0){
                this.loaderValue = 0                    // Valeur chargement à 0
                let wait = this.loadTimer / 10         // Divise le temps de chargement par 100, pour le loader (valeur de 0-100 )
                let loadInterval = setInterval(() => {                     // Incrément de 1 tous les loadTimer/100
                    this.loaderValue = this.loaderValue + 10
                    if(this.loaderValue == 100){         // Quand chargrment finis
                        clearInterval(loadInterval);        // On arrête la boucle 
                    }
                }, wait)      

            }
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
.loader{
    right: 0;
    bottom: 0;
    border-top: white 1px solid;
    border-bottom: white 1px solid;
}
p{
    color: white;
}




</style>