import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  id,
  children,
  last,
}: {
  id: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[1240px] px-6 sm:px-10 ${last ? "py-16 pb-20 sm:py-24 sm:pb-28" : "py-16 sm:py-24"}`}>
      {children}
    </section>
  );
}

export function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <Reveal className="flex gap-3 text-[12px] font-medium text-(--ink2)">
      <span className="text-(--acc)">{index}</span> {label}
    </Reveal>
  );
}
