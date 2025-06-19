// src/components/Header.tsx
"use client";

import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-[hsl(var(--color-primary))]">
        🌾 AfriCrop DAO
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ConnectWallet />
      </div>
    </header>
  );
}
