"use client";

import { useEffect, useState } from "react";

export function Year() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? "2026"}</>;
}
