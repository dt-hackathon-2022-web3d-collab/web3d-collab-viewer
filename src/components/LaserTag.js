export class LaserTag {
  constructor(context) {
    this.context = context;
    this.THREE = context.THREE;
    const THREE = this.THREE;
    this.beam = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 1, 8),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0x000000,
      })
    );
    this.beam.scale.set(0.01, 1, 0.01);
    context.scene.add(this.beam);
  }

  point(from, to) {
    const { beam, THREE } = this;
    from = new THREE.Vector3().copy(from);
    beam.position.copy(
      new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
    );
    beam.scale.setY(from.distanceTo(to));
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    beam.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    );
  }

  color(cssColorStr) {
    this.beam.material.color.setStyle(cssColorStr);
  }

  show() {
    this.beam.visible = true;
  }

  hide() {
    this.beam.visible = false;
  }

  dispose() {
    this.context.scene.remove(this.beam);
    this.beam.geometry.dispose();
    this.beam.material.dispose();
  }
}
