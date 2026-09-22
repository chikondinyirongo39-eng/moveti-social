export const MOVETI_MEDIA_QUALITY = {
  photo: {
    preserveOriginal: true,
    maxClientQuality: 0.98,
    preferredFormats: ['image/jpeg', 'image/webp', 'image/png']
  },

  video: {
    preserveOriginal: true,
    preferredMimeTypes: [
      'video/mp4;codecs=h264,aac',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ],
    preferredVideoBitrate: 12000000,
    preferredAudioBitrate: 192000
  }
}

export function getBestSupportedVideoMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return ''

  const types = MOVETI_MEDIA_QUALITY.video.preferredMimeTypes

  return (
    types.find(type => MediaRecorder.isTypeSupported(type)) || ''
  )
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function shouldPreserveOriginal(file: File): boolean {
  return isImageFile(file) || isVideoFile(file)
}
