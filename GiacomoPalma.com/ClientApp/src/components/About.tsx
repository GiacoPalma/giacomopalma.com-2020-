import * as React from 'react';
import { connect } from 'react-redux';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import './About.css';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {AnimationBlendMode, LoopOnce, Mesh} from "three";

interface AboutState {
    mount: HTMLDivElement | null
}

class About extends React.PureComponent<{}, AboutState> {

    public state: AboutState = {
        mount: null
    };
    
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera | undefined;
    private renderer: THREE.WebGLRenderer | undefined;
    private clock: THREE.Clock = new THREE.Clock();
    private mixers: THREE.AnimationMixer[] = [];
    private controls?: OrbitControls;
    
    public componentDidMount() {
        this.camera = new THREE.PerspectiveCamera(50, 2.5, 0.1, 2000);
        this.camera.position.set(-49.5, 28.9, 35.4);
        this.camera.updateMatrix();
        
        this.addLights();
        this.loadModels();
        
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(0xFFFFFF, 0);
        this.renderer.setSize(window.innerWidth, window.innerHeight / 2);
        if (this.state.mount !== null) {
            this.state.mount.appendChild(this.renderer.domElement);
        }
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(-37.5, 13.4, -15);
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
        this.controls.update();
        
        this.scene.position.x -= 20;
        //this.animateMovement();
        // set up event listeners.
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
        this.animate();
    }
    
    public loadModels = () => {
        const loader = new GLTFLoader();
        let that = this;
        loader.load("./snowboarder.glb", function(gltf){
            console.log(gltf);
            
            gltf.scene.traverse(function(node) {
                node.castShadow = true;
                node.receiveShadow = true;
            })
            
            let animations = gltf.animations;
            if(animations && animations.length)
            {
                let mixer = new THREE.AnimationMixer(gltf.scene);
                for(let i = 0; i < animations.length; i++)
                {
                    let animation = animations[i];
                    let action = mixer.clipAction(animation);
                    action.loop = LoopOnce;
                    action.clampWhenFinished = true;
                    action.play();
                }
                that.mixers.push(mixer);
            }
           
            that.scene.add(gltf.scene);
        }, undefined, function(error){
            console.log(error);
        });
    }

    private addLights = () => {
        // add lights
        const hemiLight = new THREE.HemisphereLight(0x8DE7F0, 0x380036, 0.4);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);

        const dirLightRed = new THREE.DirectionalLight(0xFF6C64, 0.8);
        dirLightRed.color.setHSL(0.1, 1, 0.95);
        dirLightRed.position.set(5, 10, 5);
        dirLightRed.castShadow = true;
        this.scene.add(dirLightRed);

        const dirLightWhite = new THREE.DirectionalLight(0xFFB313, 1);
        dirLightWhite.color.setHSL(0.1, 1, 0.95);
        dirLightWhite.position.set(-2, 15, 5);
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
        requestAnimationFrame(this.animate);
        this.draw();
    }
    
    public animateMovement = () => {
        const moveKF = new THREE.VectorKeyframeTrack('.position', [0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3], [-25,-7,0, -20,-8,0.5, -15,-7,0.5, -5,-8,0, 5,-5,0, 15,3,0, 25,4,0, 30,2,0]);
        const clip = new THREE.AnimationClip('Action', 3, [moveKF]);
        let mixer = new THREE.AnimationMixer(this.scene);
        let clipAction = mixer.clipAction(clip);
        clipAction.loop = THREE.LoopOnce;
        clipAction.clampWhenFinished = true;
        clipAction.play();
        this.mixers.push(mixer);
    }

    public draw = () => {
        if (this.renderer === undefined || this.camera === undefined || this.controls == undefined) {
            return;
        }

        let delta = this.clock.getDelta();
        if(this.mixers.length > 0)
        {
            for(var i = 0; i < this.mixers.length; i++)
            {
                this.mixers[i].update(delta);
            }
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    public render() {
        return (
            <React.Fragment>
                <h1>Who am I?</h1>

                <p className="intro">
                    I'm a software and web developer who has been working as a programmer since the beginning of 2013.
                </p>
                <p>In my role as a software developer I have worked in several different sectors and projects. I started my career working on 
                Facebook applications and web applications using mainly PHP, Jquery, HTML and CSS. Later I moved on to working in my private company making games mainly for Android using Java.
                Then I decided to become an employee again since I was not making enough money on my games and started working in the casino games industry. I learned a lot
                and worked mostly in C#, .Net MVC, Javascript, NodeJS, with several other frameworks and tools too many to list here.
                </p>
                <p>I happened to find love and because of that I decided to move away from my hometown of Växjö and move to Västerås instead. In Västerås I started working as a consultant
                and worked mostly with JavaScript and C#. I also had the opportunity to learn more Unity, VueJS and ReactJS during my time working as a consultant and had the opportunity
                to work with different businesses on vastly different projects.</p>
                <p>Currently I am now a founder of my own company, and working as a consultant still. Just not as an employee but as my own employer instead.</p>
                <p>Besides programming I enjoy basketball, snowboarding, playing videogames, spending time with loved ones and exploring the world!
                I try to always maintain a positive outlook on life and I really believe that we are in control of how we handle any situation, at least emotionally.
                I hope that I can spread joy around me and be a positive influence to those that come behind me.
                </p>
                <div>
                    <blockquote>"Dedication sees dreams come true"</blockquote>
                    - Kobe Bryant
                </div>
                <div id="about-canvas" ref={ref => this.state.mount = ref}/>
            </React.Fragment>
        );
    }
};

export default connect()(About);
