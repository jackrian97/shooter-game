import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default function createPlayer(camera, sceneSize) {
  const controls = new PointerLockControls(camera, document.body);

  const speed = 0.2; // Velocidad de movimiento
  const velocity = new THREE.Vector3(0, 0, 0); // Velocidad del jugador
  const direction = new THREE.Vector3(); // Dirección de movimiento

  // Evento para bloquear el mouse
  document.addEventListener('click', () => {
    controls.lock();
  });

  // Teclas de movimiento
  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  // Detectar teclas presionadas
  const onKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
        keys.forward = true;
        break;
      case 'KeyS':
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

  // Detectar teclas soltadas
  const onKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
        keys.forward = false;
        break;
      case 'KeyS':
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

  // Limitar posición del jugador al tamaño de la escena
  const clampPosition = (position) => {
    position.x = THREE.MathUtils.clamp(position.x, -sceneSize.x / 2, sceneSize.x / 2);
    position.z = THREE.MathUtils.clamp(position.z, -sceneSize.z, 0);
  };

  // Actualizar movimiento
  const update = () => {
    if (controls.isLocked) {
      // Calculamos la dirección hacia adelante y derecha en base a la orientación de la cámara
      const forward = new THREE.Vector3(); // Dirección hacia adelante
      camera.getWorldDirection(forward);
      forward.y = 0; // Ignoramos el eje Y (para evitar que el jugador "vuele")
      forward.normalize();

      const right = new THREE.Vector3(); // Dirección hacia la derecha
      right.crossVectors(forward, camera.up).normalize();

      // Combinamos las direcciones según las teclas presionadas
      direction.set(0, 0, 0);
      if (keys.forward) direction.add(forward);
      if (keys.backward) direction.sub(forward);
      if (keys.left) direction.sub(right);
      if (keys.right) direction.add(right);

      // Normalizamos para mantener una velocidad constante en diagonales
      direction.normalize();

      // Aplicamos la velocidad al movimiento
      velocity.copy(direction).multiplyScalar(speed);

      // Actualizamos la posición de la cámara (jugador)
      camera.position.add(velocity);

      // Restringimos la posición dentro de los límites de la escena
      clampPosition(camera.position);
    }
  };

  return { update };
}
