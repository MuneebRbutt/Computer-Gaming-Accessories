"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AddressesPage() {
  const [list, setList] = useState([
    { id: 'addr-1', label: 'Home', city: 'Karachi', address: 'Street 1' },
  ])
  const [label, setLabel] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')

  function add() {
    if (!label || !city || !address) return
    setList([{ id: String(Date.now()), label, city, address }, ...list])
    setLabel(''); setCity(''); setAddress('')
  }
  function remove(id: string) {
    setList(list.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Addresses</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Label" value={label} onChange={(e)=>setLabel(e.target.value)} />
        <Input placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
      </div>
      <Button onClick={add} className="mb-4">Add Address</Button>
      <div className="space-y-3">
        {list.map(a => (
          <div key={a.id} className="p-4 border border-gray-800 rounded-md bg-card flex items-center justify-between">
            <div>
              <div className="font-medium">{a.label}</div>
              <div className="text-sm text-gray-400">{a.city} — {a.address}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Edit</Button>
              <Button variant="outline" onClick={()=>remove(a.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


