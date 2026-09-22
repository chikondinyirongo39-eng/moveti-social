'use client'
import { usePathname, useRouter } from 'next/navigation'

export default function GlobalBackButton() {
  const pathname = usePathname()
  const router = useRouter()
  if (pathname === '/') return null
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      style={{
        position:'fixed',top:18,left:16,zIndex:9999,width:44,height:44,
        borderRadius:'50%',border:'1px solid rgba(255,255,255,.18)',
        background:'rgba(20,20,20,.92)',color:'#fff',fontSize:25,
        display:'grid',placeItems:'center',cursor:'pointer'
      }}
    >
      ‹
    </button>
  )
}
