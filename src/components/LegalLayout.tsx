import type { ReactNode } from "react";
import Link from "next/link";
import { ScoreMark } from "@/components/ScoreMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

export function LegalLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--bg) text-(--ink)">
      <nav className="sticky top-0 z-10 mx-auto flex h-[70px] max-w-[660px] items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-72">
          <ScoreMark className="h-7 w-7 flex-none" />
          <span className="font-display text-[16px] font-extrabold tracking-[-0.02em]">Score</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <Link href="/" className="rounded-[10px] px-3 py-[11px] text-[13px] font-medium text-(--ink2) transition-colors duration-200 hover:text-(--ink)">
            ← Zurück
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[660px] px-6 pt-16 pb-28 sm:px-10">
        <div className="text-[12px] font-medium text-(--ink2)">{eyebrow}</div>
        <h1 className="font-display mt-[18px] text-[clamp(1.9rem,6vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.04em]">
          {title}
        </h1>
        {intro && <p className="mt-5 text-[16px] leading-[1.8] text-(--ink2)">{intro}</p>}
        <div className="mt-13 flex flex-col gap-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

export function LegalBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="font-display mb-3 text-[13px] font-semibold">{label}</div>
      {children}
    </div>
  );
}

export function LegalPara({ children }: { children: ReactNode }) {
  return <p className="m-0 text-[15px] leading-[1.8] text-(--ink2)">{children}</p>;
}

export function LegalText({ children }: { children: ReactNode }) {
  return <div className="text-[15px] leading-[1.8] whitespace-pre-line text-(--ink2)">{children}</div>;
}
