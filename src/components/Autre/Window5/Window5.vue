<template>
    <div class="window5-div">
        <!-- Animation from : https://codepen.io/wisearts/pen/ExZGrbZ -->

        <video class="video" playsinline="true" webkit-playsinline="true" preload="auto" muted="muted">
            <source src="@/assets/videos/win.mp4" type="video/mp4" />
        </video>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default {
    name: 'Window5',
    mounted() {

        /* Encoding is important!!!
        //--------------------------------
        // ffmpeg settings used:
        //--------------------------------

        ffmpeg -i input.mp4 -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4

        // scale filtergraph optional
        // ffmpeg docs: http://ffmpeg.org/ffmpeg.html

        */
        gsap.registerPlugin(ScrollTrigger);

        const coolVideo = document.querySelector("video");

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".window5-div",
                start: "top top",
                end: "bottom top",
                pin: true,                    // Stay on component during animations
                scrub: 1,
                // markers: true
            }
        });

        // wait until video metadata is loaded, so we can grab the proper duration before adding the onscroll animation. Might need to add a loader for loonng videos
        coolVideo.onloadedmetadata = function () {
            tl.to(coolVideo, { currentTime: coolVideo.duration });
        };

        // Dealing with devices
        function isTouchDevice() {
            return (
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
            );
        }
        if (isTouchDevice()) {
            coolVideo.play();
            coolVideo.pause();
        }


    },
}
</script>


<style scoped>
.window5-div {
    position: relative;
    width: 100%;
    height: 100lvh;
    overflow: hidden;

    .video {
        width: 100vw;
        height: 100lvh;
        object-fit: cover;
    }
}
</style>