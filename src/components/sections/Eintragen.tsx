import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { cardShell } from "@/lib/styles";

const RULES = [
  { label: "Eine Klassenarbeit im Halbjahr", value: "100 %" },
  { label: "Zwei Klassenarbeiten", value: "je 50 %" },
  { label: "Test oder Projekt", value: "frei setzbar" },
  { label: "Schriftlich zu mündlich", value: "pro Fach" },
];

const ENTRIES = [
  { name: "Klassenarbeit 1", meta: "Klassenarbeit · 28 % automatisch", p: "14" },
  { name: "Klassenarbeit 2", meta: "Klassenarbeit · 28 % automatisch", p: "13" },
  { name: "Vokabeltest", meta: "Test · 20 %", p: "15" },
  { name: "Mitarbeit", meta: "Sonstiges · 70 % mündlich", p: "13" },
];

export function Eintragen() {
  return (
    <Section id="eintragen">
      <Kicker index="001" label="Eintragen" />
      <div className="mt-7 flex flex-wrap items-start gap-16">
        <div className="min-w-[320px] flex-1">
          <MaskLines
            className="font-display max-w-[440px] text-[clamp(1.9rem,4.4vw,2.875rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
            lines={["Jede Leistung einzeln.", <span key="l2" className="text-(--ink2)">Mit ihrem Anteil.</span>]}
          />
          <Reveal delay={0.24} className="mt-6 max-w-[460px] text-[15.5px] leading-[1.7] text-(--ink2) text-pretty">
            Klassenarbeiten teilen sich die schriftliche Note automatisch: eine Arbeit im
            Halbjahr zählt 100 Prozent, zwei je 50. Tests und Projekte bekommen einen festen
            Prozentwert, den du selbst setzt. Baden-Württemberg schreibt keine Quote vor, deine
            Lehrkraft gibt sie bekannt — also stellst du sie ein.
          </Reveal>
          <Stagger className="mt-9 flex max-w-[440px] flex-col gap-0.5" step={0.09}>
            {RULES.map((r, i) => (
              <div
                key={r.label}
                className={`flex items-baseline justify-between gap-4 py-3.5 ${i === 0 ? "" : "border-t border-(--line)"}`}
              >
                <span className="text-[13.5px] leading-[1.4] text-(--ink2)">{r.label}</span>
                <span className="text-[13.5px] leading-[1.4] font-semibold whitespace-nowrap">{r.value}</span>
              </div>
            ))}
          </Stagger>
        </div>

        <Reveal className="w-full flex-none sm:w-[420px]">
          <div className={cardShell}>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 flex-none rounded-[13px]"
                style={{ background: "#1C6B6E", boxShadow: "inset 0 -9px 18px rgba(0,0,0,.16)" }}
              />
              <div className="flex-1">
                <div className="text-[15px] font-semibold">Mathematik</div>
                <div className="mt-[7px] text-[11.5px] text-(--ink2)">Leistungsfach · Halbjahr 4/4</div>
              </div>
              <div className="font-display text-[26px] font-extrabold tracking-[-0.03em] tabular-nums">14</div>
            </div>
            <Stagger className="mt-[22px] flex flex-col gap-2" step={0.12}>
              {ENTRIES.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-3 rounded-2xl bg-(--sf2) px-[15px] py-[13px] transition-[padding] duration-300"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] leading-[1.2] font-semibold">{e.name}</div>
                    <div className="mt-1 text-[11px] leading-[1.2] text-(--ink2)">{e.meta}</div>
                  </div>
                  <div className="font-display text-[19px] font-extrabold tabular-nums">{e.p}</div>
                </div>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
