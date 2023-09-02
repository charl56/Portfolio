<template>
  <div class="d-flex div-table pt-1 mb-4">
    <v-row class="row-icon-language mt-2 px-8 justify-space-between">
      <!-- Download CV -->
      <div class="mx-6 px-2 pb-1 mt-2 d-flex align-center row-cv">
        <v-img class="icon-language" :src="iconDl" :width="imageSize()" :height="imageSize()"></v-img>
        <p :class="cvSize()" @click="downloadCV()">CV</p>
      </div>
      <!-- Drapeau chagement langue -->
      <div class="div-icon-language mx-6 mb-1 mt-2 d-flex align-center">
        <v-img class="icon-language" :src="iconFlag" :width="imageSize()" :height="imageSize()" @click="toggleLanguage()"></v-img>
      </div>
    </v-row>
    
    <v-row class="ma-0 pa-0">
      <!-- Affichage des projets -->
      <v-col cols="12" class="col-projets d-flex justify-center align-center flex-column px-0">
        <!-- Affichage des projets -->
        <v-row class="row-projets d-flex justify-center mb-15" v-for="projet, index in appData" :key="index">
            <!-- Nom du projet -->
            <p class="text-center font-weight-medium text-decoration-underline mt-10 mb-4 table-projet-name" :class="titleProjectSize()" data-aos="fade-up" data-aos-delay="100" data-aos-anchor-placement="center-bottom">{{ projet.name }}</p>
            <!-- Projet -->
            <ProjetComponent :projet="projet" :id="index"/>
          <!-- RESPONSIVE, POUR TELEPHONE APR EX... -->
        </v-row>
      </v-col>
    </v-row>
    <PopupImage />
  </div>
</template>

<script>
import ProjetComponent from './Projets/ProjetComponent.vue'
import PopupImage from './Projets/PopupImage/PopupImage.vue'
import dataFR from '../../data/appData/dataFR.json'
import dataENG from '../../data/appData/dataENG.json'

import { eventBus } from '../../plugins/eventBus'


export default {
  name: 'AppTable',
  components: {
    ProjetComponent,
    PopupImage,
  }
  ,
  created(){
    this.iconFlag = new URL('../../assets/Icons/france.png', import.meta.url).href
    this.iconFR = new URL('../../assets/Icons/france.png', import.meta.url).href
    this.iconENG = new URL('../../assets/Icons/england.png', import.meta.url).href
    this.iconDl = new URL('../../assets/Icons/download.png', import.meta.url).href
  },
  mounted(){ // Lance la fonction au chargement de la page
    const data = [dataFR[0], dataENG[0]]        // Variable qui est envoyé au composant 'loader', en Fr et Eng
    eventBus.emit("languageLoad", data);
    this.loadImages(dataFR[1])                  // Fonction qui charge les images

    

  },
  data () {
    return {
      appData: '',        // Données affi chées
      other: dataENG,     // Autre langue
      langue: 'Fr',       // Langue actuelle
      iconFR: '',         // Icons
      iconENG: '',
      iconFlag: '',
      iconDl: '',
      loading: true,      // Chargement
      percentage: 0,    
      // duck: 0,            // Points au tire
      // duckInterval: ''    // SetInterval and stop
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
<style>
/* Div total */
.div-table{
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}.div-table::-webkit-scrollbar {
  display: none;
}
/* CV */
.row-cv{
  border: 1px solid black;
  border-radius: 5px;
}.row-cv:hover{
  cursor: pointer;
  transform: scale(1.1);
}
/* Icon language */
.row-icon-language{
  width: 100%;
}.div-icon-language{
  z-index: 999;
  width: auto;
}.icon-language{
  width: auto;
  height: auto;
}
.icon-language:hover{
  cursor: pointer;
}
/* Affichage des projets */
.col-projets{
  margin-right: auto;
  margin-left: auto;
}
.row-projets{
  margin-right: auto;
  margin-left: auto;
  width: 100vw;
}
/* Nom des projets */
.table-projet-name:hover{
  font-size: 2em !important;
  cursor: none;
}


</style>

<!-- HTML -->
<!-- <button ref="duck" class="duck mx-0 px-0" :width="60" :height="60">
  <v-img :src="getDuckImg()" width="60" height="60" @click="onDuckClick()" class=" px-2 py-2"></v-img>
</button> -->
<!-- <div v-if="duck != 0" class="mx-6 px-2 py-1 d-flex align-center row-cv">
  <p class="text-h4">Score : {{  duck }}</p>
</div> -->
<!-- Mounted -->
<!-- this.duckInterval = setInterval(() => {                         // Affiche le canard
      const containerRect = this.$refs.table.getBoundingClientRect();
      const btnRect = this.$refs.duck.getBoundingClientRect();

      const containerWidth = containerRect.width - btnRect.width;
      const containerHeight = containerRect.height - btnRect.height;

      const newLeft = Math.floor(Math.random() * containerWidth);
      const newTop = Math.floor(Math.random() * containerHeight);

      this.$refs.duck.style.left = newLeft + "px";
      this.$refs.duck.style.top = newTop + "px";
    }, 2000); -->
<!-- Methods -->
 <!-- getDuckImg(){
      return new URL('../../assets/Icons/duck.png', import.meta.url).href
    },
    onDuckClick(){
      this.duck ++
      if(this.duck == 5 || this.duck == 10){
        if(window.outerWidth < 700){
          alert("Vous devez être sur un ordinateur pour continuer")
        } else {
          if(confirm("Passez en mode plein écran (F11), puis appuyer sur 'ok'")){
            this.duck = 0
            location.href = process.env.VITE_FRONT_URL + "zombie/"
            clearInterval(this.duckInterval)
          }
        }
      }
    }, -->
<!-- CSS -->
<!-- .duck {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 998;
}.duck:hover{
  cursor: url(../../assets/Icons/viseur_black.png) 15 15, auto;
} -->