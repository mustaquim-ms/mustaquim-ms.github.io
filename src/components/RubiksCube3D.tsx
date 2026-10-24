import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFx } from '../utils/audio';
import { calculateCubeExpansion } from '../utils/math';
import { RotateCw, Sparkles, Layers, RefreshCw, Zap } from 'lucide-react';

interface RubiksCube3DProps {
  scrollY: number;
}

export const RubiksCube3D: React.FC<RubiksCube3DProps> = ({ scrollY }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cubeState, setCubeState] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References to communicate with Three.js loop without tearing down
  const stateRef = useRef({
    cubeState: 0,
    isAutoRotating: true,
    scrollY: 0,
    targetDistance: 1.05,
    currentDistance: 1.05,
    pointerDown: false,
    prevPointer: { x: 0, y: 0 },
    rotationVel: { x: 0.003, y: 0.006 },
    manualRotation: { x: 0.3, y: 0.5 },
  });

  // Keep stateRef synced
  useEffect(() => {
    stateRef.current.cubeState = cubeState;
    const { distance } = calculateCubeExpansion(cubeState);
    stateRef.current.targetDistance = distance;
  }, [cubeState]);

  useEffect(() => {
    stateRef.current.isAutoRotating = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    stateRef.current.scrollY = scrollY;
  }, [scrollY]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to balance performance cleanly
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x7ed957, 2.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00F0FF, 1.8);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xB026FF, 2.5, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Quantum Reactor Core in center
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7ed957,
      emissive: 0x7ed957,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Orbiting core rings
    const ringGeo1 = new THREE.TorusGeometry(0.85, 0.02, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.05, 0.02, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xB026FF, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    rootGroup.add(ring2);

    // Procedural Face Textures for Rubik's Cubelets
    // Colors: Right (+X), Left (-X), Top (+Y), Bottom (-Y), Front (+Z), Back (-Z)
    const faceColors = [
      0xffb423, // Right: Tactical Amber
      0xB026FF, // Left: Electric Violet
      0xF8FAFC, // Top: Pure Silver White
      0x0A0F1E, // Bottom: Obsidian Navy
      0x7ed957, // Front: Signature Cyber Green
      0x00F0FF, // Back: Laser Neon Cyan
    ];

    const materials = faceColors.map((col) => {
      return new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.35,
        metalness: 0.45,
      });
    });

    // Dark base material for inside faces
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.8,
      metalness: 0.9,
    });

    // Generate 3x3x3 Cubelets (26 outer + 1 center omitted)
    const cubeletSize = 0.65;
    const spacing = 0.72;
    const cubeletGeo = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);

    // Edge wireframe overlay for high-tech aesthetic
    const edgeGeo = new THREE.EdgesGeometry(cubeletGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.4 });

    interface CubeletData {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      normal: THREE.Vector3;
    }

    const cubelets: CubeletData[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Keep center hollow for the glowing core

          // Assign color to exterior faces, dark material to interior faces
          const cubeletMats = [
            x === 1 ? materials[0] : innerMaterial,
            x === -1 ? materials[1] : innerMaterial,
            y === 1 ? materials[2] : innerMaterial,
            y === -1 ? materials[3] : innerMaterial,
            z === 1 ? materials[4] : innerMaterial,
            z === -1 ? materials[5] : innerMaterial,
          ];

          const cubelet = new THREE.Mesh(cubeletGeo, cubeletMats);
          const wire = new THREE.LineSegments(edgeGeo, edgeMat);
          cubelet.add(wire);

          cubelet.position.set(x * spacing, y * spacing, z * spacing);
          rootGroup.add(cubelet);

          const normal = new THREE.Vector3(x, y, z).normalize();
          cubelets.push({
            mesh: cubelet,
            baseX: x * spacing,
            baseY: y * spacing,
            baseZ: z * spacing,
            normal,
          });
        }
      }
    }

    // Pointer events for dragging
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      stateRef.current.pointerDown = true;
      stateRef.current.prevPointer = { x: clientX, y: clientY };
      setIsDragging(true);
      soundFx.playTick(950, 0.02);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!stateRef.current.pointerDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - stateRef.current.prevPointer.x;
      const deltaY = clientY - stateRef.current.prevPointer.y;

      stateRef.current.manualRotation.y += deltaX * 0.008;
      stateRef.current.manualRotation.x += deltaY * 0.008;
      stateRef.current.rotationVel = { x: deltaY * 0.002, y: deltaX * 0.002 };

      stateRef.current.prevPointer = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      stateRef.current.pointerDown = false;
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId = 0;
    let clockTime = 0;

    const animate = () => {
      clockTime += 0.016;

      // Update distance smoothly
      const ref = stateRef.current;
      ref.currentDistance += (ref.targetDistance - ref.currentDistance) * 0.08;

      // Update cubelet positions according to distance
      const dist = ref.currentDistance;
      const state = ref.cubeState;

      cubelets.forEach((c, idx) => {
        let posX = c.baseX * dist;
        let posY = c.baseY * dist;
        let posZ = c.baseZ * dist;

        if (state === 2) {
          // Quantum spin mode: oscillate slices
          const sliceAngle = Math.sin(clockTime * 3 + c.baseY) * 0.4;
          posX += Math.cos(clockTime * 2 + idx) * 0.08;
          posZ += Math.sin(clockTime * 2 + idx) * 0.08;
          c.mesh.rotation.y = sliceAngle;
        } else if (state === 3) {
          // Holographic float
          posY += Math.sin(clockTime * 2 + idx * 0.5) * 0.12;
          c.mesh.rotation.x = Math.sin(clockTime + idx) * 0.2;
          c.mesh.rotation.z = Math.cos(clockTime + idx) * 0.2;
        } else {
          c.mesh.rotation.set(0, 0, 0);
        }

        c.mesh.position.set(posX, posY, posZ);
      });

      // Ambient Core Pulsation
      const coreScale = 1 + Math.sin(clockTime * 4) * 0.08;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      ring1.rotation.z += 0.02;
      ring1.rotation.x += 0.01;
      ring2.rotation.y += 0.015;

      // Cube root rotation (drag + auto-rotation + scroll rotation)
      if (!ref.pointerDown) {
        if (ref.isAutoRotating) {
          ref.manualRotation.y += 0.005;
          ref.manualRotation.x += Math.sin(clockTime * 0.5) * 0.001;
        }
        // Friction on drag velocity
        ref.manualRotation.y += ref.rotationVel.y;
        ref.manualRotation.x += ref.rotationVel.x;
        ref.rotationVel.x *= 0.95;
        ref.rotationVel.y *= 0.95;
      }

      // Scroll-driven tilt effect
      const scrollTilt = (ref.scrollY * 0.0015);

      rootGroup.rotation.x = ref.manualRotation.x + scrollTilt;
      rootGroup.rotation.y = ref.manualRotation.y + (ref.scrollY * 0.002);

      // Core light color shifts on states
      if (state === 1) {
        coreMat.color.setHex(0xffb423);
        coreMat.emissive.setHex(0xffb423);
      } else if (state === 2) {
        coreMat.color.setHex(0x00FF88);
        coreMat.emissive.setHex(0x00FF88);
      } else if (state === 3) {
        coreMat.color.setHex(0xB026FF);
        coreMat.emissive.setHex(0xB026FF);
      } else {
        coreMat.color.setHex(0x7ed957);
        coreMat.emissive.setHex(0x7ed957);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Clean disposal
      cubeletGeo.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      materials.forEach((m) => m.dispose());
      innerMaterial.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  const handleNextState = () => {
    const next = (cubeState + 1) % 4;
    setCubeState(next);
    soundFx.playCubeTransform(next);
  };

  const stateLabels = [
    { label: 'Solved Core', desc: 'Compact Defense Matrix', icon: RefreshCw },
    { label: 'Exploded Matrix', desc: 'Quantum Core Exposed', icon: Layers },
    { label: 'Hyperdrive Spin', desc: 'Kinetic Warp Rotation', icon: Zap },
    { label: 'Holo Field', desc: 'Decoupled Flux Lattice', icon: Sparkles },
  ];

  const currentInfo = stateLabels[cubeState];

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[420px]">
      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onClick={handleNextState}
        className={`w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing transition-transform duration-300 relative ${
          isDragging ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        title="Drag to spin, Click to transform cube state"
        data-testid="rubiks-cube-canvas"
      >
        {/* Glow backdrop behind cube */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
          style={{
            background:
              cubeState === 1
                ? 'radial-gradient(circle, #ffb423 0%, transparent 70%)'
                : cubeState === 2
                ? 'radial-gradient(circle, #00FF88 0%, transparent 70%)'
                : cubeState === 3
                ? 'radial-gradient(circle, #B026FF 0%, transparent 70%)'
                : 'radial-gradient(circle, #7ed957 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Mesmerizing State Pill & Interactive Controls */}
      <div className="w-full flex flex-col items-center gap-3 -mt-4 z-10 px-4">
        {/* State Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050914]/80 border border-[#00F0FF]/20 backdrop-blur-md text-xs font-mono">
          <currentInfo.icon className="w-3.5 h-3.5 text-[#7ed957] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-white font-semibold">{currentInfo.label}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 text-[11px]">{currentInfo.desc}</span>
        </div>

        {/* Quick Transformation Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#050914]/90 border border-white/10 rounded-xl shadow-xl">
          {[0, 1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                setCubeState(s);
                soundFx.playCubeTransform(s);
              }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                cubeState === s
                  ? 'bg-[#7ed957] text-black font-bold shadow-md shadow-[#7ed957]/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={stateLabels[s].desc}
            >
              Mode {s + 1}
            </button>
          ))}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoRotating(!isAutoRotating);
              soundFx.playTick(1100, 0.02);
            }}
            className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
              isAutoRotating ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 text-center flex items-center gap-1">
          <span>Click cube to cycle modes</span>
          <span>·</span>
          <span>Drag to orbit 360°</span>
        </div>
      </div>
    </div>
  );
};
