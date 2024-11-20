import * as THREE from 'three';

export default function createTargets(scene, objects, sceneSize) {
  createCrosshair()
  const targets = [];
  const targetGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Radio reducido
  const targetMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Color rojo

  for (let i = 0; i < 5; i++) {
    const target = new THREE.Mesh(targetGeometry, targetMaterial);

    // Posición inicial aleatoria dentro de los límites
    target.position.set(
      THREE.MathUtils.randFloat(-sceneSize.x / 2 + 1, sceneSize.x / 2 - 1),
      THREE.MathUtils.randFloat(1, sceneSize.y - 1),
      THREE.MathUtils.randFloat(-sceneSize.z / 2 + 1, sceneSize.z / 2 - 1)
    );

    // Velocidad aleatoria
    const velocity = new THREE.Vector3(
      THREE.MathUtils.randFloat(-0.1, 0.1),
      THREE.MathUtils.randFloat(-0.1, 0.1),
      THREE.MathUtils.randFloat(-0.1, 0.1)
    );

    // Función para detectar colisiones con objetos
    const checkCollisionWithObjects = () => {
      for (const object of objects) {
        const distance = target.position.distanceTo(object.position);
        const collisionThreshold = 3; // Umbral de colisión

        if (distance < collisionThreshold) {
          // Cambiar dirección al colisionar
          velocity.reflect(target.position.clone().sub(object.position).normalize());
          break;
        }
      }
    };

    // Actualizar movimiento y colisiones
    const update = () => {
      target.position.add(velocity);

      // Colisiones con las paredes
      const wallThickness = 0.5;

      // Eje X (izquierda y derecha)
      if (target.position.x <= -sceneSize.x / 2 + wallThickness || target.position.x >= sceneSize.x / 2 - wallThickness) {
        velocity.x *= -1; // Invertir dirección
      }

      // Eje Z (frontal y trasera)
      if (target.position.z <= -sceneSize.z / 2 + wallThickness || target.position.z >= sceneSize.z / 2 - wallThickness) {
        velocity.z *= -1; // Invertir dirección
      }

      // Eje Y (suelo y techo)
      if (target.position.y <= 1 || target.position.y >= sceneSize.y - 1) {
        velocity.y *= -1; // Invertir dirección
      }

      // Colisiones con los objetos
      checkCollisionWithObjects();
    };

    target.update = update;
    scene.add(target);
    targets.push(target);
  }

  function createCrosshair() {
    const crosshair = document.createElement('div');
    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.width = '10px';
    crosshair.style.height = '10px';
    crosshair.style.backgroundColor = 'red';
    crosshair.style.borderRadius = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.zIndex = '1000';
    document.body.appendChild(crosshair);
  }
  return targets;
}
