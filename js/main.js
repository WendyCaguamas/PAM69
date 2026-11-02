import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// ESCENA
// ==========================================

const scene = new THREE.Scene();
scene.background = null;


// ==========================================
// RENDERIZADOR
// ==========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);

document
    .getElementById('canvas-container')
    .appendChild(renderer.domElement);


// ==========================================
// VARIABLES
// ==========================================

let model = null;
let camera = null;

const loader = new GLTFLoader();


// ==========================================
// CÁMARA DE RESPALDO
// ==========================================

function createFallbackCamera() {

    const fallbackCamera = new THREE.PerspectiveCamera(
        39.6,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );

    fallbackCamera.position.set(3, 1, 5);

    fallbackCamera.rotation.set(0, 0, 0);

    return fallbackCamera;

}


// ==========================================
// CARGAR MODELO 3D
// ==========================================

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


        // ==================================
        // UTILIZAR CÁMARA DEL GLB
        // ==================================

        if (gltf.cameras.length > 0) {

            camera = gltf.cameras[0];

            console.log(
                'Cámara del GLB cargada correctamente:',
                camera.name
            );

        } else {

            console.warn(
                'El GLB no contiene cámaras. Usando cámara de respaldo.'
            );

            camera = createFallbackCamera();

        }


        console.log('Modelo cargado correctamente');

        render();

    },


    // PROGRESO DE CARGA

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


    // ERROR

    (error) => {

        console.error(
            'Error cargando modelo:',
            error
        );

    }

);


// ==========================================
// MOVIMIENTO DE CÁMARA
// ==========================================

let isMoving = false;

function moveCamera(
    targetPosition,
    targetRotation,
    duration = 2000
) {

    if (!camera || isMoving) return;

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


// ==========================================
// BOTÓN PROYECTOS
// ==========================================

const projectsButton = document.getElementById(
    'btn-proyectos'
);

if (projectsButton) {

    projectsButton.addEventListener('click', (event) => {

        event.preventDefault();

        console.log('Entrando a proyectos...');

    });

}


// ==========================================
// RENDERIZADO
// ==========================================

function render() {

    if (!camera) return;

    renderer.render(scene, camera);

}


// ==========================================
// REDIMENSIONAR
// ==========================================

window.addEventListener('resize', () => {

    if (!camera) return;


    if (camera.isPerspectiveCamera) {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

    }


    if (camera.isOrthographicCamera) {

        // Conserva los límites verticales
        // y adapta los horizontales.

        const aspect =
            window.innerWidth / window.innerHeight;

        const height = camera.top - camera.bottom;

        const width = height * aspect;

        const centerX =
            (camera.left + camera.right) / 2;

        camera.left = centerX - width / 2;

        camera.right = centerX + width / 2;

        camera.updateProjectionMatrix();

    }


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );


    render();

});
