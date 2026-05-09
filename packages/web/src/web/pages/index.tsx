import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { STATES, PARTIES, YEARS, useIsMobile } from "../lib/utils";
import CandidateCard from "../components/CandidateCard";
import StatCard from "../components/StatCard";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [party, setParty] = useState("");
  const [year, setYear] = useState("");

  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await api.stats.$get()).json(),
  });

  const candidatesQuery = useQuery({
    queryKey: ["candidates", search, state, party, year],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (state) params.state = state;
      if (party) params.party = party;
      if (year) params.year = year;
      const res = await fetch("/api/candidates?" + new URLSearchParams(params));
      return res.json() as Promise<{ candidates: any[]; total: number }>;
    },
  });

  const candidates = candidatesQuery.data?.candidates ?? [];
  const stats = statsQuery.data;
  const isMobile = useIsMobile();

  return (
    <div>
      {/* ===== HERO ===== */}
      <div style={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0101 0%, #150404 45%, #0a0101 100%)",
        border: "1px solid var(--border-red-bright)",
        padding: isMobile ? "28px 18px 24px" : "52px 44px 44px",
        marginBottom: isMobile ? 20 : 36,
      }}>
        {/* Ambient glows */}
        <div style={{
          position: "absolute",
          top: "-30%",
          right: "-5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,30,58,0.1) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Top-left corner rule */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 60,
          height: 2,
          background: "var(--crimson)",
        }} />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 2,
          height: 60,
          background: "var(--crimson)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--crimson)",
            marginBottom: 18,
            opacity: 0.9,
          }}>
            ◆ India's Political Transparency Dashboard ◆
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.9rem, 5vw, 3.4rem)",
            fontWeight: 900,
            lineHeight: 1.08,
            margin: "0 0 14px",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>
            Your Favourite Politician's<br />
            <span style={{
              background: "linear-gradient(90deg, var(--crimson-dark), var(--crimson), var(--crimson-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Good Deeds
            </span>
          </h1>

          <p style={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: 32,
          }}>
            Verified criminal charge data declared by Indian election candidates in their sworn affidavits.
            Sourced from ADR/MyNeta.{" "}
            <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              Charges are allegations — not convictions.
            </strong>
          </p>

          {/* Stat cards */}
          {stats && (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
              gap: isMobile ? 10 : 16,
            }}>
              <div className="stat-card stat-card-normal">
                <div className="stat-card-number" style={{ color: "var(--gold)" }}>
                  {stats.totalPoliticians?.toLocaleString("en-IN")}
                </div>
                <div className="stat-card-label">Candidates Tracked</div>
              </div>
              <div className="stat-card stat-card-red">
                <div className="stat-card-number" style={{ color: "var(--crimson-light)" }}>
                  {stats.withSeriousCases?.toLocaleString("en-IN")}
                </div>
                <div className="stat-card-label">With Serious Charges</div>
              </div>
              <div className="stat-card stat-card-red">
                <div className="stat-card-number" style={{ color: "#f87171" }}>
                  {stats.convictions?.toLocaleString("en-IN")}
                </div>
                <div className="stat-card-label">Convictions Declared</div>
              </div>
              <div className="stat-card stat-card-green">
                <div className="stat-card-number" style={{ color: "#4ade80" }}>
                  {stats.cleanCandidates?.toLocaleString("en-IN")}
                </div>
                <div className="stat-card-label">Clean Candidates</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
        gap: 8,
        marginBottom: isMobile ? 18 : 28,
      }}>
        <div style={{ position: "relative", gridColumn: isMobile ? "1 / -1" : undefined }}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-dim)",
            fontSize: 13,
            pointerEvents: "none",
          }}>
            ⌕
          </span>
          <input
            className="search-input"
            style={{ paddingLeft: 30 }}
            placeholder="Search name or constituency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={state} onChange={e => setState(e.target.value)}>
          <option value="">All States</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={party} onChange={e => setParty(e.target.value)}>
          <option value="">All Parties</option>
          {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* ===== SECTION HEADER ===== */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        paddingBottom: 14,
        marginBottom: 6,
        borderBottom: "1px solid transparent",
        borderImage: "linear-gradient(90deg, var(--crimson) 0%, var(--border-red-bright) 40%, transparent 100%) 1",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "1.35rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}>
            National Leaderboard
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}>
            BY PUBLIC RISK SCORE
          </span>
        </div>
        {candidatesQuery.data && (
          <span style={{
            fontSize: 11,
            color: "var(--text-dim)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {candidatesQuery.data.total.toLocaleString("en-IN")} results
          </span>
        )}
      </div>

      {/* Column labels — desktop only */}
      {!isMobile && <div style={{
        display: "grid",
        gridTemplateColumns: "44px 52px 1fr auto",
        gap: 14,
        padding: "4px 20px 8px",
        marginBottom: 2,
      }}>
        {["#", "", "Candidate", "Risk Score"].map((h, i) => (
          <div key={i} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}>
            {h}
          </div>
        ))}
      </div>}

      {/* ===== LIST ===== */}
      {candidatesQuery.isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-skeleton" style={{
              height: 82,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--border)",
              borderRadius: 2,
              opacity: 1 - i * 0.08,
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ animation: `fadeUp 0.35s ease ${Math.min(i * 0.03, 0.4)}s both` }}>
              <CandidateCard candidate={c} rank={i + 1} />
            </div>
          ))}
          {candidates.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "64px 20px",
              color: "var(--text-dim)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontStyle: "italic",
            }}>
              No candidates found matching these filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
