<template>
  <div class="div-table">
      <!-- Download CV
      <div class="mx-6 px-2 pb-1 mt-2 d-flex align-center row-cv">
        <v-img class="icon-language" :src="iconDl" :width="imageSize()" :height="imageSize()"></v-img>
        <p :class="cvSize()" @click="downloadCV()">CV</p>
      </div>
       Drapeau chagement langue
      <div class="div-icon-language mx-6 mb-1 mt-2 d-flex align-center">
        <v-img class="icon-language" :src="iconFlag" :width="imageSize()" :height="imageSize()" @click="toggleLanguage()"></v-img>
      </div> -->

    <div class="space-40vh lightBG"></div>
    <!-- Lottie animation -->
    <div v-if="!scroll" class="div-scroll-down d-flex align-start justify-center">
      <div id="lottie-scroll-down"></div>
    </div>
    <!-- Scroll horizontal animation -->
    <div class="racesWrapper">
      <div class="races">
        <Images v-for="projet, index in appData" :key="index" :projet="projet" :id="index"/>
      </div>
    </div>

    <div class="space-20vh lightBG"></div>

    <Popup />

  </div>
</template>

<script>
// Data
import dataFR from '../../data/appData/dataFR.json'
import dataENG from '../../data/appData/dataENG.json'
// Events
import { eventBus } from '../../plugins/eventBus';
import '../../plugins/body-movin'
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Component
import Images from './Images/Images.vue'
import Popup from './Images/Popup/Popup.vue'

export default {
  name: 'AppTable',
  components: {
    Images,
    Popup,
  },
  mounted(){ // Lance la fonction au chargement de la page
    const data = [dataFR[0], dataENG[0]]        // Variable qui est envoyé au composant 'loader', en Fr et Eng
    eventBus.emit("languageLoad", data);
    this.loadImages(dataFR[1])                  // Fonction qui charge les images

    // Cache lottie scroll down
    window.addEventListener('scroll', (e) => {
      setTimeout(() => {
        this.scroll = true
      }, 500)
    }, false)
    // Lottie animation
    bodymovin.loadAnimation({
      container: document.getElementById('lottie-scroll-down'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: new URL('../../assets/Json/scroll-down2.json', import.meta.url).href
    })


    // Animation scroll horizontale
    gsap.registerPlugin(ScrollTrigger);
    const races = document.querySelector(".races");

    function getScrollAmount() {
      let racesWidth = races.scrollWidth;
      return -(racesWidth - window.innerWidth);
    }

    const tween = gsap.to(races, {
      x: getScrollAmount,
      duration: 3,
      ease: "none",
    });


    ScrollTrigger.create({
      trigger:".racesWrapper",
      start:"top 15%",
      end: () => `+=${getScrollAmount() * -1}`,
      pin:true,
      animation:tween,
      scrub:1,
      invalidateOnRefresh:true
    })

  },
  data () {
    return {
      appData: '',        // Données affi chées
      other: dataENG,     // Autre langue
      langue: 'Fr',       // Langue actuelle
      loading: true,      // Chargement
      percentage: 0,    
      scroll: false,     // user pas encore scroll
    }
  },
  methods:{
    toggleLanguage(){
      eventBus.emit('languageChange', this.langue)
      if(this.langue == 'Fr'){
        this.langue = 'Eng'
        this.appData = dataENG[1]
        this.iconFlag = this.iconENG
      } else {
        this.langue = 'Fr'
        this.appData = dataFR[1]
        this.iconFlag = this.iconFR
      }
    },
    calculateTotalImages(data) {
      let totalImages = 0;
      for (const projet of data) {
        if (projet.photos1 != undefined) {
          totalImages += projet.photos1.length;
        }
        if (projet.photos2 != undefined) {
          totalImages += projet.photos2.filter(image => image.type === 'img').length;
        }
      }
      return totalImages;
    },
    loadImages(data) {
      // Récupération des projets depuis le fichier JSON
      let progress = 0; // progression du chargement des images
      this.percentage = 0;
      const totalImages = this.calculateTotalImages(data); // Définissez cette fonction pour calculer le nombre total d'images

      let promises = []
      for(const projet of data){
        if(projet.photos1 != undefined){
          for(const image of projet.photos1){
            let img = new Image()
            if(import.meta.env.DEV){
              img.src = new URL('../../../images/' + image.src, import.meta.url).href
            } else {
              img.src = 'images/' + image.src
            }            
            // Chargement des photos, pourcentage
            promises.push(
              new Promise((resolve, reject) => {
                img.onload = () => {
                  progress++;
                  this.percentage = (progress / totalImages) * 100;
                  eventBus.emit('progressValue', this.percentage)
                  resolve();
                };
                img.onerror = reject;
              })
            );
          }
        }
        if(projet.photos2 != undefined){
          for(const image of projet.photos2){
            // Seulement pour les images
            if(image.type == 'img'){
              let img = new Image()
              if(import.meta.env.DEV){
                img.src = new URL('../../../images/' + image.src, import.meta.url).href
              } else {
                img.src = 'images/' + image.src
              }
              // Chargement des photos, pourcentage
              promises.push(
                new Promise((resolve, reject) => {
                  img.onload = () => {
                    progress++;
                    this.percentage = (progress / totalImages) * 100;
                    eventBus.emit('progressValue', this.percentage)
                    resolve();
                  };
                  img.onerror = reject;
                })
              );
            }
          }
        }
      }
      this.appData = data
      // Attente de la fin du chargement de toutes les images
      Promise.all(promises).then(() => {
        // Event bus pour elenver barre de chargement
        eventBus.emit("dataLoad", true);
        this.loading = false
      }).catch(error => console.log(error))
    },
    async downloadCV(){
      try {
        const reponse = await fetch(new URL('../../data/CV/'+this.langue+'.pdf', import.meta.url).href)
        const donnees = await reponse.blob()
        const url = URL.createObjectURL(donnees)
        const lien = document.createElement('a')
        lien.href = url
        lien.download = 'CV_PICHOU_Charles_'+this.langue+'.pdf'
        document.body.appendChild(lien)
        lien.click()
        document.body.removeChild(lien)
      } catch (erreur) {
        console.error(erreur)
      }
    },
    imageSize(){
      if(window.outerWidth < 400){
          return '90'
      } else if(window.outerWidth < 600){
          return '75'
      } else {   
          return '30' 
      }
    },
    titleProjectSize(){
      if(window.outerWidth < 400){
          return 'text-h2'
      } else if(window.outerWidth < 600){
          return 'text-h3'
      } else {   
          return 'text-h5' 
      }
    },
    cvSize(){
      if(window.outerWidth < 600){
          return 'text-h4'
      } else {   
          return 'text-h5' 
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Div total */
.div-table{
  flex-direction: column;
  overflow-x: hidden;
  margin:0;
	background:var(--background-color-1);
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}.div-table::-webkit-scrollbar {
  display: none;
}

/* GIF scroll down */
.div-scroll-down{
  z-index: 1001;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0px;
}#lottie-scroll-down{
  height: 45%;
  width: 45%;
}

/* GSAP Animation scroll horizontale */
.races {
	width:fit-content;
	display:flex;
	flex-wrap:nowrap;
}
.lightBG {
	background: var(--background-color-1);
}
.space-20vh {
	height:20vh;
}

.space-40vh {
	height:40vh;
}
</style>