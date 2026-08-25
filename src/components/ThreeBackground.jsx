import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D Orbs & Geometries
    const geometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.TorusGeometry(3, 0.8, 16, 50),
      new THREE.OctahedronGeometry(2.5, 0),
      new THREE.TetrahedronGeometry(2, 0)
    ];

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.35 })
    ];

    const meshes = [];
    for (let i = 0; i < 24; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.5 + Math.random() * 1.2;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);
      meshes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015
      });
    }

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xef4444, 2);
    dirLight2.position.set(-10, -20, -15);
    scene.add(dirLight2);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      meshes.forEach(item => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
      });
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} id="bg-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }} />;
};

export default ThreeBackground;
