import { NextRequest, NextResponse } from 'next/server'

const chineseCharacterPattern = /[\u3400-\u9fff]/

function getLanguageName(locale: 'en' | 'zh') {
  return locale === 'zh' ? 'Simplified Chinese' : 'English'
}

function inferSourceLocale(text: string): 'en' | 'zh' {
  return chineseCharacterPattern.test(text) ? 'zh' : 'en'
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLocale } = await request.json()

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Nothing to translate.' }, { status: 400 })
    }

    if (targetLocale !== 'en' && targetLocale !== 'zh') {
      return NextResponse.json({ error: 'Unsupported target locale.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Translation is unavailable until ANTHROPIC_API_KEY is configured.' }, { status: 503 })
    }

    const sourceLocale = inferSourceLocale(text)

    if (sourceLocale === targetLocale) {
      return NextResponse.json({ translation: text.trim() })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        temperature: 0,
        system: 'You are a translation engine. Preserve meaning, tone, and formatting. Return only the translated text with no notes or preamble.',
        messages: [
          {
            role: 'user',
            content: `Translate the following text from ${getLanguageName(sourceLocale)} to ${getLanguageName(targetLocale)}. Preserve formatting and names. Return only the translation.\n\n${text}`,
          },
        ],
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      const message = typeof payload?.error?.message === 'string' ? payload.error.message : 'Translation failed.'
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const translation = payload.content?.find((item: { type?: string; text?: string }) => item.type === 'text')?.text?.trim()

    if (!translation) {
      return NextResponse.json({ error: 'Translation failed.' }, { status: 502 })
    }

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json({ error: 'Translation failed.' }, { status: 500 })
  }
}