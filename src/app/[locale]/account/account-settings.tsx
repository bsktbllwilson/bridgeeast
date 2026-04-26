'use client'

import { useState } from 'react'
import {
  changePasswordAction,
  updateProfileAction,
  type AccountResult,
} from './actions'

interface Props {
  initialFullName: string
  initialPhone: string
  initialLanguage: 'en' | 'zh' | 'ko' | 'vi'
  email: string
}

export function AccountSettings({
  initialFullName,
  initialPhone,
  initialLanguage,
  email,
}: Props) {
  const [fullName, setFullName] = useState(initialFullName)
  const [phone, setPhone] = useState(initialPhone)
  const [language, setLanguage] = useState<'en' | 'zh' | 'ko' | 'vi'>(initialLanguage)
  const [profileResult, setProfileResult] = useState<AccountResult | null>(null)
  const [profilePending, setProfilePending] = useState(false)

  const [password, setPassword] = useState('')
  const [pwResult, setPwResult] = useState<AccountResult | null>(null)
  const [pwPending, setPwPending] = useState(false)

  const onSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfilePending(true)
    setProfileResult(null)
    const fd = new FormData()
    fd.append('full_name', fullName)
    fd.append('phone', phone)
    fd.append('preferred_language', language)
    const r = await updateProfileAction(fd)
    setProfilePending(false)
    setProfileResult(r)
  }

  const onChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPwPending(true)
    setPwResult(null)
    const fd = new FormData()
    fd.append('password', password)
    const r = await changePasswordAction(fd)
    setPwPending(false)
    setPwResult(r)
    if (r.ok) setPassword('')
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSaveProfile}
        className="rounded-2xl bg-white border border-black/5 p-6 md:p-8 space-y-5"
      >
        <h3 className="font-display text-2xl font-bold mb-2">Profile</h3>

        <div>
          <label htmlFor="set-email" className="block text-sm font-medium text-gray-800 mb-2">
            Email
          </label>
          <input id="set-email" type="email" disabled value={email} className="!bg-gray-50" />
          <p className="text-xs text-gray-600 mt-1">
            Email changes coming soon — contact support to update.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="set-name" className="block text-sm font-medium text-gray-800 mb-2">
              Full name
            </label>
            <input
              id="set-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={profilePending}
            />
          </div>
          <div>
            <label htmlFor="set-phone" className="block text-sm font-medium text-gray-800 mb-2">
              Phone
            </label>
            <input
              id="set-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={profilePending}
            />
          </div>
        </div>

        <div>
          <label htmlFor="set-lang" className="block text-sm font-medium text-gray-800 mb-2">
            Preferred language
          </label>
          <select
            id="set-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'zh' | 'ko' | 'vi')}
            disabled={profilePending}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ko">한국어</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>

        {profileResult?.error && <p className="text-sm text-red-700">{profileResult.error}</p>}
        {profileResult?.ok && <p className="text-sm text-green-800">{profileResult.message}</p>}

        <button
          type="submit"
          disabled={profilePending}
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          {profilePending ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <form
        onSubmit={onChangePassword}
        className="rounded-2xl bg-white border border-black/5 p-6 md:p-8 space-y-5"
      >
        <h3 className="font-display text-2xl font-bold mb-2">Change password</h3>

        <div>
          <label htmlFor="set-pw" className="block text-sm font-medium text-gray-800 mb-2">
            New password (8+ characters)
          </label>
          <input
            id="set-pw"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pwPending}
            minLength={8}
          />
        </div>

        {pwResult?.error && <p className="text-sm text-red-700">{pwResult.error}</p>}
        {pwResult?.ok && <p className="text-sm text-green-800">{pwResult.message}</p>}

        <button
          type="submit"
          disabled={pwPending || password.length < 8}
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          {pwPending ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
