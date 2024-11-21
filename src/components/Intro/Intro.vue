<template>
    <div class="background-image">
        <img src="@/assets/background/zoro.jpg" alt="">
    </div>
</template>

<script>

export default {
    name: 'Intro',
}
</script>


<style scoped>
.background-image {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--second-color);

    display: flex;
    align-items: flex-end;
    justify-content: center;

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