<template>
    <!-- Inspiration => Cursor : https://codepen.io/chriscoyier/pen/xxoYqjQ -->
    <div class="cursor-div">
        <div class="cursor-dot-outline"></div>
        <div class="cursor-dot"></div>
    </div>
</template>


<script>
export default {
    name: 'Cursor',
    data() {
        return {
            delay: 10,
            _x: 0,
            _y: 0,
            endX: (window.innerWidth / 2),
            endY: (window.innerHeight / 2),
            cursorVisible: true,
            cursorEnlarged: false,
            dot: null,
            outline: null,
        }
    },
    mounted() {


        // Set up element sizes
        this.dot = document.querySelector('.cursor-dot');
        this.outline = document.querySelector('.cursor-dot-outline');

        this.dotSize = this.dot.offsetWidth;
        this.outlineSize = this.outline.offsetWidth;

        this.animateDotOutline();
        this.toggleCursorVisibility();
        this.addEventListener();

    },

    methods: {
        toggleCursorSize() {

            if (this.cursorEnlarged) {
                this.dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            } else {
                this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        },
        animateDotOutline() {

            this._x += (this.endX - this._x) / this.delay;
            this._y += (this.endY - this._y) / this.delay;
            this.outline.style.top = this._y + 'px';
            this.outline.style.left = this._x + 'px';

            requestAnimationFrame(this.animateDotOutline.bind(this));
        },
        toggleCursorVisibility() {

            if (this.cursorVisible) {
                this.dot.style.opacity = 1;
                this.outline.style.opacity = 1;
            } else {
                this.dot.style.opacity = 0;
                this.outline.style.opacity = 0;
            }
        },
        addEventListener() {

            // Anchor hovering
            document.querySelectorAll(['.cursor-hover', 'button', 'a']).forEach((el) => {   // Ajouter => et enlever 'function' avant le (e) permet de conserver le contexte this
                el.addEventListener('mouseover', (e) => {
                    this.cursorEnlarged = true;
                    this.toggleCursorSize();
                });
                el.addEventListener('mouseout', (e) => {
                    this.cursorEnlarged = false;
                    this.toggleCursorSize();
                });
            });

            // Click events
            document.addEventListener('mousedown', (e) => {
                this.cursorEnlarged = true;
                this.toggleCursorSize();
            });
            document.addEventListener('mouseup', (e) => {
                this.cursorEnlarged = false;
                this.toggleCursorSize();
            });

            // Move cursor
            document.addEventListener('mousemove', (e) => {
                // Show the cursor
                this.cursorVisible = true;
                this.toggleCursorSize();

                // Position the dot
                this.endX = e.pageX;
                this.endY = e.pageY;

                this.dot.style.top = this.endY + 'px';
                this.dot.style.left = this.endX + 'px';

                this.outline.style.top = this.endY + 'px';
                this.outline.style.left = this.endX + 'px';
            });


            // Hide/show cursor
            document.addEventListener('mouseenter', (e) => {
                this.cursorVisible = true;
                this.toggleCursorVisibility();
                this.dot.style.opacity = 1;
                this.outline.style.opacity = 1;
            });

            document.addEventListener('mouseleave', (e) => {
                this.cursorVisible = false;
                this.toggleCursorVisibility();
                this.dot.style.opacity = 0;
                this.outline.style.opacity = 0;
            });
        },
    },
    beforeDestroy() {
        // Retirer les écouteurs sur .cursor-hover et les boutons
        document.querySelectorAll('.cursor-hover, button, a').forEach((el) => {
            el.removeEventListener('mouseover');
            el.removeEventListener('mouseout');
        });

        // Retirer les écouteurs de document
        document.removeEventListener('mousedown', document.handleMouseDown);
        document.removeEventListener('mouseup', document.handleMouseUp);
        document.removeEventListener('mousemove', document.handleMouseMove);
        document.removeEventListener('mouseenter', document.handleMouseEnter);
        document.removeEventListener('mouseleave', document.handleMouseLeave);
    },
};
</script>


<style scoped>
.cursor-div {
    position: absolute;
    top: 0;
    z-index: 1000;
}

.cursor-dot,
.cursor-dot-outline {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.cursor-dot {
    width: 8px;
    height: 8px;
    background-color: var(--cursor-first);
}

.cursor-dot-outline {
    width: 40px;
    height: 40px;
    background-color: var(--cursor-second);
}
</style>