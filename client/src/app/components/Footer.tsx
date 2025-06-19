// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full px-6 py-6 mt-8 text-sm text-center text-[hsl(var(--color-muted-foreground))] border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]">
      © {new Date().getFullYear()} AfriCrop DAO. All rights reserved.
    </footer>
  );
}
