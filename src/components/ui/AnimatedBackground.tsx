"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- CLASSE TOUCH TEXTURE ---
class TouchTexture {
  size: number; width: number; height: number; maxAge: number; radius: number;
  speed: number; trail: any[]; last: { x: number; y: number } | null;
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; texture: THREE.Texture;

  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * this.speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0, vx = 0, vy = 0;
    if (this.last) {
      const dx = point.x - this.last.x;
      const dy = point.y - this.last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d; vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point: any) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = point.age < this.maxAge * 0.3
      ? Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2))
      : -((1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) *
          ((1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2));
    intensity *= point.force;
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = this.radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// --- SHADERS ---
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1, uColor2, uDarkNavy;
  uniform float uSpeed, uIntensity, uGradientSize;
  uniform float uColor1Weight, uColor2Weight;
  uniform sampler2D uTouchTexture;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 touchTex = texture2D(uTouchTexture, uv);
    float vx = -(touchTex.r * 2.0 - 1.0);
    float vy = -(touchTex.g * 2.0 - 1.0);
    float touchIntensity = touchTex.b;

    uv.x += vx * 0.8 * touchIntensity;
    uv.y += vy * 0.8 * touchIntensity;

    float t = uTime * uSpeed;
    vec3 color = uDarkNavy;

    for (float i = 0.0; i < 6.0; i++) {
      vec2 center = vec2(
        0.5 + sin(t * 0.5 + i * 1.2) * 0.4,
        0.5 + cos(t * 0.4 + i * 0.9) * 0.4
      );
      float dist = length(uv - center);
      float influence = 1.0 - smoothstep(0.0, uGradientSize, dist);
      vec3 c = mod(i, 2.0) == 0.0 ? uColor1 : uColor2;
      float w = i < 3.0 ? uColor1Weight : uColor2Weight;
      color += c * influence * uIntensity * w;
    }

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

// --- COMPONENTE REACT ---
const AnimatedBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<TouchTexture | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Creato nel browser — nessun crash SSR
    const touch = new TouchTexture();
    touchRef.current = touch;

    const uniforms = {
      uTime:           { value: 0 },
      uResolution:     { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColor1:         { value: new THREE.Color('#17192D') },  
      uColor2:         { value: new THREE.Color('#0a224d') },  
      uDarkNavy:       { value: new THREE.Color('#000000') },  
      uSpeed:          { value: 1.2 },
      uIntensity:      { value: 1.8 },
      uGradientSize:   { value: 0.7 },
      uColor1Weight:   { value: 2.5 },
      uColor2Weight:   { value: 0.8 },
      uTouchTexture:   { value: touch.texture },
    };

    // --- Three.js setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;
    const vFov = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const geometry = new THREE.PlaneGeometry(vFov * aspect, vFov);

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Animation loop ---
    let prevTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      touch.update();
      uniforms.uTime.value += delta;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // --- Mouse ---
    const handleMouseMove = (e: MouseEvent) => {
      touch.addTouch({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Resize ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default AnimatedBackground;