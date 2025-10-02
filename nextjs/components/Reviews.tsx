"use client"

import { useMemo, useState } from 'react'

export interface Review {
  rating: number
  text: string
  time: number
  verified?: boolean
}

function Stars({ n }: { n: number }) {
  const full = Math.round(n)
  return <span className="text-yellow-400">{'★★★★★'.split('').map((s,i)=> i < full ? '★':'☆').join('')}</span>
}

export default function Reviews({ sku }: { sku: string }) {
  const KEY = `ait-reviews-${sku}`
  const load = (): Review[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  }
  const save = (list: Review[]) => localStorage.setItem(KEY, JSON.stringify(list))

  const [list, setList] = useState<Review[]>(load())
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [sort, setSort] = useState<'new'|'helpful'|'high'|'low'>('new')

  const sorted = useMemo(() => {
    const arr = [...list]
    if (sort === 'new') arr.sort((a,b)=>b.time-a.time)
    if (sort === 'high') arr.sort((a,b)=>b.rating-a.rating)
    if (sort === 'low') arr.sort((a,b)=>a.rating-b.rating)
    return arr
  }, [list, sort])

  const avg = list.length ? list.reduce((a,b)=>a+b.rating,0)/list.length : 0

  function submit() {
    const r: Review = { rating, text: text.trim(), time: Date.now(), verified: Math.random() > 0.5 }
    const next = [r, ...list]
    setList(next)
    save(next)
    setText('')
    setRating(5)
  }

  return (
    <div className="bg-card border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg">{avg.toFixed(1)}</div>
          <Stars n={avg} />
          <div className="text-xs text-gray-400">({list.length} reviews)</div>
        </div>
        <select className="text-sm bg-black/40 border border-gray-700 rounded-md px-2 py-1" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
          <option value="new">Most recent</option>
          <option value="high">Highest rating</option>
          <option value="low">Lowest rating</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {sorted.map((r,i)=> (
          <div key={i} className="border border-gray-800 rounded-md p-3">
            <div className="flex items-center justify-between">
              <Stars n={r.rating} />
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {r.verified && <span className="text-green-400">Verified</span>}
                {new Date(r.time).toLocaleString()}
              </div>
            </div>
            {r.text && <div className="mt-2 text-sm">{r.text}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Your Rating</span>
          {[1,2,3,4,5].map(n => (
            <button key={n} className="text-lg text-yellow-400" onClick={()=>setRating(n)}>{n <= rating ? '★' : '☆'}</button>
          ))}
        </div>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} placeholder="Share your thoughts" className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        <button onClick={submit} className="px-4 py-2 bg-brand text-black rounded-md text-sm font-semibold w-max">Submit Review</button>
      </div>
    </div>
  )
}


