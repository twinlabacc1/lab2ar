import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer;
let boxMesh, TetrahedronMesh, icosahedronMesh; 
let controls;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Сцена
    scene = new THREE.Scene();

    // Камера
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Об'єкт рендерингу
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
            
    renderer.xr.enabled = true; // Життєво важливий рядок коду для вашого застосунку!
    container.appendChild(renderer.domElement);
            
    // Світло
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4); 
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 10); 
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);
    
    // 1. Створюємо об'єкт куба
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    // Матеріал для першого об'єкту 
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87CEEB, 
        transparent: true,
        opacity: 0.5,
        roughness: 0.4,
        metalness: 0.8,
        reflectivity: 1.0,
        transmission: 0.8,
    });
    // Створюємо меш
    boxMesh = new THREE.Mesh(boxGeometry, glassMaterial);
    boxMesh.position.x = -1.5;
    boxMesh.position.z = -2;

    scene.add(boxMesh);

    // 2. Створюємо об'єкт TetrahedronGeometry
    const TetrahedronGeometry = new THREE.TetrahedronGeometry(1,0);
    // Матеріал для другого
    const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4Fff, 
        emissive: 0xff4500, 
        emissiveIntensity: 3, 
        metalness: 0.5,
        roughness: 0.2,
    });
    // Створюємо наступний меш
    TetrahedronMesh = new THREE.Mesh(TetrahedronGeometry, emissiveMaterial);
    TetrahedronMesh.position.z = -2
    scene.add(TetrahedronMesh);

    // 3. Створюємо об'єкт Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(0.6, 0);
    // Матеріал для третього
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0x00AAFF,
        metalness: 1,
        roughness: 0.3,
    });
    // Створюємо наступний меш
    icosahedronMesh = new THREE.Mesh(icosahedronGeometry, goldMaterial);
    icosahedronMesh.position.x = 1.5;
    icosahedronMesh.position.z = -2;

    scene.add(icosahedronMesh);
    
    // Позиція для камери
    camera.position.z = 5;

    // Контролери для 360 огляду на вебсторінці, але не під час AR-сеансу
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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
    controls.update();
}

function render() {
    rotateObjects();
    renderer.render(scene, camera);
}
    
function rotateObjects() {
    boxMesh.rotation.y = boxMesh.rotation.y - 0.01;
    TetrahedronMesh.rotation.x = TetrahedronMesh.rotation.x - 0.01;
    icosahedronMesh.rotation.x = icosahedronMesh.rotation.x - 0.01;
}