"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState, ReactNode, CSSProperties, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const noise = createNoise3D();
  let w: number;
  let h: number;
  let nt: number;
  let i: number;
  let x: number;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = useCallback(() => {
    canvas = canvasRef.current;
    if (canvas) {
      ctx = canvas.getContext("2d");
      if (ctx) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
        nt = 0;
        window.onresize = () => {
          if (canvas && ctx) {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
          }
        };
        render();
      }
    }
  }, [blur]);

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx?.beginPath();
      if (ctx) {
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
      }
      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx?.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx?.stroke();
      ctx?.closePath();
    }
  };

  const render = () => {
    if (ctx) {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);
    }
    drawWave(5);
    animationIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [init, colors, waveWidth, backgroundFill, blur, speed, waveOpacity]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but I have got to support it on Safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        } as CSSProperties}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};


