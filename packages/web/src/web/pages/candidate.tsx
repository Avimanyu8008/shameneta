import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  court: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 10,
      paddingBottom: 14, marginBottom: 20,
      borderBottom: "1px solid transparent",
      borderImage: "linear-gradient(90deg, var(--crimson) 0%, var(--border-red-bright) 40%, transparent 100%) 1",
    }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.15rem" }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          {count} TOTAL
        </span>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  const query = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res = await fetch(`/api/candidates/${id}`);
      if (!res.ok) return null;
      return res.json() as Promise<{ candidate: any; cases: Case[] }>;
    },
  });

  // All candidates — to find same-name entries (election history)
  const allQuery = useQuery({
    queryKey: ["all-candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      return res.json() as Promise<{ candidates: any[] }>;
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
  const barPct = Math.min((c.publicRiskScore / 100) * 100, 100);

  // Election history — all DB entries for same normalizedName
  const electionHistory = (allQuery.data?.candidates ?? [])
    .filter((x: any) => x.normalizedName === c.normalizedName)
    .sort((a: any, b: any) => b.electionYear - a.electionYear);

  // Case groupings
  const categoryGroups = cases.reduce((acc: Record<string, Case[]>, cs) => {
    acc[cs.category] = [...(acc[cs.category] ?? []), cs];
    return acc;
  }, {});

  const statusGroups = cases.reduce((acc: Record<string, number>, cs) => {
    acc[cs.status] = (acc[cs.status] ?? 0) + 1;
    return acc;
  }, {});

  const net = (c.totalAssets ?? 0) - (c.totalLiabilities ?? 0);
  const hasWealth = c.totalAssets != null || c.totalLiabilities != null;

  const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.4)",  label: "Pending" },
    convicted: { color: "var(--crimson-light)", bg: "rgba(196,30,58,0.1)", border: "rgba(196,30,58,0.4)", label: "Convicted" },
    acquitted: { color: "#4ade80", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.4)",   label: "Acquitted" },
    withdrawn: { color: "var(--text-dim)", bg: "rgba(255,255,255,0.04)", border: "var(--border)", label: "Withdrawn" },
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/")}
        style={{
          color: "var(--text-dim)", background: "none", border: "none",
          cursor: "pointer", fontSize: 11, marginBottom: 22,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em",
          padding: 0, textTransform: "uppercase", transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
      >
        ← BACK TO LEADERBOARD
      </button>

      {/* ── PROFILE HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0c0303 0%, #160606 50%, #0c0303 100%)",
        border: "1px solid var(--border-red-bright)",
        borderRadius: 2,
        padding: isMobile ? "20px 16px" : "32px 36px",
        marginBottom: 24,
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 48, height: 2, background: "var(--crimson)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 48, background: "var(--crimson)" }} />
        <div style={{
          position: "absolute", top: "-40%", right: 0,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,30,58,0.09) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", background: "var(--crimson)", color: "white",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
            letterSpacing: "0.22em", padding: "3px 12px", marginBottom: 20,
          }}>
            AFFIDAVIT ON FILE
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "72px 1fr" : "auto 1fr auto",
            gap: isMobile ? 14 : 28,
            alignItems: "start",
          }}>
            {/* Photo */}
            <div style={{
              width: isMobile ? 64 : 88, height: isMobile ? 78 : 108,
              borderRadius: 2, background: `linear-gradient(135deg, ${c.partyColor}18, ${c.partyColor}30)`,
              border: `1px solid ${c.partyColor}60`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.5rem",
              color: c.partyColor, flexShrink: 0, overflow: "hidden",
            }}>
              {c.photoUrl ? (
                <img
                  src={c.photoUrl} alt={c.displayName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                  onError={e => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                    const p = img.parentElement!;
                    p.textContent = getInitials(c.displayName);
                  }}
                />
              ) : getInitials(c.displayName)}
            </div>

            {/* Info */}
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 4vw, 2.2rem)", fontWeight: 900,
                margin: "0 0 10px", lineHeight: 1.08, letterSpacing: "-0.02em",
              }}>
                {c.displayName}
              </h1>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                <span style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                  color: c.partyColor, background: `${c.partyColor}14`,
                  border: `1px solid ${c.partyColor}40`, padding: "2px 8px", borderRadius: 2, letterSpacing: "0.04em",
                }}>
                  {c.partyShort} · {c.party}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.constituency}, {c.state}</span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.electionType} {c.electionYear}
                </span>
              </div>

              {/* Case stats row */}
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {[
                  { val: c.totalCases,   label: "Total Cases",  color: "var(--text-primary)" },
                  { val: c.seriousCases, label: "Serious",      color: c.seriousCases > 0 ? "var(--crimson-light)" : "#4ade80" },
                  { val: c.pendingCases, label: "Pending",      color: "#f59e0b" },
                  { val: c.convictions,  label: "Convicted",    color: c.convictions > 0 ? "var(--crimson-light)" : "var(--text-muted)" },
                  { val: c.acquittals,   label: "Acquitted",    color: "#4ade80" },
                ].map((item, idx) => (
                  <div key={item.label} style={{
                    padding: isMobile ? "6px 10px 6px 0" : "10px 20px 10px 0",
                    marginRight: isMobile ? 10 : 20,
                    borderRight: idx < 4 ? "1px solid var(--border)" : "none",
                    paddingRight: isMobile ? 10 : 20,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: 700,
                      color: item.color, lineHeight: 1, marginBottom: 3, letterSpacing: "-0.02em",
                    }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: isMobile ? 9 : 10.5, color: "var(--text-dim)", letterSpacing: "0.04em" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk panel — desktop */}
            {!isMobile && (
              <div style={{
                textAlign: "right", background: "rgba(0,0,0,0.5)",
                border: `1px solid ${risk.color}44`, borderTop: `2px solid ${risk.color}`,
                borderRadius: 2, padding: "18px 22px", minWidth: 170, flexShrink: 0,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-dim)", marginBottom: 10 }}>
                  Public Risk Score
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3rem", fontWeight: 700, color: risk.textColor, lineHeight: 1, textShadow: `0 0 30px ${risk.color}55`, marginBottom: 10, letterSpacing: "-0.03em" }}>
                  {formatScore(c.publicRiskScore)}
                </div>
                <div style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: risk.textColor, background: `${risk.color}18`, border: `1px solid ${risk.color}55`, padding: "3px 10px", marginBottom: 12 }}>
                  {risk.label}
                </div>
                <div className="risk-bar" style={{ marginTop: 4 }}>
                  <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Risk — mobile */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${risk.color}33` }}>
              <div>
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", color: "var(--text-dim)", marginBottom: 4 }}>PUBLIC RISK SCORE</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: risk.textColor, lineHeight: 1, textShadow: `0 0 20px ${risk.color}55` }}>
                  {formatScore(c.publicRiskScore)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: risk.textColor, background: `${risk.color}18`, border: `1px solid ${risk.color}55`, padding: "3px 10px", borderRadius: 2, marginBottom: 8 }}>
                  {risk.label}
                </div>
                <div className="risk-bar" style={{ width: 120 }}>
                  <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            </div>
          )}

          {c.sourceUrl && (
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-red)" }}>
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11.5, color: "var(--crimson-light)", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}>
                → View Original Affidavit on ADR/MyNeta ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── STATS GRID: Wealth + Cases Overview ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 24 }}>

        {/* Wealth card */}
        {hasWealth && (
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderTop: "2px solid rgba(212,175,55,0.4)", borderRadius: 2,
            padding: isMobile ? "16px" : "22px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem" }}>Declared Wealth</span>
              <span style={{ fontSize: 9.5, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", color: "#a89030", padding: "2px 8px", borderRadius: 2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                ECI AFFIDAVIT
              </span>
            </div>

            {/* Wealth rows */}
            {[
              { label: "Total Assets",      val: c.totalAssets,      color: "#c8a030", fmt: formatWealth(c.totalAssets) },
              { label: "Total Liabilities", val: c.totalLiabilities, color: "#c06060", fmt: formatWealth(c.totalLiabilities) },
              { label: "Net Worth",         val: net,                color: net >= 0 ? "#4ade80" : "#c06060", fmt: formatWealth(net) },
            ].filter(r => r.val != null && r.val !== 0).map(row => (
              <div key={row.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>{row.label.toUpperCase()}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.15rem", fontWeight: 700, color: row.color }}>{row.fmt}</span>
                </div>
                {/* Bar */}
                {row.label !== "Net Worth" && c.totalAssets != null && c.totalAssets > 0 && (
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      background: row.color,
                      width: `${Math.min(((row.val ?? 0) / c.totalAssets) * 100, 100)}%`,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 8, fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.6 }}>
              Self-declared at time of election filing.{" "}
              {c.sourceUrl && <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--crimson-light)", textDecoration: "none" }}>Source ↗</a>}
            </div>
          </div>
        )}

        {/* Cases overview card */}
        {cases.length > 0 && (
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderTop: `2px solid ${risk.color}`, borderRadius: 2,
            padding: isMobile ? "16px" : "22px 24px",
          }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem" }}>Cases Overview</span>
            </div>

            {/* Status breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {Object.entries(statusGroups).map(([status, count]) => {
                const cfg = statusConfig[status] ?? statusConfig.pending;
                const pct = Math.round((count / cases.length) * 100);
                return (
                  <div key={status}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                          color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                          padding: "1px 6px", borderRadius: 2, letterSpacing: "0.06em",
                        }}>
                          {cfg.label.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: cfg.color }}>
                        {count} <span style={{ fontSize: 10, color: "var(--text-dim)" }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 2, background: cfg.color, width: `${pct}%`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category chips */}
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>BY CATEGORY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(categoryGroups).map(([cat, caseList]) => (
                <div key={cat} style={{
                  background: `${getCategoryColor(cat)}12`, border: `1px solid ${getCategoryColor(cat)}44`,
                  borderRadius: 2, padding: "5px 10px", display: "flex", gap: 6, alignItems: "center",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: getCategoryColor(cat) }}>
                    {caseList.length}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{getCategoryLabel(cat)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ELECTION HISTORY ───────────────────────────────────────────────── */}
      {electionHistory.length > 0 && (
        <div style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
          borderRadius: 2, padding: isMobile ? "16px" : "22px 24px", marginBottom: 24,
        }}>
          <SectionHeader label="Election Records" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {electionHistory.map((entry: any, idx: number) => (
              <div
                key={entry.id}
                onClick={() => entry.id !== c.id && navigate(`/candidate/${entry.id}`)}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "52px 1fr" : "64px 1fr auto",
                  gap: isMobile ? 12 : 20,
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: idx < electionHistory.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  cursor: entry.id !== c.id ? "pointer" : "default",
                  opacity: entry.id !== c.id ? 0.8 : 1,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => { if (entry.id !== c.id) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={e => { if (entry.id !== c.id) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
              >
                {/* Year */}
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: isMobile ? "1rem" : "1.1rem",
                  fontWeight: 700, color: entry.id === c.id ? "var(--crimson-light)" : "var(--text-dim)",
                }}>
                  {entry.electionYear}
                </div>
                {/* Details */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: "var(--text-primary)" }}>
                    {entry.constituency}, {entry.state}
                    {entry.id === c.id && (
                      <span style={{ marginLeft: 8, fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace", color: "var(--crimson-light)", background: "rgba(196,30,58,0.1)", border: "1px solid rgba(196,30,58,0.3)", padding: "1px 6px", borderRadius: 2 }}>
                        THIS RECORD
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {entry.electionType} · <span style={{ color: entry.partyColor }}>{entry.partyShort}</span>
                  </div>
                </div>
                {/* Cases count — desktop */}
                {!isMobile && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: entry.totalCases > 0 ? "var(--crimson-light)" : "#4ade80" }}>
                      {entry.totalCases}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>cases filed</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DISCLAIMER ─────────────────────────────────────────────────────── */}
      <div className="disclaimer-banner" style={{ marginBottom: 28 }}>
        <strong>Important:</strong> All charges below are self-declared in the sworn election affidavit.
        These are allegations — they do not imply guilt unless a court has issued a conviction.
        Acquittals are scored at 0.
      </div>

      {/* ── CRIMINAL CASES ─────────────────────────────────────────────────── */}
      {cases.length === 0 ? (
        <div style={{
          background: "rgba(34,197,94,0.05)", border: "1px solid #16a34a44",
          borderLeft: "3px solid #16a34a", borderRadius: 2, padding: "32px 24px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>
            No Criminal Cases Declared
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            This candidate declared no criminal cases in their election affidavit.
          </p>
        </div>
      ) : (
        <div>
          <SectionHeader label="Declared Criminal Cases" count={cases.length} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cases.map((cs) => {
              const cfg = statusConfig[cs.status] ?? statusConfig.pending;
              return (
                <div key={cs.id} style={{
                  background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  borderLeft: `3px solid ${getCategoryColor(cs.category)}`,
                  borderRadius: 2, padding: isMobile ? "12px 14px" : "16px 20px",
                  display: "grid",
                  gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto",
                  gap: isMobile ? 12 : 20, alignItems: "start",
                }}>
                  {/* IPC code */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 700,
                    color: getCategoryColor(cs.category), background: `${getCategoryColor(cs.category)}18`,
                    border: `1px solid ${getCategoryColor(cs.category)}44`,
                    padding: "4px 10px", borderRadius: 2, minWidth: 60, textAlign: "center", lineHeight: 1.4,
                  }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--text-dim)" }}>IPC</div>
                    {cs.ipcSection}
                  </div>

                  {/* Description */}
                  <div>
                    <div style={{ fontSize: isMobile ? 13 : 14, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.5 }}>
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
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                          color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "2px 6px", borderRadius: 2,
                        }}>
                          {cfg.label.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status — desktop */}
                  {!isMobile && (
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                        padding: "3px 8px", borderRadius: 2, display: "block", marginBottom: 4,
                      }}>
                        {cfg.label.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {cs.statusMultiplier === 0 ? "×0 (scored)" : `×${cs.statusMultiplier}`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DATA SOURCES FOOTER ────────────────────────────────────────────── */}
      <div style={{
        marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-subtle)",
        fontSize: 11, color: "var(--text-dim)", lineHeight: 1.7,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ marginBottom: 4, letterSpacing: "0.08em" }}>DATA SOURCES</div>
        <div>Election Commission of India (ECI) · Association for Democratic Reforms (ADR) · MyNeta.info</div>
        <div style={{ marginTop: 4 }}>All data sourced from publicly filed affidavits. No editorial additions.</div>
      </div>
    </div>
  );
}
