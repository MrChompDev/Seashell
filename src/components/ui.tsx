import { Shell, SMark } from "./brand";
import { cx } from "@/lib/utils";

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="eyebrow">{children}</span>
      <span className="section-dash" />
    </div>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cx(
        "mt-4 text-3xl font-semibold tracking-tight text-cream sm:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

/** Decorative right-hand column used on heroes (S card + divider + tags). */
export function HeroMarkSide({
  tags,
}: {
  tags: Array<{ label: string }>;
}) {
  return (
    <div className="flex items-stretch gap-6">
      <div className="hidden items-center sm:flex">
        <div className="w-px bg-gradient-to-b from-transparent via-copper-400/40 to-transparent" />
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-7xl leading-none sm:text-8xl">
          <SMark className="text-7xl lg:text-8xl" />
        </div>
        <p className="text-center font-script text-2xl text-copper-300">
          Home of the
          <br />
          Premades
        </p>
        <ul className="flex flex-col items-center gap-3">
          {tags.map((t) => (
            <li
              key={t.label}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-stone-400"
            >
              {t.label}
            </li>
          ))}
        </ul>
        <Shell className="h-5 w-5 opacity-60" />
      </div>
    </div>
  );
}
