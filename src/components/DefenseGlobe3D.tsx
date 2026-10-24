import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface DefenseGlobe3DProps {
  isDefcon: boolean;
}

interface LogEntry {
  id: number;
  time: string;
  status: 'ok' | 'warn' | 'block';
  message: string;
}

export const DefenseGlobe3D: React.FC<DefenseGlobe3DProps> = ({ isDefcon }) => {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  // Live telemetry metrics
  const [metrics, setMetrics] = useState({ cpu: 14, ram: 42, net: 860 });
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: '21:14:02', status: 'ok', message: 'Azure AD Zero-Trust Token Refreshed.' },
    { id: 2, time: '21:14:08', status: 'ok', message: "Intune Policy 'Sec_Hardening_V2' active on 520 nodes." },
    { id: 3, time: '21:14:15', status: 'block', message: 'SSH Brute-Force Attempt Dropped from 185.220.101.4' },
    { id: 4, time: '21:14:22', status: 'warn', message: 'Core Switch Latency Jitter +4ms on VLAN 10' },
  ]);

  const defconRef = useRef(isDefcon);
  useEffect(() => {
    defconRef.current = isDefcon;
  }, [isDefcon]);

  // Log simulation interval
  useEffect(() => {
    const logCandidates: { status: 'ok' | 'warn' | 'block'; message: string }[] = [
      { status: 'ok', message: 'Zero-Trust SAML assertion validated for administrative session.' },
      { status: 'block', message: 'Malicious payload signature quarantined by EDR behavioral engine.' },
      { status: 'ok', message: 'Multi-WAN failover path verification: 100% packet integrity.' },
      { status: 'warn', message: 'Node-C4 thermal headroom threshold at 68°C.' },
      { status: 'ok', message: 'Automated RCA generated for incident #4092 with zero loss.' },
      { status: 'block', message: 'Unauthorized USB mass storage probe blocked on Clinical Station 12.' },
      { status: 'ok', message: 'LSTM Autoencoder pipeline anomaly score nominal (0.014).' },
      { status: 'warn', message: 'Certificate expiry check: 42 days remaining on wildcard TLS.' },
      { status: 'block', message: 'SYN Flood pattern suppressed at Edge Firewall layer.' },
    ];

    const timer = setInterval(() => {
      const candidate = logCandidates[Math.floor(Math.random() * logCandidates.length)];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });

      setLogs((prev) => {
        const next = [...prev, { id: Date.now(), time: now, status: candidate.status, message: candidate.message }];
        if (next.length > 7) return next.slice(next.length - 7);
        return next;
      });

      setMetrics({
        cpu: Math.floor(Math.random() * 15) + (defconRef.current ? 45 : 10),
        ram: Math.floor(Math.random() * 20) + (defconRef.current ? 65 : 35),
        net: Math.floor(Math.random() * 180) + (defconRef.current ? 1200 : 750),
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Three.js 3D Globe
  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1.4, 30, 30);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(globeMesh);

    // Constellation / Points
    const pointsMat = new THREE.PointsMaterial({
      color: 0xB026FF,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
    });
    const pointsMesh = new THREE.Points(sphereGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // Laser Attack Arcs
    const attackLinesGeo = new THREE.BufferGeometry();
    const attackLinesMat = new THREE.LineBasicMaterial({
      color: 0xFF003C,
      transparent: true,
      opacity: 0.4,
    });
    const attackLines = new THREE.LineSegments(attackLinesGeo, attackLinesMat);
    globeGroup.add(attackLines);

    // Pointer Drag Rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.005 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      globeGroup.rotation.y += dx * 0.008;
      globeGroup.rotation.x += dy * 0.008;
      rotationVelocity = { x: dy * 0.002, y: dx * 0.002 };
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    let frameId = 0;
    let tickCount = 0;

    const animate = () => {
      tickCount++;

      if (!isDragging) {
        globeGroup.rotation.y += rotationVelocity.y;
        globeGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.96;
        rotationVelocity.y = rotationVelocity.y * 0.96 + 0.003 * 0.04; // Baseline auto-spin
      }

      // Re-generate attack laser lines periodically
      if (tickCount % 60 === 0) {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 4; i++) {
          pts.push(
            new THREE.Vector3(
              (Math.random() - 0.5) * 2.8,
              (Math.random() - 0.5) * 2.8,
              (Math.random() - 0.5) * 2.8
            )
          );
        }
        attackLinesGeo.setFromPoints(pts);
      }

      // DEFCON mode color shifts
      if (defconRef.current) {
        wireMat.color.setHex(0xFF003C);
        pointsMat.color.setHex(0xFF4500);
        attackLinesMat.color.setHex(0xFF003C);
      } else {
        wireMat.color.setHex(0x00F0FF);
        pointsMat.color.setHex(0xB026FF);
        attackLinesMat.color.setHex(0x7ed957);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvasDom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      sphereGeo.dispose();
      wireMat.dispose();
      pointsMat.dispose();
      attackLinesGeo.dispose();
      attackLinesMat.dispose();
      renderer.dispose();
      if (container.contains(canvasDom)) {
        container.removeChild(canvasDom);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#050914] border border-[#00F0FF]/20 rounded-2xl p-6 shadow-2xl overflow-hidden relative">
      {/* 3D WebGL Globe Area */}
      <div className="lg:col-span-5 relative h-[360px] bg-[#02040A] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
        <div ref={globeContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Radar Sweep Effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background:
              'radial-gradient(circle at center, transparent 30%, rgba(0, 240, 255, 0.05) 70%, transparent 100%)',
          }}
        />

        {/* Live Metrics Floating Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono text-xs z-10 pointer-events-none bg-[#010308]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">CPU LOAD:</span>
            <span className={metrics.cpu > 40 ? 'text-[#FF003C] font-bold' : 'text-[#7ed957] font-bold'}>
              {metrics.cpu}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">MEM CONSUMPTION:</span>
            <span className="text-[#00F0FF] font-bold">{metrics.ram}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">THROUGHPUT:</span>
            <span className="text-[#ffb423] font-bold">{metrics.net} Mbps</span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
          Drag to rotate globe
        </div>
      </div>

      {/* Terminal Telemetry Feed */}
      <div className="lg:col-span-7 flex flex-col h-[360px] bg-[#02040A] rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080d1a] border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-slate-400 ml-2">telemetry_feed@mustaquim:~</span>
          </div>
          <span className="text-[11px] text-[#7ed957] font-semibold">LIVE PERIMETER</span>
        </div>

        {/* Terminal Body Stream */}
        <div className="p-4 flex-1 flex flex-col justify-end space-y-2 overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed animate-fade-in">
              <span className="text-[#ffb423] shrink-0">[{log.time}]</span>
              <span
                className={`font-bold uppercase shrink-0 ${
                  log.status === 'ok'
                    ? 'text-[#00FF88]'
                    : log.status === 'warn'
                    ? 'text-[#F59E0B]'
                    : 'text-[#EF4444]'
                }`}
              >
                [{log.status}]
              </span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))}

          <div className="flex items-center gap-2 text-[#7ed957] pt-1">
            <span>root@bastion:~$</span>
            <span className="animate-pulse">█</span>
          </div>
        </div>
      </div>
    </div>
  );
};
