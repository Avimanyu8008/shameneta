export default function MethodologyPage() {
  const weights = [
    { section: "IPC 302, 307", category: "Murder / Attempt to Murder", weight: 10, color: "var(--crimson)" },
    { section: "IPC 376", category: "Rape (Alleged)", weight: 10, color: "var(--crimson)" },
    { section: "IPC 363, 364", category: "Kidnapping / Abduction", weight: 8, color: "#dc7a22" },
    { section: "IPC 420, 406, 409 / PCA", category: "Corruption / Fraud", weight: 7, color: "var(--gold)" },
    { section: "IPC 323–395, 147, 148, 353", category: "Violent Offences", weight: "4–6", color: "#dc7a22" },
    { section: "IPC 186, 188, 504, 506 etc.", category: "Other Criminal Cases", weight: 2, color: "var(--text-muted)" },
  ];

  const multipliers = [
    { status: "Pending Trial", multiplier: "×1.0", note: "Not yet adjudicated", color: "#f59e0b" },
    { status: "Convicted", multiplier: "×1.5", note: "Court-established guilt", color: "var(--crimson-light)" },
    { status: "Acquitted", multiplier: "×0", note: "Not counted in score", color: "#4ade80" },
    { status: "Withdrawn", multiplier: "×0", note: "Not counted in score", color: "var(--text-muted)" },
  ];

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "var(--crimson-light)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          ◆ Scoring Methodology
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 900,
          margin: "0 0 16px",
        }}>
          How We Calculate the Public Risk Score
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.8 }}>
          The Public Risk Score is a transparent, reproducible metric based solely on self-declared criminal charges
          in candidates' sworn election affidavits. Here is the exact methodology.
        </p>
      </div>

      {/* Formula */}
      <div style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--gold)",
        borderRadius: 2,
        padding: "24px 28px",
        marginBottom: 40,
      }}>
        <div style={{
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
          Formula
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "1.1rem",
          color: "var(--gold-light)",
          background: "rgba(212,175,55,0.05)",
          border: "1px solid rgba(212,175,55,0.2)",
          padding: "16px 20px",
          borderRadius: 2,
          lineHeight: 2,
        }}>
          Public Risk Score = Σ ( Weight × Count × Status Multiplier )
        </div>
      </div>

      {/* Weights table */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 16,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 10,
        }}>
          IPC Section Weights
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {weights.map((w) => (
            <div key={w.section} style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr 60px",
              gap: 16,
              alignItems: "center",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${w.color}`,
              padding: "12px 16px",
              borderRadius: 2,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: w.color,
              }}>
                {w.section}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                {w.category}
              </div>
              <div style={{
                textAlign: "right",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: w.color,
              }}>
                {w.weight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multipliers */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 16,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 10,
        }}>
          Status Multipliers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {multipliers.map((m) => (
            <div key={m.status} style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: m.color,
                  marginBottom: 4,
                }}>
                  {m.status}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{m.note}</div>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: m.color,
              }}>
                {m.multiplier}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 16,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 10,
        }}>
          Worked Example
        </h2>
        <div style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          padding: "24px",
        }}>
          <table className="data-table" style={{ marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Charge</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Weight</th>
                <th style={{ textAlign: "right" }}>Multiplier</th>
                <th style={{ textAlign: "right" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IPC 302 — Pending</td>
                <td><span className="status-pending">Pending</span></td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>10</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>×1.0</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--crimson-light)" }}>10</td>
              </tr>
              <tr>
                <td>IPC 420 — Convicted</td>
                <td><span className="status-convicted">Convicted</span></td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>7</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>×1.5</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--crimson-light)" }}>10.5</td>
              </tr>
              <tr>
                <td>IPC 323 — Acquitted</td>
                <td><span className="status-acquitted">Acquitted</span></td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>6</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>×0</td>
                <td style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-dim)" }}>0</td>
              </tr>
            </tbody>
          </table>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: "var(--gold)",
            borderTop: "1px solid var(--border)",
            paddingTop: 12,
            textAlign: "right",
          }}>
            Total Public Risk Score = 20.5
          </div>
        </div>
      </div>

      {/* Risk levels */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 16,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 10,
        }}>
          Risk Level Thresholds
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "CLEAN", range: "0", color: "#16a34a", text: "#4ade80" },
            { label: "LOW", range: "1 – 4.9", color: "#ca8a04", text: "#fbbf24" },
            { label: "MODERATE", range: "5 – 14.9", color: "#d97706", text: "#f59e0b" },
            { label: "HIGH", range: "15 – 29.9", color: "#dc2626", text: "#f87171" },
            { label: "SEVERE", range: "30 – 49.9", color: "#b91c1c", text: "#ef4444" },
            { label: "CRITICAL", range: "50+", color: "#7f1d1d", text: "#c41e3a" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              padding: "10px 16px",
              borderRadius: 2,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: item.text,
                background: `${item.color}18`,
                border: `1px solid ${item.color}44`,
                padding: "3px 10px",
                borderRadius: 2,
                minWidth: 80,
                textAlign: "center",
              }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "var(--text-muted)" }}>
                Score {item.range}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 20,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 10,
        }}>
          Frequently Asked Questions
        </h2>
        {[
          {
            q: "What is an election affidavit?",
            a: "Every candidate contesting an Indian election is legally required to file an affidavit disclosing their criminal background, assets, liabilities, and education. These are public documents published by the Election Commission and ADR/MyNeta.",
          },
          {
            q: "Are these people criminals?",
            a: "No. The vast majority of charges listed are pending — they have not been tried or adjudicated. A pending charge means an FIR was registered and a case is before a court. Only charges explicitly marked 'Convicted' represent court-established guilt. This platform does not call anyone a criminal.",
          },
          {
            q: "Why is the score non-zero for acquitted cases?",
            a: "Acquitted cases receive a ×0 multiplier — they contribute 0 to the score. The total case count may still show acquittals for transparency.",
          },
          {
            q: "Why not just count cases?",
            a: "Not all cases are equally serious. A charge of IPC 302 (murder attempt) and a charge of IPC 188 (disobeying an order) are vastly different. The weighted score provides a more meaningful comparison.",
          },
          {
            q: "What is the data source?",
            a: "All data is sourced from candidates' sworn election affidavits published by the Association for Democratic Reforms (ADR) at myneta.info. This is a constitutional requirement — the data comes directly from the candidate's own declaration.",
          },
        ].map((faq, i) => (
          <div key={i} style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            padding: "20px 24px",
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: 10,
              color: "var(--text-primary)",
            }}>
              {faq.q}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
