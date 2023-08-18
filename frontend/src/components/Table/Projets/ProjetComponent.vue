<template>
    <div class="projet px-0 mx-0 my-0 justify-space-between">
        <div id="resizable" class="part left mr-2 pr-2" data-aos="fade-up-right" data-aos-delay="200" data-aos-anchor-placement="top-center">
            <v-carousel v-if="projet.hasOwnProperty('photos1')" cycle class="carousel-part d-flex justify-center" :show-arrows="setShowArrows(projet.photos1)" hide-delimiters >
                <v-carousel-item id="image-projet" v-for="(photo,index) in projet.photos1" class="rounded-e" :src="returnSrcImage(photo.src)" :key="index" :width="setWidth()" cover @click="openImages(projet)"> 
                </v-carousel-item>
            </v-carousel>
        </div>
        <div class="center px-2 d-flex flex-column" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
            <!-- Intro -->
            <p v-if="projet.hasOwnProperty('intro')" :class="textSize()" class="mb-3 mt-0 text-justify align-self-center">{{ projet.intro }}</p>
            <!-- Description -->
            <p :class="textSize()" class="mb-2 mt-3 text-justify" v-html="projet.description"></p>
            <!-- Liste des outils utilisés -->
            <p :class="textSize()" v-if="projet.hasOwnProperty('outils')" class="text-start mt-2 mb-0">{{ projet.outil }}</p>
            <ul v-for="outil, index in projet.outils" :key="index" class="d-flex justify-start pl-5">
                <li :class="outilSize()">{{ outil.name }}</li>
            </ul>
            <!-- Dates -->
            <p v-if="projet.hasOwnProperty('date')" :class="dateSize()" class="mt-10 mb-0 text-center font-italic align-self-end">{{projet.date}}</p>
            
        </div>
        <div class="part right ml-2 pl-2" data-aos="fade-up-left" data-aos-delay="800" data-aos-anchor-placement="top-center">
            <v-carousel v-if="projet.hasOwnProperty('photos2')" cycle class="d-flex justify-center" :show-arrows="setShowArrows(projet.photos2)" hide-delimiters >
                <v-carousel-item id="image-projet" v-for="(photo,index) in projet.photos2" class="rounded-s" :src="returnSrcImage(photo.src)"  :key="index" :width="setWidth()" cover @click="openImages(projet)">
                </v-carousel-item>
            </v-carousel> 
            <div v-else-if="projet.hasOwnProperty('video')">
                <v-carousel class="rounded d-flex justify-center" show-arrows="hover" hide-delimiters >
                    <v-carousel-item  v-for="(video,index) in projet.video" :key="index" :width="setWidth()">  
                        <video id="video-projet" controls>
                            <source :src="returnSrcImage(video.src)">
                        </video>
                    </v-carousel-item>
                </v-carousel>
            </div>
        </div>
    </div>   
</template>

<script>
import { eventBus } from '../../../plugins/eventBus'

export default {
    name: 'AppProjetComponent',
    components:{
    },
    created(){
    },
    props: {
        projet: {
            name: String,
            date: String,
            intro: String,
            description: String,
        },
        id: Number
    },
    mounted(){ // Lance la fonction au chargement de la page
    },
    data () {
        return {
        }
    },
    methods:{
        returnSrcImage(src){
            if(import.meta.env.DEV){
                return new URL('../../../../images/' + src, import.meta.url).href   
            } else {
                return 'images/' + src   
            }
        },
        setWidth(){
            let widthScreen = window.innerWidth
            let widthPart = document.getElementById('resizable')
            if(typeof widthPart == 'object' && widthPart != null){
                let value = parseInt((widthPart.offsetWidth*100)/widthScreen)+'vw'
                return value
            }
        },
        setShowArrows(data){
            if(JSON.stringify(data.length) > 1){
                return 'hover'
            } else {
                return false
            }
        },
        openImages(projet){
            let listAllMedia = []   // Liste avec toutes les photos/videos pour le popup
            if(projet.hasOwnProperty('photos1')){
                listAllMedia = listAllMedia.concat(projet.photos1)
            } if(projet.hasOwnProperty('photos2')){
                listAllMedia = listAllMedia.concat(projet.photos2)
            } if(projet.hasOwnProperty('video')){
                listAllMedia = listAllMedia.concat(projet.video)
            }
            eventBus.emit("openPopupImage", listAllMedia)
        },
        textSize(){
      // window.outerWidth < 400 ? return 'text-h4' : window.outerWidth < 600 ? return 'text-h4' : return 'text-h5'
            if(window.outerWidth < 400){
                return 'text-h4 mt-5 mx-10'
            } else if(window.outerWidth < 600){
                return 'text-h5 mx-10'
            } else {   
                return 'text-body-1' 
            }
        },
        outilSize(){
            if(window.outerWidth < 400){
                return 'text-h5'
            } else if(window.outerWidth < 600){
                return 'text-body-1'
            } else {   
                return 'text-body-2' 
            }
        },
        dateSize(){
            if(window.outerWidth < 400){
                return 'text-h6'
            } else if(window.outerWidth < 600){
                return 'text-subtitle-1'
            } else {   
                return 'text-subtitle-2' 
            }
        }
    },
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



.projet{
    width: 100vw;
    height: auto;
    display: flex;
    flex-direction: row;
}
.part{
    width: 33vw;
}.part:hover{
    cursor: pointer !important;
}.center{
    width: 34vw;
    height: 100%;
}
@media only screen and (max-width: 1000px) {
  .projet {
    display: flex !important;
    flex-direction: column !important;
  }
  .part, .center {
    width: 100vw;
  }
}

v-carousel-item:hover{
    cursor: pointer!important;
}
/* Display */
#image-projet{
    width: 100%;
    height: auto;
}
#video-projet{
    width: auto;
    height: 100%;
}


</style>
  
  