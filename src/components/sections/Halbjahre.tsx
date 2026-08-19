import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Bars } from "@/components/motion/Bars";
import { cardShell, chipClass } from "@/lib/styles";

const VERLAUF = [
  { label: "HJ 1/4", val: "13", pct: 87, active: false },
  { label: "HJ 2/4", val: "14", pct: 93, active: false },
  { label: "HJ 3/4", val: "14", pct: 93, active: false },
  { label: "HJ 4/4", val: "14", pct: 93, active: true },
];

const HJ_CHIPS = ["1/4", "2/4", "3/4", "4/4"];

export function Halbjahre() {
  return (
    <Section id="halbjahre">
      <Kicker index="002" label="Halbjahre" />
      <div className="mt-7 flex flex-wrap items-start gap-16">
        <Reveal className="w-full flex-none sm:w-[452px]">
          <div className={cardShell}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[14px] font-semibold">Verlauf</span>
              <span className="text-[11.5px] text-(--ink2)">0–15 Punkte</span>
            </div>
            <Bars className="mt-5 flex flex-col gap-2.5">
              {VERLAUF.map((v) => (
                <div key={v.label} className="flex items-center gap-3.5">
                  <span
                    className="w-[46px] flex-none text-[11px] font-medium"
                    style={{ color: v.active ? "var(--ink)" : "var(--ink2)" }}
                  >
                    Halbjahr {v.label}
                  </span>
                  <div className="h-[22px] flex-1 overflow-hidden rounded-lg bg-(--sf2)">
                    <div
                      data-target={v.pct}
                      className="h-full rounded-lg"
                      style={{ background: v.active ? "var(--acc)" : "var(--line2, var(--line))" }}
                    />
                  </div>
                  <span
                    className="font-display w-7 flex-none text-right text-[16px] font-bold tabular-nums"
                    style={{ color: v.active ? "var(--acc)" : "var(--ink)" }}
                  >
                    {v.val}
                  </span>
                </div>
              ))}
            </Bars>
          </div>
        </Reveal>

        <div className="min-w-[320px] flex-1">
          <MaskLines
            className="font-display max-w-[440px] text-[clamp(1.9rem,4.4vw,2.875rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
            lines={["Vier Halbjahre.", <span key="l2" className="text-(--ink2)">Immer im Blick.</span>]}
          />
          <Reveal delay={0.24} className="mt-6 max-w-[460px] text-[15.5px] leading-[1.7] text-(--ink2) text-pretty">
            Score startet im Halbjahr, in dem du gerade bist. Du wählst pro Fach, in welchen
            Halbjahren du es belegt hast — abgewählte zählen nicht für Block I, bleiben aber
            gespeichert. Jede Eingabe verschiebt den Schnitt sofort.
          </Reveal>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {HJ_CHIPS.map((label, i) => (
              <div key={label} className={chipClass(i === 0)}>
                Halbjahr {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
