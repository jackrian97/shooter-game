import * as THREE from 'three';

export function createRandomObjects(scene, count, sceneSize) {
  const objects = [];
  const objectGeometries = [
    new THREE.BoxGeometry(4, 4, 4), // Escala aumentada
    new THREE.SphereGeometry(3.5, 16, 16), // Escala aumentada
    new THREE.ConeGeometry(3.5, 6, 16), // Escala aumentada
  ];
  const objectMaterial = new THREE.MeshPhongMaterial({
    color: Math.random() * 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < count; i++) {
    const geometry = objectGeometries[Math.floor(Math.random() * objectGeometries.length)];
    const object = new THREE.Mesh(geometry, objectMaterial);

    // Posición inicial aleatoria dentro de los límites
    object.position.set(
      THREE.MathUtils.randFloat(-sceneSize.x / 2 + 5, sceneSize.x / 2 - 5),
      THREE.MathUtils.randFloat(2, sceneSize.y - 2),
      THREE.MathUtils.randFloat(-sceneSize.z / 2 + 5, sceneSize.z / 2 - 5)
    );

    // Rotación aleatoria para mayor variabilidad visual
    object.rotation.set(
      THREE.MathUtils.randFloat(0, Math.PI),
      THREE.MathUtils.randFloat(0, Math.PI),
      THREE.MathUtils.randFloat(0, Math.PI)
    );

    scene.add(object);
    objects.push(object);
  }

  return objects;
}
