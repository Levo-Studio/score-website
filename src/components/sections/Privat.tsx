import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { cardShell } from "@/lib/styles";

const PRIVACY = [
  { label: "Konto nötig", value: "Nein" },
  { label: "Sync", value: "Deine iCloud" },
  { label: "Verschlüsselung", value: "Alle Felder" },
  { label: "Analytics oder Tracking", value: "Nein" },
  { label: "Server", value: "Keiner" },
  { label: "Preis", value: "Kostenlos" },
];

export function Privat() {
  return (
    <Section id="privat">
      <Kicker index="006" label="Datenschutz" />
      <div className="mt-7 flex flex-wrap items-start gap-16">
        <div className="w-full min-w-0 flex-1 sm:min-w-[320px]">
          <MaskLines
            className="font-display max-w-[440px] text-[clamp(1.8rem,7vw,2.875rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
            lines={["Kein Konto.", <span key="l2" className="text-(--ink2)">Keine Anmeldung.</span>]}
          />
          <Reveal delay={0.24} className="mt-6 max-w-[460px] text-[15.5px] leading-[1.7] text-(--ink2) text-pretty">
            Deine Kurse liegen in deiner privaten iCloud und gleichen sich zwischen iPhone und
            iPad ab. Alle gespeicherten Felder sind verschlüsselt — Apple sieht die Struktur
            deiner Daten, nicht ihre Werte. Kein Server, der mitliest, keine Analytics, die
            deine Noten zählen. Löschst du die App, gehen die Daten mit.
          </Reveal>
        </div>
        <div className="w-full flex-none sm:w-[452px]">
          <div className={cardShell}>
            <Stagger className="flex flex-col" step={0.09}>
              {PRIVACY.map((p, i) => (
                <div
                  key={p.label}
                  className={`flex items-baseline justify-between gap-4 py-3.5 ${i === 0 ? "" : "border-t border-(--line)"}`}
                >
                  <span className="text-[13.5px] leading-[1.4] text-(--ink2)">{p.label}</span>
                  <span className="text-[13.5px] leading-[1.4] font-semibold">{p.value}</span>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </Section>
  );
}
