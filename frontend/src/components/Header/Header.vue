<template>
    <div id="header-div">
        <div class="marquee">
            <div class="marquee--inner">
                <span class="d-flex justify-space-around">
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                </span>
                <span class="d-flex justify-space-around">
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                </span>
            </div>
        </div>
    </div>
</template>
  

<script>  
  export default {
    name: 'AppHeader'
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#header-div{
    border-bottom: 1px solid black;
}
.marquee {
  height: 3em;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
.marquee--inner {
  display: block;
  width: 200%;
  position: absolute;
  animation: marquee 10s linear infinite;
}

span {
  float: left;
  width: 50%;
}

@keyframes marquee {
  0% { right: 0; }
  100% { right: -100%; }
}
</style>
  
  