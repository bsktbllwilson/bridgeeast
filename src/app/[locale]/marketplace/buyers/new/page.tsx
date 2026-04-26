import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type AppLocale } from '@/i18n/locales'

export default async function NewBuyerProfilePage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const t = await getTranslations({ locale, namespace: 'marketplace.buyers' })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="container pt-32 md:pt-40">
        <div className="max-w-2xl">
          <h1 className="section-title">{t('newProfileTitle')}</h1>
          <p className="mt-3 text-gray-600">{t('newProfileSubtitle')}</p>
        </div>

        <form className="mt-10 grid max-w-2xl gap-6 card p-6">
          <Field label="Display handle (auto-generated)">
            <input value="Buyer #—" disabled />
          </Field>
          <Field label={t('type')}>
            <select>
              <option value="operator">Operator</option>
              <option value="search_fund">Search fund / ETA</option>
              <option value="eb5_e2">EB-5 / E-2 investor</option>
              <option value="sba">SBA borrower</option>
              <option value="family_office">Family office</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Min budget (USD)">
              <input type="number" inputMode="numeric" />
            </Field>
            <Field label="Max budget (USD)">
              <input type="number" inputMode="numeric" />
            </Field>
          </div>
          <Field label="Notes for sellers">
            <textarea rows={4} placeholder="What kind of business are you looking for?" />
          </Field>
          <button type="button" className="btn-primary" disabled>
            Save profile
          </button>
          <p className="text-xs text-gray-500">
            Submission wires up alongside auth. The form is presentation-only for now.
          </p>
        </form>
      </section>
      <div className="h-24" />
      <Footer />
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  )
}
