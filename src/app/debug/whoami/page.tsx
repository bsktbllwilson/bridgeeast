import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function WhoamiPage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl">whoami</h1>
      {user ? (
        <pre className="overflow-x-auto rounded border border-brand-border bg-white p-4 text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <p className="text-brand-muted">not signed in</p>
      )}
    </main>
  )
}
