"use client"

import { useEffect, useRef, useState } from "react"

const effects = [
  { name: "Original", filter: "none" },
  { name: "Cinematic", filter: "contrast(1.12) saturate(1.08)" },
  { name: "Portrait", filter: "contrast(1.05) saturate(0.96) brightness(1.04)" },
  { name: "Vivid", filter: "contrast(1.15) saturate(1.3)" },
  { name: "Dream", filter: "brightness(1.08) saturate(0.82) blur(0.15px)" },
  { name: "Noir", filter: "grayscale(1) contrast(1.25)" },
  { name: "Warm", filter: "sepia(0.16) saturate(1.15) brightness(1.04)" },
  { name: "Cool", filter: "hue-rotate(12deg) saturate(0.92) contrast(1.08)" },
  { name: "Gold", filter: "sepia(0.24) saturate(1.3) contrast(1.08)" },
  { name: "Studio", filter: "contrast(1.08) brightness(1.05) saturate(0.94)" }
]

export default function MovetiCreatorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [activeEffect, setActiveEffect] = useState("Original")
  const [cameraOn, setCameraOn] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [error, setError] = useState("")

  async function startCamera(mode = facingMode) {
    try {
      setError("")

      streamRef.current?.getTracks().forEach(track => track.stop())

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraOn(true)
    } catch {
      setError("Camera or microphone permission was denied or is unavailable.")
      setCameraOn(false)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraOn(false)
  }

  async function flipCamera() {
    const next = facingMode === "user" ? "environment" : "user"
    setFacingMode(next)

    if (cameraOn) {
      await startCamera(next)
    }
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const currentFilter =
    effects.find(effect => effect.name === activeEffect)?.filter || "none"

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl">
      <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ filter: currentFilter }}
        />

        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-white/70">
            <div>
              <div className="text-4xl mb-3">🎥</div>
              <p>Camera ready</p>
              <p className="text-sm text-white/40">
                Start your MOVETI creator camera
              </p>
            </div>
          </div>
        )}

        {cameraOn && (
          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
            MOVETI • {activeEffect}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => cameraOn ? stopCamera() : startCamera()}
          className="rounded-xl bg-white px-4 py-2 font-semibold text-black"
        >
          {cameraOn ? "Stop Camera" : "Start Camera"}
        </button>

        <button
          onClick={flipCamera}
          className="rounded-xl border border-white/15 px-4 py-2 text-white"
        >
          Flip Camera
        </button>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-white">
          Professional Effects
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {effects.map(effect => (
            <button
              key={effect.name}
              onClick={() => setActiveEffect(effect.name)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm transition ${
                activeEffect === effect.name
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white"
              }`}
            >
              {effect.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
