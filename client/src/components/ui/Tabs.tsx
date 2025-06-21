import React from 'react'
import { cva } from 'class-variance-authority'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  children: (activeTab: string) => React.ReactNode
  defaultActive?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  children,
  defaultActive,
}) => {
  const [activeTab, setActiveTab] = React.useState(
    defaultActive || tabs[0]?.id || ''
  )

  return (
    <div>
      <div className="flex border-b border-primary-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm relative ${
              activeTab === tab.id
                ? 'text-primary-600'
                : 'text-secondary-500 hover:text-primary-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-2">{children(activeTab)}</div>
    </div>
  )
}