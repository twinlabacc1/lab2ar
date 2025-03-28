import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
let loader;
let model;
let jew;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Не забуваємо про цей рядок коду.
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); 
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
    scene.add(ambientLight);

/* Знаходимо назви обьєктів моделей
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}*/
    
    // Додаємо GLTF модель на сцену
    const modelUrl = 'https://pub-c6b0f7a4187340bfa738e49e82fed6ef.r2.dev/scene.gltf';



    // Створюємо завантажувач
    loader = new GLTFLoader();
	loader.load(
        modelUrl,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -5;

            const color = 0xFFFFFF;
            const intensity = 100;
            const light = new THREE.DirectionalLight(color, intensity);
            
            scene.add(model);
            scene.add(light)
            console.log("Model added to scene");
        },

        function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function (error) {
            console.error(error);
        }
    );

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    rotateModel();
    renderer.render(scene, camera);
}
    
let degrees = 0; // кут для оберту наших моделей
    
function rotateModel() {
    if (model !== undefined) {
        // допустима межа градусів - від 0 до 360
        // Після 360 three.js сприйматиме 360 як 0, 361 як 1, 362 як 2 і так далі
        degrees = degrees + 0.5; 
        const disc1 = model.getObjectByName('Jewelry_Flat003_19');
        const disc2 = model.getObjectByName('Jewelry_Flat004_20');
        const disc3 = model.getObjectByName('Jewelry_Flat005_21');

        disc1.rotation.x = THREE.MathUtils.degToRad(degrees); // обертаємо перший диск
        disc2.rotation.y = THREE.MathUtils.degToRad(degrees); // обертаємо другий диск
        disc3.rotation.z = THREE.MathUtils.degToRad(degrees); // обертаємо третій диск
    } 
}
