import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  isDefcon: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ isDefcon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool
    const particleCount = Math.min(100, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];

    const colors = isDefcon
      ? ['#FF003C', '#FF4500', '#FF2A6D']
      : ['#7ed957', '#00F0FF', '#00FF88', '#ffb423', '#B026FF'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseRadius: Math.random() * 1.6 + 0.8,
        radius: Math.random() * 1.6 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.25,
      });
    }

    // Mouse tracking with lerped coordinates
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isActive: false };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const onMouseLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.35,
        alpha: 0.8,
      });
    };

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    let animId = 0;

    const render = () => {
      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Render & update ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 5.5;
        rip.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDefcon
          ? `rgba(255, 0, 60, ${rip.alpha})`
          : `rgba(0, 240, 255, ${rip.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (rip.alpha <= 0.02 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // Update & render particles
      const connectionDist = 120;
      const mouseInteractionDist = 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse hover interaction: gentle magnet & repulse wave
        if (mouse.isActive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseInteractionDist) {
            const force = (1 - dist / mouseInteractionDist);
            // Swirl slightly around cursor
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            p.x += Math.cos(angle) * force * 1.5 - (dx / dist) * force * 1.2;
            p.y += Math.sin(angle) * force * 1.5 - (dy / dist) * force * 1.2;
            p.radius = p.baseRadius * (1 + force * 1.2);
          } else {
            p.radius = p.baseRadius;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDefcon ? '#FF003C' : '#00F0FF';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Connect particle to mouse if close
        if (mouse.isActive) {
          const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mDist < mouseInteractionDist) {
            const mLineAlpha = (1 - mDist / mouseInteractionDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDefcon ? '#FF4500' : '#7ed957';
            ctx.globalAlpha = mLineAlpha;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, [isDefcon]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
