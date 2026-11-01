
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ESCENA
const scene = new THREE.Scene();

// CÁMARA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// RENDERIZADOR
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.getElementById('canvas-container').appendChild(renderer.domElement);

// ILUMINACIÓN
scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 5, 5);
scene.add(light);

// CARGADOR GLB
const loader = new GLTFLoader();

loader.load(
    './modelo/logo.glb',

    (gltf) => {

        const model = gltf.scene;

        scene.add(model);

        // CALCULAR DIMENSIONES
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // CENTRAR MODELO
        model.position.sub(center);

        // AJUSTAR CÁMARA
        const maxDimension = Math.max(size.x, size.y, size.z);

        const distance = (maxDimension / 2) /
            Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

        camera.position.set(0, 0, distance * 1.8);
        camera.lookAt(0, 0, 0);

        console.log('Modelo cargado:', model);
        console.log('Dimensiones:', size);

        renderer.render(scene, camera);
    },

    (progress) => {
        console.log('Cargando modelo...');
    },

    (error) => {
        console.error('Error:', error);
    }
);

// REDIMENSIONAR
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
});
