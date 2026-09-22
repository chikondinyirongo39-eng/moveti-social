'use client'

import { useRef, useState } from 'react'

export default function MovetiLiveViewer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  return (
    <div className="relative min-h-[60vh] overflow-hidden rounded-3xl bg-black">
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        controls
        className="h-full min-h-[60vh] w-full object-cover"
      />

      <button
        onClick={() => setMuted(value => !value)}
        className="absolute bottom-4 right-4 rounded-full bg-black/70 px-5 py-3 text-white"
      >
        {muted ? '🔇 Unmute' : '🔊 Mute'}
      </button>
    </div>
  )
}
