<template>
    <div class="scene" ref="scene" onselectstart="return false" onmousedown="return false">
        <div class="viseur d-flex align-center justify-center">
            <div>        
                <v-img class="icon-viseur" :src="viseur"></v-img>
            </div>
        </div>
        <!-- Affiche le score -->
        <displayScore class="display-component" :score="score" />
        <!-- Affiche les balles restantes -->
        <displayLoader class="display-component" :remainBullets="remainBullets" :loader="weapons[this.player.weapon].parameters.loader" :remainLoaders="weapons[this.player.weapon].parameters.remainLoaders" :loadTimer="weapons[this.player.weapon].parameters.loadTimer" />
        <!-- Affiche le nombre de round -->
        <displayRound />
        <!-- Affiche le menu de pause -->
        <displayMenu />
    </div>
</template>

<script>
    // ThreeJs
    import * as THREE from 'three';
    import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
    // POV
    import { FirstPersonControls } from '../../plugins/FirstPersonControls';
    // Plugins
    import { eventBus } from '../../plugins/eventBus'
    import '../../plugins/ammo'
    // Import datas
    import weapons from '../../../static/datas/weapons'
    import {sceneItems} from '../../../static/datas/Maps/Map_Zombie_Ville'
    import {spawnsCoord} from '../../../static/datas/Maps/Map_Zombie_Ville'
    import targetItems from '../../../static/datas/targetItems'
    import sounds from '../../../static/datas/sounds'
    // Components
    import displayScore from './displays/displayScore.vue';
    import displayLoader from './displays/displayLoader.vue';
    import displayRound from './displays/displayRound.vue';
    import displayMenu from './displays/displayMenu.vue'


    export default {
        components: {
            displayScore,
            displayLoader,
            displayRound,
            displayMenu,
        },
        created(){
            this.weapons = weapons
            // MAJ Score
            eventBus.on('scoreChange', (data) => {
                this.score = data
            });
            // MAJ balles restantes
            eventBus.on('remainBullets', (data) => {
                this.remainBullets = data
            })
            // MAJ Zombie restant, pour changement de round
            eventBus.on('remainZombie')

            // MAJ sound
            eventBus.on('isSound', (data) => {
                this.isSound.push(data)
            })

        },
        mounted() {

            ////
            // VARIABLES
            ////
            // Ecran de chargement
            let ressourcesLoad = false, loadingScreen
            let deathScreen
            // ThreeJs : graphic
            let scene, camera, clock, deltaTime, weaponActuel
            let renderer = new THREE.WebGLRenderer()        // Fonction de rendu
            const canvas = this.$refs.scene                 // Canvas affiche le jeu
            let raycaster = new THREE.Raycaster()           // Axe de tire
            let tmpPos = new THREE.Vector3()            
            let mixers = []
            let actions = []
            //  AmmoJs : physic
            let physicsWorld, tmpTrans, rigidBodies = []
            let cbContactResult;
            let cbContactPairResult;
            const STATE = { DISABLE_DEACTIVATION : 4 };
            // Game
            let fpsControls
            let player = this.player
            let zoomView = 'not-aim'
            let bullets = []                    // Listes des balles en jeu
            let zoom = false                    // Permet de savoir si on vise, ou non
            let keyboard = {}                   // Liste des touches actives, ou non
            let lastWeaponList = ['pistolSilencer']  // Liste des armes, la dernière est l'actuel. Liste pour fonction animate
            let previousWeapon = []         
            let score = 0
            let round = 0
            let remainZombie = 0                    // Zombie restants    
            let velocity_y = 0                      // Hauteur du saut 
            let gameStop = false                    // Sert a mettre en pause le jeu
            let clips                               // Liste des animations dispos
            let newRound                            // Pour savoir nouvelle manches
            let backgroundSound                     // Son de fond
            let backgroundSoundActive = false
            let isSound = this.isSound              // Parametre active son
            // POV
            let currentMouseX, currentMouseXDelta, currentMouseY, currentMouseYDelta, previousMouseX, previousMouseY    // Pos souris
            let phi, theta
            let rotation = new THREE.Quaternion()
            let translation = new THREE.Vector3()
            // Mise en place du viseur 
            this.viseur = new URL('../../assets/Icons/viseur_white.png', import.meta.url).href
            this.remainBullets = weapons[player.weapon].parameters.remainBullets        // Met a 
            


            // AmmoJs : création physiques
            Ammo().then(
                // AmmoJs = await new Ammo(),
                start
            )
            async function start(){
                // On commence par afficher l'ecran de chargemement
                loadScreen()
                // Moteur de rendu, fait les frame
                renderFrame()
                //
                tmpTrans = new Ammo.btTransform();
                // Physic : Ammo
                setupPhysicsWorld()
                // Crée l'élement scene et les différents élement permettant l'affichage
                setupGraphics()
                // Prepare anim de la mort
                deathScreenAnim()
                // Ajout les élement à la scene
                await initScene()
                // Ajout des cibles
                await setTarget()
                // Chargement des armes
                await setWeapons()
                // Setup des event clavier/souris
                setupEventHandlers()
                // Mise en place des fonction de contact
                setupContactResultCallback()
                setupContactPairResultCallback();
                // Enlève l'ecran de chargement
                ressourcesLoad = true
            }
            ////
            // Loading screen
            ////
            function loadScreen(){
                loadingScreen = {
                    scene: new THREE.Scene(),
                    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
                    box: new THREE.Mesh(
                        new THREE.BoxGeometry(0.5, 0.5, 0.5),
                        new THREE.MeshBasicMaterial({ color:0x4444ff })
                    )
                }
                // Préparation de l'écran de chargement
                loadingScreen.box.position.set(0, 0, 5)
                loadingScreen.camera.lookAt(0, 0, 5)
                loadingScreen.scene.add(loadingScreen.box)
            }
            //////////////////
            // Ecran anim mort 
            //////////////////
            function deathScreenAnim(){
                deathScreen = {
                    scene: scene,
                    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
                }
                // Préparation de l'écran de chargement
                deathScreen.camera.rotation.set(0, Math.PI, 0)
                deathScreen.camera.position.set(0, 12, -11)
            }
            ////
            // Setup AmmoJs
            ////
            function setupPhysicsWorld(){          
                // J'ai pas tout capté, mais tous les premier éléments sont nécessaires pour la variable physicsWorld (où simulation physique s'effectue)
                let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
                let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
                let overlappingPairCache = new Ammo.btDbvtBroadphase()
                let solver = new Ammo.btSequentialImpulseConstraintSolver()
                // Création monde physique
                physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
                physicsWorld.setGravity(new Ammo.btVector3(0, -2, 0));
            }
            ////
            // Création de la scene init des élements graphiques
            ////
            function setupGraphics(){
                //create clock for timing
                clock = new THREE.Clock();
                // Init caméra
                camera = new THREE.PerspectiveCamera(75,canvas.clientWidth / canvas.clientHeight,0.1,100);
                // Position camera
                camera.position.set(0, player.height, 0)
                camera.lookAt(0, player.height, 0)
                camera.userData.tag = 'cameraPlayer'
                // Init rendu
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);  // taille
                renderer.shadowMap.enabled = true               // Active les ombres
                renderer.shadowMap.type = THREE.BasicShadowMap  // Type d'ombres
                
                // Créer le canvas
                canvas.appendChild(renderer.domElement);
                // POV
                fpsControls = new FirstPersonCamera(camera);

                // Création scene
                scene = new THREE.Scene()
                scene.background = new THREE.Color( 0x000000 );
                // Ambient ligth
                let ambientLight = new THREE.AmbientLight(0xFFE9DE, 0.2)
                scene.add(ambientLight)
                // Light 
                let light = new THREE.PointLight(0xFCB490, 0.8, 18)
                light.position.set(2, 2, 2)
                light.castShadow = true
                light.shadow.camera.near = 0.1
                light.shadow.camera.far = 25
                scene.add(light) 
                // Musique de fond
                const listener = new THREE.AudioListener()
                camera.add(listener)

                const audioLoader = new THREE.AudioLoader()
                backgroundSound = new THREE.Audio(listener)
                audioLoader.load(sounds['CouldYouBeLoved'].soundSrc, function( buffer ){
                    backgroundSound.setBuffer(buffer)
                    backgroundSound.setLoop(true)
                    backgroundSound.setVolume(0.8)
                })
            }   
            ////
            // Ajout des élements à la scene, chargement graphique des éléments
            ////
            async function initScene(){
                // Sol
                const floor = new THREE.Mesh(
                    new THREE.PlaneGeometry(100, 100),
                    new THREE.MeshBasicMaterial({color: 0x808080, wireframe: false})
                )
                floor.position.set(0, 0, 0)
                floor.rotation.x -= Math.PI / 2;
                floor.userData.tag = "floor"
                scene.add(floor)

                //Ammojs Section
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin( new Ammo.btVector3(0, 0, 0));
                transform.setRotation( new Ammo.btQuaternion(0, 0, 0, 1));
                let motionState = new Ammo.btDefaultMotionState( transform );
                // Equivalent hitbox
                let colShape = new Ammo.btBoxShape( new Ammo.btVector3(35, 0.1, 35));
                colShape.setMargin( 0.05 );

                let localInertia = new Ammo.btVector3( 0, 0, 0 );
                colShape.calculateLocalInertia( 0, localInertia );

                let rbInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, colShape, localInertia );
                let body = new Ammo.btRigidBody( rbInfo );
                // 
                body.setFriction(4);
                body.setRollingFriction(10);
                // Ajout au monde physic
                physicsWorld.addRigidBody( body );
                body.threeObject = floor;

                // Ajout des items du fichier sceneItems.js
                const keys = Object.keys(sceneItems);
                // Pour chaques items
                for (const element of keys) {   
                    const key = element;
                    const sceneItem = sceneItems[key];
                    try {
                        // ------ THREEJS SECTION
                        // Load items for scene
                        const materialItem = await loadMTL(sceneItem.mtl);
                        await materialItem.preload();

                        const materielMesh = await loadOBJ(sceneItem.obj, materialItem);
                        // Ombre de l'objet
                        materielMesh.receiveShadow = true
                        // Position
                        materielMesh.position.set(
                            sceneItem.position.x,
                            sceneItem.position.y,
                            sceneItem.position.z
                        );
                        // Rotation
                        materielMesh.rotation.set(
                            sceneItem.rotation.x,
                            sceneItem.rotation.y,
                            sceneItem.rotation.z,
                        )
                        // Echelle
                        materielMesh.scale.set(
                            sceneItem.scale, 
                            sceneItem.scale, 
                            sceneItem.scale
                        );
                        // Ajout d'un tag pour différencier
                        materielMesh.userData.tag = "sceneItem"
                        // Ajout de la mesh à l'objet de l'item
                        sceneItem.mesh = materielMesh;
                        // Ajout à la scene
                        scene.add(materielMesh)
                        //// -------------------
                        // ------ AMMOJS SECTION
                        let mass = 0    // Mass=0 : objet immobile
                        let transform = new Ammo.btTransform()
                        transform.setIdentity()
                        // Position
                        transform.setOrigin( new Ammo.btVector3( 
                            sceneItem.hitBoxPosition.x,
                            sceneItem.hitBoxPosition.y,
                            sceneItem.hitBoxPosition.z
                        ));
                        // Rotation
                        transform.setRotation( new Ammo.btQuaternion( 
                            sceneItem.rotation.x,
                            sceneItem.rotation.y,
                            sceneItem.rotation.z,
                            1
                        ));
                        let motionState = new Ammo.btDefaultMotionState( transform );
                        // Equivalent hitbox
                        let colShape = new Ammo.btBoxShape( new Ammo.btVector3(
                            sceneItem.hitBox.x, 
                            sceneItem.hitBox.y, 
                            sceneItem.hitBox.z, 
                        ));
                        colShape.setMargin( 0.05 );
                        // Inertie
                        let localInertia = new Ammo.btVector3( 0, 0, 0 );
                        colShape.calculateLocalInertia( mass, localInertia );
                        // Création de l'element physique, avec ses attributs
                        let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
                        let body = new Ammo.btRigidBody( rbInfo );                        
                        // Ajout du body au monde physique, avec contraintes de colisions
                        physicsWorld.addRigidBody( body );

                        rigidBodies.push(materielMesh)
                        materielMesh.userData.physicsBody = body
                        body.threeObject = materielMesh

                    } catch (error) {
                        console.error("Erreur lors du chargement de la physique d'un élement", error);
                    }
                }
                // // Image en 360 : stade
                // const hdrTexture = new URL('../../assets/FondHdr/stadium.hdr', import.meta.url);
                // const loader = new RGBELoader()
                // // Set hdr on background
                // loader.load(hdrTexture, function(texture){
                //     texture.mapping = THREE.EquirectangularReflectionMapping
                //     scene.background = texture;
                // })
            }
            ////
            // Fonctions pour charger les élements 'obj' et 'mtl'
            ////
            async function loadMTL(mtlPath) {                  // Decoupe de la fonction setWeapons, pour les await/async
                return new Promise((resolve, reject) => {
                    const mtlLoader = new MTLLoader();
                    mtlLoader.load(mtlPath, resolve, undefined, reject);
                });
            }
            async function loadOBJ(objPath, materials) {       // Decoupe de la fonction setWeapons, pour les await/async
                return new Promise((resolve, reject) => {
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(objPath, resolve, undefined, reject);
                });
            }
            ////
            // Ajout des cibles sur la scene, chargement élements graphiques
            ////
            async function setTarget(){
                // MAJ nombre de round
                round ++
                eventBus.emit("roundNumber", round)
                // Mise a jour nouvelle manche
                newRound = true
                // Formule nb zombie en fonction du round
                let zombieNumber = (round * 1.41) + 2.6 
                remainZombie = parseInt(zombieNumber)
                // Vie par zombie = nombre de balles
                let zombieLife = 2
                // Ajout des items du fichier tagetItems.js
                // Chaque zombie a : une partie graphic, une partie physique, une partie animation
                const gltfLoader = new GLTFLoader();
                // On récupère le zombie dans la liste des cibles
                const zombieGltf = targetItems["zombieMale"]
                for (let i = 0; i<parseInt(zombieNumber); i++) {   
                    try {
                        gltfLoader.load(zombieGltf.gltf, (gltf) => {                                                   
                            /////////////////////////
                            // ---------------THREEJS
                            // On récupère les positions de spawn dans une liste
                            let keyLength = Object.keys(spawnsCoord).length 
                            let keySpawn = parseInt(Math.random() * keyLength) + 1
                            let acutalSpawn = spawnsCoord[keySpawn] 
                            // Assignation des coords de spawn a l'endroit de spawn du zombie  
                            let pos = {
                                x: acutalSpawn.x, 
                                y: acutalSpawn.y, 
                                z: acutalSpawn.z
                            };
                            let scale = {x: 0.8, y: 0.8, z: 0.8};
                            let quat = {x: 0, y: 0, z: 0, w: 1};
                            let mass = 1;
                            // Equivalent mesh        
                            const zombie = gltf.scene
                            // Ombre de l'objet
                            zombie.castShadow = true;
                            zombie.receiveShadow = true
                            // Position
                            zombie.position.set(pos.x, pos.y, pos.z)
                            // Echelle
                            zombie.scale.set(scale.x, scale.y, scale.z)
                            // Ajout d'un tag pour différencier
                            zombie.userData.tag = "targetItem_zombie"   
                            // Vie du zombie
                            zombie.userData.remainLife =  zombieLife   
                            // Ajout d'un score 'donnable'
                            zombie.userData.points = true
                            // Ajout à la scene
                            scene.add(zombie)

                            /////////////////////////
                            // -------------ANIMATION
                            let mixer = new THREE.AnimationMixer(zombie)
                            clips = gltf.animations
                            const clip = THREE.AnimationClip.findByName(clips, 'Walk')
                            let action = (mixer.clipAction(clip))
                            action.play()
                            mixers.push(mixer)
    
                            /////////////////////////
                            // ----------------AMMOJS
                            let transform = new Ammo.btTransform()  
                            transform.setIdentity()
                            // Position
                            transform.setOrigin( new Ammo.btVector3( 
                                pos.x,
                                pos.y,
                                pos.z,
                            ));
                            // Rotation
                            transform.setRotation( new Ammo.btQuaternion( 
                                quat.x,
                                quat.y,
                                quat.z,
                                quat.w,
                            ));
                            let motionState = new Ammo.btDefaultMotionState( transform );
                            // Hitbox
                            let colShape = new Ammo.btBoxShape( new Ammo.btVector3( 
                                scale.x * 0.8, 
                                2,
                                scale.z * 0.8, 
                            ));
                            colShape.setMargin( 0.05 );
                            // Inertie
                            let localInertia = new Ammo.btVector3( 0, 0, 0 );
                            colShape.calculateLocalInertia( mass, localInertia );
                            // Création de l'element physique, avec ses attributs
                            let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
                            let body = new Ammo.btRigidBody( rbInfo );   
                            // Frictions      
                            // body.setFriction(40);
                            // body.setRollingFriction(10); 
                            // body.setActivationState( STATE.DISABLE_DEACTIVATION )

                            // Ajout du body au monde physique, avec contraintes de colisions
                            physicsWorld.addRigidBody( body );
    
                            rigidBodies.push(zombie)
                            zombie.userData.physicsBody = body
                            body.threeObject = zombie
                        }, undefined, (error) => {
                            console.log(error)
                        })      
                    } catch (error) {
                        console.error("Erreur lors du chargement de la physique d'un élement", error);
                    }
                }
            }
            ////
            // Chargement graphique des armes
            ////
            async function setWeapons(){
                let playerWeapon = player.weapon
                // Permet d'avoir un id par item
                const keys = Object.keys(weapons);
                // Pour chaques items
                for (const element of keys) {   
                    const key = element;
                    const weapon = weapons[key];

                    try {
                        // ------ THREEJS SECTION           
                        // Load weapons
                        const materials = await loadMTL(weapon.mtl);

                        await materials.preload();

                        const weaponMesh = await loadOBJ(weapon.obj, materials);
                        weaponMesh.receiveShadow = true
                        // Position et taille de l'arme
                        weaponMesh.position.set(1, 2, 0);
                        weaponMesh.scale.set(5, 5, 5);
                        weaponMesh.name = key
                        // Ajout d'un tag
                        weaponMesh.userData.tag = "weapon_"+key
                        weapon.mesh = weaponMesh;

                        if(playerWeapon == key){
                            player.weapon = key
                            player.weaponMesh = weaponMesh
                            await scene.add(weaponMesh);
                        }
                        /////
                        //----- Ammo bullet for weapon
                        const ammoMaterials = await loadMTL(weapon.ammo.mtl);

                        await materials.preload();

                        const ammoMesh = await loadOBJ(weapon.ammo.obj, ammoMaterials);
                        ammoMesh.receiveShadow = true
                        ammoMesh.scale.set(15,15,15)
                        // Ajout tag
                        ammoMesh.userData.tag = "ammo_" + key

                        weapon.ammo.mesh = ammoMesh;

                        /////////////
                        // Pas besoin de physic pour le skin des armes
                    } catch (error) {
                        console.error("Erreur lors du chargement de la physique d'un élement", error);
                    }
                }
            }
            ////
            // Mise en place des fonction d'évenement
            ////
            function setupEventHandlers(){
                // document.addEventListener('mousemove', (e) => onMouseMove(e), false)
                document.addEventListener('click', (e) => onClick(e), false)
                document.addEventListener('contextmenu', (e) => onContextMenu(e), false)
                document.addEventListener('keyup', (e) => keyUp(e), false)
                document.addEventListener('keydown', (e) => keyDown(e), false)
            }
            // Déplace a vue, avec la souris
            function onMouseMove(e){
                if(player.alive){       // Si joueur en vie
                    // Pos actuel de la souris
                    currentMouseX = e.pageX - window.innerWidth / 2
                    currentMouseY = e.pageY - window.innerHeight / 2
                 
                    // Différence avec pos souyris précédente
                    currentMouseXDelta = currentMouseX - previousMouseX
                    currentMouseYDelta = currentMouseY - previousMouseY
                 
                 
                    // // Point milieu de l'écran
                    // const middleX = window.innerWidth / 2
                    // const middleY = window.innerHeight / 2
                    
                    // // Différence entre le milieu, et le curseur
                    // const diffX = middleX - e.x
                    // const diffY = middleY - e.y
                    // // Conversion des px en angle valable pour la rotation
                    // const angleRotY = (diffX / window.innerWidth * 2 * Math.PI) + Math.PI
                    // const angleVertical = (diffY / window.innerHeight * 2 * Math.PI / 3)
                    // // Conversions deplacement vertical en angles de rotation x et z
                    // const angleRotX = Math.cos( angleRotY ) * angleVertical
                    // const angleRotZ = Math.pow(Math.pow(Math.sin( angleRotY ), 2), 0.3)
                    
                    // -Math.pow(Math.cos( angleRotY + Math.PI/2 ), 2) * angleVertical
                    // // Assignement des angles à la cam     
                    // camera.rotation.set(
                    //     0,
                    //     angleRotY, 
                    //     0,
                    //     )
                }
            }
            // Tire au click
            function onClick(e){
                if(gameStop || !player.alive || !player.canShoot){
                } else {
                    // Permet de limiter le nombre de tire par secondes, en fonction des armes
                    player.canShoot = false
                    // Parametres de l'arme du jour. Mise dans variable pour simplifier les appels ensuite
                    let playerWeaponParameters = weapons[player.weapon].parameters
                    // Si il reste des balles dans le chargeur, -1, et tirer normalement
                    if(playerWeaponParameters.remainBullets > 0){
                        playerWeaponParameters.remainBullets = playerWeaponParameters.remainBullets - 1
                        // Timer de cadence de tire
                        setTimeout(function(){
                            player.canShoot = true
                        }, playerWeaponParameters.shootTimer)

                        // ------ THREEJS SECTION
                        // Balle, en fonction de l'arme
                        let bullet = weapons[player.weapon].ammo.mesh.clone()   

                        let bulletPos

                        // Position de départ de la balle, en fonction de la vue (visé ou non)
                        if(zoomView == 'not-aim'){
                            bulletPos = new THREE.Vector3(
                                camera.position.x - Math.sin(camera.rotation.y - Math.PI/6) * 0.6,
                                camera.position.y - 0.13,
                                camera.position.z - Math.cos(camera.rotation.y - Math.PI/6) * 0.6
                            )
                        } else {
                            bulletPos = new THREE.Vector3(
                                camera.position.x - Math.sin(camera.rotation.y) * 0.6,
                                camera.position.y - playerWeaponParameters.positionAimY,    // Position en fonction de l'arme
                                camera.position.z - Math.cos(camera.rotation.y) * 0.6
                            )
                        }
                        // Position de la balle, en fonction de la vue (visé ou non)
                        bullet.position.set(
                            bulletPos.x,
                            bulletPos.y,
                            bulletPos.z
                        )
                        // Coord 2 vector
                        let middleScreen =  new THREE.Vector2(0, 0)
                        raycaster.setFromCamera(middleScreen, camera)        
                        raycaster.ray.origin = bulletPos
                        // Set ray vector
                        tmpPos.copy(raycaster.ray.direction)
                        tmpPos.add(raycaster.ray.origin)
                        // Ombre
                        bullet.receiveShadow = true
                        // Aligne la balle par rapport à l'arme
                        bullet.rotation.set(
                            camera.rotation.x,
                            camera.rotation.y + Math.PI/2,
                            camera.rotation.z - Math.PI/2
                        )
                        // Timer 'durée de vie' de la balle
                        setTimeout(function(){
                            bullet.alive = false
                            // On enleve le graphic
                            scene.remove(bullet)
                            // On cherche l'index de la bullet
                            const physicBullet = rigidBodies.findIndex((obj) => obj.uuid === bullet.uuid);
                            // Si index > -1, c'est que l'objet est dans la liste, donc sur la scene
                            if (physicBullet > -1) {
                                // On enleve la partie physique de la liste
                                rigidBodies.splice(physicBullet, 1);
                                // On enleve du monde physic
                                physicsWorld.removeRigidBody(bullet.userData.physicsBody)
                            }
                        }, 3000)
                        // affiche bullet
                        bullet.alive = true;
                        bullets.push(bullet)                        
                        // Ajout la bullet à la scene
                        scene.add(bullet)
                        //// -------------------
                        // ------ AMMOJS SECTION
                        let mass = 1    // Mass=0 : objet immobile
                        let transform = new Ammo.btTransform()  
                        transform.setIdentity()
                        // Position de départ de la balle, en fonction de la vue (visé ou non)
                        transform.setOrigin( new Ammo.btVector3( 
                            bulletPos.x,
                            bulletPos.y,
                            bulletPos.z
                        ));
                        // Rotation
                        transform.setRotation( new Ammo.btQuaternion(
                            camera.rotation.x,
                            camera.rotation.y + Math.PI/2,
                            camera.rotation.z - Math.PI/2,
                            1
                        ));
                        let motionState = new Ammo.btDefaultMotionState( transform );
                        // Object autour, qui va avoir la colision
                        let colShape = new Ammo.btBoxShape( new Ammo.btVector3( 0.1, 0.1, 0.1));
                        colShape.setMargin( 0.05 );
                        // Inertie
                        let localInertia = new Ammo.btVector3( 0, 0, 0 );
                        colShape.calculateLocalInertia( mass, localInertia );
                        // Création de l'element physique, avec ses attributs
                        let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
                        let body = new Ammo.btRigidBody( rbInfo );                        
                        // Ajout du body au monde physique, avec contraintes de colisions
                        physicsWorld.addRigidBody( body );
                        // Place balle et donne la velocite
                        tmpPos.copy(raycaster.ray.direction)
                        tmpPos.multiplyScalar(60)
                        body.setLinearVelocity(new Ammo.btVector3(
                            tmpPos.x,
                            tmpPos.y,
                            tmpPos.z
                        ))
                        bullet.userData.physicsBody = body
                        rigidBodies.push(bullet)
                        body.threeObject = bullet
                        ////
                        // Recule au tir
                        ////
                        // updateRecoil()

                        ////
                        // Son au tire
                        ////
                        if((isSound[isSound.length - 1])){

                            const listener = new THREE.AudioListener()
                            camera.add(listener)
                            
                            const audioLoader = new THREE.AudioLoader()
                            let shootSound = new THREE.Audio(listener)
                            audioLoader.load(weapons[player.weapon].soundSrc, function( buffer ){
                                shootSound.setBuffer(buffer)
                                shootSound.setLoop(false)
                                shootSound.setVolume(0.3)
                                shootSound.play()
                            })                              
                        }

                        // Si plus de balles dans chargeur, recharge
                        if(playerWeaponParameters.remainBullets == 0){
                            // On enlève un chargeur
                            playerWeaponParameters.remainLoaders = playerWeaponParameters.remainLoaders - 1
                            // Le joueur peut pas tirer pendant le chargement
                            player.canShoot = false    
                            // Timer chargement arme
                            setTimeout(function(){
                                // Remises des balles dans le chargeur
                                playerWeaponParameters.remainBullets = playerWeaponParameters.loader
                                // Peut tirer
                                player.canShoot = true
                                // MAJ Nombre de balle restantes
                                eventBus.emit("remainBullets", (playerWeaponParameters.remainBullets))
                            }, playerWeaponParameters.loadTimer)
                        }
                    }
                    eventBus.emit("remainBullets", (playerWeaponParameters.remainBullets))
                }
            }
            // Recul au tir
            function updateRecoil(){
                
                weaponActuel.rotation.set(
                    camera.position.x + Math.sin(camera.rotation.y - Math.PI/4),
                    camera.rotation.y + Math.PI,
                    camera.position.z + Math.cos(camera.rotation.y + Math.PI/4)
                )

                // camera.position.y+=velocity_y*deltaTime;
                // if(!player.canJump){
                //     velocity_y-=9.8*2*deltaTime;
                //     if(camera.position.y<=1.8){
                //     player.canJump = true
                //     velocity_y=0;
                //     camera.position.y= 1.8;
                //     }
                // }
            }

            // Click droit = viser !
            function onContextMenu(e){
                // Désactive le menu en clique droit
                e.preventDefault()
                // Active le zoom ou non
                if(zoom){
                    camera.fov = 40;
                    camera.updateProjectionMatrix();
                    document.getElementsByClassName('icon-viseur')[0].style.height = '60px'
                    document.getElementsByClassName('icon-viseur')[0].style.width = '60px'
                    // Passe l'arme en mode 'visé'
                    zoomView = "aim"
                } else {
                    camera.fov = 75;
                    camera.updateProjectionMatrix();
                    document.getElementsByClassName('icon-viseur')[0].style.height = '40px'
                    document.getElementsByClassName('icon-viseur')[0].style.width = '40px'
                    // Passe l'arme en mode visé
                    zoomView = "not-aim"
                }
                zoom = !zoom
            }
            function keyDown(e){
                keyboard[e.keyCode] = true
                keyUse()
            }
            function keyUp(e){
                keyboard[e.keyCode] = false
                keyUse()
            }

            function keyUse(){
                // if(keyboard[16]){       // Sprint
                //     player.speed = 0.15
                // } else {
                //     player.speed = 0.065
                // }
                if(keyboard[27]){       // Menu pause
                    if(!gameStop){
                        gameStop = true
                    } else {
                        if(!(isSound[isSound.length - 1])){
                            backgroundSound.pause()
                        }
                        gameStop = false
                        renderFrame()
                    }
                    eventBus.emit("gameStop", gameStop)

                }
                // Active le son de fond
                if(keyboard[80]){
                    backgroundSoundPlay()
                } 
                if(keyboard[76]){
                    testDeath()
                } 

            }    
            function testDeath(){
                player.alive = false
                eventBus.emit("playerDeath")
            }

            function backgroundSoundPlay(){
                if((isSound[isSound.length - 1])){    
                    if(backgroundSoundActive){
                        backgroundSound.pause()
                    } else{
                        backgroundSound.play()
                    }
                    backgroundSoundActive = !backgroundSoundActive
                }
            }
       

            ////
            // Permet de changer d'arme en fonction du score
            ////
            function changeWeapon(){ // Fonction qui permet de changer d'arme
                let change = false
                // On commence par choisir l'arme en fonction du score, on active change, et set l'arme précédente
                if(score == 2){
                    previousWeapon.push('pistolSilencer')
                    player.weapon = 'shotgun'
                    change = true
                } else if(score == 4){
                    previousWeapon.push('shotgun')
                    player.weapon = 'uzi'
                    change = true
                } else if(score == 6){
                    previousWeapon.push('uzi')
                    player.weapon = 'uziLongSilencer'
                    change = true
                } else if(score == 8){
                    previousWeapon.push('uziLongSilencer')
                    player.weapon = 'machinegun'
                    change = true
                } else if(score == 10){
                    previousWeapon.push('machinegun')
                    player.weapon = 'sniperCamo'
                    change = true
                } else if(score == 12){
                    previousWeapon.push('sniperCamo')
                    player.weapon = 'rocketlauncher'
                    change = true
                } else if(score == 14){
                    previousWeapon.push('rocketlauncher')
                    player.weapon = 'flamethrower'
                    change = true
                }
                if(change){ // Si besoin de changer d'arme
                    let objectToRemove = null                   // Var qui va recevoir l'objet de l'ancienne arme, à enlever
                    let nextWeapon = player.weapon         // Récupère arme actuel, dans les données user
                    lastWeaponList.push(nextWeapon)        // On ajout à la liste des armes, pour la boucle animate 
                    let previousWeapon = previousWeapon[previousWeapon.length - 1]        // Arme précédente, pour trouver quel objet supprimer
                    // On 'traverse' la liste des objets sur la scene, pour trouver les meshs
                    scene.traverse( function( object ) {
                        if(object.isObject3D && object.name == previousWeapon){  // 3DObject peut être enlevé de la scène
                            objectToRemove = object
                        }
                    });
                    // Supprime de la scene 
                    scene.remove(objectToRemove)
                    // Créer un nouveau mesh pour poser l'arme 
                    let newMeshWeapon = weapons[nextWeapon].mesh.clone()
                    // Vision gun : Position
                    let time = Date.now() * 0.0005
                    newMeshWeapon.position.set(
                        camera.position.x - Math.sin(camera.rotation.y - Math.PI/6) * 0.6,
                        camera.position.y - 0.2 + Math.sin(time*4 + camera.rotation.x + camera.rotation.z)*0.01,
                        camera.position.z - Math.cos(camera.rotation.y - Math.PI/6) * 0.6
                    )
                    // Rotation
                    newMeshWeapon.rotation.set(
                        camera.rotation.x,
                        camera.rotation.y + Math.PI,
                        camera.rotation.z
                    )
                    scene.add(newMeshWeapon)
                }
            } 
            ////
            // Contact entre 2 mesh
            ////
            function setupContactResultCallback(){

                cbContactResult = new Ammo.ConcreteContactResultCallback();
                cbContactResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
                    
                    let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );
                    const distance = contactPoint.getDistance();
                    if( distance > 0 ) return;

                    let colWrapper0 = Ammo.wrapPointer( colObj0Wrap, Ammo.btCollisionObjectWrapper );
                    let rb0 = Ammo.castObject( colWrapper0.getCollisionObject(), Ammo.btRigidBody );
                    
                    let colWrapper1 = Ammo.wrapPointer( colObj1Wrap, Ammo.btCollisionObjectWrapper );
                    let rb1 = Ammo.castObject( colWrapper1.getCollisionObject(), Ammo.btRigidBody );

                    let threeObject0 = rb0.threeObject;
                    let threeObject1 = rb1.threeObject;
                    let tag, localPos, worldPos

                    // Si la balle (dans threeObject0) touche un zombie (cible dans threeObject1)
                    if(threeObject1.userData.tag == "targetItem_zombie"){
        
                        // Si la vie est > 0, on décremente, sinon on tue
                        if(threeObject1.userData.remainLife > 0){
                            threeObject1.userData.remainLife -= 1

                        } else { // Zombie mort
                            // Permet de changer l'animation du zombie
                            mixers.forEach((mixer, index) => {
                                // Celui qui correspond à l'uuid du zomb touché
                                if(mixer._root.uuid == threeObject1.uuid && mixer._actions[0]._clip.name == 'Walk'){
                                    // On commence par stopper l'animation
                                    mixers.splice(index, 1)
                                    // On créé un nouveau mixer, pour ne pas avoir l'anim précédente
                                    const clip = THREE.AnimationClip.findByName(clips, 'Roll')
                                    let mixer2 = new THREE.AnimationMixer(threeObject1)
                                    let action = (mixer2.clipAction(clip))
                                    action.play()
                                    // On l'ajoute à la liste des anim, pour lancer l'animation tomber
                                    mixers.push(mixer2)
                                    // Les points sont utilisés
                                    threeObject1.userData.points = false
                                }
                            }) 
                        
                            // On enlève le zombie 2 secondes apres
                            let killInterval = setInterval(function(){   
                                if(!threeObject1.userData.points){
                                    // On recupere les index physic des objects
                                    const physicAmmo = rigidBodies.findIndex((obj) => obj.uuid === threeObject0.uuid);
                                    const physicTarget = rigidBodies.findIndex((obj) => obj.uuid === threeObject1.uuid);
                                    // Si index > -1, c'est que les objets sont dans la liste, donc sur la scene
                                    if (physicAmmo > -1 && physicTarget > -1) {
                                        // On enleve la partie physic de la liste
                                        rigidBodies.splice(physicAmmo, 1);
                                        rigidBodies.splice(physicTarget, 1);
                                        // On enleve du monde physic
                                        physicsWorld.removeRigidBody(threeObject0.userData.physicsBody)
                                        physicsWorld.removeRigidBody(threeObject1.userData.physicsBody)
                                        // On enleve la partie graphic
                                        scene.remove(threeObject0)
                                        scene.remove(threeObject1)
                                        // On met à jour le score
                                        score ++
                                        eventBus.emit("scoreChange", score)
                                        // On decremente le nombre de zombie restant
                                        remainZombie = remainZombie - 1
                                        clearInterval(killInterval);
                                    }
                                }                
                            }, 2900)
                        }
                    } else if (threeObject0.userData.tag == "ammo_"+player.weapon && threeObject1.userData.tag == "sceneItem"){ // Sinon on enlève juste la balle
                    } else if(threeObject0.userData.tag == "ammo_"+player.weapon){
                        // scene.remove(threeObject0)
                    }
                }
            }
            function setupContactPairResultCallback(){

                cbContactPairResult = new Ammo.ConcreteContactResultCallback();
                cbContactPairResult.hasContact = false;
                cbContactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
                    
                    let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );
                    const distance = contactPoint.getDistance();
                    if( distance > 0 ) return;

                    this.hasContact = true;
                }
            }
            ////
            // Gestion zombie restant, et nombre de manche
            ////
            function checkZombieRemain(){
                if(remainZombie == 0 && newRound){
                    // On va changer de round
                    newRound = false
                    // On fait clignoter le nombre de manche, prévenir à la suivante
                    eventBus.emit("onChangeRound")
                    setTimeout(async function(){
                        setTarget()
                        ressourcesLoad = true
                    }, 3000) 
                }
            }


            ////
            // Moteur de rendu, fait les frame
            ////
            function renderFrame() {

                // Ecran de chargement
                if(!ressourcesLoad){
                    requestAnimationFrame(renderFrame)
                    // Mouvement de la box
                    loadingScreen.box.position.x -= 0.05
                    if(loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10
                    loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x)

                    renderer.render(loadingScreen.scene, loadingScreen.camera)
                    return
                } else if(!player.alive || gameStop){                   
                    requestAnimationFrame(renderFrame)
                    // Mouvement de la box
                    deathScreen.camera.position.x -= 0.07
                    
                    if(deathScreen.camera.position.x < -10) deathScreen.camera.position.x = 13
                    deathScreen.camera.position.y = Math.sin(deathScreen.camera.position.x) + 12
                     
                    renderer.render(deathScreen.scene, deathScreen.camera)
                    // return
                } else {
                    // Check nombre de zombie restant dans la manche
                    checkZombieRemain()
                    // AmmoJs update physics : create clock for timing
                    deltaTime = clock.getDelta();
                    updatePhysics( deltaTime );
                    // Animation
                    mixers.forEach((mixer) => {
                        mixer.update(deltaTime/2)
                    })


                    renderer.render(scene, camera);
                    requestAnimationFrame(renderFrame);
                    // Movement 
                    let time = Date.now() * 0.0005
                    
                    ////
                    // Gestion du temps de vie des balles, et des impacts
                    ////
                    for(let i = 0; i < bullets.length; i++){
                        if(bullets[i].alive == false){
                            bullets.splice(i, 1)
                            continue
                        }
                        physicsWorld.contactTest( bullets[i].userData.physicsBody , cbContactResult );
                    }
                    //////
                    // POV
                    //////
                    fpsControls.update(deltaTime)
                    
                    ////
                    // Affichage de l'arme, en fonction de la visée 
                    ////
                    let actualWeaponAnimate = lastWeaponList[lastWeaponList.length - 1] // Dernier élément de la liste
                    // On récupère l'objet mesh de l'arme, pour pouvoir modifier sa position, rotation...
                    scene.traverse( function( object ) {
                        if(object.isObject3D && object.name == actualWeaponAnimate){  
                            weaponActuel = object
                        }
                    });

                    if(zoomView == 'not-aim'){      // Vue normal
                        // Vision gun : Position
                        weaponActuel.position.set(
                            camera.position.x - Math.sin(camera.rotation.y - Math.PI/6) * 0.6,
                            camera.position.y - 0.2 + Math.sin(time*4 + camera.rotation.x + camera.rotation.z)*0.01,
                            camera.position.z - Math.cos(camera.rotation.y - Math.PI/6) * 0.6
                        )
                        // Rotation
                        weaponActuel.rotation.set(
                            camera.rotation.x,
                            camera.rotation.y + Math.PI,
                            camera.rotation.z
                        )
                    } else {                        // Vue visé
                        // Vision gun : Position
                        weaponActuel.position.set(
                            camera.position.x - Math.sin(camera.rotation.y) * 0.6,
                            camera.position.y - weapons[actualWeaponAnimate].parameters.positionAimY,    // Position en fonction de l'arme
                            camera.position.z - Math.cos(camera.rotation.y) * 0.6
                        )
                        // Rotation
                        weaponActuel.rotation.set(
                            camera.rotation.x,
                            camera.rotation.y + Math.PI,
                            camera.rotation.z
                        )
                    }   
                };
            }
            // AmmoJs
            function updatePhysics(deltaTime){
                // Step world
                physicsWorld.stepSimulation( deltaTime, 10 );
                // Update rigid bodies
                for ( let i = 0; i < rigidBodies.length; i++ ) {
                    let objThree = rigidBodies[ i ];
                    let objAmmo = objThree.userData.physicsBody;
                    let ms = objAmmo.getMotionState();
                    // Pas capté
                    if ( ms ) {
                        ms.getWorldTransform( tmpTrans );
                        let p = tmpTrans.getOrigin();
                        let q = tmpTrans.getRotation();
                        objThree.position.set( p.x(), p.y(), p.z() );
                        objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
                    }
                    // Rotation et déplacement des zombies
                    if(rigidBodies[i].userData.tag == 'targetItem_zombie' && rigidBodies[i].userData.remainLife > 0){
                        // Position de la camera, l'endroit vers où le zombie regarde
                        let camPosX = camera.position.x
                        let camPosY = camera.position.y/2
                        let camPosZ = camera.position.z
                        rigidBodies[i].lookAt(camPosX, camPosY, camPosZ)
                        // 'Vitesse' du vecteur de direction
                        let scalingFactor = 1;
                        // Met à jour la position du zombie
                        rigidBodies[i].updateMatrixWorld();
                        let zombPosX = rigidBodies[i].matrixWorld.elements[12]  // Coord X
                        let zombPosZ = rigidBodies[i].matrixWorld.elements[14]  // Coord Z
                        // Différence entre les 2 objects
                        let diffX = camPosX - zombPosX
                        let diffZ = camPosZ - zombPosZ
                        // Distance de déplacement
                        let moveX 
                        let moveZ
                        // Déplace dans une direction, en fonction de la position du zomb et de la cam
                        if(diffX > 0.1){ moveX = 0.85 } else if (diffX < -0.1){ moveX = -0.85 } else { moveX = 0 }
                        if(diffZ > 0.1){ moveZ = 0.85 } else if (diffZ < -0.1){ moveZ = -0.85 } else { moveZ = 0 }
                        // Si zombie sur la cam, on fait rien
                        if( moveX == 0 && moveZ == 0) return;
                        // Sinon vecteur dans la direction
                        let resultantImpulse = new Ammo.btVector3( moveX, 0 , moveZ )
                        resultantImpulse.op_mul(scalingFactor);
                        // Assignation vecteur pour déplacement
                        let physicsBody = rigidBodies[i].userData.physicsBody;
                        // Collé au sol
                        physicsBody.threeObject.position.y = 0
                        // Ajout le vecteur de déplacement                 
                        physicsBody.setLinearVelocity( resultantImpulse )
                    }
                }
            };
            ///////////////////////////////////////////////////////////
            // Class controle POV
            const KEYS = {
                'z': 90,
                's': 83,
                'q': 81,
                'd': 68,
            };

            function clamp(x, a, b) {
                return Math.min(Math.max(x, a), b);
            }

            class InputController {
                constructor(target) {
                    this.target_ = target || document;
                    this.initialize_();    
                }

                initialize_() {
                    this.current_ = {
                    mouseXDelta: 0,
                    mouseYDelta: 0,
                    mouseX: 0,
                    mouseY: 0,
                    };
                    this.previous_ = null;
                    this.keys_ = {};
                    this.previousKeys_ = {};
                    this.target_.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
                    this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
                    this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
                }

                onMouseMove_(e) {
                    this.current_.mouseX = e.pageX - window.innerWidth / 2;
                    this.current_.mouseY = e.pageY - window.innerHeight / 2;

                    if (this.previous_ === null) {
                    this.previous_ = {...this.current_};
                    }

                    this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
                    this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
                }

                onKeyDown_(e) {
                    this.keys_[e.keyCode] = true;
                }

                onKeyUp_(e) {
                    this.keys_[e.keyCode] = false;
                }

                key(keyCode) {
                    return !!this.keys_[keyCode];
                }

                update(_) {
                    if (this.previous_ !== null) {
                    this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
                    this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

                    this.previous_ = {...this.current_};
                    }
                }
            };

            class FirstPersonCamera {
                constructor(camera) {
                    this.camera_ = camera;
                    this.input_ = new InputController();
                    this.rotation_ = new THREE.Quaternion();
                    this.translation_ = new THREE.Vector3(0, 2, 0);
                    this.phi_ = 0;
                    this.phiSpeed_ = 8;
                    this.theta_ = 0;
                    this.thetaSpeed_ = 5;
                    this.playerSpeed = 7
                    this.velocity_y = 0
                    this.playerCanJump = true
                    this.clock = new THREE.Clock()
                    this.deltaTime = null
                }

                update(timeElapsedS) {
                    this.updateRotation_(timeElapsedS);
                    this.updateCamera_(timeElapsedS);
                    this.updateTranslation_(timeElapsedS);
                    this.input_.update(timeElapsedS);
                }

                updateCamera_(_) {
                    this.camera_.quaternion.copy(this.rotation_);
                    this.camera_.position.copy(this.translation_);

                    let deltaTime = 0.0165
                    // Snike : accroupi
                    if(this.input_.key(20)){      
                        this.camera_.position.y = 1
                    } 
                    // Space : jump !
                    if (this.input_.key(32) && this.playerCanJump) { 
                        this.playerCanJump = false
                        this.velocity_y = 100;
                        this.camera_.position.y+=(this.velocity_y/2)*deltaTime;
                    }
                    this.camera_.position.y+=this.velocity_y*deltaTime;
                    if(!this.playerCanJump){
                        this.velocity_y-=9.8*30*deltaTime;
                        console.log(this.velocity_y, "\n", deltaTime)
                        if(this.camera_.position.y<=1.8){
                            this.playerCanJump = true
                            this.velocity_y=0;
                            this.camera_.position.y= 1.8;
                        }
                    }
                    const forward = new THREE.Vector3(0, 0, -1);
                    forward.applyQuaternion(this.rotation_);

                    const dir = forward.clone();

                    forward.multiplyScalar(100);
                    forward.add(this.translation_);

                    let closest = forward;
                    const result = new THREE.Vector3();
                    const ray = new THREE.Ray(this.translation_, dir);

                    this.camera_.lookAt(closest);
                }

                updateTranslation_(timeElapsedS) {
                    const forwardVelocity = (this.input_.key(KEYS.z) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
                    const strafeVelocity = (this.input_.key(KEYS.q) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)

                    const qx = new THREE.Quaternion();
                    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);

                    // Sprint ou marche normal
                    if(this.input_.key(16)){      
                        this.playerSpeed = 11
                    } else {
                        this.playerSpeed = 7
                    }

                    const forward = new THREE.Vector3(0, 0, -1);
                    forward.applyQuaternion(qx);
                    forward.multiplyScalar(forwardVelocity * timeElapsedS * this.playerSpeed);

                    const left = new THREE.Vector3(-1, 0, 0);
                    left.applyQuaternion(qx);
                    left.multiplyScalar(strafeVelocity * timeElapsedS * this.playerSpeed);

                    this.translation_.add(forward);
                    this.translation_.add(left);
                }

                updateRotation_(timeElapsedS) {
                    const xh = this.input_.current_.mouseXDelta / window.innerWidth;
                    const yh = this.input_.current_.mouseYDelta / window.innerHeight;

                    this.phi_ += -xh * this.phiSpeed_;
                    this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);

                    const qx = new THREE.Quaternion();
                    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
                    const qz = new THREE.Quaternion();
                    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);

                    const q = new THREE.Quaternion();
                    q.multiply(qx);
                    q.multiply(qz);

                    this.rotation_.copy(q);
                }
            }

        },
        data(){
            return {
                // Variables déclarées ici pour être envoyé en tant que props, dans un component
                player: {height: 1.8, canShoot: true, canJump: true, speed: 0.065, turnSpeed: Math.PI*0.02, alive: true, weapon: 'pistolSilencer', weaponMesh: null},
                viseur: '',         // Change la couleur du viseur
                score: 0,                   // Score du jeu
                remainBullets: 0,
                isSound: [false],
            }
        },
    };
</script>
  

<style>
.scene{
    height: 100vh;
    width: 100vw;
    cursor: none;
    position: relative;
}
/* Menu changement couleur */
.menu-color{
    width: auto !important;
    height: auto;
    background-color: rgba(69, 69, 69, 0.557);
    border-radius: 5px;
    position:absolute; 
    top:10px; 
    left:10px;
}.menu-color:hover{
    cursor: pointer;
    background-color: red;
}
/* Couleurs pour le viseur */
.color{
    width: 20px;
    height: 20px;
    color: grey;
}.white{
    background-color: white;
}.red{
    background-color: red;
}.yellow{
    background-color: yellow;
}.green{
    background-color: green;
}.blue{
    background-color: blue;
}.purple{
    background-color: purple;
}.black{
    background-color: black;
}
/* Viseur */
.viseur{
    position:absolute; 
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}.icon-viseur{
    height: 40px;
    width: 40px;
}
/* Affichage score */
.menu-score{
    width: auto !important;
    height: auto;
    background-color: rgba(69, 69, 69, 0.557);
    border-radius: 5px;
    position:absolute; 
    left:30vw;
    right: 30vw;
    color: white;
}
/* Affichage chargeur */
.display-component{
    position:absolute; 
}
</style>
