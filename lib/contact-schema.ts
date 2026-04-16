import { z } from "zod"

type ContactSchemaMessages = {
  nameMin: string
  nameMax: string
  emailInvalid: string
  emailMax: string
  messageMin: string
  messageMax: string
  botDetected: string
}

const defaultMessages: ContactSchemaMessages = {
  nameMin: "Name must be at least 2 characters",
  nameMax: "Name is too long",
  emailInvalid: "Please enter a valid email address",
  emailMax: "Email is too long",
  messageMin: "Message must be at least 10 characters",
  messageMax: "Message is too long (max 5000 characters)",
  botDetected: "Bot detected",
}

export function createContactSchema(
  messages: Partial<ContactSchemaMessages> = {}
) {
  const m = { ...defaultMessages, ...messages }

  return z.object({
    name: z.string().min(2, m.nameMin).max(100, m.nameMax).trim(),

    email: z.string().email(m.emailInvalid).max(254, m.emailMax).trim(),

    message: z.string().min(10, m.messageMin).max(5000, m.messageMax).trim(),

    // Honeypot field — must be empty (bots tend to fill hidden fields)
    _honey: z.string().max(0, m.botDetected).optional(),
  })
}

export const contactSchema = createContactSchema()

export type ContactFormValues = z.infer<typeof contactSchema>
