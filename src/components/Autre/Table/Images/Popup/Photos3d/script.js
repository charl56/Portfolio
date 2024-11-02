import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const clock = new THREE.Clock();

export class Models3DVisualisatioh {
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

        this.setupScene();

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

    setupScene() {

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (item, loaded, total) => {
            this.onProgress_((loaded / total) * 100);
        };


        // Floor support
        const geoFloor = new THREE.BoxGeometry(14, 0.1, 14);
        const matStdFloor = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.5 });
        const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
        mshStdFloor.position.set(0, -8, 0);
        this.scene_.add(mshStdFloor);


        // Cube with pictures
        const textures = [];
        const materials = [];
        const geometry = new THREE.BoxGeometry(5, 4, 5, 10, 10, 10);

        for (let i = 0; i < this.photos_.length; i++) {
            textures.push(new THREE.TextureLoader(loadingManager).load('../../../../../../images/' + this.photos_[i].src));
        }

        while (materials.length < 6) {
            for (let i = 0; i < textures.length && materials.length < 6; i++) {
                if (materials.length == 3) {
                    materials.push(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide }));
                } else if (materials.length == 2 ) {
                    materials.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader(loadingManager).load('../../../../../../images/Signature/signature.jpg'), transparent: false, side: THREE.DoubleSide }));
                } else {
                    materials.push(new THREE.MeshBasicMaterial({ map: textures[i], transparent: true, side: THREE.DoubleSide }));
                }
            }
        }

        this.cube_ = new THREE.Mesh(geometry, materials);
        this.cube_.receiveShadow = true;
        this.scene_.add(this.cube_);

        
        // Cylindre support
        const support = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 2, 6, 32),
            new THREE.MeshStandardMaterial({ color: 0xf7efd7, roughness: 0.5, metalness: 0.5 })
        );
        support.position.set(0, -5, 0);
        support.receiveShadow = true;
        support.castShadow = true;
        this.cube_.add(support);


        ////// Light bottom
        RectAreaLightUniformsLib.init();
        const rectLight1 = new THREE.RectAreaLight(0xffffff, 1.5, 5, 5);
        rectLight1.position.set(0, -2.001, 0);
        rectLight1.rotation.x = - Math.PI / 2;
        this.cube_.add(rectLight1);
        this.scene_.add(new RectAreaLightHelper(rectLight1));
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
