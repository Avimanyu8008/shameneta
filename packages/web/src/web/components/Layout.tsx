import { Link, useLocation } from "wouter";

const navLinks = [
  { href: "/", label: "Leaderboard" },
  { href: "/parties", label: "Parties" },
  { href: "/integrity", label: "Integrity" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "Methodology" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ===== DISCLAIMER STRIP ===== */}
      <div style={{
        background: "rgba(139, 0, 0, 0.1)",
        borderBottom: "1px solid var(--border-red-bright)",
        padding: "5px clamp(14px, 4vw, 24px)",
        textAlign: "center",
        fontSize: "10.5px",
        color: "#d07070",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.04em",
        lineHeight: 1.5,
      }}>
        <span style={{ color: "var(--crimson-light)", fontWeight: 700, marginRight: 6 }}>!</span>
        Data sourced from candidates' sworn election affidavits via ADR/MyNeta.
        Charges are allegations — not convictions unless stated by a court.
      </div>

      {/* ===== HEADER ===== */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(8,8,8,0.96)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(14px, 4vw, 24px)" }}>

          {/* Masthead */}
          <div style={{
            borderBottom: "1px solid var(--border-subtle)",
            padding: "14px 0 12px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 4vw, 2.1rem)",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}>
                  Shame<span style={{ color: "var(--crimson)" }}>Neta</span>
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  color: "var(--text-dim)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 3,
                }}>
                  Your Favourite Politician's Good Deeds
                </div>
              </div>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{
                background: "rgba(196, 30, 58, 0.08)",
                border: "1px solid rgba(196,30,58,0.4)",
                borderRadius: 2,
                padding: "3px 9px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "var(--crimson)",
                letterSpacing: "0.1em",
              }}>
                INDIA
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "var(--text-dim)",
                letterSpacing: "0.06em",
              }}>
                EST. 2024
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch" as any, scrollbarWidth: "none" as any }}>
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    textDecoration: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11.5px",
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    borderBottom: isActive ? "2px solid var(--crimson)" : "2px solid transparent",
                    transition: "color 0.15s, border-color 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(16px, 4vw, 32px) clamp(14px, 4vw, 24px)" }}>
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        padding: "40px clamp(14px, 4vw, 24px) 32px",
        marginTop: 60,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(14px, 4vw, 24px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.35rem",
                fontWeight: 800,
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}>
                Shame<span style={{ color: "var(--crimson)" }}>Neta</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 380 }}>
                A civic transparency platform presenting verified criminal charge information declared by
                Indian election candidates in their sworn affidavits.
              </p>
            </div>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 14,
              }}>
                Navigate
              </div>
              {navLinks.map(l => (
                <div key={l.href} style={{ marginBottom: 9 }}>
                  <Link href={l.href} style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}>
                    {l.label}
                  </Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: 14,
              }}>
                Data Source
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75 }}>
                Association for Democratic Reforms (ADR) via MyNeta.info
              </p>
              <a
                href="https://myneta.info"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "var(--crimson-light)", textDecoration: "none" }}
              >
                → myneta.info ↗
              </a>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: 18,
            fontSize: 11,
            color: "var(--text-dim)",
            lineHeight: 1.9,
          }}>
            <strong style={{ color: "#b89020" }}>Legal Disclaimer:</strong>{" "}
            All information is derived from candidates' sworn election affidavits published by ADR/MyNeta.
            Criminal charges may be pending and do not imply guilt unless established by a court of law.
            This platform is intended solely for voter awareness and civic transparency.
            ShameNeta does not make any accusations or imply guilt.
          </div>
        </div>
      </footer>
    </div>
  );
}
