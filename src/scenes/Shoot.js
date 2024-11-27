import * as THREE from 'three';

export default class Shoot {
  constructor(camera, scene, targets) {
    this.camera = camera;
    this.scene = scene;
    this.targets = targets;
    this.raycaster = new THREE.Raycaster(); // Raycaster para detección de colisiones
    this.mouse = new THREE.Vector2(); // Coordenadas del mouse
    this.initShootEvent();
  }

  initShootEvent() {
    // Detectar clic para disparar
    window.addEventListener('click', () => this.handleShoot());
  }

  handleShoot() {
    // Configurar raycaster desde la cámara hacia adelante
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Detectar intersecciones con los objetivos
    const intersects = this.raycaster.intersectObjects(this.targets);

    if (intersects.length > 0) {
      // Obtener el primer objetivo alcanzado
      const hitTarget = intersects[0].object;

      // Remover el objetivo de la escena y de la lista
      this.scene.remove(hitTarget);
      this.targets.splice(this.targets.indexOf(hitTarget), 1);

      // Actualizar puntuación
      const scoreElement = document.getElementById('score');
      scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
    }
  }
}
