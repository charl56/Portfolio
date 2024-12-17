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
            delay: 4,
            _x: 0,
            _y: 0,
            endX: (window.innerWidth / 2),
            endY: (window.innerHeight / 2),
            cursorVisible: false,
            cursorEnlarged: false,
            dot: null,
            outline: null,
            observer: null
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
        this.setupEventListeners();
        this.setupMutationObserver();

    },

    methods: {
        setupMutationObserver() {
            // Create a MutationObserver to watch for new elements with cursor-hover class
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // Reattach event listeners to all cursor-hover elements
                        this.attachCursorHoverListeners();
                    }
                });
            });
            // Start observing the entire document with the configured parameters
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        attachCursorHoverListeners() {
            // Remove existing listeners first to prevent duplicates
            document.querySelectorAll('.cursor-hover').forEach((el) => {
                el.removeEventListener('mouseover', this.handleCursorHoverIn);
                el.removeEventListener('mouseout', this.handleCursorHoverOut);
            });

            // Add new listeners
            document.querySelectorAll('.cursor-hover').forEach((el) => {
                el.addEventListener('mouseover', this.handleCursorHoverIn);
                el.addEventListener('mouseout', this.handleCursorHoverOut);
            });
        },
        handleCursorHoverIn() {
            this.cursorEnlarged = true;
            this.toggleCursorSize();
        },
        handleCursorHoverOut() {
            this.cursorEnlarged = false;
            this.toggleCursorSize();
        },
        setupEventListeners() {
            // Attach initial hover listeners
            this.attachCursorHoverListeners();

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
                this.toggleCursorVisibility();

                if (window.innerWidth < 769) {
                    return;
                }

                // Position the dot
                this.endX = e.pageX;
                this.endY = e.pageY - window.scrollY;

                this.dot.style.top = this.endY + 'px';
                this.dot.style.left = this.endX + 'px';

                this.outline.style.top = this.endY + 'px';
                this.outline.style.left = this.endX + 'px';
            });

            // Hide/show cursor
            document.addEventListener('mouseenter', (e) => {
                this.cursorVisible = true;
                this.toggleCursorVisibility();
            });

            document.addEventListener('mouseleave', (e) => {
                this.cursorVisible = false;
                this.toggleCursorVisibility();
                this.dot.style.opacity = 0;
                this.outline.style.opacity = 0;
            });
        },


        toggleCursorSize() {
            if (window.innerWidth < 769) {
                return false;
            }

            if (this.cursorEnlarged) {
                this.dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            } else {
                this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        },
        animateDotOutline() {
            if (window.innerWidth < 769) {
                return;
            }

            this._x += (this.endX - this._x) / this.delay;
            this._y += (this.endY - this._y) / this.delay;
            this.outline.style.top = this._y + 'px';
            this.outline.style.left = this._x + 'px';

            requestAnimationFrame(this.animateDotOutline.bind(this));
        },
        toggleCursorVisibility() {
            if (this.cursorVisible && window.innerWidth > 769) {
                this.dot.style.opacity = 1;
                this.outline.style.opacity = 1;
            } else {
                this.dot.style.opacity = 0;
                this.outline.style.opacity = 0;
            }
        },
    },
    beforeDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        // Remove all event listeners
        document.querySelectorAll('.cursor-hover').forEach((el) => {
            el.removeEventListener('mouseover', this.handleCursorHoverIn);
            el.removeEventListener('mouseout', this.handleCursorHoverOut);
        });

        document.removeEventListener('mousedown');
        document.removeEventListener('mouseup');
        document.removeEventListener('mousemove');
        document.removeEventListener('mouseenter');
        document.removeEventListener('mouseleave');
    },
};
</script>


<style scoped>
.cursor-div {
    position: fixed;
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