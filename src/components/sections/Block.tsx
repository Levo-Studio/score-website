import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { Bars } from "@/components/motion/Bars";
import { cardShell, hoverCard } from "@/lib/styles";

const CHAIN = [
  { n: "42", label: "Kurse belegt" },
  { n: "40", label: "Kurse gewertet" },
  { n: "48", label: "Wertungen" },
  { n: "600", label: "Punkte Kursblock" },
  { n: "+300", label: "Punkte Prüfung" },
  { n: "900", label: "→ die Note" },
];

const GAUGES = [
  {
    title: "Kursblock",
    max: "600",
    fillPct: 87,
    passPct: 33,
    passLabel: "Bestehen ab 200",
    caption: "40 gewertete Kurse ergeben 48 Wertungen — die drei Leistungsfächer zählen doppelt.",
  },
  {
    title: "Prüfungsblock",
    max: "300",
    fillPct: 77,
    passPct: 33,
    passLabel: "Bestehen ab 100",
    caption: "Fünf Abiturprüfungen — drei schriftlich, zwei mündlich — zählen je vierfach.",
  },
];

const NOTE_TICKS = [
  { pos: 0, label: "300", sub: "4,0" },
  { pos: 87, label: "823", sub: "1,0" },
  { pos: 100, label: "900", sub: "1,0" },
];

export function Block() {
  return (
    <Section id="block">
      <Kicker index="003" label="Block I" />
      <MaskLines
        className="font-display mt-6 max-w-[900px] text-[clamp(2.1rem,5vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
        lines={["Punkte statt Noten.", <span key="l2" className="text-(--ink2)">So rechnet Baden-Württemberg.</span>]}
      />
      <Reveal delay={0.22} className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-(--ink2) text-pretty">
        Am Ende zählt eine amtliche Punktzahl, keine Schulnote. Score rechnet den Weg dahin
        mit — vom belegten Kurs bis zur fertigen Note.
      </Reveal>

      <Stagger className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-4" step={0.08} y={16}>
        {CHAIN.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center rounded-[20px] border border-(--line) bg-(--sf) px-5 py-4 text-center">
              <div className="font-display text-[26px] leading-none font-extrabold tracking-[-0.03em] tabular-nums text-(--acc)">
                {step.n}
              </div>
              <div className="mt-2 text-[11.5px] whitespace-nowrap text-(--ink2)">{step.label}</div>
            </div>
            {i < CHAIN.length - 1 && (
              <span className="text-[18px] text-(--ink2)" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </Stagger>

      <Stagger className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2" step={0.12}>
        {GAUGES.map((g) => (
          <div key={g.title} className={`${cardShell} ${hoverCard} px-7 py-7`}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[15.5px] font-semibold">{g.title}</span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-[22px] font-extrabold tabular-nums text-(--acc)">{g.max}</span>
                <span className="text-[12px] text-(--ink2)">Punkte</span>
              </span>
            </div>
            <Bars className="relative mt-6 h-[10px]">
              <div className="h-full overflow-hidden rounded-full bg-(--sf2)">
                <div
                  data-target={g.fillPct}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--acc-soft), var(--acc))" }}
                />
              </div>
              <div
                className="absolute -top-1.5 h-[13px] w-[2px] rounded-full bg-(--ink)"
                style={{ left: `${g.passPct}%` }}
                title={g.passLabel}
              />
            </Bars>
            <div className="mt-2 text-[11px] text-(--ink2)">{g.passLabel}</div>
            <p className="mt-4 text-[13px] leading-[1.6] text-(--ink2)">{g.caption}</p>
          </div>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-8">
        <div className={`${cardShell} px-7 py-7`}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[15.5px] font-semibold">Kursblock + Prüfungsblock → Note</span>
            <span className="text-[12px] text-(--ink2)">amtliche Tabelle, Schritte von 18 Punkten</span>
          </div>
          <div className="relative mt-7 h-[5px] rounded-[3px]" style={{ background: "linear-gradient(90deg, var(--acc), var(--acc-soft) 60%, var(--trk))" }}>
            {NOTE_TICKS.map((t) => (
              <div
                key={t.label}
                className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${t.pos}%`, transform: `translate(${t.pos === 0 ? "0" : t.pos === 100 ? "-100%" : "-50%"}, -50%)` }}
              >
                <span className="h-[15px] w-[3px] rounded-full bg-(--ink)" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[12px] text-(--ink2)">
            {NOTE_TICKS.map((t) => (
              <span key={t.label} className="flex flex-col gap-0.5 text-center first:items-start last:items-end">
                <span className="font-display font-semibold tabular-nums text-(--ink)">{t.label} P.</span>
                <span>{t.sub}</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 max-w-[640px] text-[14px] leading-[1.7] text-(--ink2) text-pretty">
        Zwei deiner drei Leistungsfächer zählen doppelt, deshalb werden aus 40 Kursen 48
        Wertungen. Bei den Abiturprüfungen zählt jede der fünf Prüfungen vierfach.
      </Reveal>
    </Section>
  );
}
