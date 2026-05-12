/**
 * Scrape attendance data from sansad.in and update politicians DB
 * Usage: bun --env-file=../../.env scrape-attendance.ts
 */
import { db } from "./src/api/database/index.ts";
import { politicians } from "./src/api/database/schema.ts";
import { eq } from "drizzle-orm";

const LOKSABHA = 18;
const SESSION = 7;
const SESSION_LABEL = "LS18-S7";
const TOTAL_SESSION_DAYS = 31; // Session VII: 28/01/2026 to 02/04/2026, 16/04/2026 to 18/04/2026

// Normalize name for fuzzy matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bdr\.?\s*/gi, "")        // remove Dr/Dr.
    .replace(/\bshri\.?\s*/gi, "")      // remove Shri
    .replace(/\bsmt\.?\s*/gi, "")       // remove Smt
    .replace(/\bkumari\.?\s*/gi, "")    // remove Kumari
    .replace(/[^a-z\s]/g, "")           // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}

// Token overlap score between two name strings
function nameScore(a: string, b: string): number {
  const tokA = new Set(normalizeName(a).split(" ").filter(t => t.length > 2));
  const tokB = new Set(normalizeName(b).split(" ").filter(t => t.length > 2));
  let overlap = 0;
  for (const t of tokA) if (tokB.has(t)) overlap++;
  return overlap / Math.max(tokA.size, tokB.size, 1);
}

function normalizeConstituency(c: string): string {
  return c.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  console.log("Fetching attendance from sansad.in...");
  const res = await fetch(
    `https://sansad.in/api_ls/member/getMemberAttendanceMemberWise?loksabha=${LOKSABHA}&session=${SESSION}&locale=en`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const sansadData: Array<{
    mpsno: number;
    memberName: string;
    constituency: string;
    state: string;
    signedDaysCount: number;
  }> = await res.json();

  console.log(`Got ${sansadData.length} records from sansad.in`);

  // Fetch all Lok Sabha MPs from DB
  const dbPols = await db
    .select({
      id: politicians.id,
      displayName: politicians.displayName,
      constituency: politicians.constituency,
      state: politicians.state,
      electionType: politicians.electionType,
    })
    .from(politicians)
    .where(eq(politicians.electionType, "Lok Sabha"));

  console.log(`Got ${dbPols.length} Lok Sabha MPs from DB`);

  let matched = 0;
  let unmatched = 0;
  const unmatchedList: string[] = [];

  for (const sansad of sansadData) {
    // Find best DB match
    let bestMatch: (typeof dbPols)[0] | null = null;
    let bestScore = 0;

    for (const dbPol of dbPols) {
      const ns = nameScore(sansad.memberName, dbPol.displayName);
      const cs = normalizeConstituency(sansad.constituency) === normalizeConstituency(dbPol.constituency) ? 0.5 : 0;
      const score = ns + cs;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = dbPol;
      }
    }

    // Require minimum match threshold
    if (bestMatch && bestScore >= 0.5) {
      await db
        .update(politicians)
        .set({
          attendanceDays: sansad.signedDaysCount,
          totalSessionDays: TOTAL_SESSION_DAYS,
          attendanceSession: SESSION_LABEL,
        })
        .where(eq(politicians.id, bestMatch.id));
      matched++;
    } else {
      unmatched++;
      unmatchedList.push(`${sansad.memberName} (${sansad.constituency}, ${sansad.state}) → best: ${bestMatch?.displayName ?? "none"} score=${bestScore.toFixed(2)}`);
    }
  }

  console.log(`\n✓ Matched and updated: ${matched}`);
  console.log(`✗ Unmatched: ${unmatched}`);
  if (unmatchedList.length > 0) {
    console.log("\nUnmatched entries:");
    unmatchedList.forEach(u => console.log("  -", u));
  }
}

main().catch(console.error);
