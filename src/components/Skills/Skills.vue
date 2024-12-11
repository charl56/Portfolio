<template>
    <div class="div-skills">
        <div class="div-skills__title">
            <p>Compétences</p>
        </div>
        <div class="div-skills__content">
            <p>Déso j'ai pas eu le temps de finir, je fais de l'argent</p>
        </div>
        <!-- <h1>OUai les compétences</h1>
        <p>Web (front-back)</p>
        <p>Serveur</p>
        
        <p>Android</p> -->
    </div>
</template>

<script>

export default {
    name: 'Skills',
}
</script>


<style scoped>
.div-skills {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.div-skills__title{
    height: 10vh;
    width: 100%;

    p {
        font-size: 4em;
        color: white;
    }
}

.div-skills__content{
    height: 90vh;
    width: 100%;

    p {
        font-size: 2em;
        color: white;
    }
}
</style>