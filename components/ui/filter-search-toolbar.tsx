"use client"

import SegmentedControl from "@/components/arc/segmented-control/segmented-control"
import { SearchField } from "@/components/arc/search-field/search-field"
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
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="w-full min-w-0 flex-1">
        <SegmentedControl
          label="Filter by category"
          value={activeFilter}
          onValueChange={(next) => onFilterChange(next as T)}
          options={filters.map((filter) => {
            const isActive = activeFilter === filter.id
            return {
              value: filter.id,
              label: filter.label,
              accessory: (
                <span
                  className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold tabular-nums transition-colors",
                    isActive
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[filter.id]}
                </span>
              ),
            }
          })}
        />
      </div>

      <div className="w-full shrink-0 sm:max-w-sm [&_label]:sr-only">
        <SearchField
          id={searchInputId}
          label={searchLabel}
          autoComplete="off"
          value={searchValue}
          onValueChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  )
}
