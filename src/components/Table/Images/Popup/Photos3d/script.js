import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const clock = new THREE.Clock();

export class PhotoVisualisation {
    constructor(modelPath, container, photos, onProgress) {
        this.modelPath_ = modelPath;
        this.container_ = container;
        this.photos_ = photos;
        this.camera_ = null;
        this.controls_ = null;
        this.scene_ = null;
        this.renderer_ = null;
        this.mixer_ = null;
        this.model_ = null;
        this.onProgress_ = onProgress;
        this.isDragging_ = false;

        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.init_();
    }

    init_() {
        const width = this.container_.clientWidth;
        const height = this.container_.clientHeight;

        this.scene_ = new THREE.Scene();
        this.scene_.background = new THREE.Color(0xf5f9ff);

        this.camera_ = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        this.camera_.position.set(0, 3, 6);
        this.camera_.lookAt(0, 0, 0);

        this.renderer_ = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer_.setSize(width, height);
        this.renderer_.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer_.setAnimationLoop(this.animate);
        this.container_.appendChild(this.renderer_.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        this.scene_.add(light);

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (item, loaded, total) => {
            this.onProgress_((loaded / total) * 100);
        };

        // Cube with pictures
        const textures = [];
        const materials = [];
        const geometry = new THREE.BoxGeometry(5, 4, 5, 10, 10, 10);

        for (let i = 0; i < this.photos_.length; i++) {
            textures.push(new THREE.TextureLoader(loadingManager).load('../../../../../../images/' + this.photos_[i].src));
        }

        while (materials.length < 6) {
            for (let i = 0; i < textures.length && materials.length < 6; i++) {
                if (materials.length == 2 || materials.length == 3) {
                    materials.push(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, side: THREE.DoubleSide }));
                } else {
                    materials.push(new THREE.MeshBasicMaterial({ map: textures[i], transparent: true, side: THREE.DoubleSide }));
                }
            }
        }

        this.cube_ = new THREE.Mesh(geometry, materials);
        this.cube_.receiveShadow = true;

        // Cube support
        let bone1 = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 3, 8, 32),
            new THREE.MeshBasicMaterial({ color: 0xcccccc })
        );
        bone1.position.set(0, -5, 0);

        this.cube_.add(bone1);
        this.scene_.add(this.cube_);

        this.controls_ = new OrbitControls(this.camera_, this.renderer_.domElement);
        this.controls_.minDistance = 0;
        this.controls_.maxDistance = 15;

        this.controls_.addEventListener('start', () => {
            this.isDragging_ = true;
        });

        this.controls_.addEventListener('end', () => {
            this.isDragging_ = false;
        });

        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {
        const width = this.container_.clientWidth;
        const height = this.container_.clientHeight;

        this.camera_.aspect = width / height;
        this.camera_.updateProjectionMatrix();

        this.renderer_.setSize(width, height);
    }

    animate() {
        const delta = clock.getDelta();

        if (this.mixer_) this.mixer_.update(delta);
        this.renderer_.render(this.scene_, this.camera_);

        if (this.cube_ && !this.isDragging_) {
            this.cube_.rotation.y += 0.0005;
        }
    }
}
