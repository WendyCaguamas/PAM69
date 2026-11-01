
import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ESCENA
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x111111);

// CÁMARA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 5);

// RENDERIZADOR
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.outputColorSpace = THREE.SRGBColorSpace;

document
    .getElementById('canvas-container')
    .appendChild(renderer.domElement);

// ILUMINACIÓN
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);

// CARGAR MODELO 3D
const loader = new GLTFLoader();

loader.load(
    'modelo/logo.glb',

    (gltf) => {
        const model = gltf.scene;

        scene.add(model);

        console.log('Modelo 3D cargado correctamente');

    },

    (progress) => {
        console.log(
            'Cargando:',
            (progress.loaded / progress.total * 100).toFixed(2) + '%'
        );
    },

    (error) => {
        console.error('Error al cargar el modelo:', error);
    }
);

// REDIMENSIONAR
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

// RENDERIZADO ESTÁTICO
renderer.render(scene, camera);
