"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

// Animiert die direkten Kinder nacheinander ein, sobald der Container in den Viewport läuft.
export function Stagger({
  children,
  className,
  step = 0.09,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const kids = Array.from(ref.current.children);
      gsap.set(kids, { opacity: 0, y });
      gsap.to(kids, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: step,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
