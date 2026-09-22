"use client"

import { useState } from "react"

export type PostVisibility = "public" | "only_me" | "selected"

type Props = {
  value: PostVisibility
  onChange: (value: PostVisibility) => void
  autoDownload: boolean
  onAutoDownloadChange: (value: boolean) => void
}

export default function MovetiPostPrivacy({
  value,
  onChange,
  autoDownload,
  onAutoDownloadChange
}: Props) {
  const [showPeople, setShowPeople] = useState(false)

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">
        Who can see this post?
      </div>

      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={() => onChange("public")}
          className={`rounded-xl p-3 text-left ${
            value === "public"
              ? "bg-white text-black"
              : "bg-white/5 text-white"
          }`}
        >
          🌍 Public
          <span className="block text-xs opacity-60">
            Anyone on MOVETI can see it
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange("only_me")}
          className={`rounded-xl p-3 text-left ${
            value === "only_me"
              ? "bg-white text-black"
              : "bg-white/5 text-white"
          }`}
        >
          🔒 Only me
          <span className="block text-xs opacity-60">
            Only you can see it
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onChange("selected")
            setShowPeople(true)
          }}
          className={`rounded-xl p-3 text-left ${
            value === "selected"
              ? "bg-white text-black"
              : "bg-white/5 text-white"
          }`}
        >
          👥 Selected people
          <span className="block text-xs opacity-60">
            Choose who can see this post
          </span>
        </button>
      </div>

      {value === "selected" && (
        <button
          type="button"
          onClick={() => setShowPeople(true)}
          className="mt-3 w-full rounded-xl border border-white/10 p-3 text-sm text-white"
        >
          {showPeople ? "People selection ready" : "Choose people"}
        </button>
      )}

      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 p-3">
        <input
          type="checkbox"
          checked={autoDownload}
          onChange={event => onAutoDownloadChange(event.target.checked)}
          className="h-5 w-5"
        />

        <span>
          <span className="block text-sm font-semibold text-white">
            Automatically save videos to my device
          </span>
          <span className="block text-xs text-white/50">
            Save supported videos after you create them. You can still
            download manually with the Download button.
          </span>
        </span>
      </label>
    </div>
  )
}
