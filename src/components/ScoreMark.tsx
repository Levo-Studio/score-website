export function ScoreMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray="178 214"
        transform="rotate(-58 50 50)"
      />
      <circle cx="50" cy="50" r="8" fill="var(--acc)" />
    </svg>
  );
}
