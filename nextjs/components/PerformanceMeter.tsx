export default function PerformanceMeter({ score }: { score: number }) {
  const tier = score < 200 ? 'Entry' : score < 400 ? 'Mid' : score < 650 ? 'High' : 'Ultra'
  const bars = [
    { key: 'Entry', color: 'bg-green-500' },
    { key: 'Mid', color: 'bg-yellow-500' },
    { key: 'High', color: 'bg-orange-500' },
    { key: 'Ultra', color: 'bg-red-500' }
  ]
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="text-gray-400">Performance</div>
        <div className="font-semibold">{tier}</div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {bars.map(b => (
          <div key={b.key} className={`h-2 rounded ${b.color} ${tier === b.key ? '' : 'opacity-30'}`} />
        ))}
      </div>
    </div>
  )
}


