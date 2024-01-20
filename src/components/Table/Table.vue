<script setup>
const iconDl = new URL('../../assets/Icons/download.png', import.meta.url).href
const iconFR = new URL('../../assets/Icons/france.png', import.meta.url).href
const iconENG = new URL('../../assets/Icons/england.png', import.meta.url).href
</script>
<template>
  <div class="div-table">
    <div class="space-40vh"></div>

    <!-- Lottie animation -->
    <div class="div-scroll-down d-flex align-start justify-center">
      <div v-if="showLoffie" id="lottie-scroll-down"></div>
    </div>
    <!-- Scroll horizontal animation -->
    <div class="racesWrapper">
      <div class="races">
        <Images v-for="projet, index in appData" :key="index" :projet="projet" :id="index" />
      </div>
    </div>


    <!-- Popup open project -->
    <Popup />

    <div class="space-40vh d-flex">
      <!-- Download CV -->
      <div class="d-flex justify-center align-center div-post-header">
        <div>
          <v-img class="icon-post-header" @click="downloadCV()" :src="iconDl" :width="imageSize()" :height="imageSize()">
          </v-img>
        </div>
        <p :class="cvSize()">CV</p>
      </div>
      <!-- Drapeau chagement langue -->
      <div class="d-flex align-center div-post-header">
        <v-img v-if="langue == 'Fr'" class="icon-post-header flag" :src="iconFR" :width="imageSize()"
          :height="imageSize()" @click="toggleLanguage()"></v-img>
        <v-img v-else class="icon-post-header flag" :src="iconENG" :width="imageSize()" :height="imageSize()"
          @click="toggleLanguage()"></v-img>
      </div>
    </div>


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
  mounted() { // Lance la fonction au chargement de la page

    // Lottie animation
    bodymovin.loadAnimation({
      container: document.getElementById('lottie-scroll-down'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: new URL('../../assets/Json/scroll-down2.json', import.meta.url).href
    })
    this.showLoffie = false

    // GSAP hide/show loffie animation
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".div-scroll-down", {
      scrollTrigger: {
        trigger: ".div-scroll-down",                             // Where it declenche action
        toggleActions: "restart pause reverse pause",       // "list" of action to do
        start: "top top ",                             // Where trigger start : center of component, center of screen
        end: "bottom bottom",                                  // Where trigger end : bottom of component, top of screen            
        scrub: 1,                                           // Move every scroll
        onEnter: () => { },
        onLeave: () => {
          document.querySelector('.div-scroll-down').style.position = 'absolute';
          document.querySelector('.div-scroll-down').style.display = 'none';
        },
        onEnterBack: () => { },
        onLeaveBack: () => {
          document.querySelector('.div-scroll-down').style.position = 'fixed';
          document.querySelector('.div-scroll-down').style.display = '';
        },
      },
      opacity: 0,
      ease: "none"
    })

    const data = [dataFR[0], dataENG[0]]        // Variable qui est envoyé au composant 'loader', en Fr et Eng
    eventBus.emit("languageLoad", data);
    this.loadImages(dataFR[1])                  // Fonction qui charge les images



    if (window.outerWidth > 1200) {
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
        trigger: ".racesWrapper",
        start: "top 15%",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
      })
    }

  },
  data() {
    return {
      appData: '',        // Données affi chées
      other: dataENG,     // Autre langue
      langue: 'Fr',       // Langue actuelle
      loading: true,      // Chargement des images
      showLoffie: true,  // Show scroll animation
      percentage: 0,
      scroll: false,      // user pas encore scroll
      iconFlag: null,     // Icons
    }
  },
  methods: {
    toggleLanguage() {
      eventBus.emit('languageChange', this.langue)
      if (this.langue == 'Fr') {
        this.langue = 'Eng'
        this.appData = dataENG[1]
        // this.iconFlag = this.iconENG
      } else {
        this.langue = 'Fr'
        this.appData = dataFR[1]
        // this.iconFlag = this.iconFR
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
      for (const projet of data) {
        if (projet.photos1 != undefined) {
          for (const image of projet.photos1) {
            let img = new Image()
            if (import.meta.env.DEV) {
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
        if (projet.photos2 != undefined) {
          for (const image of projet.photos2) {
            // Seulement pour les images
            if (image.type == 'img') {
              let img = new Image()
              if (import.meta.env.DEV) {
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
      this.showLoffie = true
      this.appData = data
      // Attente de la fin du chargement de toutes les images
      Promise.all(promises).then(() => {
        // Event bus pour elenver barre de chargement
        eventBus.emit("dataLoad", true);
        this.loading = false
      }).catch(error => console.log(error))

    },
    async downloadCV() {
      try {
        console.log("sde")
        const reponse = await fetch(new URL('../../data/CV/' + this.langue + '.pdf', import.meta.url).href)
        const donnees = await reponse.blob()
        const url = URL.createObjectURL(donnees)
        const lien = document.createElement('a')
        lien.href = url
        lien.download = 'CV_PICHOU_Charles_' + this.langue + '.pdf'
        document.body.appendChild(lien)
        lien.click()
        document.body.removeChild(lien)
      } catch (erreur) {
        console.error(erreur)
      }
    },
    imageSize() {
      if (window.outerWidth < 400) {
        return '90'
      } else if (window.outerWidth < 600) {
        return '75'
      } else {
        return '30'
      }
    },
    titleProjectSize() {
      if (window.outerWidth < 400) {
        return 'text-h2'
      } else if (window.outerWidth < 600) {
        return 'text-h3'
      } else {
        return 'text-h5'
      }
    },
    cvSize() {
      if (window.outerWidth < 600) {
        return 'text-h3'
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
.div-table {
  flex-direction: column;
  overflow-x: hidden;
  margin: 0;
  background: var(--background-color-1);
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.div-table::-webkit-scrollbar {
  display: none;
}

/* GIF scroll down */
.div-scroll-down {
  z-index: 1001;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 500px;
}

#lottie-scroll-down {
  height: 45%;
  width: 45%;
}

/* Icons cv and language */
.div-post-header {
  height: auto;
  width: 50vw;
}

.icon-post-header {
  z-index: 1002;
}

.icon-post-header:hover {
  cursor: pointer;
  transform: scale(1.2);
}

/* ----------------------------------------------
 * Generated by Animista on 2023-11-8 9:40:48
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */
.flag {
  animation: swing-in-bottom-fwd 0.5s cubic-bezier(0.470, 0.000, 0.745, 0.715) 0.1s both;
}

@keyframes swing-in-bottom-fwd {
  0% {
    transform: rotateX(100deg);
    transform-origin: bottom;
    opacity: 0;
  }

  100% {
    transform: rotateX(0);
    transform-origin: bottom;
    opacity: 1;
  }
}

@media (min-width: 1200px) {

  /* GSAP Animation scroll horizontale */
  .racesWrapper {
    transform: rotate3d(0, 1, 1, 3deg);
  }

  .races {
    width: fit-content;
    display: flex;
    flex-wrap: nowrap;
  }

}

@media (max-width: 1199px) {
  .racesWrapper {
    transform: rotate3d(0, 0, 0, 0deg);
  }

  .races {
    display: flex !important;
    justify-content: center !important;
    flex-direction: column !important;
  }

  .space-40vh {
    height: 25vh;
  }
}

.space-20vh {
  height: 20vh;
}

.space-40vh {
  height: 40vh;
}
</style>