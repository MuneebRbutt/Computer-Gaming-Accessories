"use client"

import { useState } from 'react'

interface TabItem {
  key: string
  label: string
  content: React.ReactNode
}

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key)
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-800">
        {items.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-2 text-sm border-b-2 -mb-[1px] ${active === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {items.find(i => i.key === active)?.content}
      </div>
    </div>
  )
}


