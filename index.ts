import postgres from 'postgres'

// Global singleton agar tidak buat koneksi baru tiap request
declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined
}

export function useDb() {
  if (!globalThis.__pgClient) {
    const config = useRuntimeConfig()
    const url = config.databaseUrl || process.env.DATABASE_URL

    if (!url) throw new Error('DATABASE_URL tidak di-set di .env')

    globalThis.__pgClient = postgres(url, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
    })
  }
  return globalThis.__pgClient
}
