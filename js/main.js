
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// =====================================
// ESCENA
// =====================================

const scene = new THREE.Scene();
scene.background = null;


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
    39.6,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);


// =====================================
// CONFIGURACIÓN DE CÁMARA
// =====================================

const CAMERA_CONFIG = {

    // Altura de la cámara
    elevation: 0.85,

    // Distancia de cámara
    distanceMultiplier: 0.75,

    // Dirección frontal
    direction: -1,

    // Ángulo lateral
    horizontalAngle: 0.25

};


// =====================================
// VARIABLES
// =====================================

let model = null;

const loader = new GLTFLoader();


// =====================================
// CARGAR MODELO 3D
// =====================================

loader.load(

    './modelo/logo.glb',

    (gltf) => {

        model = gltf.scene;

        scene.add(model);


        // ---------------------------------
        // DIMENSIONES DEL MODELO
        // ---------------------------------

        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(
            new THREE.Vector3()
        );

        const size = box.getSize(
            new THREE.Vector3()
        );


        // ---------------------------------
        // CENTRAR MODELO
        // ---------------------------------

        model.position.sub(center);


        // ---------------------------------
        // CALCULAR DISTANCIA
        // ---------------------------------

        const sphere = new THREE.Sphere();

        box.getBoundingSphere(sphere);

        const radius = sphere.radius;

        const verticalFov = THREE.MathUtils.degToRad(
            camera.fov
        );

        const horizontalFov = 2 * Math.atan(
            Math.tan(verticalFov / 2) * camera.aspect
        );

        const limitingFov = Math.min(
            verticalFov,
            horizontalFov
        );

        const distance = (
            radius / Math.sin(limitingFov / 2)
        ) * CAMERA_CONFIG.distanceMultiplier;


        // ---------------------------------
        // POSICIÓN DE CÁMARA
        // ---------------------------------

        camera.position.set(

            distance * CAMERA_CONFIG.horizontalAngle,

            distance * CAMERA_CONFIG.elevation,

            distance * CAMERA_CONFIG.direction

        );


        // ---------------------------------
        // ORIENTAR HACIA EL MODELO
        // ---------------------------------

        camera.lookAt(0, 0, 0);


        // ---------------------------------
        // CLIPPING
        // ---------------------------------

        camera.near = Math.max(
            0.001,
            distance / 100
        );

        camera.far = distance * 100;

        camera.updateProjectionMatrix();


        // ---------------------------------
        // INFORMACIÓN
        // ---------------------------------

        console.log('Modelo cargado correctamente');

        console.log('Dimensiones:', size);

        console.log('Centro:', center);

        console.log('Distancia:', distance);

        console.log('Posición cámara:', camera.position);


        render();

    },


    // ---------------------------------
    // PROGRESO DE CARGA
    // ---------------------------------

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


    // ---------------------------------
    // ERRORES
    // ---------------------------------

    (error) => {

        console.error(
            'Error cargando modelo:',
            error
        );

    }

);


// =====================================
// MOVIMIENTO DE CÁMARA
// =====================================

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


// =====================================
// BOTÓN PROYECTOS
// =====================================

const projectsButton = document.getElementById(
    'btn-proyectos'
);

if (projectsButton) {

    projectsButton.addEventListener('click', (event) => {

        event.preventDefault();

        console.log('Entrando a proyectos...');

    });

}


// =====================================
// RENDERIZADO
// =====================================

function render() {

    renderer.render(scene, camera);

}


// =====================================
// REDIMENSIONAR VENTANA
// =====================================

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
