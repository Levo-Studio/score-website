// Wiederverwendete Klassenkombinationen für die interaktiven Muster der Vorlage:
// wachsende Unterstreichung, füllender Verlauf auf Buttons, Kachel-Hover.

export const underlineLink =
  "pb-[3px] bg-[linear-gradient(var(--acc),var(--acc))] bg-no-repeat bg-left-bottom bg-[length:0%_1.5px] transition-[background-size,color] duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-(--ink)";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-[15px] bg-(--acc) text-(--acc-ink) font-semibold " +
  "bg-[image:linear-gradient(105deg,transparent_0%,rgba(255,255,255,.26)_45%,transparent_100%)] bg-no-repeat " +
  "[background-position:-40%_0] bg-[length:0%_100%] " +
  "transition-[background-size,background-position,box-shadow] duration-500 ease-out " +
  "hover:bg-[length:220%_100%] hover:[background-position:140%_0] hover:shadow-[0_12px_30px_rgba(28,107,110,.32)] active:shadow-none";

export const btnOutline =
  "inline-flex items-center justify-center rounded-[15px] border border-(--line) text-(--ink) font-medium " +
  "bg-[linear-gradient(var(--acc),var(--acc))] bg-no-repeat bg-left-bottom bg-[length:100%_0%] " +
  "transition-[background-size,color,border-color] duration-400 ease-out " +
  "hover:bg-[length:100%_100%] hover:text-(--acc-ink) hover:border-(--acc)";

export const cardShell = "rounded-[28px] border border-(--line) bg-(--sf) p-7";

// Kachel-Hover: Rand wird zur Akzentfarbe, ein 2px-Strich läuft oben ein.
export const hoverCard =
  "transition-[border-color,box-shadow] duration-300 ease-out hover:border-(--acc) hover:shadow-[inset_0_2px_0_0_var(--acc)]";

// Listenzeile-Hover: ein Akzentstrich läuft links ein und schiebt den Text an.
export const hoverRow =
  "transition-[padding-left,box-shadow] duration-300 ease-out hover:pl-[22px] hover:shadow-[inset_3px_0_0_0_var(--acc)]";

export function chipClass(active: boolean) {
  return (
    "rounded-full px-[15px] py-[11px] text-[12.5px] font-medium border transition-[background-color,color,border-color,transform] duration-300 " +
    (active
      ? "bg-(--acc) text-(--acc-ink) border-transparent"
      : "bg-(--sf) text-(--ink2) border-(--line) hover:bg-(--acc) hover:text-(--acc-ink) hover:border-(--acc)")
  );
}
