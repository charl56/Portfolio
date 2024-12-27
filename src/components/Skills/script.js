import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

export class Models3DVisualisation {
    constructor(modelPath, container) {
        this.modelPath_ = modelPath;
        this.container_ = container;
        this.camera_ = null;
        this.controls_ = null;
        this.scene_ = null;
        this.renderer_ = null;
        this.model_ = null;

        this.width_ = 0;
        this.height_ = 0;
        this.rotationModelX_ = 0;
        this.rotationModelY_ = 0;
        this.rotationModelZ_ = 0;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.init_()
    }


    init_() {
        this.width_ = this.container_.clientWidth;
        this.height_ = this.container_.clientHeight;

        this.rotationModelX_ = Math.PI / 8;
        this.rotationModelY_ = 0;
        this.rotationModelZ_ = Math.PI;

        if (this.container_.clientWidth < 768) {
            this.width_ = this.container_.clientWidth * 0.6;
            this.height_ = this.container_.clientHeight * 0.6;

            this.rotationModelX_ = Math.PI / 6;

        }

        this.scene_ = new THREE.Scene();

        this.camera_ = new THREE.PerspectiveCamera(65, this.width_ / this.height_, 1, 100);
        this.camera_.position.set(-15, 0, 0);
        this.camera_.lookAt(0, 0, 0);


        this.renderer_ = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer_.shadowMap.enabled = true;
        this.renderer_.setSize(this.width_, this.height_);
        this.renderer_.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer_.setAnimationLoop(this.animate);
        this.container_.appendChild(this.renderer_.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-15, 0, -15);
        this.scene_.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Intensité 0.5
        this.scene_.add(ambientLight);

        this.controls_ = new OrbitControls(this.camera_, this.renderer_.domElement);
        this.controls_.enableZoom = false; // Désactive le zoom avec la molette


        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('scroll', this.onScroll);

        this.loadGLTFModel();

    }


    onWindowResize() {
        this.width_ = this.container_.clientWidth;
        this.height_ = this.container_.clientHeight;

        this.rotationModelX_ = Math.PI / 8;

        if (this.container_.clientWidth < 768) {
            this.width_ = this.container_.clientWidth * 0.6;
            this.height_ = this.container_.clientHeight * 0.6;

            this.rotationModelX_ = Math.PI / 6;

        }


        this.camera_.aspect = this.width_ / this.height_;
        this.camera_.updateProjectionMatrix();

        this.renderer_.setSize(this.width_, this.height_);
    }


    loadGLTFModel() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();


            loader.load(this.modelPath_, (gltf) => {
                const model = gltf.scene;

                if (this.model_) {
                    this.scene_.remove(this.model_);
                    this.mixer_ = null;
                }

                this.model_ = model;

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });


                model.position.set(0, 0, 0);
                model.rotation.set(this.rotationModelX_, this.rotationModelY_, this.rotationModelZ_);
                this.scene_.add(model);

                resolve();
            },
                undefined,
                (error) => {
                    console.error(error);
                    reject(error);
                }
            );
        });
    }

    onScroll() {
        if (this.model_ === undefined) return;

        const scrollY = window.scrollY;
        gsap.to(this.model_.rotation, {
            z: scrollY * 0.008 + this.rotationModelZ_,
            duration: 1,
            ease: 'power2.out',
        });
    }

    animate() {
        const delta = clock.getDelta();

        if (this.mixer_) this.mixer_.update(delta);
        this.renderer_.render(this.scene_, this.camera_);
    }
}