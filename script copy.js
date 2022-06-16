import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
//import { EasePack } from "gsap/EasePack";
//gsap.registerPlugin(EasePack);


/*
 * Base
 */
// Debug
//const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const color = 0xffffff;  // white
const near = 0.1;
const far = 100;
scene.background = new THREE.Color(0x000000);
//scene.fog = new THREE.Fog(0x000000, 10, 45);
//scene.fog = new THREE.FogExp2(0x000000, 0.02)


// Texture
const textureLoader = new THREE.TextureLoader();

/*
 * Models 
 */
const particleShape = new THREE.TextureLoader().load("./static/particleShape.png");
const plyLoader = new PLYLoader();
const material = new THREE.PointsMaterial({
    vertexColors: true,
	size: 0.03,
	map: particleShape,
	transparent: true,
	blending: THREE.AdditiveBlending,
	sizeAttenuation:true,
	alphaMap: particleShape,
	depthWrite: false
});
const material2 = new THREE.PointsMaterial({
    vertexColors: true,
	size: 0.08,
	map: particleShape,
	transparent: true,
	blending: THREE.AdditiveBlending,
	sizeAttenuation:true,
	alphaMap: particleShape,
	depthWrite: false
});
plyLoader.load('./static/models/PointCloudTest.ply', (geometry) => { 
	const particles = new THREE.Points(geometry, material);

    scene.add(particles);
});
plyLoader.load('./static/models/PointCloudForest2.ply', (geometry) => { 
	const particles = new THREE.Points(geometry, material2);
	particles.position.set(22,-30,5)
    scene.add(particles);
});
plyLoader.load('./static/models/PointCloudFlower1.ply', (geometry) => { 
	const particles = new THREE.Points(geometry, material2);
	particles.position.set(66,-35,-18)
	particles.rotation.set(0,1.6,0)
	
    scene.add(particles);
});

const backgroundGeometry1 = new THREE.BufferGeometry();
const backgroundGeometry2 = new THREE.BufferGeometry();

const count1 = 15000;
const count2 = 9000;

const positions1 = new Float32Array(count1 * 3);
const positions2 = new Float32Array(count2 * 3);

for (let i = 0; i < count1 * 3; i++) {
	positions1[i] = (Math.random() - 0.5) * 500;
}
for (let i = 0; i < count2 * 3; i++) {
	positions2[i] = (Math.random() - 0.5) * 200;
}

backgroundGeometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3))
backgroundGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))


const backgroundMaterial1 = new THREE.PointsMaterial({
	size: 0.01,
	map: particleShape,
	transparent: true,
	blending: THREE.AdditiveBlending,
	sizeAttenuation:true,
	alphaMap: particleShape,
	depthWrite: false,
	opacity:0,
	color: new THREE.Color(0x8efaa6)
});
const backgroundMaterial2 = new THREE.PointsMaterial({
	//vertexColors: true,
	size: 0.03,
	map: particleShape,
	transparent: true,
	blending: THREE.AdditiveBlending,
	sizeAttenuation:true,
	alphaMap: particleShape,
	depthWrite: false,
	opacity:0,
	color: new THREE.Color(0xC1E1C1)
});

const background1 = new THREE.Points(backgroundGeometry1, backgroundMaterial1)
const background2 = new THREE.Points(backgroundGeometry2, backgroundMaterial2)

scene.add(background1);
scene.add(background2);



/*
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = - 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = - 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);



/*
 * Window fullSize
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};


/*
 * Camera
 */
// PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45,	sizes.width / sizes.height, 0.1, 100);
camera.position.x = 2.7388667694354347;
camera.position.y = 1.35;
camera.position.z = -0.4182813456070749;

//camera.lookAt(mesh.position)
scene.add(camera);

// OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enabled = true;
controls.enableDamping = true;
controls.dampingFactor = 0.005;
//controls.zoomSpeed = 0.5;
//controls.maxDistance = 5;

//controls.maxPolarAngle = Math.PI * 0.35;


/*
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
 * Animate
 */

const helperPos = {
	x: 63, y: -34, z: 0
}
const helperGeo = new THREE.SphereGeometry(0.1, 10, 10);
const helperMat = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const helperSphere = new THREE.Mesh(helperGeo, helperMat);
helperSphere.position.set(helperPos.x, helperPos.y, helperPos.z);
scene.add(helperSphere);
//camera.lookAt(helperSphere);

// Camera Animation
var masterTl = gsap.timeline({ paused: true });
let targetPath1 = [
	{ x: 0, y: 0, z: 0 },
	{ x: 0.3, y: -0.5, z: 0.3 },
	{ x: 0.7, y: -6, z: 0.7 },
	{ x: 35, y: -30, z: 3 },
	{ x: 60, y: -30, z: 0 },
	{ x: 70, y: -32, z: -15 }
];

let cameraPath1 = [
	{ x: 2.7388667694354347, y: 1.35, z: -0.4182813456070749 },
	{ x: 0.8, y: 2.4, z: -0.1 },
	{ x: 0.4, y: -1, z: 0.4 },
	{ x: -1.5, y: -30, z: 2  },
	{ x: 30, y: -33, z: 4 },
	{ x: 40, y: -32.6, z: -2 },
	{ x: 63, y: -33, z: 0 },
	{ x: 80, y: -30, z: -5 }
];
let cameraPath2 = [
	{ x: 80, y: -30, z: -5 },
	{ x: 61, y: -32, z: -37 },

]

masterTl.to(controls.target, {
		ease: "power1.inOut",
		motionPath: { path: targetPath1, autoRotate: true, type: "soft", },
		duration: 30,
		
	}, 0)
	.to(camera.position, {
		ease: "power1.inOut",
		motionPath: { path: cameraPath1, autoRotate: true, type: "soft" },
		duration: 37.5,

	}, 0)
	.to(camera.position, {
		ease: "power1.in",
		motionPath: { path: cameraPath2, autoRotate: true, type: "soft" },
		duration: 8,

	}, 37.5)
	;
//masterTl.timeScale(2);
if (masterTl.paused) {
	//controls.autoRotate = true;
	//controls.autoRotateSpeed = 0.1;
}
//const ease= 'none';

//masterTl.to(controls.target, { duration: 1.5, x: 0.3, y: -0.5, z: 0.3 ,ease}, 0)
//	.to(camera.position, { duration: 1.5, x: 0.8, y: 2.4, z: -0.1 ,ease}, 0)
//	.to(controls.target, { duration: 3, x: 0.7, y: -10, z: 0.7 ,ease},1.5)
//	.to(camera.position, { duration: 3, x: 0.1, y: -1, z: 0.1 ,ease},1.5)
//	;



// Text Animation
const startButton = document.querySelector(".title")
const text = startButton.querySelectorAll('span');
var textTl = gsap.timeline({paused: true});
textTl.to(text, { duration: 1.2, yPercent: 110, autoAlpha: 0, stagger: 0.05, ease: "expo.inOut" },0.8);

// Start Event

//const startButton = document.querySelector(".title");
const audio = document.getElementById("audio");


let audioSource; 
let analyser; 
let bufferLength; 
let dataArray; 

let clicked = false;

startButton.addEventListener('click', () => {
	const audioContext = new AudioContext();
	//Camera & Text Animation
	masterTl.paused(false);
	textTl.paused(false);

	//AudioVisual
	//audioData();

	audio.play();

	audioSource = audioContext.createMediaElementSource(audio);
	analyser = audioContext.createAnalyser();
	audioSource.connect(analyser);
	analyser.connect(audioContext.destination);
	analyser.fftSize = 256;
	//analyser.smoothingTimeConstant = 0.0;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Float32Array(bufferLength);

	return clicked = true;
});

//const baseSpeed = 0.01;
//masterTl.timeScale(baseSpeed);

startButton.addEventListener('touchend', (ev) => {
	ev.preventDefault();
	
	masterTl.paused(false);
	textTl.paused(false);

	//audioVisual
	audio.play();
	audioData();

});

const updateTime = () => {
	// Update objects

	// OrbitControls
	controls.update();
	//console.log(controls.object.position);
	//console.log(camera.position);
	//console.log(controls.target);

	// Render
	renderer.render(scene, camera);

	window.requestAnimationFrame(updateTime);

	if (clicked) {
		analyser.getFloatFrequencyData(dataArray);

		//const baseSpeed = 1;
		for (let i = 0; i < bufferLength; i++) {
			let SoundVolume = (dataArray[i] + 190) / 300;
			//let SoundVolume2 = (dataArray[i] + 190)/ 50;

			background2.material.opacity = SoundVolume*10;
			background2.material.size = SoundVolume *5;
			background2.material.opacity = SoundVolume*10;
			background2.material.size = SoundVolume *2;
			//background2.material.size = SoundVolume2;

			//const speed = baseSpeed * SoundVolume
			//masterTl.timeScale(speed);
			//console.log(speed);
			//console.log(SoundVolume);


		}
		//console.log(camera.position)
	}
};

updateTime();
