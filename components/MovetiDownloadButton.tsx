"use client"

import { useState } from "react"

type Props = {
  url: string
  filename?: string
}

export default function MovetiDownloadButton({
  url,
  filename = "moveti-media"
}: Props) {
  const [downloading, setDownloading] = useState(false)

  async function downloadMedia() {
    if (!url || downloading) return

    try {
      setDownloading(true)

      const response = await fetch(url)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(objectUrl)
    } catch {
      window.open(url, "_blank", "noopener,noreferrer")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={downloadMedia}
      disabled={downloading}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
    >
      {downloading ? "Downloading..." : "⬇ Download"}
    </button>
  )
}
