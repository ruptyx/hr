export const PAY_FREQUENCIES = [
  'Weekly',
  'Bi-weekly',
  'Semi-monthly',
  'Monthly',
  'Quarterly',
  'Annually'
] as const

export type PayFrequency = typeof PAY_FREQUENCIES[number]