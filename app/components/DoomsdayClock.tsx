"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import ParticleCanvas from "./ParticleCanvas";
import Countdown from "./Countdown";
import WillReturn from "./WillReturn";

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export default function DoomsdayClock() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    setIsActive(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const scene = sceneRef.current;
      if (!scene) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.08);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.08);

      scene.style.setProperty("--x", currentPos.current.x + "px");
      scene.style.setProperty("--y", currentPos.current.y + "px");
      scene.style.setProperty("--nx", String((currentPos.current.x / w) * 2 - 1));
      scene.style.setProperty("--ny", String((currentPos.current.y / h) * 2 - 1));

      animationRef.current = requestAnimationFrame(animate);
    };

    mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentPos.current = { ...mousePos.current };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className={`scene relative w-screen h-screen flex justify-center items-center ${isActive ? "active" : ""}`}
    >
      {/* Background */}
      <div className="bg-base absolute inset-0 z-[1] bg-cover bg-center brightness-0" style={{ backgroundImage: "url('/doomsday-bg.png')" }} />
      
      {/* God rays */}
      <div className="god-rays absolute -top-[100vmin] -left-[100vmin] -right-[100vmin] -bottom-[100vmin] z-[2] mix-blend-color-dodge blur-[2vmin] pointer-events-none scale-[1.4]" />
      
      {/* Ambient glow */}
      <div className="ambient-glow absolute inset-0 z-[3] bg-cover bg-center mix-blend-color-dodge pointer-events-none opacity-0" style={{ backgroundImage: "url('/doomsday-bg.png')" }} />
      
      {/* 3D shadow effect */}
      <div className="faux-3d-shadow absolute inset-0 z-[4] mix-blend-multiply pointer-events-none" />
      
      {/* Specular highlight */}
      <div className="faux-3d-specular absolute inset-0 z-[5] mix-blend-overlay pointer-events-none" />
      
      {/* Mouse bloom */}
      <div className="mouse-bloom absolute inset-0 z-[6] mix-blend-color-dodge pointer-events-none" />
      
      {/* Fog */}
      <div className="absolute w-full h-full overflow-hidden z-[7] pointer-events-none opacity-40 mix-blend-screen">
        <div className="fog-layer absolute w-[200%] h-full top-0 -left-1/2 blur-[4vmin]" />
      </div>
      
      {/* Vignette */}
      <div className="vignette absolute inset-0 z-[9] pointer-events-none" />
      
      {/* Particles */}
      <ParticleCanvas />
      
      {/* Countdown */}
      <Countdown />
      
      {/* Will Return text */}
      <Suspense fallback={null}>
        <WillReturn />
      </Suspense>
    </div>
  );
}
