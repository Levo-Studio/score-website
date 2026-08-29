"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

// Zwei Überschriftzeilen, die nacheinander aus einer Blende hochfahren.
export function MaskLines({
  lines,
  className,
  lineClassName,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const els = ref.current.querySelectorAll<HTMLElement>("[data-mask-line]");
      gsap.set(els, { clipPath: "inset(-14% -8% 106% -8%)", y: 26 });
      gsap.to(els, {
        clipPath: "inset(-14% -8% -6% -8%)",
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          data-mask-line
          className={`block max-w-full text-balance lg:w-max lg:max-w-none lg:whitespace-nowrap ${lineClassName ?? ""}`}
        >
          {line}
        </span>
      ))}
    </h2>
  );
}
