"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

// Balken, die von 0 auf ihren data-target-Wert (Prozent) auflaufen, sobald sie sichtbar werden.
export function Bars({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const bars = ref.current.querySelectorAll<HTMLElement>("[data-target]");
      gsap.set(bars, { width: 0 });
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          width: `${bar.dataset.target}%`,
          duration: 0.9,
          delay: i * 0.11,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
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
