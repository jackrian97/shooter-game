import * as THREE from 'three';
import createTargets from './Target';
import { createRandomObjects } from './Objects';
import createPlayer from './Player';

function createScene(container) {
  const scene = new THREE.Scene();

  // Fondo de la escena
  scene.background = new THREE.Color(0x87ceeb);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Suelo
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x556b2f });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Crear objetos aleatorios
  const sceneSize = { x: 50, y: 20, z: 50 };
  const objects = createRandomObjects(scene, 10, sceneSize);

  // Crear dianas
  const targets = createTargets(scene, objects, sceneSize);

  // Crear jugador
  const player = createPlayer(camera, sceneSize);

  // Ajustar cámara
  camera.position.set(0, 2, 20); // Posición inicial
  camera.lookAt(0, 2, 0);

  // Ajustar ventana
  const onResize = () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  };
  window.addEventListener('resize', onResize);

  // Animación
  const animate = () => {
    requestAnimationFrame(animate);

    // Actualizar jugador
    player.update();

    // Actualizar dianas
    targets.forEach((target) => target.update());

    renderer.render(scene, camera);
  };
  animate();

  const dispose = () => {
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };

  return { dispose };
}

export default createScene;
