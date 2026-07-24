"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const SHAPES = [
  {
    id: 0,
    path: "M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z",
    inner: "M12 4L14 9.5L20 12L14 14.5L12 20L10 14.5L4 12L10 9.5Z",
  },
  {
    id: 1,
    path: "M12 2L13.5 8.5L21 9L15 13.5L17 21L12 16.5L7 21L9 13.5L3 9L10.5 8.5Z",
    inner: null,
  },
  {
    id: 2,
    path: "M12 0L24 12L12 24L0 12Z",
    inner: null,
  },
];

const COLORS = [
  { outer: "#fff9e6", glow: "#ffd700" },
  { outer: "#ffffff", glow: "#ffe4f0" },
  { outer: "#ffe4f0", glow: "#ffb7e2" },
  { outer: "#f0e6ff", glow: "#d1b3ff" },
];

function generateSparkle(i) {
  const shape = SHAPES[i % SHAPES.length];
  const color = COLORS[i % COLORS.length];
  return {
    id: i,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 90,
    size: 6 + Math.random() * 18,
    floatDuration: 4 + Math.random() * 6,
    floatDelay: Math.random() * 8,
    driftX: -80 + Math.random() * 160,
    rotateDir: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: 1.5 + Math.random() * 2.5,
    twinkleDelay: Math.random() * 3,
    shape,
    color,
  };
}

export default function Sparkles() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
  }

  const sparkles = Array.from({ length: 30 }, (_, i) => generateSparkle(i));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            "--drift": `${s.driftX}px`,
            "--rotate": `${s.rotateDir}`,
            "--float-duration": `${s.floatDuration}s`,
            "--float-delay": `${s.floatDelay}s`,
            "--twinkle-speed": `${s.twinkleSpeed}s`,
            "--twinkle-delay": `${s.twinkleDelay}s`,
            color: s.color.outer,
            "--glow-color": s.color.glow,
          }}
        >
          <div className="sparkle-inner">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d={s.shape.path} />
              {s.shape.inner && (
                <path d={s.shape.inner} fill="white" opacity="0.7" />
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
