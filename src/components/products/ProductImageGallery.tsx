"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import type { ProductImageGalleryProps } from "@/types";

export function ProductImageGallery({ images, thumbnail, title }: ProductImageGalleryProps) {
  // Deduplicate: thumbnail first, then remaining images
  const allImages = [thumbnail, ...images.filter((img) => img !== thumbnail)];
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }

  return (
    <div className="space-y-3">
      {/* ── Main image with cursor-tracked zoom ── */}
      <div
        ref={containerRef}
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in select-none"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-300 ease-out will-change-transform",
            zoom ? "scale-150" : "scale-100"
          )}
          style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
          priority
        />
      </div>

      {/* ── Thumbnail strip ── */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden bg-muted transition-all duration-150",
                "ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeImage === img
                  ? "ring-2 ring-primary opacity-100"
                  : "ring-0 opacity-60 hover:opacity-90"
              )}
            >
              <Image
                src={img}
                alt={`${title} — view ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
