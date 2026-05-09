import { db } from "./database";
import { politicians, cases, partyStats } from "./database/schema";
import { eq, count } from "drizzle-orm";

// ─── IPC Weights (same as seed.ts) ───────────────────────────────────────────
const IPC_WEIGHTS: Record<string, { weight: number; category: string }> = {
  "302": { weight: 10, category: "murder" },
  "307": { weight: 10, category: "murder" },
  "376": { weight: 10, category: "rape" },
  "363": { weight: 8, category: "kidnapping" },
  "364": { weight: 8, category: "kidnapping" },
  "420": { weight: 7, category: "corruption" },
  "406": { weight: 7, category: "corruption" },
  "409": { weight: 7, category: "corruption" },
  "7-PCA": { weight: 7, category: "corruption" },
  "323": { weight: 6, category: "violent" },
  "324": { weight: 6, category: "violent" },
  "325": { weight: 6, category: "violent" },
  "395": { weight: 6, category: "violent" },
  "147": { weight: 5, category: "violent" },
  "148": { weight: 5, category: "violent" },
  "149": { weight: 5, category: "violent" },
  "353": { weight: 4, category: "violent" },
  "186": { weight: 2, category: "other" },
  "188": { weight: 2, category: "other" },
  "504": { weight: 2, category: "other" },
  "506": { weight: 2, category: "other" },
};

// ─── Party color map ──────────────────────────────────────────────────────────
const PARTY_COLORS: Record<string, string> = {
  BJP: "#FF9933",
  INC: "#00BFFF",
  SP: "#E53935",
  AITC: "#2196F3",
  DMK: "#E53935",
  YSRCP: "#1565C0",
  TDP: "#FFD600",
  JDU: "#4CAF50",
  NCP: "#FF6F00",
  "NCP(SP)": "#FF8F00",
  SHS: "#FF9800",
  "SHS(UBT)": "#FF5722",
  RJD: "#F44336",
  AIADMK: "#4CAF50",
  AAP: "#1565C0",
  BSP: "#1565C0",
  CPI: "#F44336",
  "CPI(M)": "#D32F2F",
  CPIM: "#D32F2F",
  JDS: "#4CAF50",
  BRS: "#FFC107",
  IUML: "#4CAF50",
  KEC: "#FF9800",
  LJPRV: "#FF9933",
  IND: "#9E9E9E",
  TRS: "#FFC107",
};

function getPartyColor(short: string): string {
  return PARTY_COLORS[short.trim().toUpperCase()] ?? "#888888";
}

function normalizePartyShort(raw: string): string {
  const s = raw.trim();
  // Normalize common aliases
  const map: Record<string, string> = {
    "BJPBS": "BJP",
    "SHIVSENA": "SHS",
    "SHIV SENA": "SHS",
    "CONGRESS": "INC",
    "INC(T)": "INC",
  };
  return map[s.toUpperCase()] ?? s;
}

function calcScore(caseList: { ipcSection: string; status: string }[]): number {
  return caseList.reduce((sum, c) => {
    const info = IPC_WEIGHTS[c.ipcSection] ?? { weight: 2, category: "other" };
    const mult = c.status === "convicted" ? 1.5 : c.status === "acquitted" ? 0 : 1.0;
    return sum + info.weight * mult;
  }, 0);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Parse constituency list page ────────────────────────────────────────────
function parseWinner(html: string): { candidateId: number; name: string; party: string; constituency: string; state: string } | null {
  // Extract constituency + state from heading: "List of Candidates - ARAKU (ST):ANDHRA PRADESH"
  let constituency = "Unknown";
  let state = "Unknown";
  const h3 = html.match(/List of Candidates - ([^<(]+?)(?:\s*\([A-Z]+\))?\s*:\s*([^<(]+)/i);
  if (h3) {
    constituency = h3[1].replace(/\(SC\)|\(ST\)|\(GEN\)/gi, "").trim();
    state = h3[2].replace(/\([^)]*\)/g, "").trim();
  }

  // Find winner — "Winner" appears after candidate name
  const winnerMatch = html.match(/candidate_id=(\d+)>(.*?)<\/a>[\s\S]*?Winner[\s\S]*?<\/td>\s*<td>(.*?)<\/td>/i);
  if (!winnerMatch) return null;

  const candidateId = parseInt(winnerMatch[1]);
  const name = winnerMatch[2].replace(/&amp;/g, "&").trim();
  const party = winnerMatch[3].replace(/<[^>]+>/g, "").trim();

  return { candidateId, name, party, constituency, state };
}

// ─── Parse candidate detail page ─────────────────────────────────────────────
interface CaseRow {
  ipcSection: string;
  description: string;
  status: "pending" | "convicted" | "acquitted";
}

function extractIpcFromTable(tableHtml: string, status: "pending" | "convicted"): CaseRow[] {
  const rows: CaseRow[] = [];
  if (tableHtml.includes("No Cases")) return rows;

  // Each data row: <tr><td> N</td><td>FIR...</td>...<td>IPC_SECTIONS</td>...
  // IPC sections are in the 5th <td> (index 4, 0-based)
  const rowMatches = tableHtml.matchAll(/<tr><td[^>]*>\s*\d+\s*<\/td>([\s\S]*?)<\/tr>/gi);
  for (const rowMatch of rowMatches) {
    const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    // IPC sections is 4th cell (index 3) in the pending table
    // cols: FIR No | Case No | Court | IPC Sections | Other Acts | ...
    if (cells.length >= 4) {
      const ipcCell = cells[3][1].replace(/<[^>]+>/g, "").trim();
      const sections = ipcCell.split(",").map((s) => s.trim()).filter((s) => /^\d{2,3}[A-Z]?$/.test(s));
      for (const sec of sections) {
        rows.push({ ipcSection: sec, description: `IPC Section ${sec}`, status });
      }
    }
  }
  return rows;
}

function parseRupees(raw: string): number {
  // "12,08,84,682" → 120884682
  return parseInt(raw.replace(/,/g, ""), 10) || 0;
}

function parseCases(html: string): { caseRows: CaseRow[]; photoUrl: string | null; totalAssets: number | null; totalLiabilities: number | null } {
  // Extract photo URL
  const photoMatch = html.match(/src=(https:\/\/myneta\.info\/images_candidate\/LokSabha2024\/[^\s"'>]+)/i);
  const photoUrl = photoMatch ? photoMatch[1] : null;

  // Extract assets & liabilities from the summary table
  const assetsMatch = html.match(/Assets:\s*<\/td><td>\s*<b>Rs&nbsp;([\d,]+)<\/b>/i);
  const liabMatch = html.match(/Liabilities:\s*<\/td><td>\s*<b>Rs&nbsp;([\d,]+)<\/b>/i);
  const totalAssets = assetsMatch ? parseRupees(assetsMatch[1]) : null;
  const totalLiabilities = liabMatch ? parseRupees(liabMatch[1]) : null;

  const caseRows: CaseRow[] = [];

  // Parse "Cases where Pending" table
  const pendingMatch = html.match(/Cases where Pending<\/h3>[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/i);
  if (pendingMatch) {
    caseRows.push(...extractIpcFromTable(pendingMatch[1], "pending"));
  }

  // Parse "Cases where Convicted" table
  const convictedMatch = html.match(/Cases where Convicted<\/h3>[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/i);
  if (convictedMatch) {
    caseRows.push(...extractIpcFromTable(convictedMatch[1], "convicted"));
  }

  // Fallback: use brief IPC list if tables gave nothing
  if (caseRows.length === 0) {
    const briefIpcMatches = [...html.matchAll(/IPC Section-(\w+)\)/gi)];
    for (const m of briefIpcMatches) {
      caseRows.push({
        ipcSection: m[1].toUpperCase(),
        description: `IPC Section ${m[1]}`,
        status: "pending",
      });
    }
  }

  // Deduplicate — multiple FIRs can reference same section+status
  const seen = new Map<string, CaseRow>();
  for (const c of caseRows) {
    const key = `${c.ipcSection}-${c.status}`;
    if (!seen.has(key)) seen.set(key, c);
  }

  return { caseRows: Array.from(seen.values()), photoUrl, totalAssets, totalLiabilities };
}

// ─── Fetch with retry ─────────────────────────────────────────────────────────
async function fetchHtml(url: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
  throw new Error("unreachable");
}

// ─── Main scrape function ─────────────────────────────────────────────────────
export async function scrapeAndSeed(onProgress?: (done: number, total: number, name: string) => void) {
  console.log("[scraper] Starting Lok Sabha 2024 scrape...");

  const total = 543;
  let done = 0;
  let inserted = 0;
  let skipped = 0;

  const partyAgg: Record<string, {
    name: string; color: string;
    total: number; withCases: number; seriousCases: number;
    totalCases: number; scoreSum: number;
  }> = {};

  for (let cid = 1; cid <= total; cid++) {
    try {
      const listUrl = `https://www.myneta.info/LokSabha2024/index.php?action=show_candidates&constituency_id=${cid}`;
      const listHtml = await fetchHtml(listUrl);

      const winner = parseWinner(listHtml);
      if (!winner) {
        console.warn(`[scraper] No winner found for constituency ${cid}`);
        skipped++;
        done++;
        onProgress?.(done, total, `constituency ${cid} — no winner`);
        await sleep(250);
        continue;
      }

      // Fetch candidate detail page
      const detailUrl = `https://www.myneta.info/LokSabha2024/candidate.php?candidate_id=${winner.candidateId}`;
      const detailHtml = await fetchHtml(detailUrl);

      const { caseRows, photoUrl, totalAssets, totalLiabilities } = parseCases(detailHtml);

      const partyRaw = winner.party.trim();
      const partyShort = normalizePartyShort(partyRaw);
      const partyColor = getPartyColor(partyShort);
      const normalizedName = winner.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const score = calcScore(caseRows);

      const pending = caseRows.filter((c) => c.status === "pending").length;
      const convicted = caseRows.filter((c) => c.status === "convicted").length;
      const acquitted = caseRows.filter((c) => c.status === "acquitted").length;
      const serious = caseRows.filter((c) => {
        const w = IPC_WEIGHTS[c.ipcSection]?.weight ?? 2;
        return w >= 6;
      }).length;

      // Insert politician
      const [pol] = await db
        .insert(politicians)
        .values({
          normalizedName,
          displayName: winner.name,
          party: partyRaw,
          partyShort,
          partyColor,
          state: winner.state,
          constituency: winner.constituency,
          electionYear: 2024,
          electionType: "Lok Sabha",
          photoUrl: photoUrl ?? null,
          totalAssets: totalAssets ?? null,
          totalLiabilities: totalLiabilities ?? null,
          totalCases: caseRows.length,
          seriousCases: serious,
          pendingCases: pending,
          convictions: convicted,
          acquittals: acquitted,
          publicRiskScore: score,
          sourceUrl: detailUrl,
        })
        .returning({ id: politicians.id });

      // Insert individual case rows
      if (caseRows.length > 0) {
        await db.insert(cases).values(
          caseRows.map((c) => {
            const info = IPC_WEIGHTS[c.ipcSection] ?? { weight: 2, category: "other" };
            const mult = c.status === "convicted" ? 1.5 : c.status === "acquitted" ? 0 : 1.0;
            return {
              politicianId: pol.id,
              ipcSection: c.ipcSection,
              description: c.description,
              category: info.category,
              seriousnessWeight: info.weight,
              status: c.status,
              statusMultiplier: mult,
            };
          })
        );
      }

      // Aggregate party stats
      if (!partyAgg[partyShort]) {
        partyAgg[partyShort] = { name: partyRaw, color: partyColor, total: 0, withCases: 0, seriousCases: 0, totalCases: 0, scoreSum: 0 };
      }
      partyAgg[partyShort].total++;
      partyAgg[partyShort].totalCases += caseRows.length;
      partyAgg[partyShort].scoreSum += score;
      if (caseRows.length > 0) partyAgg[partyShort].withCases++;
      if (serious > 0) partyAgg[partyShort].seriousCases++;

      inserted++;
      done++;
      onProgress?.(done, total, winner.name);
      console.log(`[scraper] [${done}/${total}] ${winner.name} (${partyShort}) — ${caseRows.length} cases, score=${score.toFixed(1)}`);
    } catch (err) {
      console.error(`[scraper] Error on constituency ${cid}:`, err);
      skipped++;
      done++;
      onProgress?.(done, total, `constituency ${cid} — error`);
    }

    await sleep(300); // polite rate limit
  }

  // Upsert party stats
  for (const [short, agg] of Object.entries(partyAgg)) {
    await db
      .insert(partyStats)
      .values({
        partyShort: short,
        partyName: agg.name,
        partyColor: agg.color,
        totalCandidates: agg.total,
        candidatesWithCases: agg.withCases,
        candidatesWithSeriousCases: agg.seriousCases,
        avgRiskScore: agg.total > 0 ? agg.scoreSum / agg.total : 0,
        totalCases: agg.totalCases,
      })
      .onConflictDoUpdate({
        target: partyStats.partyShort,
        set: {
          totalCandidates: agg.total,
          candidatesWithCases: agg.withCases,
          candidatesWithSeriousCases: agg.seriousCases,
          avgRiskScore: agg.total > 0 ? agg.scoreSum / agg.total : 0,
          totalCases: agg.totalCases,
        },
      });
  }

  console.log(`[scraper] Done. Inserted: ${inserted}, Skipped: ${skipped}`);
  return { inserted, skipped };
}
