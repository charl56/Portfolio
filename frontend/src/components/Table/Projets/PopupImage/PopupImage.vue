<template>
    <div v-if="open" @click.stop="closePopup()" class="div-popup-image d-flex flex-column justify-center align-center elevation-10">
        <div class="carousel-popup d-flex align-center justify-center mb-4" @click.stop="divCarousel()">
            <v-carousel class="d-flex justify-center" hide-delimiter-background show-arrows="hover">
                <v-carousel-item v-for="(media,index) in listMedia" class="carousel-popup-image rounded" width="80vw" :src="returnSrcImage(media.src)" :key="index">
                    <video v-if="media.type == 'video'" class="carousel-popup-video" controls>
                        <source :src="returnSrcImage(media.src)"> 
                    </video>
                </v-carousel-item>
            </v-carousel>
        </div>
    </div>   
</template>

<script>
import { eventBus } from '../../../../plugins/eventBus'


export default {
    name: 'AppPopupImages',
    created(){
        eventBus.on("openPopupImage", (data) => {
            this.open = true
            this.listMedia = data
        })
        document.addEventListener('keyup', (event) => {
            if(event.key == "Escape"){
                this.closePopup()
            }
        }, false);

    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
            open: false,
            listMedia: [],
        }
    },
    methods:{
        closePopup(){
            this.listMedia = []
            this.open = false
        },
        returnSrcImage(src){
            if(import.meta.env.DEV){
                return new URL('../../../../../images/' + src, import.meta.url).href   
            } else {
                return 'images/' + src   
            }
        },
        divCarousel(){
        }
    },
    computed: {
    }

}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.div-popup-image{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.7);
}
/* Images */
.carousel-popup{
    z-index: 2010;
    width: 80vw;
    height: 100%;
}.carousel-popup-image{
    width: auto;
    height: 100%;
}.carousel-popup-video{
    width: auto;
    height: 100%;
}

</style>
  
  