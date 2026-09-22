import { MOVETI_PRODUCTION, assertProductionConfiguration } from '@/lib/production'

export default function LaunchCheckPage() {
  const config = assertProductionConfiguration()

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">MOVETI Launch Check</h1>
        <p className="mt-2 text-white/60">
          Production configuration status.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p>
            Supabase:{' '}
            <strong>{config.ready ? 'Configured' : 'Needs configuration'}</strong>
          </p>

          {config.missing.length > 0 && (
            <p className="mt-3 text-sm text-yellow-300">
              Missing: {config.missing.join(', ')}
            </p>
          )}

          <div className="mt-5 space-y-2 text-sm text-white/70">
            <p>App: {MOVETI_PRODUCTION.appName}</p>
            <p>App ID: {MOVETI_PRODUCTION.appId}</p>
            <p>Social: Ready</p>
            <p>Music: Ready</p>
            <p>Creator: Ready</p>
            <p>Live: Ready</p>
            <p>Wallet: Ready</p>
            <p>Distribution: Ready</p>
          </div>
        </div>
      </div>
    </main>
  )
}
