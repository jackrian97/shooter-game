import * as THREE from 'three';
import { createMovement } from './Movement';

function createTargets(scene, objects, sceneSize) {
  const targets = [];

  const targetGeometry = new THREE.CircleGeometry(1, 32);
  const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  for (let i = 0; i < 5; i++) {
    const target = new THREE.Mesh(targetGeometry, targetMaterial);

    // Posición inicial aleatoria
    target.position.set(
      Math.random() * sceneSize.x - sceneSize.x / 2,
      Math.random() * sceneSize.y,
      -Math.random() * sceneSize.z
    );

    // Movimiento
    const movement = createMovement(target.position, sceneSize);

    target.update = () => {
      movement.update();

      // Restringir posición dentro de los límites
      target.position.set(
        THREE.MathUtils.clamp(movement.position.x, -sceneSize.x / 2, sceneSize.x / 2),
        THREE.MathUtils.clamp(movement.position.y, 1, sceneSize.y),
        THREE.MathUtils.clamp(movement.position.z, -sceneSize.z, 0)
      );

      // Detectar colisiones con objetos
      for (const obj of objects) {
        const distance = target.position.distanceTo(obj.position);
        if (distance < 3) { // Ajuste según tamaño de objetos
          movement.velocity.x = -movement.velocity.x;
          movement.velocity.y = -movement.velocity.y;
          movement.velocity.z = -movement.velocity.z;
          break;
        }
      }
    };

    scene.add(target);
    targets.push(target);
  }

  return targets;
}

export default createTargets;
