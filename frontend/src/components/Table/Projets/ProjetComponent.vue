<template>
    <div class="projet px-0 mx-0 my-0 justify-space-between">
        <v-col class="px-0 mx-0">
            <div id="resizable" class="part left mr-2" data-aos="fade-up-right" data-aos-delay="200" data-aos-anchor-placement="top-center">
                <v-carousel v-if="projet.hasOwnProperty('photos1')" cycle class="d-flex justify-center" :show-arrows="setShowArrows(projet.photos1)" hide-delimiters >
                    <v-carousel-item id="image-projet" v-for="(photo,index) in projet.photos1" class="rounded" :src="returnSrcImage(photo.src)" :key="index" :width="setWidth()" cover>         <!--  ???-->
                    </v-carousel-item>
                </v-carousel>
            </div>
        </v-col>
        <v-col class="px-0 mx-0">
            <div class="part center mr-0 px-2 d-flex flex-column" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
                <!-- Intro -->
                <p v-if="projet.hasOwnProperty('intro')" class="mb-3 mt-0 text-justify text-body-1 font-weight-medium align-self-center">{{ projet.intro }}</p>
                <!-- Description -->
                <p class="mb-2 mt-3 text-justify text-body-1 font-weight-medium" v-html="projet.description"></p>
                <!-- Liste des outils utilisés -->
                <p v-if="projet.hasOwnProperty('outils')" class="text-start text-body-1 mt-2 mb-0">{{ projet.outil }}</p>
                <ul v-for="outil, index in projet.outils" :key="index" class="d-flex justify-start pl-5">
                    <li class="text-body-2">{{ outil.name }}</li>
                </ul>
                <!-- Dates -->
                <p v-if="projet.hasOwnProperty('date')" class="mt-10 mb-0 text-center font-italic text-subtitle-2 align-self-end">{{projet.date}}</p>
                
            </div>
        </v-col>
        <v-col class="px-0 mx-0">
            <div class="part right ml-2" data-aos="fade-up-left" data-aos-delay="800" data-aos-anchor-placement="top-center">
                <v-carousel v-if="projet.hasOwnProperty('photos2')" cycle class="d-flex justify-center" :show-arrows="setShowArrows(projet.photos2)" hide-delimiters >
                    <v-carousel-item id="image-projet" v-for="(photo,index) in projet.photos2" class="rounded" :src="returnSrcImage(photo.src)"  :key="index" :width="setWidth()" cover>       <!-- cover ???-->
                    </v-carousel-item>
                </v-carousel> 
                <div v-else-if="projet.hasOwnProperty('video')">
                    <v-carousel class="rounded d-flex justify-center" show-arrows="hover" hide-delimiters >
                        <v-carousel-item  v-for="(video,index) in projet.video" :key="index" :width="setWidth()">       <!-- cover ???-->
                            <video id="video-projet" controls>
                                <source :src="returnSrcImage(video.src)">
                            </video>
                        </v-carousel-item>
                    </v-carousel>
                </div>
            </div>
        </v-col>
    </div>   
</template>

<script>

export default {
    name: 'AppProjetComponent',
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
    },
    computed: {
    }

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
}.right{
}.center{
    height: 100%;
}.left{
}
@media only screen and (max-width: 1000px) {
  .projet {
    display: flex !important;
    flex-direction: column !important;
  }
  .part {
    width: 100vw;
  }
}



#image-projet{
    width: 100%;
    height: auto;
}#video-projet{
    width: auto;
    height: 100%;
}


</style>
  
  