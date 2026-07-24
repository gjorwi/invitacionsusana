"use client";

import { useState, useEffect } from "react";
import SectionReveal from "./SectionReveal";
import { API } from "../lib/config";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/gallery?approved=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || images.length === 0) return null;

  return (
    <SectionReveal id="gallery">
      <h3 className="font-headline text-2xl text-primary text-center mb-8 font-bold elegant-text-shadow italic">
        Momentos con Susana
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div
            key={img._id || i}
            className={`glass-morphism p-2 rounded-lg shadow-sm bg-white/60 border-white/80 ${
              img.colSpan ? "col-span-2" : i % 2 === 1 ? "translate-y-4" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-md group">
              <img
                src={img.url}
                alt={img.label || ""}
                className={`object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000 ${
                  img.colSpan ? "w-full h-40" : "w-full aspect-square"
                }`}
              />
            </div>
            {img.label && (
              <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary/70 mt-2">
                {img.label}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
