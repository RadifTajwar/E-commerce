"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";

// Constants for magnifier size and zoom level
const MAGNIFIER_SIZE = 150;
const ZOOM_LEVEL = 2;

interface ImageEffectProps {
  src: string;
  /** Used for the image's alt text; falls back to a generic description. */
  alt?: string;
}

type DivMouseEvent = MouseEvent<HTMLDivElement>;

const ImageEffect = ({ src, alt }: ImageEffectProps) => {
  // State variables
  const [zoomable, setZoomable] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 100, y: 100, mouseX: 0, mouseY: 0 });

  const updatePosition = (e: DivMouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({
      x: -x * ZOOM_LEVEL + MAGNIFIER_SIZE / 2,
      y: -y * ZOOM_LEVEL + MAGNIFIER_SIZE / 2,
      mouseX: x - MAGNIFIER_SIZE / 2,
      mouseY: y - MAGNIFIER_SIZE / 2,
    });
  };

  // Event handlers
  const handleMouseEnter = (e: DivMouseEvent) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setImageSize({ width, height });
    setZoomable(true);
    updatePosition(e);
  };

  const handleMouseLeave = (e: DivMouseEvent) => {
    setZoomable(false);
    updatePosition(e);
  };

  const handleMouseMove = (e: DivMouseEvent) => {
    updatePosition(e);
  };

  return (
    <div className="flex justify-center items-center cursor-crosshair">
      <div
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden"
      >
        {/* Image container with relative positioning */}
        <div className="relative">
          <Image
            className="object-cover border z-10"
            alt={alt ? `${alt} product image` : "Product image"}
            src={src}
            height={640}
            width={640}
          />
        </div>

        {/* Black overlay on hover */}
        {zoomable && <div className="absolute inset-0 bg-black opacity-30 z-20"></div>}

        {/* Zoom effect */}
        <div
          style={{
            backgroundPosition: `${position.x}px ${position.y}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageSize.width * ZOOM_LEVEL}px ${imageSize.height * ZOOM_LEVEL}px`,
            backgroundRepeat: "no-repeat",
            display: zoomable ? "block" : "none",
            top: `${position.mouseY}px`,
            left: `${position.mouseX}px`,
            width: `${MAGNIFIER_SIZE}px`,
            height: `${MAGNIFIER_SIZE}px`,
          }}
          className="z-50 pointer-events-none absolute"
        />
      </div>
    </div>
  );
};

export default ImageEffect;
