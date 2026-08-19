"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "@/lib/gsap";
import { ScoreMark } from "@/components/ScoreMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { underlineLink, btnPrimary } from "@/lib/styles";
import { APP_STORE_URL } from "@/lib/constants";

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!navRef.current || !innerRef.current || !progressRef.current) return;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(progressRef.current, { width: `${self.progress * 100}%` });
        const scrolled = self.scroll() > 4;
        gsap.set(innerRef.current, { height: scrolled ? 62 : 74 });
        navRef.current?.style.setProperty(
          "border-bottom-color",
          scrolled ? "var(--line)" : "transparent",
        );
      },
    });
  }, []);

  return (
    <>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 z-30 h-[2px] bg-(--acc)"
        style={{ width: 0 }}
      />
      <nav
        ref={navRef}
        className="sticky top-0 z-20 border-b border-transparent bg-(--nav-bg) backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300"
      >
        <div
          ref={innerRef}
          className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-6 transition-[height] duration-300 sm:px-10"
        >
          <a href="#top" className="flex items-center gap-3 transition-[letter-spacing] duration-300 hover:tracking-[0.4px]">
            <ScoreMark className="h-[30px] w-[30px] flex-none" />
            <span className="font-display text-[17px] font-extrabold tracking-[-0.02em]">Score</span>
          </a>
          <div className="hidden items-center gap-2 md:flex">
            <a href="#eintragen" className={`mx-[10px] px-[2px] py-[10px] text-[13.5px] font-medium text-(--ink2) ${underlineLink}`}>
              Funktionen
            </a>
            <a href="#code" className={`mx-[10px] px-[2px] py-[10px] text-[13.5px] font-medium text-(--ink2) ${underlineLink}`}>
              Quellcode
            </a>
            <ThemeToggle />
            <a href={APP_STORE_URL || "#laden"} className={`ml-2 px-[18px] py-[12px] text-[13.5px] ${btnPrimary}`}>
              Laden
            </a>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle size="sm" />
            <a href={APP_STORE_URL || "#laden"} className={`px-4 py-[10px] text-[13px] ${btnPrimary}`}>
              Laden
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
