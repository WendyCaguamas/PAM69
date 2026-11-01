
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
// CÁMARA
// =====================================

const camera = new THREE.PerspectiveCamera(
    39.6, // Equivalente aproximado a 50mm
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// POSICIÓN DE BLENDER

camera.position.set(
    7.35889,
    4.95831,
    6.92579
);

// ROTACIÓN DE BLENDER
// Blender utiliza X, Y, Z.
// Three.js utiliza otro sistema de ejes.

camera.rotation.order = 'YXZ';

camera.rotation.set(
    THREE.MathUtils.degToRad(63.5593),
    THREE.MathUtils.degToRad(46.6919),
    0
);

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
// MODELO 3D
// =====================================

const loader = new GLTFLoader();

loader.load(
    './modelo/logo.glb',

    (gltf) => {

        const model = gltf.scene;

        scene.add(model);

        console.log('Modelo cargado correctamente');

        render();

    },

    (progress) => {

        if (progress.total > 0) {
            console.log(
                'Carga:',
                (progress.loaded / progress.total * 100).toFixed(2) + '%'
            );
        }

    },

    (error) => {

        console.error('Error cargando modelo:', error);

    }
);

// =====================================
// SISTEMA DE MOVIMIENTO DE CÁMARA
// =====================================

let isMoving = false;

function moveCamera(targetPosition, targetRotation, duration = 2000) {

    if (isMoving) return;

    isMoving = true;

    const startPosition = camera.position.clone();
    const startRotation = camera.quaternion.clone();

    const endPosition = new THREE.Vector3(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z
    );

    const endRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(targetRotation.x),
        THREE.MathUtils.degToRad(targetRotation.y),
        THREE.MathUtils.degToRad(targetRotation.z),
        'YXZ'
    );

    const endQuaternion = new THREE.Quaternion()
        .setFromEuler(endRotation);

    const startTime = performance.now();

    function animateCamera(now) {

        const elapsed = Math.min(
            (now - startTime) / duration,
            1
        );

        // Suavizado cinematográfico
        const eased = elapsed * elapsed * (3 - 2 * elapsed);

        camera.position.lerpVectors(
            startPosition,
            endPosition,
            eased
        );

        camera.quaternion.slerpQuaternions(
            startRotation,
            endQuaternion,
            eased
        );

        render();

        if (elapsed < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            isMoving = false;
        }
    }

    requestAnimationFrame(animateCamera);
}

// =====================================
// BOTÓN PROYECTOS
// =====================================

const projectsButton = document.getElementById('btn-proyectos');

if (projectsButton) {

    projectsButton.addEventListener('click', (event) => {

        event.preventDefault();

        console.log('Entrando a proyectos...');

        // Aquí posteriormente colocaremos
        // las coordenadas de la cámara de proyectos.

    });

}

// =====================================
// RENDERIZADO
// =====================================

function render() {

    renderer.render(scene, camera);

}

// =====================================
// REDIMENSIONAR
// =====================================

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    render();

});

