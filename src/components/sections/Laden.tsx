import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { btnPrimary } from "@/lib/styles";
import { APP_STORE_URL } from "@/lib/constants";

export function Laden() {
  return (
    <Section id="laden" last>
      <Kicker index="007" label="Laden" />
      <MaskLines
        className="font-display mt-6 max-w-[900px] text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
        lines={["Einmal einrichten,", <span key="l2" className="text-(--ink2)">dann nur noch Noten eintragen.</span>]}
      />
      <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener"
          className={`w-full px-7 py-[19px] text-[15px] sm:w-auto ${btnPrimary}`}
        >
          Im App Store laden
        </a>
        <span className="text-[13.5px] text-(--ink2)">
          Kostenlos · iPhone und iPad · Baden-Württemberg
        </span>
      </Reveal>
    </Section>
  );
}
