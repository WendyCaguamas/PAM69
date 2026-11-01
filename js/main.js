
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
    0.1,
    1000
);

// Posición inicial provisional
camera.position.set(7, 7, 4.5);

camera.lookAt(0, 0, 0);

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

// Luz adicional
const fillLight = new THREE.DirectionalLight(
    0xffffff,
    1
);

fillLight.position.set(-5, 3, -5);

scene.add(fillLight);

// =====================================
// VARIABLES DEL MODELO
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

        // Calcular dimensiones del modelo
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(
            new THREE.Vector3()
        );

        const size = box.getSize(
            new THREE.Vector3()
        );

        // Centrar modelo en la escena
        model.position.sub(center);

        // Calcular tamaño máximo
        const maxDimension = Math.max(
            size.x,
            size.y,
            size.z
        );

        // Distancia de cámara
        const distance = maxDimension * 0.1;

        // Posición de cámara
        camera.position.set(
            distance * 5,
            distance * 0,
            distance * 4.5
        );

        // Mirar al centro del modelo
        camera.lookAt(0, 0, 0);

        // Ajustar clipping
        camera.near = Math.max(0.01, distance / 100);
        camera.far = distance * 100;

        camera.updateProjectionMatrix();

        console.log('Modelo cargado correctamente');
        console.log('Dimensiones:', size);
        console.log('Centro original:', center);
        console.log('Distancia cámara:', distance);

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

// =====================================
// SISTEMA DE MOVIMIENTO DE CÁMARA
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

const projectsButton = document.getElementById(
    'btn-proyectos'
);

if (projectsButton) {

    projectsButton.addEventListener('click', (event) => {

        event.preventDefault();

        console.log('Entrando a proyectos...');

        // Aquí colocaremos las coordenadas
        // de la cámara para la sección proyectos.

        // Ejemplo:
        // moveCamera(
        //     { x: 5, y: 3, z: 5 },
        //     { x: 0, y: 0, z: 0 },
        //     2000
        // );

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
