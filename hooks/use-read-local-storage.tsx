import { Database, RefreshCw } from "lucide-react"
import * as React from "react"

// ============================================================================

interface UseReadLocalStorageOptions<T, InitializeWithValue extends boolean | undefined> {
  deserializer?: (value: string) => T
  initializeWithValue: InitializeWithValue
}

const IS_SERVER = typeof window === "undefined"

// SSR version
export function useReadLocalStorage<T>(
  key: string,
  options: UseReadLocalStorageOptions<T, false>,
): T | null | undefined
// CSR version
export function useReadLocalStorage<T>(
  key: string,
  options?: Partial<UseReadLocalStorageOptions<T, true>>,
): T | null
export function useReadLocalStorage<T>(
  key: string,
  options: Partial<UseReadLocalStorageOptions<T, boolean>> = {},
): T | null | undefined {
  let { initializeWithValue = true } = options
  if (IS_SERVER) {
    initializeWithValue = false
  }

  const deserializer = React.useCallback<(value: string) => T | null>(
    value => {
      if (options.deserializer) {
        return options.deserializer(value)
      }
      if (value === "undefined") {
        return undefined as unknown as T
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(value)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        return null
      }

      return parsed as T
    },
    [options],
  )

  const readValue = React.useCallback((): T | null => {
    if (IS_SERVER) {
      return null
    }

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : null
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return null
    }
  }, [key, deserializer])

  const [storedValue, setStoredValue] = React.useState(() => {
    if (initializeWithValue) {
      return readValue()
    }
    return undefined
  })

  React.useEffect(() => {
    setStoredValue(readValue())
  }, [key, readValue])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("local-storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("local-storage", handleStorageChange)
    }
  }, [key, readValue])

  return storedValue
}

export type { UseReadLocalStorageOptions }

// ============================================================================