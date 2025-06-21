'use client'

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const sustainabilityCategories = [
  { subject: 'Water', fullMark: 100 },
  { subject: 'Soil', fullMark: 100 },
  { subject: 'Biodiversity', fullMark: 100 },
  { subject: 'Carbon', fullMark: 100 },
  { subject: 'Efficiency', fullMark: 100 },
]

export function SustainabilityChart({ score }: { score: number }) {
  // Generate random data for each category based on overall score
  const data = sustainabilityCategories.map(category => ({
    ...category,
    A: Math.max(10, Math.min(100, score + (Math.random() * 20 - 10))),
  }))

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Sustainability Breakdown</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              name="Score" 
              dataKey="A" 
              stroke="#3A5A40" 
              fill="#8DB38B" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}