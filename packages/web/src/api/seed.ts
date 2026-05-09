import { db } from "./database";
import { politicians } from "./database/schema";
import { scrapeAndSeed } from "./scraper";

export async function seed() {
  // Guard: only seed if DB is empty
  const existing = await db.select({ id: politicians.id }).from(politicians).limit(1);
  if (existing.length > 0) {
    console.log("[seed] DB already has data, skipping seed.");
    return;
  }

  console.log("[seed] DB is empty — starting scrape of Lok Sabha 2024 winners...");
  try {
    const result = await scrapeAndSeed();
    console.log(`[seed] Scrape complete: ${result.inserted} inserted, ${result.skipped} skipped.`);
  } catch (err) {
    console.error("[seed] Scrape failed:", err);
  }
}
