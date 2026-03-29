import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FilterOption<T extends string> = {
  id: T
  label: string
}

interface FilterSearchToolbarProps<T extends string> {
  filters: readonly FilterOption<T>[]
  activeFilter: T
  counts: Record<T, number>
  onFilterChange: (filter: T) => void
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  searchInputId: string
  searchLabel: string
  className?: string
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      variant="ghost"
      className={cn(
        "relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {label}
      <span
        className={cn(
          "flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold tabular-nums",
          active
            ? "bg-background/20 text-background"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </Button>
  )
}

export function FilterSearchToolbar<T extends string>({
  filters,
  activeFilter,
  counts,
  onFilterChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchInputId,
  searchLabel,
  className,
}: FilterSearchToolbarProps<T>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="w-full min-w-0 flex-1 overflow-x-auto">
        <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-border/60 bg-card/50 p-1.5">
          {filters.map((filter) => (
            <FilterTab
              key={filter.id}
              label={filter.label}
              count={counts[filter.id]}
              active={activeFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>

      <div className="relative w-full shrink-0 sm:max-w-sm">
        <label htmlFor={searchInputId} className="sr-only">
          {searchLabel}
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={searchInputId}
          type="search"
          autoComplete="off"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-border/60 bg-card/60 pr-4 pl-10 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-primary/50"
        />
      </div>
    </div>
  )
}
