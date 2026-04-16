// Define the state type
export interface Pagination {
  total: number
  count: number
  page_size: number
  current_page: number
  total_pages: number
  links?: { next: string | null; previous: string | null }
}

export interface ResponseMessage<T = unknown> {
  message: string
  status: number
  data?: T
  errors?: string[] | string
  meta?: Meta
}

export type Meta = {
  pagination: Pagination
}

export interface CounterState {
  count: number
  increment: () => void
}

export interface PortfolioMediaItem {
  id: string
  title: string
  description: string
  imageUrl: string
  alt?: string
}
