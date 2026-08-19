"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

// Blendet ein Element beim Einlaufen in den Viewport sanft ein — das "rise"-Muster der Vorlage.
export function Reveal({ children, delay = 0, y = 26, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.set(ref.current, { opacity: 0, y });
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
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
