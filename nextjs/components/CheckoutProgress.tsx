"use client"

interface Step { key: string; label: string }

export default function CheckoutProgress({ steps, active }: { steps: Step[]; active: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-xs mb-6">
      {steps.map((s, i) => {
        const isActive = s.key === active
        const done = steps.findIndex(x=>x.key===active) > i
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full grid place-items-center border ${done ? 'border-green-600 text-green-400' : isActive ? 'border-brand text-brand' : 'border-gray-700 text-gray-400'}`}>{i+1}</div>
            <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>{s.label}</div>
            {i < steps.length-1 && <div className="w-8 h-[2px] bg-gray-800" />}
          </div>
        )
      })}
    </div>
  )
}


