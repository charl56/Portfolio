<template>
    <div class="background-image">
        <h1>Credits, contact..</h1>
        <img src="@/assets/background/zoro.jpg" alt="">
    </div>
</template>

<script>

export default {
    name: 'End',
}
</script>


<style scoped>
.background-image {
    position: relative;
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;

    img {
        width: 50%;
    }

    @media (max-width: 768px) {
        img {
            width: 100%;
        }
    }

}
</style>