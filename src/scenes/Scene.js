import * as THREE from "three";
import createTargets from "./Target";
import { createRandomObjects } from "./Objects";
import createPlayer from "./Player";
import Shoot from "./Shoot";

function createScene(container) {
  const scene = new THREE.Scene();

  // Fondo de la escena
  scene.background = new THREE.Color(0x87ceeb);

  // Cámara
  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );

  // Renderer
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

  // Tamaño de la escena
  const sceneSize = { x: 50, y: 25, z: 50 }; // Match con el plano

  // Suelo
  const planeGeometry = new THREE.PlaneGeometry(sceneSize.x, sceneSize.z);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x556b2f });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Colocar el plano horizontalmente
  plane.position.y = 0; // Altura del plano
  scene.add(plane);

  // Crear materiales de colores para las paredes
  const wallMaterials = {
    front: new THREE.MeshPhongMaterial({ color: 0xff00ff }), // Violeta
    back: new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Verde
    left: new THREE.MeshPhongMaterial({ color: 0x0000ff }), // Azul
    right: new THREE.MeshPhongMaterial({ color: 0xffff00 }), // Amarillo
  };
  // paredes del escenario
  const createWall = (width, height, depth, position, material) => {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );
    wall.position.set(position.x, position.y, position.z);
    return wall;
  };

  const halfX = sceneSize.x / 2;
  const halfZ = sceneSize.z / 2;

  // Crear paredes ajustadas a los límites
  const wallThickness = 0.5;

  // Pared frontal
  scene.add(
    createWall(
      sceneSize.x,
      sceneSize.y,
      wallThickness,
      { x: 0, y: sceneSize.y / 2, z: -sceneSize.z / 2 },
      wallMaterials.front
    )
  );
  // Pared trasera
  scene.add(
    createWall(
      sceneSize.x,
      sceneSize.y,
      wallThickness,
      { x: 0, y: sceneSize.y / 2, z: sceneSize.z / 2 },
      wallMaterials.back
    )
  );
  // Pared izquierda
  scene.add(
    createWall(
      wallThickness,
      sceneSize.y,
      sceneSize.z,
      { x: -sceneSize.x / 2, y: sceneSize.y / 2, z: 0 },
      wallMaterials.left
    )
  );
  // Pared derecha
  scene.add(
    createWall(
      wallThickness,
      sceneSize.y,
      sceneSize.z,
      { x: sceneSize.x / 2, y: sceneSize.y / 2, z: 0 },
      wallMaterials.right
    )
  );

  // Techo
  const ceilingGeometry = new THREE.PlaneGeometry(sceneSize.x, sceneSize.z);
  const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2; // Rotación para orientarlo horizontalmente
  ceiling.position.y = sceneSize.y; // Posición del techo
  scene.add(ceiling);

  // Objetos aleatorios
  const objects = createRandomObjects(scene, 10, sceneSize);

  // Crear dianas
  const targets = createTargets(scene, objects, sceneSize);

  // Crear jugador
  const player = createPlayer(camera, sceneSize);

  // Inicializar sistema de disparo
  const shootSystem = new Shoot(camera, scene, targets);

  // Ajustar cámara
  camera.position.set(0, 2, 20);
  camera.lookAt(0, 2, 0);

  // Ajustar ventana
  const onResize = () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  };
  window.addEventListener("resize", onResize);

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
    window.removeEventListener("resize", onResize);
    renderer.dispose();
  };

  return { dispose };
}
const scoreElement = document.createElement("div");
scoreElement.id = "score";
scoreElement.style.position = "absolute";
scoreElement.style.top = "20px";
scoreElement.style.left = "20px";
scoreElement.style.color = "white";
scoreElement.style.fontSize = "40px";
scoreElement.textContent = "0"; // Puntuación inicial
document.body.appendChild(scoreElement);
export default createScene;
