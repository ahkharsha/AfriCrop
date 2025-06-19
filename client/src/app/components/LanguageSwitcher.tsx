// src/components/LanguageSwitcher.tsx
"use client";

import { useState } from "react";

const languages = [
  { code: "en", label: "🇬🇧 English" },
  { code: "sw", label: "🇰🇪 Swahili" },
  { code: "ha", label: "🇳🇬 Hausa" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "fr", label: "🇫🇷 French" },
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="bg-transparent border border-[hsl(var(--color-border))] rounded-md px-2 py-1 text-sm"
    >
      {languages.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
