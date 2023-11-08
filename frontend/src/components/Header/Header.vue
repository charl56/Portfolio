<template>
    <div id="header-div">
        <div class="marquee d-flex align-center">
            <div class="marquee--inner">
                <span class="d-flex justify-space-around">
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                  <p class="text-h3 font-weight-bold">Portfolio</p>
                </span>
                <span class="d-flex justify-space-around">
                  <p class="text-h3 font-weight-bold">Portfolio</p>
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
  position: fixed;
  height: 9vh;  
  width: 100%;
  border-bottom: 1.5px solid black;
  background-color: var(--background-color-1);
  z-index: 1006;
}
.marquee {
  height: 100%;
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
  
  