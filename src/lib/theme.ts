"use client";

import { useCallback, useState } from "react";

export type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("score-theme", next);
      } catch {
        // localStorage kann in privaten Modi fehlen — Theme bleibt dann nur für diese Sitzung gesetzt.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
