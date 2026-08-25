/* ==========================================================================
   RS-25F MIND 3D Personal Finance Tracker — Three.js 3D Background Engine
   ========================================================================== */

class ThreeDScene {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.floatingObjects = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js library not loaded yet');
      return;
    }

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.0015);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 400;

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Particles (Bull Green & Bear Red theme)
    this.createParticleCloud();

    // 5. Create 3D Floating Geometry Nodes
    this.createFloatingNodes();

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const greenPointLight = new THREE.PointLight(0x10b981, 2, 500);
    greenPointLight.position.set(-200, 100, 100);
    this.scene.add(greenPointLight);

    const redPointLight = new THREE.PointLight(0xef4444, 2, 500);
    redPointLight.position.set(200, -100, 100);
    this.scene.add(redPointLight);

    // Event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Animation Loop
    this.animate();
  }

  createParticleCloud() {
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const greenColor = new THREE.Color(0x10b981);
    const redColor = new THREE.Color(0xef4444);
    const goldColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

      const rand = Math.random();
      let chosenColor = greenColor;
      if (rand > 0.6) chosenColor = redColor;
      else if (rand > 0.4) chosenColor = goldColor;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createFloatingNodes() {
    const geometries = [
      new THREE.IcosahedronGeometry(20, 0),
      new THREE.OctahedronGeometry(25, 0),
      new THREE.TorusGeometry(18, 5, 12, 24)
    ];

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      }),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      })
    ];

    for (let i = 0; i < 9; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400 - 100
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        floatSpeed: Math.random() * 0.02 + 0.005,
        initialY: mesh.position.y
      };

      this.floatingObjects.push(mesh);
      this.scene.add(mesh);
    }
  }

  onMouseMove(e) {
    this.mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    this.mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Gentle camera parallax
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.03;
    this.camera.lookAt(this.scene.position);

    // Rotate particle cloud
    if (this.particles) {
      this.particles.rotation.y += 0.0006;
      this.particles.rotation.x += 0.0003;
    }

    // Animate floating geometric objects
    const time = Date.now() * 0.001;
    this.floatingObjects.forEach((obj) => {
      obj.rotation.x += obj.userData.rotSpeedX;
      obj.rotation.y += obj.userData.rotSpeedY;
      obj.position.y = obj.userData.initialY + Math.sin(time * obj.userData.floatSpeed * 10) * 15;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.ThreeDSceneInstance = new ThreeDScene();
});
