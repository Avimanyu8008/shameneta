export default function StatCard({
  value,
  label,
  sub,
  accent = false,
  gold = false,
}: {
  value: string | number;
  label: string;
  sub?: string;
  accent?: boolean;
  gold?: boolean;
}) {
  const color = gold ? "var(--gold)" : accent ? "var(--crimson-light)" : "var(--text-primary)";
  return (
    <div style={{
      background: "var(--bg-secondary)",
      border: "1px solid var(--border)",
      borderTop: gold ? "3px solid var(--gold)" : accent ? "3px solid var(--crimson)" : "3px solid var(--border)",
      borderRadius: 2,
      padding: "20px 24px",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "2rem",
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: 6,
        textShadow: gold ? "0 0 20px rgba(212,175,55,0.3)" : accent ? "0 0 20px rgba(196,30,58,0.3)" : "none",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: sub ? 4 : 0 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{sub}</div>}
    </div>
  );
}
