import { z } from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .trim(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long (max 5000 characters)")
    .trim(),

  // Honeypot field — must be empty (bots tend to fill hidden fields)
  _honey: z.string().max(0, "Bot detected").optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
