"use client"

interface Step {
  key: string
  label: string
}

export default function BuilderStepper({ steps, active, completed, onJump }: {
  steps: Step[]
  active: string
  completed: Set<string>
  onJump: (key: string) => void
}) {
  return (
    <aside className="hidden md:block md:w-64">
      <div className="sticky top-20 border border-gray-800 rounded-lg bg-card p-3">
        <div className="text-sm font-semibold mb-2">Build Steps</div>
        <ol className="space-y-1">
          {steps.map((s, i) => {
            const isDone = completed.has(s.key)
            const isActive = active === s.key
            return (
              <li key={s.key}>
                <button
                  onClick={() => onJump(s.key)}
                  className={`w-full text-left px-2 py-2 rounded-md border ${
                    isActive ? 'border-brand text-brand' : isDone ? 'border-green-700 text-green-400' : 'border-gray-800 text-gray-300'
                  } hover:border-brand/60`}
                >
                  <span className="text-xs mr-2 opacity-70">{String(i+1).padStart(2,'0')}</span>
                  {s.label}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}


