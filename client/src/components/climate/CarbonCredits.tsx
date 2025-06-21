'use client'

import { Button } from '@/components/ui/button'

export function CarbonCredits({ score }: { score: number }) {
  const credits = Math.floor(score / 10)

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Carbon Credits</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-sustainability-accent"
                strokeWidth="8"
                strokeDasharray={`${credits * 2.5} 250`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{credits}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Estimated carbon credits earned
        </p>
        <Button className="w-full" disabled={credits === 0}>
          Claim Credits
        </Button>
      </div>
    </div>
  )
}