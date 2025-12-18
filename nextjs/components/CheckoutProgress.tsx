"use client"

interface Step { key: string; label: string }

export default function CheckoutProgress({ steps, active }: { steps: Step[]; active: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm mb-8 w-full overflow-x-auto py-2">
      {steps.map((s, i) => {
        const isActive = s.key === active
        const done = steps.findIndex(x => x.key === active) > i
        return (
          <div key={s.key} className="flex items-center gap-3 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full grid place-items-center border-2 font-display font-bold transition-all duration-300 ${done ? 'border-gaming-success bg-gaming-success/10 text-gaming-success shadow-neon-success' :
                isActive ? 'border-gaming-primary bg-gaming-primary/10 text-gaming-primary shadow-neon' :
                  'border-white/10 bg-gaming-surface text-gray-500'
              }`}>{done ? '✓' : i + 1}</div>
            <div className={`font-medium transition-colors duration-300 ${isActive ? 'text-white' : done ? 'text-gaming-success' : 'text-gray-500'}`}>{s.label}</div>
            {i < steps.length - 1 && <div className={`w-12 h-[2px] transition-colors duration-300 ${done ? 'bg-gaming-success' : 'bg-white/10'}`} />}
          </div>
        )
      })}
    </div>
  )
}


