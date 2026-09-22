export type LiveStatus = 'offline' | 'live' | 'ended'

export type LiveSession = {
  id: string
  hostId: string
  title: string
  status: LiveStatus
  createdAt: string
}

export function createLiveSession(hostId: string, title = 'MOVETI Live'): LiveSession {
  return {
    id: crypto.randomUUID(),
    hostId,
    title,
    status: 'live',
    createdAt: new Date().toISOString()
  }
}
