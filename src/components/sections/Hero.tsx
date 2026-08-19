"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { btnPrimary, btnOutline } from "@/lib/styles";
import { APP_STORE_URL } from "@/lib/constants";

const HERO_FACTS = [
  { value: "600 + 300", label: "Punkte in Block I und Prüfung" },
  { value: "0 €", label: "kostenlos, ohne Konto" },
  { value: "iCloud", label: "iPhone und iPad synchron" },
];

const START_NOTE = 3.4;
const END_NOTE = 1.5;

function fmt(n: number) {
  return n.toFixed(1).replace(".", ",");
}

function blockPoints(note: number) {
  return Math.round(600 - ((note - 1) / 3) * 400);
}

function markerPct(note: number) {
  return Math.max(2, Math.min(97, ((4 - note) / 3) * 100));
}

export function Hero() {
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!cardWrapRef.current) return;

    ScrollTrigger.create({
      trigger: cardWrapRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const raw = self.progress;
        gsap.set(cardWrapRef.current, { y: (0.5 - raw) * 26 });
        const p = Math.max(0, Math.min(1, (raw - 0.06) / 0.34));
        const eased = 1 - Math.pow(1 - p, 3);
        const v = START_NOTE + (END_NOTE - START_NOTE) * eased;
        if (scoreRef.current) scoreRef.current.textContent = fmt(v);
        if (markerRef.current) markerRef.current.style.left = `${markerPct(v)}%`;
        if (blockRef.current) blockRef.current.textContent = String(blockPoints(v));
      },
    });
  }, []);

  return (
    <header id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[180px] -left-[140px] h-[860px] w-[860px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--glow) 0%, transparent 64%)" }}
      />
      <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-16 px-6 py-24 sm:px-10 sm:pt-28 sm:pb-28">
        <div className="min-w-[320px] flex-1">
          <Reveal className="flex items-center gap-3 text-[12.5px] font-medium text-(--ink2)">
            <span className="h-[7px] w-[7px] flex-none rounded-full bg-(--acc) [animation:sc-blink_2.6s_ease-in-out_infinite]" />
            <span>iPhone und iPad · kostenlos</span>
          </Reveal>

          <MaskLines
            className="mt-6 font-display max-w-[560px] text-[clamp(2.75rem,6.5vw,4.625rem)] leading-[1.04] font-extrabold tracking-[-0.05em]"
            lines={["Dein Abischnitt.", <span key="l2" className="text-(--ink2)">Live mitgerechnet.</span>]}
          />

          <Reveal delay={0.24} className="mt-6 max-w-[520px] text-[19px] leading-[1.6] text-(--ink2) text-pretty">
            Noten eintragen, Score rechnet Block I und den Prüfungsblock. Klassenarbeiten,
            Tests, Projekte und mündliche Noten mit eigener Gewichtung — für die Kursstufe
            in Baden-Württemberg.
          </Reveal>

          <Reveal delay={0.32} className="mt-9 flex flex-wrap items-center gap-3.5">
            <a href={APP_STORE_URL || "#laden"} className={`px-6 py-[18px] text-[14.5px] ${btnPrimary}`}>
              Im App Store laden
            </a>
            <a href="#eintragen" className={`px-[22px] py-[18px] text-[14.5px] ${btnOutline}`}>
              Was es macht ↓
            </a>
          </Reveal>

          <Stagger className="mt-11 flex flex-wrap gap-7">
            {HERO_FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-display text-[19px] font-semibold tabular-nums">{f.value}</div>
                <div className="mt-2 text-[12.5px] text-(--ink2)">{f.label}</div>
              </div>
            ))}
          </Stagger>
        </div>

        <div ref={cardWrapRef} className="w-full flex-none sm:w-[452px]">
          <div className="rounded-[28px] border border-(--line) bg-(--sf) p-7 sm:p-[30px]">
            <div className="flex items-center justify-between text-[12px] font-medium text-(--ink2)">
              <span>Erwarteter Abischnitt</span>
              <span className="text-(--acc)">↑ 0,2</span>
            </div>
            <div
              ref={scoreRef}
              className="font-display mt-4 text-[clamp(4.5rem,13vw,8.5rem)] leading-none font-extrabold tracking-[-0.06em] tabular-nums"
            >
              {fmt(START_NOTE)}
            </div>
            <div className="relative mt-6 h-[22px]">
              <div
                className="absolute top-[9px] right-0 left-0 h-[5px] rounded-[3px]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--trk) 0%, var(--acc-soft) 60%, var(--acc) 100%)",
                }}
              />
              <div
                ref={markerRef}
                className="absolute top-0 h-[23px] w-[5px] rounded-[3px] bg-(--ink)"
                style={{ left: `${markerPct(START_NOTE)}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[12px] text-(--ink2)">
              <span>4,0</span>
              <span>2,5</span>
              <span>1,0</span>
            </div>
            <div className="mt-[30px] flex gap-8 border-t border-(--line) pt-[22px]">
              <div className="flex items-baseline gap-2">
                <span ref={blockRef} className="font-display text-[19px] font-semibold tabular-nums">
                  {blockPoints(START_NOTE)}
                </span>
                <span className="text-[14px] text-(--ink2)">Block I</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[19px] font-semibold tabular-nums">40/42</span>
                <span className="text-[14px] text-(--ink2)">Kurse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
