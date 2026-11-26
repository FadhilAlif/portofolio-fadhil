export type ChatLanguage = "en" | "id"

const INDONESIAN_MARKERS = new Set([
  "apa",
  "apakah",
  "siapa",
  "dimana",
  "mana",
  "bagaimana",
  "gimana",
  "kenapa",
  "mengapa",
  "berapa",
  "kapan",
  "yang",
  "dan",
  "atau",
  "dengan",
  "untuk",
  "dari",
  "pada",
  "ini",
  "itu",
  "adalah",
  "bisa",
  "dapat",
  "punya",
  "memiliki",
  "pernah",
  "kerja",
  "bekerja",
  "pengalaman",
  "proyek",
  "projek",
  "keahlian",
  "sertifikat",
  "sertifikasi",
  "pendidikan",
  "kuliah",
  "lulus",
  "kontak",
  "hubungi",
  "menghubungi",
  "unduh",
  "tentang",
  "seputar",
  "ceritakan",
  "jelaskan",
  "sebutkan",
  "tolong",
  "kasih",
  "tahu",
  "kamu",
  "anda",
  "dia",
  "ia",
  "saya",
  "aku",
  "tidak",
  "gak",
  "ga",
  "nggak",
  "bukan",
  "sudah",
  "udah",
  "belum",
  "saat",
  "sekarang",
  "terbaru",
  "saja",
  "aja",
  "dong",
  "nih",
  "halo",
  "selamat",
  "makasih",
  "terima",
  "publikasi",
  "prestasi",
  "kuasai",
  "bangun",
  "buat",
  "pakai",
  "gunakan",
  "bahasa",
  "lokasi",
  "tinggal",
  "alamat",
  "ipk",
  "universitas",
  "kampus",
  "skripsi",
  "organisasi",
  "tersedia",
  "kolaborasi",
])

const ENGLISH_MARKERS = new Set([
  "what",
  "who",
  "where",
  "when",
  "why",
  "how",
  "which",
  "whose",
  "does",
  "do",
  "did",
  "is",
  "are",
  "was",
  "were",
  "has",
  "have",
  "had",
  "can",
  "could",
  "would",
  "should",
  "will",
  "the",
  "and",
  "or",
  "with",
  "for",
  "from",
  "about",
  "his",
  "her",
  "him",
  "he",
  "she",
  "they",
  "you",
  "your",
  "my",
  "me",
  "tell",
  "explain",
  "describe",
  "list",
  "show",
  "give",
  "please",
  "hello",
  "hey",
  "thanks",
  "thank",
  "work",
  "worked",
  "working",
  "experience",
  "project",
  "projects",
  "skill",
  "skills",
  "stack",
  "built",
  "build",
  "develop",
  "developed",
  "education",
  "university",
  "degree",
  "gpa",
  "certificate",
  "certificates",
  "certification",
  "certifications",
  "contact",
  "resume",
  "download",
  "available",
  "hiring",
  "currently",
  "latest",
  "recent",
  "publications",
  "achievements",
  "summary",
  "background",
  "more",
  "many",
  "much",
  "any",
  "there",
  "this",
  "that",
  "long",
  "reach",
  "out",
  "located",
  "location",
  "languages",
  "speak",
])

export function resolveUiLanguage(value?: string): ChatLanguage {
  if (!value) return "en"
  return value.toLowerCase().startsWith("id") ? "id" : "en"
}

/**
 * Detects whether a user message is written in Indonesian or English.
 * Falls back to the UI language only for short/ambiguous inputs (e.g. "CV?", "GitHub?").
 */
export function detectMessageLanguage(
  message: string,
  fallback: ChatLanguage
): ChatLanguage {
  const normalized = message
    .toLowerCase()
    .replace(/['’]s\b/g, "") // strip English possessives like "Fadhil's"
    .replace(/[^a-z\s-]/g, " ")

  const tokens = normalized.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return fallback

  let idScore = 0
  let enScore = 0

  for (const token of tokens) {
    // Handle hyphenated Indonesian clitics like "cv-nya", "ai-nya", "flutter-nya"
    if (token.endsWith("-nya") || (token.length > 4 && token.endsWith("nya"))) {
      idScore += 2
      continue
    }

    if (INDONESIAN_MARKERS.has(token)) {
      idScore += 1
    }
    if (ENGLISH_MARKERS.has(token)) {
      enScore += 1
    }
  }

  // Strong multi-word Indonesian phrases
  if (/\b(di mana|terima kasih|apa saja|bisa gak|ada ga)\b/.test(normalized)) {
    idScore += 2
  }

  // Strong English contractions/possessives from original message
  if (/\b(what's|who's|where's|how's|he's|doesn't|can't|i'm|fadhil's)\b/i.test(message)) {
    enScore += 2
  }

  if (idScore > enScore) return "id"
  if (enScore > idScore) return "en"
  return fallback
}

/**
 * Turn-level directive appended at the VERY END of systemInstruction (recency position)
 * to override language inertia from prior turns in multi-turn conversations.
 */
export function buildTurnLanguageDirective(lang: ChatLanguage): string {
  if (lang === "id") {
    return `
============================================================
MANDATORY OUTPUT LANGUAGE FOR THIS TURN: INDONESIAN (BAHASA INDONESIA)
============================================================
- Write your Markdown answer and EVERY item in "followUps" (inside <<<META>>>) strictly in natural, professional Indonesian (Bahasa Indonesia).
- COMPLETELY OVERRIDE the language used in earlier conversation turns (even if previous messages were in English).
- Technical nouns (e.g., Full-Stack Engineer, Next.js, REST API, RBAC) may remain in English, but all sentences and follow-up questions MUST be in Indonesian.`
  }

  return `
============================================================
MANDATORY OUTPUT LANGUAGE FOR THIS TURN: ENGLISH
============================================================
- Write your Markdown answer and EVERY item in "followUps" (inside <<<META>>>) strictly in clear, professional English.
- COMPLETELY OVERRIDE the language used in earlier conversation turns (even if previous messages were in Indonesian).
- Never reply in Indonesian or mix Indonesian sentences into this English turn.`
}
