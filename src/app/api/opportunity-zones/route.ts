import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface OpportunityZone {
  neighborhood: string
  whyMatch: string
  avgRent: string
  confidence: number
}

function buildPrompt(businessType: string, budgetMin: number, budgetMax: number) {
  return `You are an expert NYC commercial real estate analyst helping F&B and retail brands find the best neighborhood to open in.

A business is looking to open in NYC with the following profile:
- Business type: ${businessType}
- Monthly budget range: $${budgetMin} - $${budgetMax}

Analyze NYC neighborhoods and return exactly 3 opportunity zones. For each, provide:
1. Neighborhood name
2. Why it's a match (foot traffic, rent trends, competition gap, demographic fit)
3. Average rent range per sq ft / month
4. A confidence score out of 10

Respond ONLY with a JSON array. No markdown, no preamble. Example format:
[
  {
    "neighborhood": "Williamsburg",
    "whyMatch": "High foot traffic from young professionals, underserved in this category, rents trending flat after 2023 correction.",
    "avgRent": "$45-$65/sq ft/yr",
    "confidence": 8
  }
]`
}

function normalizeOpportunityZones(payload: unknown) {
  if (!Array.isArray(payload)) {
    return null
  }

  const zones = payload
    .filter((item): item is OpportunityZone => {
      return Boolean(
        item &&
        typeof item === 'object' &&
        typeof item.neighborhood === 'string' &&
        typeof item.whyMatch === 'string' &&
        typeof item.avgRent === 'string' &&
        typeof item.confidence === 'number',
      )
    })
    .map((item) => ({
      neighborhood: item.neighborhood.trim(),
      whyMatch: item.whyMatch.trim(),
      avgRent: item.avgRent.trim(),
      confidence: Math.max(0, Math.min(10, Math.round(item.confidence))),
    }))
    .filter((item) => item.neighborhood && item.whyMatch && item.avgRent)

  return zones.length === 3 ? zones : null
}

function extractTextFromMessage(content: Anthropic.Messages.Message['content']) {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const { businessType, budgetMin, budgetMax } = await request.json()

    if (typeof businessType !== 'string' || !businessType.trim()) {
      return NextResponse.json({ error: 'Business type is required.' }, { status: 400 })
    }

    if (!Number.isFinite(budgetMin) || !Number.isFinite(budgetMax)) {
      return NextResponse.json({ error: 'Budget range must be numeric.' }, { status: 400 })
    }

    if (budgetMin < 0 || budgetMax < 0 || budgetMax < budgetMin) {
      return NextResponse.json({ error: 'Budget range is invalid.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Opportunity analysis is unavailable until ANTHROPIC_API_KEY is configured.' }, { status: 503 })
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      temperature: 0.2,
      messages: [{ role: 'user', content: buildPrompt(businessType.trim(), budgetMin, budgetMax) }],
    })

    const rawText = extractTextFromMessage(message.content)

    if (!rawText) {
      return NextResponse.json({ error: 'Opportunity analysis failed.' }, { status: 502 })
    }

    const parsed = normalizeOpportunityZones(JSON.parse(rawText))

    if (!parsed) {
      return NextResponse.json({ error: 'Opportunity analysis returned an unexpected format.' }, { status: 502 })
    }

    return NextResponse.json({ opportunities: parsed })
  } catch (error) {
    console.error('Opportunity zones API error:', error)
    return NextResponse.json({ error: 'Opportunity analysis failed.' }, { status: 500 })
  }
}