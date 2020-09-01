import * as React from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {connect} from 'react-redux';
import './Home.css';

type HomeState = {
    mount: HTMLDivElement | null
}

class Home extends React.PureComponent<{}, HomeState> {
    public state: HomeState = {
        mount: null
    };

    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera | undefined;
    private renderer: THREE.WebGLRenderer | undefined;
    private clock: THREE.Clock = new THREE.Clock();
    private rand1: number = Math.random();
    private rand2: number = Math.random();
    private rand3: number = Math.random();
    private pos: THREE.Euler = new THREE.Euler();
    private pos2: THREE.Euler = new THREE.Euler();
    private moveBack: boolean = false;
    private particles?: THREE.Points;
    private particlesCount: number = 10000;
    private particlesPositions: number[] = [];

    public componentDidMount() {
        // === THREE.JS CODE START ===
        // Sky

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        if (context == null) {
            return;
        }
        const gradient = context.createLinearGradient(0, 0, 0, 32);
        gradient.addColorStop(0.0, '#014a84');
        gradient.addColorStop(0.5, '#0561a0');
        gradient.addColorStop(1.0, '#437ab6');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const sky = new THREE.Mesh(
            new THREE.SphereBufferGeometry(2000),
            new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas), side: THREE.BackSide})
        );
        this.scene.add(sky);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(350, 640, 990);
        this.pos = this.camera.rotation.clone();
        var that = this;
        var loader = new THREE.FontLoader();
        loader.load('./fonts/Catamaran_Thin_Regular.json', function (font) {

            var xMid, text;

            var color = 0xDFDFDF;

            var matDark = new THREE.LineBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            var matLite = new THREE.MeshBasicMaterial({
                color: "rgb(31, 172, 242)",
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });

            var message = "   Giacomo Palma\nFullstack Developer";
            var shapes = font.generateShapes(message, 100);
            var geometry = new THREE.ShapeBufferGeometry(shapes);
            geometry.computeBoundingBox();

            if (geometry.boundingBox == null) {
                console.log("geometry boundinbox null");
                return;
            }

            xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid, 0, 0);

            // make shape ( N.B. edge view not visible )
            text = new THREE.Mesh(geometry, matLite);
            text.position.z = 10;
            that.scene.add(text);

            // make line shape ( N.B. edge view remains visible )
            var holeShapes = [];
            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i];
                if (shape.holes && shape.holes.length > 0) {
                    for (var j = 0; j < shape.holes.length; j++) {
                        var hole = shape.holes[j];
                        holeShapes.push(hole);
                    }
                }
            }

            if (holeShapes == null) {
                console.log("null shapes");
                return;
            }

            // @ts-ignore
            shapes.push.apply(shapes, holeShapes);
            var lineText = new THREE.Object3D();

            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i];

                var points = shape.getPoints();
                var geometry = new THREE.BufferGeometry().setFromPoints(points);

                geometry.translate(xMid, 0, 0);

                var lineMesh = new THREE.Line(geometry, matDark);
                lineText.add(lineMesh);
            }

            lineText.position.z = 150;
            that.scene.add(lineText);

        }, function (load) {
            console.log(load);
        }, function (err) {
            console.log(err);
        }); //end load function

        // ** PARTICLES **//
        // create the particle variables
        var colors = [];
        var color = new THREE.Color();
        var particleGeometry = new THREE.BufferGeometry();
        var textureLoader = new THREE.TextureLoader();
        var particleSprite = textureLoader.load('./sprites/magic_05.png');
        
        for(var i = 0; i < this.particlesCount; i ++){
            var x = Math.random() * 2000 - 1000;
            var y = Math.random() * 2000 - 1000;
            var z = Math.random() * 2000 - 1000;
            
            var hue = Math.floor(Math.random() * 70) + 20;
            var normalizedHue = this.normalizeValue(0, 360, hue);
            color.setHSL(normalizedHue, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
            this.particlesPositions.push(x, y, z);
        }

        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.particlesPositions, 3).setUsage(THREE.DynamicDrawUsage));
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
        
        particleGeometry.computeBoundingSphere();
        
        var material = new THREE.PointsMaterial({
            size: 3,
            map: particleSprite,
            blending: THREE.AdditiveBlending,
            opacity: 1,
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(particleGeometry, material);
        this.scene.add(this.particles);
        
        /** END PARTICLES **/
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.state.mount != null) {
            console.log("appended");
            this.state.mount.appendChild(this.renderer.domElement);
        }

        var controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.update();
        window.addEventListener('resize', this.onWindowResize, false)
        this.animate();
    }
    
    private normalizeValue = (min: number, max: number, value: number) => {
        var delta = max - min;
        return (value - min) / delta;
    }

    public onWindowResize = () => {
        if (this.camera == undefined || this.renderer == undefined) {
            console.log("cam or rendered undefined in resize");
            return;
        }
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public animate = () => {
        if (this.camera == undefined) {
            return;
        }

        if (this.particles) {
            for (var i = 0; i < this.particlesCount; i++) {
                var velocity = new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2);
                this.particlesPositions[i * 3] += velocity.x;
                this.particlesPositions[i * 3 + 1] += velocity.y;
                this.particlesPositions[i * 3 + 2] += velocity.z;
            }

            (this.particles.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
        }
        
        requestAnimationFrame(this.animate);

        var delta = this.clock.getDelta();

        var step = 0.01 * delta;

        this.draw();
    }

    public draw = () => {
        if (this.renderer == undefined || this.camera == undefined) {
            return;
        }
        this.renderer.render(this.scene, this.camera);
    }

    public render() {
        return (
            <div>
                <div ref={ref => this.state.mount = ref}></div>
                <div className="button">About</div>
            </div>

        )
    }
}


export default connect()(Home);
