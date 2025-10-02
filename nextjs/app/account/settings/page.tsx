"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const [name, setName] = useState('Gamer')
  const [email, setEmail] = useState('gamer@example.com')
  const [phone, setPhone] = useState('03xx-xxxxxxx')
  const [dark, setDark] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySMS, setNotifySMS] = useState(false)

  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Settings</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <Input value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">Phone</label>
          <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-400">Password</label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border border-gray-800 rounded-md bg-card">
          <div className="font-semibold mb-2">Preferences</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dark} onChange={()=>setDark(!dark)} /> Dark Mode</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notifyEmail} onChange={()=>setNotifyEmail(!notifyEmail)} /> Email Notifications</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notifySMS} onChange={()=>setNotifySMS(!notifySMS)} /> SMS Notifications</label>
        </div>
        <div className="p-4 border border-gray-800 rounded-md bg-card">
          <div className="font-semibold mb-2">Danger Zone</div>
          <Button variant="outline">Deactivate Account</Button>
        </div>
      </div>
      <Button>Save Changes</Button>
    </div>
  )
}


