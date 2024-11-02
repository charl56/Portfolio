import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";

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

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.init_()
    }


    init_() {
        const width = this.container_.clientWidth;
        const height = this.container_.clientHeight;

        this.scene_ = new THREE.Scene();

        this.camera_ = new THREE.PerspectiveCamera(65, width / height, 1, 100);
        this.camera_.position.set(-8, 0, 0);
        this.camera_.lookAt(0, 0, 0);


        this.renderer_ = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer_.shadowMap.enabled = true;
        this.renderer_.setSize(width, height);
        this.renderer_.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer_.setAnimationLoop(this.animate);
        this.container_.appendChild(this.renderer_.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-15, 0, -15);
        this.scene_.add(light);


        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('scroll', this.onScroll);

        this.loadGLTFModel();

    }


    onWindowResize() {
        const width = this.container_.clientWidth;
        const height = this.container_.clientHeight;

        this.camera_.aspect = width / height;
        this.camera_.updateProjectionMatrix();

        this.renderer_.setSize(width, height);
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
                // model.rotation.set(0, 0, 0)
                model.rotation.set(-Math.PI/2, 0, Math.PI/2)
                // model.lookAt(0, 10, 0)
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
            z: scrollY * 0.025,
            duration: 0.2,
            ease: 'power2.out'
        });
    }

    animate() {
        const delta = clock.getDelta();

        if (this.mixer_) this.mixer_.update(delta);
        this.renderer_.render(this.scene_, this.camera_);
    }
}