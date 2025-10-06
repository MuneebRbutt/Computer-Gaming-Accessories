"use client"

interface Step { key: string; label: string }

export default function CheckoutProgress({ steps, active }: { steps: Step[]; active: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-sm mb-6">
      {steps.map((s, i) => {
        const isActive = s.key === active
        const done = steps.findIndex(x=>x.key===active) > i
        return (
          <div key={s.key} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full grid place-items-center border-2 font-medium ${
              done ? 'border-green-500 bg-green-50 text-green-600' : 
              isActive ? 'border-primary bg-primary/10 text-primary' : 
              'border-gray-300 bg-white text-gray-400'
            }`}>{i+1}</div>
            <div className={`${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{s.label}</div>
            {i < steps.length-1 && <div className="w-8 h-[2px] bg-gray-200" />}
          </div>
        )
      })}
    </div>
  )
}


