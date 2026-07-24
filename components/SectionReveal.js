"use client";

import { useEffect, useRef } from "react";

export default function SectionReveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal-section ${className}`}>
      {children}
    </section>
  );
}
