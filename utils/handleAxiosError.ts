import { AxiosError } from "axios"
import { ResponseMessage } from "@/types"
import { toast } from "sonner"

type NotificationType = "destructive" | "default"

const DEFAULT_ERROR_MESSAGE = "An unknown error occurred."
const NETWORK_ERROR_MESSAGE =
  "Unable to connect to the server. Please check your connection and try again."

const showNotification = (
  type: NotificationType,
  message: string,
  description: string
) => {
  switch (type) {
    case "destructive":
      toast.error(message, { description })
      break
    default:
      toast(message, { description })
      break
  }
}

const getErrorDescription = (error: AxiosError<ResponseMessage>): string => {
  return error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
}

const handleSpecificError = (
  status: number,
  description: string
): { message: string; errorMessage: string } => {
  switch (status) {
    case 400:
      return { message: "Bad Request", errorMessage: description }
    case 403:
      return {
        message: "Forbidden",
        errorMessage: "You do not have permission to access this resource.",
      }
    case 404:
      return { message: "Not Found", errorMessage: description }
    case 500:
      return {
        message: "Server Error",
        errorMessage:
          description || "A server error occurred. Please try again later.",
      }
    default:
      return { message: "Error", errorMessage: DEFAULT_ERROR_MESSAGE }
  }
}

export const handleAxiosError = (err: AxiosError<ResponseMessage>) => {
  console.error("Error: ", err)

  if (!err.response) {
    showNotification("destructive", "Network Error", NETWORK_ERROR_MESSAGE)
    return { error: true, message: NETWORK_ERROR_MESSAGE }
  }

  const { status } = err.response
  const description = getErrorDescription(err)
  const { message, errorMessage } = handleSpecificError(status, description)

  showNotification("destructive", message, errorMessage)

  return { error: true, message: errorMessage }
}
