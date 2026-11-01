
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// =====================================
// ESCENA
// =====================================

const scene = new THREE.Scene();

// =====================================
// RENDERIZADOR
// =====================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setClearColor(0x000000, 0);

document
    .getElementById('canvas-container')
    .appendChild(renderer.domElement);

// =====================================
// ILUMINACIÓN
// =====================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

directionalLight.position.set(5, 5, 5);

scene.add(directionalLight);

// =====================================
// CÁMARA
// =====================================

let camera = null;

// =====================================
// CARGAR MODELO GLB
// =====================================

const loader = new GLTFLoader();

loader.load(
    './modelo/logo.glb',

    (gltf) => {

        const model = gltf.scene;

        // Agregar modelo a la escena
        scene.add(model);

        console.log('Modelo 3D cargado correctamente');

        // =====================================
        // UTILIZAR CÁMARA DE BLENDER
        // =====================================

        if (gltf.cameras && gltf.cameras.length > 0) {

            camera = gltf.cameras[0];

            console.log('Cámara de Blender encontrada:', camera);

        } else {

            console.warn(
                'No se encontró una cámara en Blender. Usando cámara alternativa.'
            );

            camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            camera.position.set(0, 0, 5);

            camera.lookAt(0, 0, 0);
        }

        // Renderizar escena
        render();

    },

    (progress) => {

        if (progress.total > 0) {

            const percentage = (
                progress.loaded / progress.total
            ) * 100;

            console.log(
                `Cargando modelo: ${percentage.toFixed(2)}%`
            );

        }

    },

    (error) => {

        console.error(
            'Error al cargar el modelo GLB:',
            error
        );

    }
);

// =====================================
// RENDERIZADO ESTÁTICO
// =====================================

function render() {

    if (!camera) return;

    renderer.render(scene, camera);

}

// =====================================
// REDIMENSIONAR VENTANA
// =====================================

window.addEventListener('resize', () => {

    if (!camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;

    if (camera.isPerspectiveCamera) {

        camera.updateProjectionMatrix();

    }

    renderer.setSize(width, height);

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    render();

});

