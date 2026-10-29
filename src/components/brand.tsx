/*
 * Brand assets: shell logo, S mark and the Discord mark (not part of lucide).
 */

const RIDGE_ENDS: Array<[number, number]> = [
  [56.6, 25.7],
  [53.7, 17.5],
  [48.1, 10.9],
  [40.6, 6.5],
  [32, 5],
  [23.4, 6.5],
  [15.9, 10.9],
  [10.3, 17.5],
  [7.4, 25.7],
];

/**
 * Stylized scallop shell. Self-contained SVG so it inlines crisply at any
 * size; ids are shared on purpose (identical defs -> harmless duplicates).
 */
export function Shell({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="seashell-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d2ba" />
          <stop offset="55%" stopColor="#d8a987" />
          <stop offset="100%" stopColor="#a97a4f" />
        </linearGradient>
        <clipPath id="seashell-clip">
          <path d="M6 30 A26 26 0 0 1 58 30 L40 54 L32 56 L24 54 Z" />
        </clipPath>
      </defs>
      <path
        d="M6 30 A26 26 0 0 1 58 30 L40 54 L32 56 L24 54 Z"
        fill="url(#seashell-grad)"
      />
      <g clipPath="url(#seashell-clip)">
        {RIDGE_ENDS.map(([x, y], i) => (
          <line
            key={i}
            x1="32"
            y1="56"
            x2={x}
            y2={y}
            stroke="#170f08"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ))}
      </g>
      <path d="M27.5 54.5 L36.5 54.5 L32 64 Z" fill="url(#seashell-grad)" />
    </svg>
  );
}

/**
 * Big "S" brand mark (as in the reference cards): gradient letter with the
 * shell tucked into the top-right.
 */
export function SMark({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block select-none ${className}`} aria-hidden="true">
      <span
        className="bg-gradient-to-b from-copper-100 to-copper-500 bg-clip-text text-transparent"
        style={{
          fontFamily: "var(--font-poppins)",
          fontWeight: 800,
          display: "inline-block",
          transform: "skewX(-7deg)",
        }}
      >
        S
      </span>
      <Shell className="absolute top-1 right-[-0.6em] h-[0.55em] w-[0.55em] rotate-12 opacity-95" />
      {/* shell needs an em-sized box; honor parent font-size */}
    </div>
  );
}

export function DiscordMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function BrandLockup({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Shell className={compact ? "h-6 w-6" : "h-8 w-8"} />
      <span
        className="leading-none"
        style={{ fontWeight: 600, letterSpacing: "0.02em" }}
      >
        Seashell <span className="text-copper-300">Customs</span>
      </span>
    </div>
  );
}
