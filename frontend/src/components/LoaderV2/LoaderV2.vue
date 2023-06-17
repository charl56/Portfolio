<template>
    <div class="container" ref="container">
        <button class="btn" ref="btn" @click="onBtnClick">Bouton</button>
    </div>
</template>

<script>

export default {
    name: 'AppLoaderV2',
    created(){
    },
    mounted() {
        setInterval(() => {
        const containerRect = this.$refs.container.getBoundingClientRect();
        const btnRect = this.$refs.btn.getBoundingClientRect();

        const containerWidth = containerRect.width - btnRect.width;
        const containerHeight = containerRect.height - btnRect.height;

        const newLeft = Math.floor(Math.random() * containerWidth);
        const newTop = Math.floor(Math.random() * containerHeight);

        this.$refs.btn.style.left = newLeft + "px";
        this.$refs.btn.style.top = newTop + "px";
        }, 1000);
    },
    data () {
        return {
        }
    },
    methods:{
        onBtnClick() {
            console.log("Bouton cliqué!");
        },
    },
    computed: {
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid black;
}

.btn {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

