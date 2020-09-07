import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { connect } from 'react-redux';
import './Home.css';
import NavMenu from "./NavMenu";
import {BufferGeometry} from "three";

type HomeState = {
    mount: HTMLDivElement | null
}

class Home extends React.PureComponent<{}, HomeState> {
    public state: HomeState = {
        mount: null
    };

    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera | undefined;
    private controls?: OrbitControls;
    private renderer: THREE.WebGLRenderer | undefined;
    private clock: THREE.Clock = new THREE.Clock();
    private pos: THREE.Euler = new THREE.Euler();
    private particles?: THREE.Points;
    private particlesCount: number = 10000;
    private particlesPositions: number[] = [];
    private particlesVelocity: THREE.Vector3[] = [];
    private mixers: THREE.AnimationMixer[] = [];

    public componentDidMount() {
        // create the sky mesh
        this.createSky();
        
        this.camera = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight), 0.1, 10000);
        this.camera.position.set(1,350,900);
        this.pos = this.camera.rotation.clone();
        
        // create the particles
        this.createParticles();
        
        // create lights
        this.addLights();
        
        // create text
        this.loadTextModel();
        
        this.camera.updateMatrix();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.state.mount !== null) {
            this.state.mount.appendChild(this.renderer.domElement);
        }

        // setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.rotateSpeed = 0.5;
        this.controls.autoRotateSpeed = 0.3;
        this.controls.update();
        
        // set up event listeners.
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
        this.animate();
    }
    
    private addLights = () => {
        // add lights
        const hemiLight = new THREE.HemisphereLight(0x8DE7F0, 0x380036, 0.4);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);

        const dirLightRed = new THREE.DirectionalLight(0xFF6C64, 0.5);
        dirLightRed.color.setHSL(0.1, 1, 0.95);
        dirLightRed.position.set(10, -5, -5);
        dirLightRed.position.multiplyScalar(30);
        this.scene.add(dirLightRed);

        const dirLightWhite = new THREE.DirectionalLight(0xFFB313, 1);
        dirLightWhite.color.setHSL(0.1, 1, 0.95);
        dirLightWhite.position.set(-2, 5, 5);
        dirLightWhite.position.multiplyScalar(30);
        this.scene.add(dirLightWhite);

        dirLightWhite.castShadow = true;

        dirLightWhite.shadow.mapSize.width = 2048;
        dirLightWhite.shadow.mapSize.height = 2048;

        const d = 50;
        dirLightWhite.shadow.camera.left = -d;
        dirLightWhite.shadow.camera.right = d;
        dirLightWhite.shadow.camera.top = d;
        dirLightWhite.shadow.camera.bottom = -d;
        dirLightWhite.shadow.camera.far = 3500;
        dirLightWhite.shadow.bias = -0.0001;
    }
    
    private loadTextModel = () => {
        const loader = new GLTFLoader();
        let that = this;
        let translateX = 0;
        loader.load('./giacomopalma_text.glb', function (gltf){
            let mesh = gltf.scene.children[0] as THREE.Mesh;
            let scale = 200;
            mesh.scale.set(scale, scale, scale);

            let bigLettersGeometry = (mesh.children[0] as THREE.Mesh).geometry as BufferGeometry;
            if(bigLettersGeometry.boundingBox == undefined)
            {
                return;
            }
            
            translateX = -0.5 * (bigLettersGeometry.boundingBox.max.x - bigLettersGeometry.boundingBox.min.x);
            
            for(let i = 0; i < mesh.children.length; i++)
            {
                let child = mesh.children[i] as THREE.Mesh;
                child.geometry.translate(translateX, 0, 0);
            }
            that.scene.add(mesh);

            loader.load('./fullstack_developer.glb', function (gltf) {
                console.log(gltf.scene);
                for (let i = 0; i < gltf.scene.children.length; i++) {
                    let mesh = gltf.scene.children[i] as THREE.Mesh;
                    let fullstackGeometry = mesh.geometry as BufferGeometry;
                    if (fullstackGeometry.boundingBox == undefined) {
                        return;
                    }
                    
                    fullstackGeometry.translate(translateX, 0, 0.6);
                    that.animateLetter(mesh, i);
                }
                that.scene.add(gltf.scene);
            }, undefined, function (error) {
                console.log(error);
            })
        }, undefined, function(error){
            console.log(error);
        })
    }

    private createSky = () => {
        // ** Sky ** //
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        if (context === null) {
            return;
        }
        const gradient = context.createLinearGradient(0, 0, 0, 32);
        gradient.addColorStop(0.0, '#380036');
        gradient.addColorStop(1.0, '#0CBABA');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const sky = new THREE.Mesh(
            new THREE.SphereBufferGeometry(2000),
            new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas), side: THREE.BackSide})
        );
        this.scene.add(sky);
    }
    
    private createParticles = () => {
        // create the particle variables
        const colors = [];
        const color = new THREE.Color();
        const particleGeometry = new THREE.BufferGeometry();
        const textureLoader = new THREE.TextureLoader();
        const particleSprite = textureLoader.load('./sprites/magic_05.png');

        for (let i = 0; i < this.particlesCount; i++) {
            let x = Math.random() * 2000 - 1000;
            let y = Math.random() * 2000 - 1000;
            let z = Math.random() * 2000 - 1000;

            let hue = Math.floor(Math.random() * 70) + 20;
            let normalizedHue = this.normalizeValue(0, 360, hue);
            let randomX = Math.random() * (10) - 5;
            let randomY = Math.random() * (10) - 5;
            let randomZ = Math.random() * 4 - 2;
            let velocity = new THREE.Vector3(randomX, randomY, randomZ);
            this.particlesVelocity.push(velocity, velocity, velocity);
            color.setHSL(normalizedHue, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
            this.particlesPositions.push(x, y, z);
        }

        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.particlesPositions, 3).setUsage(THREE.DynamicDrawUsage));
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

        particleGeometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({
            size: 5,
            map: particleSprite,
            blending: THREE.AdditiveBlending,
            opacity: 1,
            transparent: true,
            vertexColors: true
        });

        this.particles = new THREE.Points(particleGeometry, material);
        this.scene.add(this.particles);
    }
    
    private normalizeValue = (min: number, max: number, value: number) => {
        let delta = max - min;
        return (value - min) / delta;
    }
    
    private animateParticles = () => {
        if (this.particles !== undefined) {
            let geometry = this.particles.geometry as THREE.BufferGeometry;
            let attributes = geometry.attributes;
            
            // for (let i = 0; i < attributes.position.array.length; i++) {
            //     let velocity = this.particlesVelocity[i];
            //     // @ts-ignore
            //     attributes.position.array[i * 3 + 2] += velocity.z * 0.01;
            //     // @ts-ignore
            //     attributes.position.array[i * 3 + 1] += velocity.y * 0.01;
            //     // @ts-ignore
            //     attributes.position.array[i * 3] += velocity.x * 0.01;
            // }
            //
            // attributes.position.needsUpdate = true;
        }
    }
    
    public animateLetter = (object: THREE.Object3D, index: number) => {
        const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 0.2, 0.3], [0, 0, 0, 120, 120, 120, 100, 100, 100]);
        const clip = new THREE.AnimationClip('Action', 0.3, [scaleKF]);
        let mixer = new THREE.AnimationMixer(object);
        let clipAction = mixer.clipAction(clip);
        clipAction.loop = THREE.LoopOnce;
        clipAction.clampWhenFinished = true;
        clipAction.play();
        clipAction.startAt(0.3 * index);
        this.mixers.push(mixer);
    }

    public onWindowResize = () => {
        if (this.camera === undefined || this.renderer === undefined) {
            console.log("cam or rendered undefined in resize");
            return;
        }
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public animate = () => {
        if (this.camera === undefined) {
            return;
        }

        requestAnimationFrame(this.animate);

        this.draw();
    }

    public draw = () => {
        if (this.renderer === undefined || this.camera === undefined || this.controls === undefined) {
            return;
        }
        
        let delta = this.clock.getDelta();
        
        // update animation mixers
        if(this.mixers.length > 0)
        {
            for(let i = 0; i < this.mixers.length; i++)
            {
                let mixer = this.mixers[i];
                mixer.update(delta);
            }
        }
        
        // animate particles
        this.animateParticles();
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    public render() {
        return (
            <div>
                <div id="home-canvas" ref={ref => this.state.mount = ref}/>
                <NavMenu />
            </div>
        )
    }
}


export default connect()(Home);
