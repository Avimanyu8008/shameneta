import { Link } from "wouter";
import { getRiskLevel, getInitials, formatScore, formatWealth, useIsMobile } from "../lib/utils";

type Candidate = {
  id: number;
  displayName: string;
  party: string;
  partyShort: string;
  partyColor: string;
  state: string;
  constituency: string;
  electionYear: number;
  electionType: string;
  photoUrl?: string | null;
  totalAssets?: number | null;
  totalLiabilities?: number | null;
  totalCases: number;
  seriousCases: number;
  pendingCases: number;
  convictions: number;
  publicRiskScore: number;
};

export default function CandidateCard({ candidate, rank }: { candidate: Candidate; rank?: number }) {
  const risk = getRiskLevel(candidate.publicRiskScore);
  const isMobile = useIsMobile();
  const maxScore = 100;
  const barPct = Math.min((candidate.publicRiskScore / maxScore) * 100, 100);

  const isTopRank = rank !== undefined && rank <= 3;
  const severity =
    candidate.seriousCases > 0 ? "critical" :
    candidate.pendingCases > 0 ? "pending" :
    "clean";

  const borderLeft = severity === "critical"
    ? "3px solid var(--crimson)"
    : severity === "pending"
    ? "3px solid var(--gold)"
    : "3px solid #1c3a1c";

  const bgBase =
    severity === "critical"
      ? "linear-gradient(to right, rgba(196,30,58,0.04) 0%, var(--bg-secondary) 55%)"
      : severity === "pending"
      ? "linear-gradient(to right, rgba(212,175,55,0.03) 0%, var(--bg-secondary) 55%)"
      : "var(--bg-secondary)";

  const bgHover =
    severity === "critical"
      ? "linear-gradient(to right, rgba(196,30,58,0.07) 0%, var(--bg-elevated) 55%)"
      : severity === "pending"
      ? "linear-gradient(to right, rgba(212,175,55,0.05) 0%, var(--bg-elevated) 55%)"
      : "var(--bg-elevated)";

  // Mobile: 2-col layout, score goes below info
  const gridCols = isMobile
    ? (rank !== undefined ? "36px 1fr" : "44px 1fr")
    : (rank !== undefined ? "44px 52px 1fr auto" : "52px 1fr auto");

  return (
    <Link href={`/candidate/${candidate.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: bgBase,
          border: "1px solid var(--border)",
          borderLeft,
          borderRadius: 2,
          padding: isMobile ? "12px 14px" : "14px 20px",
          display: "grid",
          gridTemplateColumns: gridCols,
          alignItems: isMobile ? "start" : "center",
          gap: isMobile ? 10 : 14,
          transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = bgHover;
          el.style.borderColor = severity === "critical" ? "var(--border-red-bright)" : "var(--border)";
          el.style.transform = "translateY(-1px)";
          el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = bgBase;
          el.style.borderColor = "var(--border)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Rank */}
        {rank !== undefined && (
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: isTopRank ? (isMobile ? "1.4rem" : "1.7rem") : (isMobile ? "1.2rem" : "1.5rem"),
            fontWeight: 700,
            color: isTopRank ? "var(--gold)" : "var(--text-dim)",
            textAlign: "center",
            lineHeight: 1,
            textShadow: isTopRank ? "0 0 12px rgba(212,175,55,0.3)" : "none",
            paddingTop: 2,
          }}>
            {rank}
          </div>
        )}

        {/* Avatar — hidden on mobile when rank present (space saving) */}
        {!isMobile && (
          <div style={{
            width: 48,
            height: 52,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${candidate.partyColor}1a, ${candidate.partyColor}35)`,
            border: `1px solid ${candidate.partyColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: candidate.partyColor,
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}>
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  const parent = img.parentElement!;
                  parent.textContent = getInitials(candidate.displayName);
                  parent.style.color = candidate.partyColor;
                }}
              />
            ) : (
              getInitials(candidate.displayName)
            )}
          </div>
        )}

        {/* Info */}
        <div style={{ minWidth: 0 }}>
          {/* Name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 3 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: isMobile ? "0.95rem" : "1.02rem",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}>
              {candidate.displayName}
            </span>
            <span style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: candidate.partyColor,
              background: `${candidate.partyColor}14`,
              border: `1px solid ${candidate.partyColor}40`,
              padding: "1px 6px",
              borderRadius: 2,
              letterSpacing: "0.04em",
            }}>
              {candidate.partyShort}
            </span>
            {candidate.convictions > 0 && (
              <span className="badge badge-red">
                ✕ {candidate.convictions} CONVICTED
              </span>
            )}
          </div>

          {/* Constituency row */}
          <div style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginBottom: 5,
            letterSpacing: "0.01em",
            lineHeight: 1.5,
          }}>
            {candidate.constituency}
            <span style={{ color: "var(--text-dim)", margin: "0 4px" }}>·</span>
            {candidate.state}
            {!isMobile && (
              <>
                <span style={{ color: "var(--text-dim)", margin: "0 4px" }}>·</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-dim)" }}>
                  {candidate.electionType} {candidate.electionYear}
                </span>
              </>
            )}
          </div>

          {/* Wealth row */}
          {candidate.totalAssets != null && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingTop: 4,
              marginBottom: 5,
              borderTop: "1px solid var(--border-subtle)",
              flexWrap: "wrap",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
              }}>
                <span style={{ color: "var(--text-dim)", letterSpacing: "0.03em" }}>ASSETS</span>
                <span style={{ color: "#a89030", fontWeight: 600 }}>{formatWealth(candidate.totalAssets)}</span>
              </div>
              {candidate.totalLiabilities != null && candidate.totalLiabilities > 0 && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                }}>
                  <span style={{ color: "var(--text-dim)" }}>LIAB</span>
                  <span style={{ color: "#c06060", fontWeight: 600 }}>{formatWealth(candidate.totalLiabilities)}</span>
                </div>
              )}
              <span style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.04em" }}>ECI</span>
            </div>
          )}

          {/* Cases / risk bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, maxWidth: isMobile ? 100 : 160, minWidth: 60 }}>
              <div className="risk-bar">
                <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
              </div>
            </div>
            <div style={{
              display: "flex",
              gap: 8,
              fontSize: 10,
              color: "var(--text-dim)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span>
                <span>C </span>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{candidate.totalCases}</span>
              </span>
              <span>
                <span>S </span>
                <span style={{
                  color: candidate.seriousCases > 0 ? "var(--crimson-light)" : "#3a7a3a",
                  fontWeight: 600,
                }}>
                  {candidate.seriousCases}
                </span>
              </span>
            </div>

            {/* Score inline on mobile */}
            {isMobile && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: risk.textColor,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textShadow: `0 0 14px ${risk.color}44`,
                }}>
                  {formatScore(candidate.publicRiskScore)}
                </div>
                <div style={{
                  fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: risk.textColor,
                  background: `${risk.color}14`,
                  border: `1px solid ${risk.color}44`,
                  padding: "1px 5px",
                  borderRadius: 2,
                  letterSpacing: "0.06em",
                }}>
                  {risk.label}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score — desktop only */}
        {!isMobile && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.65rem",
              fontWeight: 700,
              color: risk.textColor,
              lineHeight: 1,
              marginBottom: 5,
              letterSpacing: "-0.02em",
              textShadow: `0 0 20px ${risk.color}44`,
            }}>
              {formatScore(candidate.publicRiskScore)}
            </div>
            <div style={{
              fontSize: 9.5,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color: risk.textColor,
              background: `${risk.color}14`,
              border: `1px solid ${risk.color}44`,
              padding: "2px 6px",
              borderRadius: 2,
              letterSpacing: "0.08em",
              display: "inline-block",
            }}>
              {risk.label}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
