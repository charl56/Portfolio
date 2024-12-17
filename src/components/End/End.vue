<template>
    <div class="end-div">
        <div class="end-div__contact">
            <a href="https://github.com/charl56" target="_blank" rel="noopener noreferrer">Github</a>
            <p @mouseover="onHoverText">{{ text }}</p>
            <a href="https://www.linkedin.com/in/charles-pichou/" target="_blank" rel="noopener noreferrer">Linkedin</a>
        </div>
        <img src="@/assets/background/zoro.webp" alt="">
    </div>
</template>

<script>

export default {
    name: 'End',
    data() {
        return {
            text: "©2024 — All rights reserved",
            originalText: "©2024 — All rights reserved",
            shuffledText: "",
            isAnimating: false,
            intervalId: null,
        }
    },
    methods: {
        onHoverText() {
            if (!this.isAnimating) {
                this.shuffleAndReorganize();
            }
        },
        shuffleAndReorganize(textType) {
            this.isAnimating = true;
            // Shuffle instant
            this.shuffleText(textType);

            // Reorganize during 1 sec
            let index = 0;
            const originalText = this.originalText;
            const intervalId = setInterval(() => {
                if (index < originalText.length) {
                    this.text = originalText.slice(0, index + 1) + this.shuffledText.slice(index + 1);
                    index++;
                } else {
                    clearInterval(this.intervalId);
                    this.isAnimating = false;
                }
            }, 1000 / originalText.length);

            this.intervalId = intervalId;
        },
        shuffleText() {
            const shuffled = this.text.split('').sort(() => 0.5 - Math.random()).join('');
            this.shuffledText = shuffled;
            this.text = shuffled;
        },
    }
}
</script>


<style scoped>
.end-div {
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

        .end-div__contact {
            width: 100%;
        }
    }
}

.end-div__contact {
    display: flex;
    width: 50%;
    justify-content: space-around;
    font-size: large;

    p {
        text-align: center;
    }
}
</style>