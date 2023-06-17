<template>
    <v-footer id="footer-div" app bottom fixed padless>
        <v-col class="text-center" cols="12" >
            <v-row class="d-flex justify-space-around">
                <p class="text-subtitle-1"><a href="https://www.linkedin.com/in/charles-pichou/" target="_blank">LinkedIn</a></p>
                <p class="text-subtitle-1">2022 - {{ new Date().getFullYear() }}</p>
                <p class="text-subtitle-1"><a href="https://github.com/charl56" target="_blank">GitHub</a></p>
            </v-row>
        </v-col>
    </v-footer>
</template>
  

<script>  
  export default {
    name: 'AppFooter',
    props: {
    },
    created(){
    },
    mounted(){
    },
    data () {
        return {
        }
    },
    methods:{
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#footer-div{
    border-top: 1px solid black;
    background-color: #FFF2DC;
    height: 2em;
}

a{
    color: #2c3e50 !important;
    text-decoration: none !important;
}
p{
    margin-bottom: 0px !important;
}
</style>
  
  