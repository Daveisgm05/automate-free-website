"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof Object> | null>(null);

  useEffect(() => {
    if (vantaEffect) return;

    const loadVanta = async () => {
      const THREE = await import("three");
      const FOG = (await import("vanta/dist/vanta.fog.min")).default;

      if (vantaRef.current) {
        const effect = FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xe6e0dd,
          midtoneColor: 0xb69161,
          lowlightColor: 0x84745b,
          baseColor: 0xe8e8e8,
        });
        setVantaEffect(effect);
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) (vantaEffect as { destroy: () => void }).destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
