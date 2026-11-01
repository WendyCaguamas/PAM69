
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ESCENA

const scene = new THREE.Scene();
scene.background = null;


// RENDERIZADOR

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


// CÁMARA

const camera = new THREE.PerspectiveCamera(
    39.6,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);

// POSICIÓN DE LA CÁMARA
camera.position.set(3, 1, 5);

// ROTACIÓN DE LA CÁMARA
    camera.rotation.set(
    THREE.MathUtils.degToRad(0),
    THREE.MathUtils.degToRad(0),
    0
);


// VARIABLES

let model = null;

const loader = new GLTFLoader();


// CARGAR MODELO 3D

loader.load(

    './modelo/logo.glb',

    (gltf) => {

        model = gltf.scene;

        scene.add(model);

        // POSICIÓN DEL MODELO
        model.position.set(0, 0, 0);

        // ROTACIÓN DEL MODELO
        model.rotation.set(0, 0, 0);

        // ESCALA DEL MODELO
        model.scale.set(1, 1, 1);

        console.log('Modelo cargado correctamente');

        render();

    },

    (progress) => {

        if (progress.total > 0) {

            console.log(
                'Carga:',
                (
                    progress.loaded /
                    progress.total *
                    100
                ).toFixed(2) + '%'
            );

        }

    },

    (error) => {

        console.error(
            'Error cargando modelo:',
            error
        );

    }

);


// MOVIMIENTO DE CÁMARA

let isMoving = false;

function moveCamera(
    targetPosition,
    targetRotation,
    duration = 2000
) {

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


// BOTÓN PROYECTOS

const projectsButton = document.getElementById(
    'btn-proyectos'
);

if (projectsButton) {

    projectsButton.addEventListener('click', (event) => {

        event.preventDefault();

        console.log('Entrando a proyectos...');

    });

}


// RENDERIZADO

function render() {

    renderer.render(scene, camera);

}


// REDIMENSIONAR

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

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
