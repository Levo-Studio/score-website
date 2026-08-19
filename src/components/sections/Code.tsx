import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";
import { Stagger } from "@/components/motion/Stagger";
import { cardShell } from "@/lib/styles";
import { GITHUB_APP_URL, GITHUB_WEBSITE_URL } from "@/lib/constants";

const REPOS = [
  {
    name: "levo-studio/score",
    text: "Die iOS- und iPadOS-App in Swift.",
    href: GITHUB_APP_URL,
  },
  {
    name: "levo-studio/score-website",
    text: "Diese Website.",
    href: GITHUB_WEBSITE_URL,
  },
];

export function Code() {
  return (
    <Section id="code">
      <Kicker index="008" label="Quellcode" />
      <MaskLines
        className="font-display mt-6 max-w-[900px] text-[clamp(2.1rem,5vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
        lines={["Der Code ist einsehbar.", <span key="l2" className="text-(--ink2)">App und Website auf GitHub.</span>]}
      />
      <Reveal delay={0.22} className="mt-6 max-w-[700px] text-[16px] leading-[1.7] text-(--ink2) text-pretty">
        Wenn du prüfen willst, dass deine Noten nirgendwo hingesendet werden, kannst du es
        selbst nachlesen. Beides liegt offen — private Nutzung ist erlaubt, kommerzielle
        Nutzung und abgeleitete Werke nicht.
      </Reveal>
      <Stagger className="mt-11 grid max-w-[820px] grid-cols-1 gap-4 sm:grid-cols-2" step={0.12}>
        {REPOS.map((r) => (
          <a key={r.name} href={r.href} className={`block ${cardShell} px-[26px] py-6`}>
            <div className="flex items-center justify-between gap-3.5">
              <span className="font-display text-[15px] leading-[1.3] font-semibold">{r.name}</span>
              <span className="text-[15px] text-(--ink2)">↗</span>
            </div>
            <div className="mt-2.5 text-[13.5px] leading-[1.6] text-(--ink2)">{r.text}</div>
          </a>
        ))}
      </Stagger>
    </Section>
  );
}
