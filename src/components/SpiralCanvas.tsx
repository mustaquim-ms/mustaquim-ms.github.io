import React, { useEffect, useRef } from 'react';

interface SpiralCanvasProps {
  isDefcon: boolean;
}

export const SpiralCanvas: React.FC<SpiralCanvasProps> = ({ isDefcon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let time = 0;

    const particles: { angle: number; baseRadius: number; speed: number }[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        angle: ((Math.PI * 2) / 35) * i,
        baseRadius: i * 1.8,
        speed: 0.02 + i * 0.001,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let animationId = 0;

    const render = () => {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      ctx.clearRect(0, 0, width, height);
      time += 1;

      particles.forEach((p, index) => {
        const radius = p.baseRadius + Math.sin(time * 0.05 + index) * 12;
        const currentAngle = p.angle + time * p.speed;
        const x = glowX + Math.cos(currentAngle) * radius;
        const y = glowY + Math.sin(currentAngle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);

        // Color shift if DEFCON active
        const hue = isDefcon ? 340 + index : 150 + index * 2.8;
        ctx.fillStyle = `hsla(${hue}, 100%, 55%, ${Math.max(0, 1 - index / 35)})`;
        ctx.fill();

        if (index > 0) {
          const prevP = particles[index - 1];
          const prevRadius = prevP.baseRadius + Math.sin(time * 0.05 + (index - 1)) * 12;
          const prevAngle = prevP.angle + time * prevP.speed;
          const prevX = glowX + Math.cos(prevAngle) * prevRadius;
          const prevY = glowY + Math.sin(prevAngle) * prevRadius;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(prevX, prevY);
          ctx.strokeStyle = `hsla(${hue}, 100%, 55%, ${Math.max(0, 0.25 - index / 80)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [isDefcon]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 mix-blend-screen"
      aria-hidden="true"
    />
  );
};
