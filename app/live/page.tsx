'use client'

import { useEffect, useRef, useState } from 'react'

export default function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [live, setLive] = useState(false)
  const [mic, setMic] = useState(true)
  const [camera, setCamera] = useState(true)
  const [error, setError] = useState('')

  async function startLive() {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setLive(true)
    } catch {
      setError('Camera or microphone permission was denied.')
    }
  }

  function stopLive() {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setLive(false)
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0]
    if (!track) return
    track.enabled = !track.enabled
    setMic(track.enabled)
  }

  function toggleCamera() {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    track.enabled = !track.enabled
    setCamera(track.enabled)
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="text-xl font-bold">MOVETI</div>
            <div className="text-xs text-white/50">LIVE</div>
          </div>

          {live && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold">
              LIVE
            </span>
          )}
        </header>

        <section className="flex flex-1 flex-col p-4">
          <div className="relative flex min-h-[55vh] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
            <video
              ref={videoRef}
              muted
              playsInline
              className={`h-full w-full object-cover ${
                camera ? '' : 'hidden'
              }`}
            />

            {!camera && (
              <div className="text-center text-white/50">
                <div className="text-5xl">◉</div>
                <p className="mt-3">Camera off</p>
              </div>
            )}

            {!live && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startLive}
                  className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-black"
                >
                  Go Live
                </button>
              </div>
            )}

            {live && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                <button
                  onClick={toggleMic}
                  className="rounded-full bg-black/70 px-5 py-3"
                >
                  {mic ? '🎙️ Mic on' : '🔇 Mic off'}
                </button>

                <button
                  onClick={toggleCamera}
                  className="rounded-full bg-black/70 px-5 py-3"
                >
                  {camera ? '📷 Camera on' : '🚫 Camera off'}
                </button>

                <button
                  onClick={stopLive}
                  className="rounded-full bg-red-600 px-5 py-3 font-bold"
                >
                  End Live
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/40">Broadcast</div>
              <div className="mt-1 font-semibold">
                {live ? 'Live' : 'Offline'}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/40">Quality</div>
              <div className="mt-1 font-semibold">HD</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/40">Audio</div>
              <div className="mt-1 font-semibold">
                {mic ? 'On' : 'Off'}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            MOVETI preserves the camera quality available on your device.
          </p>
        </section>
      </div>
    </main>
  )
}
