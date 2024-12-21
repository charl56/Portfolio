import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
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
        this.scene_.background = new THREE.Color(0x525252);

        this.camera_ = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        this.camera_.position.set(0, 3, 6);
        this.camera_.lookAt(0, 0, 0);

        this.renderer_ = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer_.setSize(width, height);
        this.renderer_.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer_.setAnimationLoop(this.animate);
        this.renderer_.shadowMap.enabled = true;
        this.renderer_.toneMapping = THREE.ReinhardToneMapping;
        this.renderer_.toneMappingExposure = Math.pow(1, 5.0); // to allow for very bright scenes.
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


        // Light
        this.bulbLight_ = new THREE.PointLight(0xffee88, 1, 100, 2);

        this.bulbMat_ = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 1,
            color: 0x000000
        });

        const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
        this.bulbLight_.add(new THREE.Mesh(bulbGeometry, this.bulbMat_));
        this.bulbLight_.position.set(0, 3, 0);
        this.bulbLight_.castShadow = true;

        this.bulbLight_.power = 400;
        this.bulbMat_.emissiveIntensity = this.bulbLight_.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface

        this.scene_.add(this.bulbLight_);


        const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
        hemiLight.intensity = 0.002;
        this.scene_.add(hemiLight);


        // Floor
        const floorMat = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 1
        });
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('../../../../../images/models/wood_floor/hardwood2_diffuse.jpg', function (map) {

            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(10, 24);
            map.colorSpace = THREE.SRGBColorSpace;
            floorMat.map = map;
            floorMat.needsUpdate = true;

        });

        textureLoader.load('../../../../../images/models/wood_floor/hardwood2_bump.jpg', function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(10, 24);
            floorMat.bumpMap = map;
            floorMat.needsUpdate = true;

        });

        textureLoader.load('../../../../../images/models/wood_floor/hardwood2_roughness.jpg', function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(10, 24);
            floorMat.roughnessMap = map;
            floorMat.needsUpdate = true;

        });

        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = - Math.PI / 2.0;
        this.scene_.add(floorMesh);


        const cubeMat = new THREE.MeshStandardMaterial({
            roughness: 0.7,
            color: 0xffffff,
            bumpScale: 1,
            metalness: 0.2
        });

        textureLoader.load('../../../../../images/models/wood_floor/brick_diffuse.jpg', function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(1, 1);
            map.colorSpace = THREE.SRGBColorSpace;
            cubeMat.map = map;
            cubeMat.needsUpdate = true;

        });

        textureLoader.load('../../../../../images/models/wood_floor/brick_bump.jpg', function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(1, 1);
            cubeMat.bumpMap = map;
            cubeMat.needsUpdate = true;

        });



        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
        boxMesh.position.set(- 2, 1, - 1);
        boxMesh.castShadow = true;
        this.scene_.add(boxMesh);

        const boxMesh2 = new THREE.Mesh(boxGeometry, cubeMat);
        boxMesh2.position.set(3, 1, - 1);
        boxMesh2.castShadow = true;
        this.scene_.add(boxMesh2);


    }

    LoadFBX() {
        const fbxLoader = new FBXLoader()
        fbxLoader.load("../../../../../images/models/container/Container.FBX", (fbx) => {

            fbx.position.set(0, 0, 0)
            fbx.scale.set(.01, .01, .01)
            fbx.castShadow = true

            this.scene_.add(fbx)

        },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
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
