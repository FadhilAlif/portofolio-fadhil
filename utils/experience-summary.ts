export type ExperienceSummaryItem = {
  company: string
  start: string
  end?: string
}

const MONTH_TO_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

export function parseMonthYear(value: string): Date | null {
  const [monthRaw, yearRaw] = value.trim().split(/\s+/)

  if (!monthRaw || !yearRaw) {
    return null
  }

  const month = MONTH_TO_INDEX[monthRaw.slice(0, 3).toLowerCase()]
  const year = Number.parseInt(yearRaw, 10)

  if (month === undefined || Number.isNaN(year)) {
    return null
  }

  return new Date(year, month, 1)
}

export function getInclusiveMonthSpan(
  start: string,
  end?: string,
  now: Date = new Date()
): number {
  const startDate = parseMonthYear(start)
  const endDate = end
    ? parseMonthYear(end)
    : new Date(now.getFullYear(), now.getMonth(), 1)

  if (!startDate || !endDate) {
    return 0
  }

  const monthDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())

  return Math.max(0, monthDiff + 1)
}

export function getExperienceSummary(
  items: ExperienceSummaryItem[],
  options?: {
    includedCompanies?: ReadonlySet<string>
    now?: Date
  }
): { totalMonths: number; totalYears: number } {
  const now = options?.now ?? new Date()
  const includedCompanies = options?.includedCompanies

  const filteredItems = includedCompanies
    ? items.filter((item) => includedCompanies.has(item.company))
    : items

  const totalMonths = filteredItems.reduce(
    (sum, item) => sum + getInclusiveMonthSpan(item.start, item.end, now),
    0
  )

  return {
    totalMonths,
    totalYears: totalMonths / 12,
  }
}
