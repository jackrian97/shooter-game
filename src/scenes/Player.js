import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default function createPlayer(camera, sceneSize) {
  const controls = new PointerLockControls(camera, document.body);

  // Velocidades de movimiento
  const speed = 0.2;
  const velocity = new THREE.Vector3(0, 0, 0);
  const direction = new THREE.Vector3();

  // Limitar posición del jugador al espacio de la escena
  const clampPosition = (position) => {
    position.x = THREE.MathUtils.clamp(position.x, -sceneSize.x / 2, sceneSize.x / 2);
    position.z = THREE.MathUtils.clamp(position.z, -sceneSize.z, 0);
  };

  // Evento para bloquear el mouse
  document.addEventListener('click', () => {
    controls.lock();
  });

  // Configuración de movimiento
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  const onKeyDown = (event) => {
    switch (event.code) {
      case 'KeyS':
        keys.forward = true;
        break;
      case 'KeyW':
        keys.backward = true;
        break;
      case 'KeyA':
        keys.left = true;
        break;
      case 'KeyD':
        keys.right = true;
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.code) {
      case 'KeyS':
        keys.forward = false;
        break;
      case 'KeyW':
        keys.backward = false;
        break;
      case 'KeyA':
        keys.left = false;
        break;
      case 'KeyD':
        keys.right = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Actualizar movimiento
  const update = () => {
    direction.z = Number(keys.forward) - Number(keys.backward);
    direction.x = Number(keys.right) - Number(keys.left);
    direction.normalize(); // Normalizar para velocidad constante

    if (controls.isLocked) {
      // Actualizar la velocidad
      velocity.x = direction.x * speed;
      velocity.z = direction.z * speed;

      // Aplicar movimiento
      camera.position.x += velocity.x;
      camera.position.z += velocity.z;

      // Restringir posición
      clampPosition(camera.position);
    }
  };

  return { update };
}
