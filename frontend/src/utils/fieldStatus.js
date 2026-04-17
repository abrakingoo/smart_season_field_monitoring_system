const RISK_KEYWORDS = ['pest', 'disease', 'drought', 'flood', 'damage', 'wilt', 'rot']
const STALE_DAYS = 7

export function computeStatus(field) {
  if (field.stage === 'Harvested') return 'Completed'

  const lastUpdated = new Date(field.updatedAt)
  const daysSinceUpdate = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24)
  const isStale = daysSinceUpdate > STALE_DAYS

  const hasRiskNote = field.notes.some((note) =>
    RISK_KEYWORDS.some((kw) => note.text.toLowerCase().includes(kw))
  )

  if (isStale || hasRiskNote) return 'At Risk'

  return 'Active'
}
