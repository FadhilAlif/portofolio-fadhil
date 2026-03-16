import * as React from "react"

interface ContactEmailTemplateProps {
  name: string
  email: string
  message: string
  sentAt: string
}

export function ContactEmailTemplate({
  name,
  email,
  message,
  sentAt,
}: ContactEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
        backgroundColor: "#0a0a0a",
        color: "#e5e5e5",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "32px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#e5e5e5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "monospace",
              fontWeight: "700",
              fontSize: "16px",
              color: "#0a0a0a",
            }}
          >
            <img
              src="/favicon.ico"
              alt="FADHIL.DEV"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <span
            style={{ fontSize: "18px", fontWeight: "600", color: "#e5e5e5" }}
          >
            FADHIL<span style={{ color: "#7c7cf4" }}>.DEV</span>
          </span>
        </div>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "22px",
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          New Contact Message 📬
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          You received a new message via your portfolio contact form
        </p>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "36px 40px",
          backgroundColor: "#111111",
        }}
      >
        {/* Sender info */}
        <div
          style={{
            display: "grid",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <InfoRow label="From" value={name} />
          <InfoRow label="Email" value={email} isLink={`mailto:${email}`} />
          <InfoRow label="Sent At" value={sentAt} />
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px dashed rgba(255,255,255,0.1)",
            marginBottom: "28px",
          }}
        />

        {/* Message */}
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Message
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "20px",
              fontSize: "14px",
              lineHeight: "1.7",
              color: "#d4d4d4",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </div>
        </div>

        {/* Reply CTA */}
        <div style={{ marginTop: "28px", textAlign: "center" as const }}>
          <a
            href={`mailto:${email}?subject=Re: Your message on fadhil.dev`}
            style={{
              display: "inline-block",
              backgroundColor: "#e5e5e5",
              color: "#0a0a0a",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Reply to {name} →
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "20px 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "#0d0d0d",
          textAlign: "center" as const,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          This message was sent from the contact form at{" "}
          <a
            href="https://fadhil.dev"
            style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            fadhil.dev
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Helper Components ────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  isLink,
}: {
  label: string
  value: string
  isLink?: string
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          minWidth: "60px",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.35)",
          paddingTop: "2px",
        }}
      >
        {label}
      </span>
      {isLink ? (
        <a
          href={isLink}
          style={{
            fontSize: "14px",
            color: "#7c7cf4",
            textDecoration: "none",
          }}
        >
          {value}
        </a>
      ) : (
        <span style={{ fontSize: "14px", color: "#e5e5e5" }}>{value}</span>
      )}
    </div>
  )
}
