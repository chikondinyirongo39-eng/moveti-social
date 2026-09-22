"use client"

import { useRef, useState } from "react"
import MovetiPostPrivacy, { type PostVisibility } from "@/components/MovetiPostPrivacy"
import { createClient } from "@/lib/supabase"

export default function MovetiCreatorPost() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [status, setStatus] = useState("")
  const [visibility, setVisibility] = useState<PostVisibility>("public")
  const [autoDownload, setAutoDownload] = useState(false)

  function chooseFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] || null
    setFile(selected)
    setStatus("")
  }

  async function publish() {
    if (!file) {
      setStatus("Choose a photo or video first.")
      return
    }

    try {
      setStatus("Publishing...")

      const supabase = createClient()
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        setStatus("Please sign in before publishing.")
        return
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "bin"
      const path = `${auth.user.id}/${Date.now()}.${extension}`

      const bucket = file.type.startsWith("video/") ? "AUDIO" : "ARTWORK"

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: false,
          contentType: file.type,
          cacheControl: "31536000"
        })

      if (uploadError) {
        setStatus(uploadError.message)
        return
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: caption.trim(),
          media_url: publicData.publicUrl,
          media_type: file.type.startsWith("video/") ? "video" : "image",
          visibility,
          auto_download: autoDownload
        })
      })

      if (!response.ok) {
        setStatus("Media uploaded, but the post could not be created.")
        return
      }

      setFile(null)
      setCaption("")
      if (inputRef.current) inputRef.current.value = ""
      setStatus("Posted successfully to MOVETI.")
    } catch {
      setStatus("Something went wrong while publishing.")
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Create a Post</h2>
        <p className="text-sm text-white/50">
          Share high-quality photos and videos with your MOVETI community.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={chooseFile}
        className="block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white"
      />

      {file && (
        <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white/70">
          Selected: {file.name}
        </div>
      )}

      <textarea
        value={caption}
        onChange={event => setCaption(event.target.value)}
        placeholder="What's happening?"
        rows={4}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none placeholder:text-white/30"
      />

      <MovetiPostPrivacy
        value={visibility}
        onChange={setVisibility}
        autoDownload={autoDownload}
        onAutoDownloadChange={setAutoDownload}
      />

      <button
        onClick={publish}
        className="mt-4 rounded-xl bg-white px-5 py-3 font-semibold text-black"
      >
        Publish to MOVETI
      </button>

      {status && (
        <p className="mt-3 text-sm text-white/60">{status}</p>
      )}
    </section>
  )
}
