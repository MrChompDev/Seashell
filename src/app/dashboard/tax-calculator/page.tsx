"use client";

import { useState } from "react";
import { Calculator, Percent } from "lucide-react";

export default function TaxCalculatorPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(25);

  const parsed = Number(amount.replace(/[^\d.]/g, ""));
  const hasAmount = Number.isFinite(parsed) && parsed > 0;
  const tax = hasAmount ? (parsed * rate) / 100 : 0;
  const net = hasAmount ? parsed - tax : parsed === 0 ? 0 : 0;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow text-copper-300">Tools</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Tax Calculator
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
          Quickly calculate how much tax is taken off an order amount and what
          you'll actually receive.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* inputs */}
        <div className="card-dark p-7 lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
                Amount
              </label>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-dark text-lg font-semibold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
                Tax rate
              </label>
              <input
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value.replace(/[^\d.]/g, "")) || 0)}
                className="input-dark text-lg font-semibold"
              />
            </div>
          </div>

          {/* quick rates */}
          <div className="mt-6">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone-500">
              Quick set
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[5, 10, 12.5, 15, 20, 25, 30].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRate(r)}
                  className={
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
                    (rate === r
                      ? "bg-copper-400 text-ink"
                      : "border border-white/10 text-stone-300 hover:border-copper-400/50 hover:text-copper-200")
                  }
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* slider row */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-copper-400/70" />
                Slide to adjust
              </span>
              <span className="font-semibold text-copper-300">{rate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#d6a68c]"
            />
          </div>

          {/* live preview lines */}
          <div className="mt-7 space-y-3">
            <Row label="Gross" value={currency.format(hasAmount ? parsed : 0)} muted />
            <Row label={`Tax (${rate}%)`} value={"- " + currency.format(tax)} className="text-red-300" />
            <Row
              label="Net after tax"
              value={currency.format(net)}
              className="text-lg font-bold text-copper-300"
            />
          </div>
        </div>

        {/* side card */}
        <div className="card-dark flex flex-col p-7">
          <div className="eyebrow text-copper-300">Standard</div>
          <h2 className="mt-3 flex items-center gap-2 text-lg font-semibold text-cream">
            <Calculator className="h-5 w-5 text-copper-300" />
            Standard Rates
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            Use the exact rate from your order ticket. If you're unsure, 25% is
            the default many orders use.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-stone-500">
            Enter an amount, pick a quick rate or slide, and the net figure
            updates instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  className = "",
  muted,
}: {
  label: string;
  value: string;
  className?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
      <span className={muted ? "text-sm text-stone-400" : "text-sm text-stone-300"}>{label}</span>
      <span className={"font-semibold text-cream " + className}>{value}</span>
    </div>
  );
}
