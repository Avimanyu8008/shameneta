import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  getRiskLevel, getCategoryLabel, getCategoryColor,
  getStatusLabel, getInitials, formatScore, formatWealth, useIsMobile
} from "../lib/utils";

type Case = {
  id: number;
  ipcSection: string;
  description: string;
  category: string;
  seriousnessWeight: number;
  status: string;
  statusMultiplier: number;
  year: number | null;
};

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const query = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res = await fetch(`/api/candidates/${id}`);
      if (!res.ok) return null;
      return res.json() as Promise<{ candidate: any; cases: Case[] }>;
    },
  });

  if (query.isLoading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading affidavit data...</div>
      </div>
    );
  }

  if (!query.data?.candidate) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: 12 }}>Candidate not found</div>
        <button onClick={() => navigate("/")} style={{ color: "var(--crimson-light)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>
          ← Back to Leaderboard
        </button>
      </div>
    );
  }

  const { candidate: c, cases } = query.data;
  const risk = getRiskLevel(c.publicRiskScore);
  const isMobile = useIsMobile();
  const maxScore = 100;
  const barPct = Math.min((c.publicRiskScore / maxScore) * 100, 100);

  const categoryGroups = cases.reduce((acc: Record<string, Case[]>, cs) => {
    acc[cs.category] = [...(acc[cs.category] ?? []), cs];
    return acc;
  }, {});

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/")}
        style={{
          color: "var(--text-dim)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          marginBottom: 22,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          padding: 0,
          textTransform: "uppercase",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
      >
        ← BACK TO LEADERBOARD
      </button>

      {/* Profile header */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0c0303 0%, #160606 50%, #0c0303 100%)",
        border: "1px solid var(--border-red-bright)",
        borderRadius: 2,
        padding: isMobile ? "20px 16px" : "32px 36px",
        marginBottom: 28,
        overflow: "hidden",
      }}>
        {/* Corner accent */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 48, height: 2, background: "var(--crimson)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 48, background: "var(--crimson)" }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "-40%", right: 0,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,30,58,0.09) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Stamp */}
          <div style={{
            display: "inline-block",
            background: "var(--crimson)",
            color: "white",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.22em",
            padding: "3px 12px",
            marginBottom: 20,
          }}>
            AFFIDAVIT ON FILE
          </div>

          {/* Layout: photo + info + score */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "72px 1fr" : "auto 1fr auto",
            gap: isMobile ? 14 : 28,
            alignItems: "start",
          }}>

            {/* Photo */}
            <div style={{
              width: isMobile ? 64 : 88,
              height: isMobile ? 78 : 108,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${c.partyColor}18, ${c.partyColor}30)`,
              border: `1px solid ${c.partyColor}60`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: c.partyColor,
              flexShrink: 0,
              overflow: "hidden",
            }}>
              {c.photoUrl ? (
                <img
                  src={c.photoUrl}
                  alt={c.displayName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                    const parent = img.parentElement!;
                    parent.style.display = "flex";
                    parent.style.alignItems = "center";
                    parent.style.justifyContent = "center";
                    parent.textContent = getInitials(c.displayName);
                  }}
                />
              ) : (
                getInitials(c.displayName)
              )}
            </div>

            {/* Info */}
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 900,
                margin: "0 0 10px",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}>
                {c.displayName}
              </h1>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
                <span style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  color: c.partyColor,
                  background: `${c.partyColor}14`,
                  border: `1px solid ${c.partyColor}40`,
                  padding: "2px 8px",
                  borderRadius: 2,
                  letterSpacing: "0.04em",
                }}>
                  {c.partyShort} · {c.party}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {c.constituency}, {c.state}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.electionType} {c.electionYear}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                {[
                  { val: c.totalCases, label: "Total Cases", color: "var(--text-primary)" },
                  { val: c.seriousCases, label: "Serious", color: c.seriousCases > 0 ? "var(--crimson-light)" : "#4ade80" },
                  { val: c.pendingCases, label: "Pending", color: "#f59e0b" },
                  { val: c.convictions, label: "Convicted", color: c.convictions > 0 ? "var(--crimson-light)" : "var(--text-muted)" },
                  { val: c.acquittals, label: "Acquitted", color: "#4ade80" },
                ].map((item, idx) => (
                  <div key={item.label} style={{
                    padding: isMobile ? "8px 12px 8px 0" : "10px 20px 10px 0",
                    marginRight: isMobile ? 12 : 20,
                    borderRight: idx < 4 ? "1px solid var(--border)" : "none",
                    paddingRight: isMobile ? 12 : 20,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: isMobile ? "1.1rem" : "1.5rem",
                      fontWeight: 700,
                      color: item.color,
                      lineHeight: 1,
                      marginBottom: 3,
                      letterSpacing: "-0.02em",
                    }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: isMobile ? 9.5 : 10.5, color: "var(--text-dim)", letterSpacing: "0.04em" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk score panel — on mobile spans full width as separate row */}
            {!isMobile && <div style={{
              textAlign: "right",
              background: `rgba(0,0,0,0.5)`,
              border: `1px solid ${risk.color}44`,
              borderTop: `2px solid ${risk.color}`,
              borderRadius: 2,
              padding: "18px 22px",
              minWidth: 170,
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 10,
              }}>
                Public Risk Score
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "3rem",
                fontWeight: 700,
                color: risk.textColor,
                lineHeight: 1,
                textShadow: `0 0 30px ${risk.color}55`,
                marginBottom: 10,
                letterSpacing: "-0.03em",
              }}>
                {formatScore(c.publicRiskScore)}
              </div>
              <div style={{
                display: "inline-block",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: risk.textColor,
                background: `${risk.color}18`,
                border: `1px solid ${risk.color}55`,
                padding: "3px 10px",
                marginBottom: 12,
              }}>
                {risk.label}
              </div>
              <div className="risk-bar" style={{ marginTop: 4 }}>
                <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
              </div>
            </div>}

          {/* Risk score — mobile inline row */}
          {isMobile && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${risk.color}33`,
            }}>
              <div>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", color: "var(--text-dim)", marginBottom: 4 }}>PUBLIC RISK SCORE</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: risk.textColor, lineHeight: 1, textShadow: `0 0 20px ${risk.color}55` }}>
                  {formatScore(c.publicRiskScore)}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  color: risk.textColor, background: `${risk.color}18`,
                  border: `1px solid ${risk.color}55`, padding: "3px 10px", borderRadius: 2, marginBottom: 8,
                }}>
                  {risk.label}
                </div>
                <div className="risk-bar" style={{ width: 120 }}>
                  <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            </div>
          )}

          </div>

          {/* Source link */}
          {c.sourceUrl && (
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-red)" }}>
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11.5, color: "var(--crimson-light)", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}
              >
                → View Original Affidavit on ADR/MyNeta ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Wealth */}
      {(c.totalAssets != null || c.totalLiabilities != null) && (
        <div style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderTop: "2px solid rgba(212,175,55,0.35)",
          borderRadius: 2,
          padding: "22px 28px",
          marginBottom: 28,
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: "1px solid var(--border-subtle)",
          }}>
            <span style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              fontWeight: 600,
            }}>
              Declared Wealth
            </span>
            <span style={{
              fontSize: 9.5,
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#a89030",
              padding: "2px 8px",
              borderRadius: 2,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em",
            }}>
              ECI AFFIDAVIT · SELF-DECLARED
            </span>
          </div>

          {/* Values */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, marginBottom: 18 }}>
            {c.totalAssets != null && (
              <div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  TOTAL ASSETS
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#c8a030",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}>
                  {formatWealth(c.totalAssets)}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  ₹{c.totalAssets.toLocaleString("en-IN")}
                </div>
              </div>
            )}
            {c.totalLiabilities != null && c.totalLiabilities > 0 && (
              <div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  TOTAL LIABILITIES
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#c06060",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}>
                  {formatWealth(c.totalLiabilities)}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  ₹{c.totalLiabilities.toLocaleString("en-IN")}
                </div>
              </div>
            )}
            {c.totalAssets != null && (
              <div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  NET WORTH
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#4ade80",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}>
                  {formatWealth(c.totalAssets - (c.totalLiabilities ?? 0))}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  Assets − Liabilities
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.7 }}>
            Self-declared affidavit filed with the Election Commission of India (ECI) via{" "}
            <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--crimson-light)", textDecoration: "none" }}>
              ADR/MyNeta ↗
            </a>
            . Values reflect declared amounts at time of election filing.
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer-banner" style={{ marginBottom: 32 }}>
        <strong>Important:</strong> All charges below are self-declared by the candidate in their sworn election affidavit.
        These are allegations and pending charges — they do not imply guilt unless a court has convicted the individual.
        Acquittals are shown with a score of 0.
      </div>

      {/* Cases */}
      {cases.length === 0 ? (
        <div style={{
          background: "rgba(34,197,94,0.05)",
          border: "1px solid #16a34a44",
          borderLeft: "3px solid #16a34a",
          borderRadius: 2,
          padding: "32px 40px",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#4ade80",
            marginBottom: 8,
          }}>
            No Criminal Cases Declared
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            This candidate declared no criminal cases in their election affidavit.
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            paddingBottom: 14,
            marginBottom: 24,
            borderBottom: "1px solid transparent",
            borderImage: "linear-gradient(90deg, var(--crimson) 0%, var(--border-red-bright) 40%, transparent 100%) 1",
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.3rem",
              letterSpacing: "-0.01em",
            }}>
              Declared Criminal Cases
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "var(--text-dim)",
              letterSpacing: "0.08em",
            }}>
              {cases.length} TOTAL
            </span>
          </div>

          {/* Category breakdown */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: 16,
            }}>
              By Category
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(categoryGroups).map(([cat, caseList]) => (
                <div key={cat} style={{
                  background: `${getCategoryColor(cat)}12`,
                  border: `1px solid ${getCategoryColor(cat)}44`,
                  borderRadius: 2,
                  padding: "8px 16px",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: getCategoryColor(cat),
                  }}>
                    {caseList.length}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {getCategoryLabel(cat)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual cases */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cases.map((cs) => (
              <div key={cs.id} style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${getCategoryColor(cs.category)}`,
                borderRadius: 2,
                padding: isMobile ? "12px 14px" : "16px 20px",
                display: "grid",
                gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto",
                gap: isMobile ? 12 : 20,
                alignItems: isMobile ? "start" : "center",
              }}>
                {/* IPC code */}
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: getCategoryColor(cs.category),
                  background: `${getCategoryColor(cs.category)}18`,
                  border: `1px solid ${getCategoryColor(cs.category)}44`,
                  padding: "4px 10px",
                  borderRadius: 2,
                  minWidth: 70,
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-dim)" }}>IPC</div>
                  {cs.ipcSection}
                </div>

                {/* Description */}
                <div>
                  <div style={{ fontSize: 14, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.5 }}>
                    {cs.description}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      Category: <span style={{ color: getCategoryColor(cs.category) }}>{getCategoryLabel(cs.category)}</span>
                    </span>
                    <span style={{ color: "var(--text-dim)", fontSize: 11 }}>·</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      Weight: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>×{cs.seriousnessWeight}</span>
                    </span>
                    {isMobile && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: cs.status === "convicted" ? "var(--crimson-light)"
                          : cs.status === "acquitted" ? "#4ade80"
                          : cs.status === "pending" ? "#f59e0b"
                          : "var(--text-muted)",
                        background: cs.status === "convicted" ? "rgba(196,30,58,0.1)"
                          : cs.status === "acquitted" ? "rgba(34,197,94,0.1)"
                          : cs.status === "pending" ? "rgba(245,158,11,0.1)"
                          : "rgba(255,255,255,0.05)",
                        border: cs.status === "convicted" ? "1px solid rgba(196,30,58,0.4)"
                          : cs.status === "acquitted" ? "1px solid rgba(34,197,94,0.4)"
                          : cs.status === "pending" ? "1px solid rgba(245,158,11,0.4)"
                          : "1px solid var(--border)",
                        padding: "2px 6px",
                        borderRadius: 2,
                      }}>
                        {getStatusLabel(cs.status).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                {!isMobile && <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: cs.status === "convicted" ? "var(--crimson-light)"
                      : cs.status === "acquitted" ? "#4ade80"
                      : cs.status === "pending" ? "#f59e0b"
                      : "var(--text-muted)",
                    background: cs.status === "convicted" ? "rgba(196,30,58,0.1)"
                      : cs.status === "acquitted" ? "rgba(34,197,94,0.1)"
                      : cs.status === "pending" ? "rgba(245,158,11,0.1)"
                      : "rgba(255,255,255,0.05)",
                    border: cs.status === "convicted" ? "1px solid rgba(196,30,58,0.4)"
                      : cs.status === "acquitted" ? "1px solid rgba(34,197,94,0.4)"
                      : cs.status === "pending" ? "1px solid rgba(245,158,11,0.4)"
                      : "1px solid var(--border)",
                    padding: "3px 8px",
                    borderRadius: 2,
                    display: "block",
                    marginBottom: 4,
                  }}>
                    {getStatusLabel(cs.status).toUpperCase()}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {cs.statusMultiplier === 0 ? "×0 (scored)" : `×${cs.statusMultiplier}`}
                  </span>
                </div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
