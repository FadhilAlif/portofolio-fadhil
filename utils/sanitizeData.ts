const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export const sanitizeData = (data: unknown): unknown => {
  try {
    if (!data) {
      return data
    }

    if (typeof data === "string") {
      return escapeHtml(data.trim())
    }

    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          const trimmedItem = item?.trim()
          return sanitizeData(trimmedItem)
        }
        return sanitizeData(item)
      })
    }

    if (typeof data === "object") {
      const sanitizedData: { [key: string]: unknown } = {}
      for (const [key, value] of Object.entries(data)) {
        const trimmedValue = typeof value === "string" ? value?.trim() : value
        sanitizedData[key] = sanitizeData(trimmedValue)
      }
      return sanitizedData
    }

    return data
  } catch (error) {
    console.error("Error sanitizing data:", error)
    return data
  }
}

/**
 * Sanitizes URL by cleaning both path parameters and query parameters
 * @param url - The URL to sanitize
 * @returns Sanitized URL
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const [basePath, queryString] = url.split("?")

    const pathParts = basePath.split("/")
    const sanitizedPathParts = pathParts.map((part) =>
      sanitizeData(decodeURIComponent(part))
    )
    const sanitizedBasePath = sanitizedPathParts.join("/")

    if (!queryString) {
      return sanitizedBasePath
    }

    const searchParams = new URLSearchParams(queryString)
    const sanitizedParams = new URLSearchParams()

    searchParams.forEach((value, key) => {
      sanitizedParams.append(
        sanitizeData(key) as string,
        sanitizeData(decodeURIComponent(value)) as string
      )
    })

    const sanitizedQueryString = sanitizedParams.toString()
    return sanitizedQueryString
      ? `${sanitizedBasePath}?${sanitizedQueryString}`
      : sanitizedBasePath
  } catch (error) {
    console.error("Error sanitizing URL:", error)
    return url
  }
}
