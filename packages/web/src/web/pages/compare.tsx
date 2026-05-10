import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRiskLevel, getCategoryLabel, getCategoryColor, getInitials, formatScore, formatWealth } from "../lib/utils";

// ── Hoisted outside ComparePage to prevent re-mount on every render ──────────

function CandidateCompareCard({ data, onClear }: { data: { candidate: any; cases: any[] }; onClear: () => void }) {
  const { candidate: c, cases } = data;
  const risk = getRiskLevel(c.publicRiskScore);
  const barPct = Math.min((c.publicRiskScore / 100) * 100, 100);
  const net = (c.totalAssets ?? 0) - (c.totalLiabilities ?? 0);

  const categoryGroups = cases.reduce((acc: Record<string, number>, cs: any) => {
    acc[cs.category] = (acc[cs.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      background: "var(--bg-secondary)",
      border: "1px solid var(--border)",
      borderTop: `3px solid ${risk.color}`,
      borderRadius: 2,
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 2,
            background: `${c.partyColor}22`, border: `2px solid ${c.partyColor}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem",
            color: c.partyColor, flexShrink: 0,
          }}>
            {getInitials(c.displayName)}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
              {c.displayName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {c.partyShort} · {c.constituency} · {c.state}
            </div>
          </div>
        </div>
        <button
          onClick={onClear}
          style={{
            background: "none", border: "1px solid var(--border)",
            color: "var(--text-dim)", cursor: "pointer", fontSize: 12,
            padding: "4px 8px", borderRadius: 2,
          }}
        >
          ✕
        </button>
      </div>

      {/* Score */}
      <div style={{
        background: "rgba(0,0,0,0.3)", border: `1px solid ${risk.color}33`,
        borderRadius: 2, padding: "16px", marginBottom: 16, textAlign: "center",
      }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 4 }}>
          PUBLIC RISK SCORE
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 700, color: risk.textColor, lineHeight: 1, marginBottom: 8 }}>
          {formatScore(c.publicRiskScore)}
        </div>
        <div className="risk-bar">
          <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: risk.textColor, letterSpacing: "0.08em" }}>
          {risk.label}
        </div>
      </div>

      {/* Case stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { val: c.totalCases, label: "Total", color: "var(--text-primary)" },
          { val: c.seriousCases, label: "Serious", color: c.seriousCases > 0 ? "var(--crimson-light)" : "#4ade80" },
          { val: c.convictions, label: "Convicted", color: c.convictions > 0 ? "var(--crimson-light)" : "var(--text-muted)" },
        ].map(item => (
          <div key={item.label} style={{ textAlign: "center", background: "rgba(0,0,0,0.2)", padding: "10px 0", borderRadius: 2 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: item.color }}>
              {item.val}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Wealth */}
      {(c.totalAssets != null || c.totalLiabilities != null) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", color: "var(--text-dim)", marginBottom: 8 }}>
            ECI AFFIDAVIT · SELF-DECLARED
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Assets", val: formatWealth(c.totalAssets), color: "#4ade80" },
              { label: "Liabilities", val: formatWealth(c.totalLiabilities), color: "var(--crimson-light)" },
              { label: "Net Worth", val: formatWealth(net), color: net >= 0 ? "#facc15" : "var(--crimson-light)" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center", background: "rgba(0,0,0,0.2)", padding: "10px 4px", borderRadius: 2 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color: item.color, marginBottom: 2 }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(categoryGroups).length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>Charge Categories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(categoryGroups).map(([cat, count]) => (
              <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <span style={{ color: getCategoryColor(cat) }}>{getCategoryLabel(cat)}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)",
                  background: `${getCategoryColor(cat)}18`, border: `1px solid ${getCategoryColor(cat)}33`,
                  padding: "1px 6px", borderRadius: 2,
                }}>
                  {count as number}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cases.length === 0 && (
        <div style={{ textAlign: "center", padding: "16px", color: "#4ade80", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
          ✓ No criminal cases declared
        </div>
      )}
    </div>
  );
}

function CandidatePanel({
  label, search, setSearch, selected, setSelected, dataQuery, allCandidates,
}: {
  label: string;
  search: string;
  setSearch: (s: string) => void;
  selected: number | null;
  setSelected: (id: number | null) => void;
  dataQuery: any;
  allCandidates: any[];
}) {
  const filtered = search
    ? allCandidates.filter(c =>
        c.displayName.toLowerCase().includes(search.toLowerCase()) ||
        c.constituency.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : allCandidates.slice(0, 10);

  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-dim)", marginBottom: 12,
      }}>
        {label}
      </div>

      {!selected ? (
        <div>
          <input
            className="search-input"
            placeholder="Search candidate..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 8 }}
            autoComplete="off"
          />
          {filtered.length > 0 && (
            <div style={{
              border: "1px solid var(--border)", borderRadius: 2,
              background: "var(--bg-secondary)", maxHeight: 280, overflowY: "auto",
            }}>
              {filtered.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c.id); setSearch(""); }}
                  style={{
                    width: "100%", textAlign: "left", background: "none",
                    border: "none", borderBottom: "1px solid var(--border)",
                    padding: "12px 16px", cursor: "pointer", color: "var(--text-primary)",
                    display: "flex", alignItems: "center", gap: 12, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <div style={{
                    width: 36, height: 36, flexShrink: 0,
                    background: `${c.partyColor}22`, border: `1px solid ${c.partyColor}44`,
                    borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.85rem", color: c.partyColor,
                  }}>
                    {getInitials(c.displayName)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.displayName}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {c.partyShort} · {c.state}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : dataQuery.isLoading ? (
        <div style={{ height: 300, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 2 }} />
      ) : dataQuery.data ? (
        <CandidateCompareCard data={dataQuery.data} onClear={() => setSelected(null)} />
      ) : null}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);

  const allQuery = useQuery({
    queryKey: ["all-candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      return res.json() as Promise<{ candidates: any[] }>;
    },
  });

  const candidateAQuery = useQuery({
    queryKey: ["candidate-compare-a", selectedA],
    enabled: selectedA !== null,
    queryFn: async () => {
      const res = await fetch(`/api/candidates/${selectedA}`);
      return res.json() as Promise<{ candidate: any; cases: any[] }>;
    },
  });

  const candidateBQuery = useQuery({
    queryKey: ["candidate-compare-b", selectedB],
    enabled: selectedB !== null,
    queryFn: async () => {
      const res = await fetch(`/api/candidates/${selectedB}`);
      return res.json() as Promise<{ candidate: any; cases: any[] }>;
    },
  });

  const allCandidates = allQuery.data?.candidates ?? [];
  const candA = candidateAQuery.data?.candidate;
  const candB = candidateBQuery.data?.candidate;

  const winner = candA && candB
    ? (candA.publicRiskScore <= candB.publicRiskScore ? "A" : "B")
    : null;

  const netA = candA ? (candA.totalAssets ?? 0) - (candA.totalLiabilities ?? 0) : null;
  const netB = candB ? (candB.totalAssets ?? 0) - (candB.totalLiabilities ?? 0) : null;
  const wealthierName = (netA !== null && netB !== null)
    ? (netA >= netB ? candA?.displayName : candB?.displayName)
    : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: "0.15em", color: "var(--crimson-light)",
          textTransform: "uppercase", marginBottom: 8,
        }}>
          ◆ Compare Candidates
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, margin: "0 0 12px" }}>
          Side-by-Side Comparison
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 600 }}>
          Compare any two candidates' declared criminal charges, Public Risk Scores, and wealth head-to-head.
        </p>
      </div>

      {/* Verdict */}
      {winner && (
        <div style={{
          background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: 2, padding: "16px 24px", marginBottom: 24,
          display: "flex", flexDirection: "column", gap: 8, alignItems: "center",
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#4ade80" }}>
            {winner === "A" ? candA?.displayName : candB?.displayName} has a lower Risk Score — fewer declared charges.
          </span>
          {wealthierName && (
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#facc15" }}>
              {wealthierName} has the higher declared net worth.
            </span>
          )}
        </div>
      )}

      {/* Compare panels */}
      <div style={{ display: "flex", gap: 24 }}>
        <CandidatePanel
          label="Candidate A"
          search={searchA} setSearch={setSearchA}
          selected={selectedA} setSelected={setSelectedA}
          dataQuery={candidateAQuery}
          allCandidates={allCandidates}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 40 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.4rem", color: "var(--text-dim)" }}>
            vs
          </div>
        </div>

        <CandidatePanel
          label="Candidate B"
          search={searchB} setSearch={setSearchB}
          selected={selectedB} setSelected={setSelectedB}
          dataQuery={candidateBQuery}
          allCandidates={allCandidates}
        />
      </div>
    </div>
  );
}
