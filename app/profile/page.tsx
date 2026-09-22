'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('MOVETI Artist')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setEmail(data.user.email || '')
        const profile = data.user.user_metadata?.full_name || data.user.user_metadata?.name
        if (profile) setName(profile)
      }
    }
    load()
  }, [])

  return (
    <main style={{minHeight:'100vh',padding:'24px',background:'#000',color:'#fff'}}>
      <Link href="/" style={{display:'inline-block',marginBottom:'28px'}}>← Back</Link>
      <div style={{maxWidth:520,margin:'0 auto',textAlign:'center'}}>
        <div style={{width:96,height:96,borderRadius:'50%',margin:'20px auto',background:'#222',display:'grid',placeItems:'center',fontSize:40}}>👤</div>
        <h1 style={{fontSize:28,margin:'8px 0'}}>{name}</h1>
        {email && <p style={{opacity:.65}}>{email}</p>}
        <div style={{marginTop:28,display:'grid',gap:12}}>
          <Link href="/dashboard" style={{padding:16,borderRadius:14,background:'#151515'}}>Artist Dashboard</Link>
          <Link href="/discover" style={{padding:16,borderRadius:14,background:'#151515'}}>Discover</Link>
        </div>
      </div>
    </main>
  )
}
