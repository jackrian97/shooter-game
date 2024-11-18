import * as THREE from 'three';

export function createRandomObjects(scene, numObjects, sceneSize) {
  const objects = [];

  for (let i = 0; i < numObjects; i++) {
    const geometryTypes = [
      new THREE.BoxGeometry(5, 5, 5), // Tamaño más grande
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.ConeGeometry(3, 6, 32),
    ];
    const randomGeometry =
      geometryTypes[Math.floor(Math.random() * geometryTypes.length)];

    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
      flatShading: true,
    });

    const object = new THREE.Mesh(randomGeometry, material);

    // Posición inicial aleatoria
    object.position.set(
      Math.random() * sceneSize.x - sceneSize.x / 2,
      Math.random() * sceneSize.y,
      -Math.random() * sceneSize.z
    );

    scene.add(object);
    objects.push(object);
  }

  return objects;
}
