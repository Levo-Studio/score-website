"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle({ size = "md" }: { size?: "md" | "sm" }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const w = size === "sm" ? 58 : 62;
  const h = size === "sm" ? 30 : 32;
  const knob = size === "sm" ? 22 : 24;
  const inset = 3;

  return (
    <button
      type="button"
      onClick={toggle}
      title={dark ? "Zu hell wechseln" : "Zu dunkel wechseln"}
      aria-label={dark ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"}
      className="relative flex-none cursor-pointer rounded-full border border-(--line) bg-(--sf) transition-colors duration-200 hover:border-(--acc)"
      style={{ width: w, height: h }}
      suppressHydrationWarning
    >
      <span
        className="absolute top-[3px] rounded-full bg-(--acc) transition-[left] duration-300 ease-[cubic-bezier(.32,1.12,.4,1)]"
        style={{ width: knob, height: knob, left: dark ? w - knob - inset : inset }}
      />
      <span
        className="pointer-events-none absolute top-1/2 left-[8px] -translate-y-1/2 transition-colors duration-300"
        style={{ color: dark ? "var(--ink2)" : "var(--acc-ink)" }}
      >
        <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </g>
        </svg>
      </span>
      <span
        className="pointer-events-none absolute top-1/2 right-[8px] -translate-y-1/2 transition-colors duration-300"
        style={{ color: dark ? "var(--acc-ink)" : "var(--ink2)" }}
      >
        <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
          <path
            d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
