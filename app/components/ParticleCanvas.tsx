"use client";

import { useEffect, useRef } from "react";

interface DustParticle {
  x: number;
  y: number;
  baseSize: number;
  baseVx: number;
  baseVy: number;
  alpha: number;
  fadeSpeed: number;
  fadingOut: boolean;
  angle: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createParticle = (initial = false): DustParticle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseSize: Math.random() * 1.5 + 0.1,
      baseVx: (Math.random() - 0.5) * 0.15,
      baseVy: (Math.random() - 0.5) * 0.15 - 0.05,
      alpha: initial ? Math.random() * 0.6 : 0,
      fadeSpeed: Math.random() * 0.002 + 0.001,
      fadingOut: Math.random() > 0.5,
      angle: Math.random() * Math.PI * 2,
    });

    const resetParticle = (p: DustParticle) => {
      p.x = Math.random() * window.innerWidth;
      p.y = Math.random() * window.innerHeight;
      p.baseSize = Math.random() * 1.5 + 0.1;
      p.baseVx = (Math.random() - 0.5) * 0.15;
      p.baseVy = (Math.random() - 0.5) * 0.15 - 0.05;
      p.alpha = 0;
      p.fadeSpeed = Math.random() * 0.002 + 0.001;
      p.fadingOut = false;
      p.angle = Math.random() * Math.PI * 2;
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: 500 }, () => createParticle(true));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;

      particlesRef.current.forEach((p) => {
        p.angle += 0.005;
        p.x += p.baseVx * scaleFactor + Math.sin(p.angle) * (0.1 * scaleFactor);
        p.y += p.baseVy * scaleFactor;

        if (p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight) {
          resetParticle(p);
        }

        if (p.fadingOut) {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0) {
            p.fadingOut = false;
            resetParticle(p);
          }
        } else {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 0.7) p.fadingOut = true;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 255, 200, ${p.alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas absolute inset-0 z-[8] pointer-events-none" />;
}
