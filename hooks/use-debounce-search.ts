import { useEffect, useRef, type RefObject } from "react";
import useDebounce from "./use-debounce";

interface DebouncedSearchConfig<T> {
  searchQuery: string;
  params: T;
  setParams: (params: T) => void;
  delay?: number;
  isInitializedRef?: RefObject<boolean>;
  isRestoringRef?: RefObject<boolean>;
}

export function useDebouncedSearch<
  T extends { page: number; search?: string },
>({
  searchQuery,
  params,
  setParams,
  delay = 500,
  isInitializedRef,
  isRestoringRef,
}: DebouncedSearchConfig<T>) {
  const debouncedSearch = useDebounce(searchQuery, delay);
  const previousSearchRef = useRef<string>("");

  useEffect(() => {
    if (isInitializedRef && !isInitializedRef.current) return;
    if (isRestoringRef && isRestoringRef.current) return;
    if (debouncedSearch === previousSearchRef.current) return;
    if (debouncedSearch === (params.search ?? "")) return;

    previousSearchRef.current = debouncedSearch;

    setParams({
      ...params,
      page: 1,
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch, params, setParams, isInitializedRef, isRestoringRef]);

  return debouncedSearch;
}
