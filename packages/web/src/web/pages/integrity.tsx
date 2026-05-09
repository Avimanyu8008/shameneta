import { useQuery } from "@tanstack/react-query";
import { getInitials } from "../lib/utils";
import { Link } from "wouter";

export default function IntegrityPage() {
  const query = useQuery({
    queryKey: ["integrity"],
    queryFn: async () => {
      const res = await fetch("/api/candidates?integrity=true&sort=asc");
      return res.json() as Promise<{ candidates: any[]; total: number }>;
    },
  });

  const candidates = query.data?.candidates ?? [];

  return (
    <div>
      {/* Header */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #030d03, #061206)",
        border: "1px solid #1a3a1a",
        borderRadius: 2,
        padding: "40px",
        marginBottom: 40,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-30%",
          right: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "#4ade80",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            ◆ Integrity Leaderboard
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 900,
            margin: "0 0 12px",
            color: "var(--text-primary)",
          }}>
            Clean Candidates
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            Candidates who declared <strong style={{ color: "#4ade80" }}>zero serious criminal charges</strong> in their sworn election affidavits.
            A rarity worth noting.
          </p>
        </div>
      </div>

      {/* Count */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        borderBottom: "1px solid var(--border)",
        paddingBottom: 16,
        marginBottom: 24,
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1.3rem",
        }}>
          Candidates with No Serious Charges
        </span>
        {query.data && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#4ade80",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            padding: "2px 8px",
            borderRadius: 2,
          }}>
            {query.data.total} found
          </span>
        )}
      </div>

      {query.isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 72, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 2 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {candidates.map((c, i) => (
            <Link key={c.id} href={`/candidate/${c.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid #16a34a",
                borderRadius: 2,
                padding: "16px 20px",
                display: "grid",
                gridTemplateColumns: "48px 52px 1fr auto",
                alignItems: "center",
                gap: 16,
                transition: "all 0.2s",
                cursor: "pointer",
                animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "var(--bg-elevated)";
                  el.style.borderColor = "#16a34a";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "var(--bg-secondary)";
                  el.style.borderColor = "var(--border)";
                }}
              >
                {/* Rank */}
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--text-dim)",
                  textAlign: "center",
                }}>
                  {i + 1}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${c.partyColor}22, ${c.partyColor}44)`,
                  border: `2px solid ${c.partyColor}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: c.partyColor,
                  flexShrink: 0,
                }}>
                  {getInitials(c.displayName)}
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                    }}>
                      {c.displayName}
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: c.partyColor,
                      background: `${c.partyColor}18`,
                      border: `1px solid ${c.partyColor}44`,
                      padding: "1px 6px",
                      borderRadius: 2,
                    }}>
                      {c.partyShort}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {c.constituency} · {c.state} · {c.electionType} {c.electionYear}
                  </div>
                </div>

                {/* Clean badge */}
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.4)",
                    borderRadius: 2,
                    padding: "6px 12px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#4ade80",
                    letterSpacing: "0.08em",
                  }}>
                    ✓ CLEAN
                  </div>
                  {c.totalCases > 0 && (
                    <div style={{ marginTop: 4, fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {c.totalCases} minor case{c.totalCases > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {candidates.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-dim)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
            }}>
              No clean candidates found in current filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
