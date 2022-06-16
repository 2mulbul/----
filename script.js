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
scene.fog = new THREE.Fog(0x000000, 10, 45);
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
	particles.position.set(70,-35,8)
	particles.rotation.set(0,-1.3,0)
	
    scene.add(particles);
});
plyLoader.load('./static/models/PointCloudRocks1.ply', (geometry) => { 
	const particles = new THREE.Points(geometry, material);
	particles.position.set(55,-70,30)
	particles.rotation.set(0,0.3,0)
	
    scene.add(particles);
});
plyLoader.load('./static/models/PointCloudPiano1.ply', (geometry) => { 
	const particles = new THREE.Points(geometry, material);
	particles.position.set(24,-64,-9)
	
    scene.add(particles);
});

const backgroundGeometry1 = new THREE.BufferGeometry();
const backgroundGeometry2 = new THREE.BufferGeometry();

const count1 = 20000;
const count2 = 24000;

const positions1 = new Float32Array(count1 * 3);
const positions2 = new Float32Array(count2 * 3);

for (let i = 0; i < count1 * 3; i++) {
	positions1[i] = (Math.random() - 0.5) * 400;
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
	color: new THREE.Color(0xffffff)
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
window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
})

/*
 * Camera
 */
// PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45,	sizes.width / sizes.height, 0.1, 200);
camera.position.x = 2.7388667694354347;
camera.position.y = 1.35;
camera.position.z = -0.4182813456070749;

//camera.lookAt(mesh.position)
scene.add(camera);

// OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
//controls.enableDamping = true;
//controls.dampingFactor = 0.005;
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
	x: 70, y: -40, z: 30
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
	{ x: 45, y: -31, z: 2 },
	{ x: 60, y: -32, z: 6 },
	{ x: 70, y: -35, z: 13 }
];

let cameraPath1 = [
	{ x: 2.7388667694354347, y: 1.35, z: -0.4182813456070749 },
	{ x: 0.8, y: 2.4, z: -0.1 },
	{ x: 0.4, y: -1, z: 0.4 },
	{ x: -1.5, y: -31.6, z: 2  },
	{ x: 17, y: -31.6, z: 3 },
	{ x: 30, y: -31.6, z: 0 },	
	{ x: 56, y: -31.6, z: -3 },
	{ x: 77, y: -30.5, z: 1 }
];
let targetPath2 = [
	{ x: 70, y: -35, z: 13 },
	{ x: 55, y: -70, z: 30 },
];
let cameraPath2 = [
	{ x: 77, y: -30.5, z: 1 },
	{ x: 70, y: -35, z: 13 },
	{ x: 52, y: -69, z: 21 },

	{ x: 23, y: -63, z: -12 },

];
let targetPath3 = [
	{ x: 55, y: -70, z: 30 },
	{ x: 28, y: -60.5, z: 0.09},
	{ x: 24, y: -64, z: -9 },
];
let cameraPath3 = [
	{ x: 25.3, y: -63, z: -12 },
	{ x: 33.5, y: -59, z: -9.5 }

];

masterTl.to(controls.target, {
		ease: "power1.inOut",
		motionPath: { path: targetPath1, autoRotate: true, type: "soft", },
		duration: 31,
		
	}, 0)
	.to(camera.position, {
		ease: "power1.inOut",
		motionPath: { path: cameraPath1, autoRotate: true, type: "soft" },
		duration: 37.5,

	}, 0)
	.to(controls.target, {
		ease: "power2.inOut",
		motionPath: { path: targetPath2, autoRotate: true, type: "soft", },
		duration: 12,
		
	}, 37.5)
	.to(camera.position, {
		ease: "power2.inOut",
		motionPath: { path: cameraPath2, autoRotate: true, type: "soft" },
		duration: 24,
	}, 37.5)
	.to(controls.target, {
		ease: "power1.inOut",
		motionPath: { path: targetPath3, autoRotate: true, type: "soft", },
		duration: 12,
		
	}, 62)
	.to(camera.position, {
		ease: "power1.inOut",
		motionPath: { path: cameraPath3, autoRotate: true, type: "soft" },
		duration: 15,
	}, 62)
;


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

startButton.addEventListener('touchend', (ev) => {
	ev.preventDefault();
	
	masterTl.paused(false);
	textTl.paused(false);

	//audioVisual
	audio.play();
	audioData();

});

window.addEventListener("wheel", (e) => {
	console.log(e.deltaY);
	if (clicked) {
		const speed=e.deltaY*0.01
		masterTl.timeScale(speed);
	}
	e.stopImmediatePropagation();
	e.preventDefault();
	return false;
}, { passive: false });


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
		console.log(camera.position)
	}
};

updateTime();
