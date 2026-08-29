import { Section, Kicker } from "@/components/Section";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { cardShell, chipClass, hoverCard } from "@/lib/styles";
import { HIGHLIGHTED_SUBJECT_INDICES, SUBJECTS } from "@/lib/subjects";

const FEATURES = [
  {
    title: "Standardfächer sind drin",
    text: "Von Deutsch bis Literatur und Theater, mit Farbe und Kürzel. Fehlt eines, tippst du den Namen selbst ein.",
  },
  {
    title: "Gewichtung pro Fach",
    text: "Schriftlich zu mündlich stellst du je Fach ein — 60:40 in Mathe, 50:50 in Deutsch, wie deine Lehrkraft es macht.",
  },
  {
    title: "Belegte Halbjahre",
    text: "Fächer, die du nur ein Jahr hattest, markierst du entsprechend. Score lässt sie aus Block I heraus.",
  },
];

export function Faecher() {
  return (
    <Section id="faecher">
      <Kicker index="004" label="Fächer" />
      <MaskLines
        className="font-display mt-6 max-w-[900px] text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
        lines={["Alle Fächer drin.", <span key="l2" className="text-(--ink2)">Der Rest kommt von dir.</span>]}
      />
      <Stagger className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-3" step={0.16}>
        {FEATURES.map((f) => (
          <div key={f.title} className={`${cardShell} ${hoverCard} px-5 py-6 sm:px-7 sm:py-7`}>
            <div className="font-display text-[15.5px] leading-[1.3] font-semibold">{f.title}</div>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-(--ink2)">{f.text}</p>
          </div>
        ))}
      </Stagger>
      <Stagger className="mt-7 flex flex-wrap gap-2.5" step={0.035} y={12}>
        {SUBJECTS.map((label, i) => (
          <div key={label} className={chipClass(HIGHLIGHTED_SUBJECT_INDICES.has(i))}>
            {label}
          </div>
        ))}
      </Stagger>
    </Section>
  );
}
