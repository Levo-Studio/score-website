import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { cardShell } from "@/lib/styles";

const CHAIN = [
  { n: "42", label: "Kurse belegt" },
  { n: "40", label: "Kurse gewertet" },
  { n: "48", label: "Wertungen" },
  { n: "600", label: "Punkte Kursblock" },
  { n: "+300", label: "Punkte Prüfung" },
  { n: "900", label: "→ die Note" },
];

const BLOCKS = [
  {
    title: "Kursblock — 0 bis 600 Punkte",
    text: "Du belegst mindestens 42 Kurse: zwölf in deinen drei Leistungsfächern, mindestens dreißig weitere. Eingebracht werden davon 40 — was du nicht selbst klammerst, klammert Score von unten heraus. Nur die Kurse deiner fünf Prüfungsfächer sind gesetzt und zählen immer. Weil zwei der drei Leistungsfächer doppelt zählen, werden aus den 40 Kursen 48 Wertungen. Die Punktzahl ist die Summe aller 48 Wertungen, geteilt durch 48, mal 40 — mindestens 200 Punkte zum Bestehen.",
  },
  {
    title: "Prüfungsblock — 0 bis 300 Punkte",
    text: "Dazu kommen fünf Abiturprüfungen: drei schriftliche in den Leistungsfächern, zwei mündliche. Jedes Ergebnis zählt vierfach — mindestens 100 Punkte zum Bestehen.",
  },
];

export function Block() {
  return (
    <Section id="block">
      <Kicker index="003" label="Block I" />
      <MaskLines
        className="font-display mt-6 max-w-[900px] text-[clamp(2.1rem,5vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
        lines={["Punkte statt Noten.", <span key="l2" className="text-(--ink2)">So rechnet Baden-Württemberg.</span>]}
      />
      <Reveal delay={0.22} className="mt-6 max-w-[700px] text-[16px] leading-[1.7] text-(--ink2) text-pretty">
        Am Ende zählen keine Schulnoten, sondern Punkte auf einer amtlichen Tabelle. Score
        rechnet den Weg dahin für dich mit — vom belegten Kurs bis zur fertigen Note.
      </Reveal>

      <Stagger
        className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-4"
        step={0.08}
        y={16}
      >
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
        {BLOCKS.map((b) => (
          <div key={b.title} className={`${cardShell} px-7 py-7`}>
            <div className="font-display text-[15.5px] leading-[1.3] font-semibold">{b.title}</div>
            <p className="mt-3 text-[13.5px] leading-[1.7] text-(--ink2)">{b.text}</p>
          </div>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-8">
        <div className={`${cardShell} px-7 py-7`}>
          <div className="font-display text-[15.5px] font-semibold">Die Note kommt aus einer Tabelle</div>
          <p className="mt-3 max-w-[760px] text-[13.5px] leading-[1.7] text-(--ink2)">
            Kursblock und Prüfungsblock ergeben zusammen 300 bis 900 Punkte. Deine Note liest
            das Kultusministerium aus einer amtlichen Tabelle ab, in Schritten von 18 Punkten
            — nicht aus einer Formel. 900 Punkte sind eine 1,0, 823 Punkte sind noch eine 1,0,
            300 Punkte sind eine 4,0. Score rechnet dir diese Tabelle ab, du musst sie nicht
            auswendig kennen.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
