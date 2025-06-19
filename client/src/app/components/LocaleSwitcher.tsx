// src/components/LocaleSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "English" },
  { code: "sw", label: "Swahili" },
  { code: "ha", label: "Hausa" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "Français" },
];

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    startTransition(() => {
      router.push(newPath);
    });
  };

  const currentLocale = pathname.split("/")[1] || "en";

  return (
    <div className="relative">
      <select
        className="appearance-none bg-[hsl(var(--color-muted))] border border-[hsl(var(--color-border))] text-sm text-[hsl(var(--color-muted-foreground))] px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-ring))] transition-all"
        value={currentLocale}
        onChange={handleChange}
        aria-label="Select Language"
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.label}
          </option>
        ))}
      </select>
      {/* Down arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[hsl(var(--color-muted-foreground))]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
