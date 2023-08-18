<template>
    <v-footer class="pa-0" id="footer-div" app bottom fixed padless>
        <v-col class="text-center" cols="12" >
            <v-row class="d-flex justify-space-around">
                <p :class="footerSIze()"><a class="px-1 py-0" href="https://www.linkedin.com/in/charles-pichou/" target="_blank">LinkedIn</a></p>
                <p :class="footerSIze()">2022 - {{ new Date().getFullYear() }}</p>
                <p :class="footerSIze()"><a class="px-1 pa-0" href="https://github.com/charl56" target="_blank">GitHub</a></p>
            </v-row>
        </v-col>
    </v-footer>
</template>
  

<script>  
  export default {
    name: 'AppFooter',
    methods:{
        footerSIze(){
            if(window.outerWidth < 400){
                return 'text-h2 py-1'
            } else if(window.outerWidth < 600){
                return 'text-h3'
            } else {   
                return 'text-subtitle-1' 
            }
        }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#footer-div{
    border-top: 1px solid black;
    background-color: var(--background-color-1);
    height: min-content;
}

a{
    color: #2c3e50 !important;
    text-decoration: none !important;
}a:hover{
    cursor: pointer!important;
    border-radius: 5px;
    background-color: #b7bdc4;
}
p{
    margin-bottom: 0px !important;
}
</style>
  
  