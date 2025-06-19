// src/app/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "Join Crop Insurance",
    desc: "Participate in a decentralized insurance pool for your crops.",
    href: "/insurance",
  },
  {
    title: "Governance Voting",
    desc: "Vote on DAO proposals using Quadratic Voting.",
    href: "/vote",
  },
  {
    title: "Farmer Reputation",
    desc: "Build and monitor your public farmer reputation score.",
    href: "/reputation",
  },
  {
    title: "DAO Proposals",
    desc: "Create and view lifecycle stages of active proposals.",
    href: "/dao-proposals",
  },
  {
    title: "Community Treasury",
    desc: "Access community fund operations, loans & yield programs.",
    href: "/treasury",
  },
  {
    title: "Leaderboard",
    desc: "View gamified rankings of top performing farmers & contributors.",
    href: "/leaderboard",
  },
  {
    title: "Farmer Education",
    desc: "Learn about sustainable practices and earn rep as you learn.",
    href: "/education",
  },
  {
    title: "Crop Tracker",
    desc: "Track lifecycle of your registered Crop NFTs.",
    href: "/crop-tracker",
  },
  {
    title: "Post-Harvest Dashboard",
    desc: "Monitor spoilage, storage stats and preservation trends.",
    href: "/post-harvest",
  },
];

export default function Home() {
  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[hsl(var(--color-primary))] mb-2">
          AfriCrop DAO Dashboard
        </h1>
        <p className="text-[hsl(var(--color-muted-foreground))] text-lg">
          Empowering African farmers through decentralized governance, fair insurance, and transparent systems.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.href}
            className="p-5 hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))]"
          >
            <h3 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-2">
              {feature.title}
            </h3>
            <p className="text-[hsl(var(--color-muted-foreground))] mb-4">{feature.desc}</p>
            <Link href={feature.href}>
              <Button variant="default">Explore</Button>
            </Link>
          </Card>
        ))}
      </section>
    </main>
  );
}
