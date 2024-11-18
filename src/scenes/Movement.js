import * as THREE from 'three';

export function createMovement(initialPosition, sceneSize) {
  const position = initialPosition.clone();

  // Velocidad inicial aleatoria para cada eje
  const velocity = new THREE.Vector3(
    Math.random() * 0.2 - 0.1,
    Math.random() * 0.2 - 0.1,
    Math.random() * 0.2 - 0.1
  );

  // Límites dinámicos en función del tamaño de la escena
  const bounds = {
    x: [-sceneSize.x / 2, sceneSize.x / 2],
    y: [1, sceneSize.y], // Desde 1 para no tocar el suelo
    z: [-sceneSize.z, 0], // Profundidad
  };

  // Actualizar posición y manejar rebotes
  const update = () => {
    position.add(velocity);

    // Rebote en los límites
    if (position.x < bounds.x[0] || position.x > bounds.x[1]) {
      velocity.x = -velocity.x;
    }
    if (position.y < bounds.y[0] || position.y > bounds.y[1]) {
      velocity.y = -velocity.y;
    }
    if (position.z < bounds.z[0] || position.z > bounds.z[1]) {
      velocity.z = -velocity.z;
    }
  };

  return { position, update };
}
