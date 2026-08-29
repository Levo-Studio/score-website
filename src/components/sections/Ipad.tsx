import { Section, Kicker } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/MaskLines";

const SIDE_COLORS = ["#1C6B6E", "#3E7CA6", "#5A7A61", "#8A6A4A", "#B4534A", "#7A6EA6"];
const BARS = [70, 88, 88, 93];
const CARDS = [
  { name: "Mathematik", val: "14", c: "#1C6B6E" },
  { name: "Englisch", val: "14", c: "#3E7CA6" },
  { name: "Biologie", val: "13", c: "#5A7A61" },
  { name: "Deutsch", val: "12", c: "#8A6A4A" },
];

export function Ipad() {
  return (
    <Section id="ipad">
      <Kicker index="005" label="iPad" />
      <div className="mt-7 flex flex-wrap items-center gap-10 sm:gap-16">
        <div className="w-full min-w-0 flex-1 sm:min-w-[320px]">
          <MaskLines
            className="font-display max-w-[440px] text-[clamp(1.8rem,7vw,2.875rem)] leading-[1.1] font-extrabold tracking-[-0.04em]"
            lines={["Auf dem iPad", <span key="l2" className="text-(--ink2)">alles gleichzeitig.</span>]}
          />
          <Reveal delay={0.24} className="mt-6 max-w-[460px] text-[15.5px] leading-[1.7] text-(--ink2) text-pretty">
            Kein hochskaliertes iPhone: links deine Fächer, oben Score, Halbjahre und
            Kennzahlen nebeneinander, darunter die Kurse. Über iCloud sind beide Geräte
            synchron.
          </Reveal>
        </div>

        <Reveal className="w-full flex-none sm:w-[520px]">
          <div className="overflow-hidden rounded-[26px] border border-(--line) bg-(--sf) p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex w-[76px] flex-none flex-col gap-[7px] rounded-[14px] bg-(--sf2) px-2 py-3 sm:w-[112px] sm:px-2.5">
                {SIDE_COLORS.map((c, i) => (
                  <div key={c} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 flex-none rounded-[4px]" style={{ background: c }} />
                    <div
                      className="h-[7px] flex-1 rounded-[4px] bg-(--line)"
                      style={{ opacity: i === 0 ? 0.9 : 0.5 }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex gap-2.5">
                  <div className="flex-1 rounded-[14px] border border-(--line) bg-(--score-bg) p-3.5">
                    <div className="text-[9px] text-(--ink2)">Abischnitt</div>
                    <div className="font-display mt-2 text-[34px] leading-none font-extrabold tracking-[-0.05em]">
                      1,5
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-[7px] rounded-[14px] bg-(--sf2) p-3.5">
                    {BARS.map((w, i) => (
                      <div
                        key={i}
                        className="h-[9px] rounded-[5px]"
                        style={{ width: `${w}%`, background: i === 3 ? "var(--acc)" : "var(--line)" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5 rounded-[14px] bg-(--sf2) p-2 sm:gap-2 sm:p-3">
                  {CARDS.map((c, i) => (
                    <div
                      key={c.name}
                      className={`min-w-0 flex-1 rounded-xl border border-(--line) bg-(--sf) p-2 sm:p-2.5 ${i === CARDS.length - 1 ? "hidden sm:block" : ""}`}
                    >
                      <div className="h-[18px] w-[18px] rounded-[7px]" style={{ background: c.c }} />
                      <div className="mt-2.5 truncate text-[9px] font-semibold">{c.name}</div>
                      <div className="font-display mt-1.5 text-[15px] font-extrabold">{c.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
