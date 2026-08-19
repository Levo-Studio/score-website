import Link from "next/link";
import { ScoreMark } from "@/components/ScoreMark";
import { underlineLink } from "@/lib/styles";
import { GITHUB_APP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-(--line)">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 py-9 sm:px-10">
        <div className="flex items-center gap-[11px]">
          <ScoreMark className="h-6 w-6" />
          <span className="text-[13px] font-medium text-(--ink2)">Score · ein Produkt von Levo Studio</span>
        </div>
        <div className="flex flex-wrap items-center gap-[22px] text-[13px] text-(--ink2)">
          <Link href="/datenschutz" className={underlineLink}>Datenschutz</Link>
          <Link href="/impressum" className={underlineLink}>Impressum</Link>
          <a href={GITHUB_APP_URL} className={underlineLink}>GitHub</a>
          <span>© 2026 Levo Studio</span>
        </div>
      </div>
    </footer>
  );
}
