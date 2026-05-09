import { useQuery } from "@tanstack/react-query";

export default function PartiesPage() {
  const query = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await fetch("/api/parties");
      return res.json() as Promise<{ parties: any[] }>;
    },
  });

  const parties = query.data?.parties ?? [];
  const maxScore = Math.max(...parties.map(p => p.avgRiskScore), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "var(--crimson-light)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          ◆ Party Transparency Dashboard
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 900,
          margin: "0 0 12px",
        }}>
          Party-wise Criminal Disclosure
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 600 }}>
          Breakdown of declared criminal charges by political party, based on candidates' sworn affidavits.
          Percentages reflect proportion of tracked candidates per party.
        </p>
      </div>

      {query.isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 100, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 2 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {parties.map((p, i) => {
            const barPct = maxScore > 0 ? (p.avgRiskScore / maxScore) * 100 : 0;
            const pctWithCases = p.totalCandidates > 0 ? Math.round((p.candidatesWithCases / p.totalCandidates) * 100) : 0;
            const pctWithSerious = p.totalCandidates > 0 ? Math.round((p.candidatesWithSeriousCases / p.totalCandidates) * 100) : 0;

            return (
              <div key={p.partyShort} style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${p.partyColor}`,
                borderRadius: 2,
                padding: "20px 24px",
                animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  alignItems: "center",
                  gap: 16,
                }}>
                  {/* Party name */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}>
                        {p.partyShort}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {p.partyName}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="risk-bar" style={{ width: 160 }}>
                        <div className="risk-bar-fill" style={{ width: `${barPct}%` }} />
                      </div>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}>
                        avg score
                      </span>
                    </div>
                  </div>

                  {/* Candidates */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                      {p.totalCandidates}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Candidates</div>
                  </div>

                  {/* With cases */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: pctWithCases > 50 ? "var(--crimson-light)" : "var(--text-primary)",
                      marginBottom: 2,
                    }}>
                      {pctWithCases}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Have Cases</div>
                  </div>

                  {/* With serious */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: pctWithSerious > 30 ? "var(--crimson-light)" : "var(--text-primary)",
                      marginBottom: 2,
                    }}>
                      {pctWithSerious}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Serious Charges</div>
                  </div>

                  {/* Avg score */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: p.avgRiskScore > 20 ? "var(--crimson-light)" : p.avgRiskScore > 5 ? "#f59e0b" : "#4ade80",
                      marginBottom: 2,
                    }}>
                      {Math.round(p.avgRiskScore * 10) / 10}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Avg Risk Score</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="disclaimer-banner" style={{ marginTop: 32 }}>
        Party statistics are calculated from the tracked candidates in our database and may not represent the party's full candidate base.
        Data sourced from ADR/MyNeta affidavit disclosures.
      </div>
    </div>
  );
}
