import * as THREE from 'three';
import { gsap } from "gsap";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const clock = new THREE.Clock();

export class ObjectVisualisation {
    constructor(container) {
        this.container_ = container;
        this.camera_ = null;
        this.scene_ = null;
        this.renderer_ = null;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.init_();
    }

    init_() {
        const width = this.container_.clientWidth;
        const height = this.container_.clientHeight;

        this.scene_ = new THREE.Scene();

        this.camera_ = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        this.camera_.position.set(0, 3, 6);
        this.camera_.lookAt(0, 0, 0);

        this.renderer_ = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer_.shadowMap.enabled = true;
        this.renderer_.setSize(width, height);
        this.renderer_.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer_.setAnimationLoop(this.animate);
        this.container_.appendChild(this.renderer_.domElement);

        this.setupScene();

        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('scroll', this.onScroll);
    }

    setupScene() {
        // 3d model
        this.loadGLTFModel()

        // Sphere
        // const geometry = new THREE.SphereGeometry(2, 64, 64);
        // const material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("../../../../../images/Textures/earthmap.jpg") });
        // this.sphere_ = new THREE.Mesh(geometry, material);
        // this.sphere_.rotation.z = Math.PI / 7.8;    // 23 degres
        // this.sphere_.castShadow = true;
        // this.sphere_.receiveShadow = true;
        // this.scene_.add(this.sphere_);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
        directionalLight.position.set(1, 0, 0.25);
        directionalLight.castShadow = true;
        this.scene_.add(directionalLight);

        // Ambient light
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene_.add(light);


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

            loader.load("../../../../../images/model/scene.gltf", (gltf) => {
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

                this.mixer_ = new THREE.AnimationMixer(model);
                this.mixer_.clipAction(gltf.animations[0]).play();

                model.position.set(0, 0, 0);
                model.scale.set(1.5, 1.5, 1.5);
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
            y: scrollY * 0.003,
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