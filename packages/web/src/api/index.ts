import { Hono } from "hono";
import { cors } from "hono/cors";
import { candidates } from "./routes/candidates";
import { parties } from "./routes/parties";
import { stats } from "./routes/stats";
import { seed } from "./seed";
import { scrapeAndSeed } from "./scraper";
import { db } from "./database";
import { politicians } from "./database/schema";
import { isNull, eq } from "drizzle-orm";

// Seed on startup only if DB is empty
seed().catch(console.error);

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true }))
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/candidates", candidates)
  .route("/parties", parties)
  .route("/stats", stats)

  // Admin: trigger full scrape (clears DB and re-scrapes)
  .post("/admin/scrape", async (c) => {
    const force = c.req.query("force") === "true";

    const existing = await db.select({ id: politicians.id }).from(politicians).limit(1);
    if (existing.length > 0 && !force) {
      return c.json({ ok: false, message: "DB already has data. Use ?force=true to re-scrape." }, 400);
    }

    // Fire-and-forget — scrape in background
    (async () => {
      try {
        if (force) {
          // Clear existing data
          const { cases } = await import("./database/schema");
          await db.delete(cases);
          await db.delete(politicians);
          console.log("[admin/scrape] Cleared existing data.");
        }
        await scrapeAndSeed((done, total, name) => {
          if (done % 50 === 0) console.log(`[admin/scrape] Progress: ${done}/${total} — ${name}`);
        });
      } catch (err) {
        console.error("[admin/scrape] Error:", err);
      }
    })();

    return c.json({ ok: true, message: "Scrape started in background. Check server logs for progress." });
  })

  // Admin: scrape status
  .get("/admin/status", async (c) => {
    const rows = await db.select({ id: politicians.id }).from(politicians);
    return c.json({ count: rows.length, message: `${rows.length} politicians in DB` });
  })

  // Admin: backfill wealth for existing rows that are missing it
  .post("/admin/backfill-wealth", async (c) => {
    const missing = await db
      .select({ id: politicians.id, sourceUrl: politicians.sourceUrl })
      .from(politicians)
      .where(isNull(politicians.totalAssets));

    if (missing.length === 0) {
      return c.json({ ok: true, message: "All rows already have wealth data." });
    }

    (async () => {
      let updated = 0;
      for (const pol of missing) {
        if (!pol.sourceUrl) continue;
        try {
          const res = await fetch(pol.sourceUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(15000),
          });
          const html = await res.text();
          const assetsMatch = html.match(/Assets:\s*<\/td><td>\s*<b>Rs&nbsp;([\d,]+)<\/b>/i);
          const liabMatch = html.match(/Liabilities:\s*<\/td><td>\s*<b>Rs&nbsp;([\d,]+)<\/b>/i);
          const totalAssets = assetsMatch ? parseInt(assetsMatch[1].replace(/,/g, ""), 10) : null;
          const totalLiabilities = liabMatch ? parseInt(liabMatch[1].replace(/,/g, ""), 10) : null;
          if (totalAssets !== null) {
            await db.update(politicians)
              .set({ totalAssets, totalLiabilities })
              .where(eq(politicians.id, pol.id));
            updated++;
          }
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.error(`[backfill] Error for id=${pol.id}:`, e);
        }
      }
      console.log(`[backfill-wealth] Done. Updated ${updated}/${missing.length}`);
    })();

    return c.json({ ok: true, message: `Backfilling wealth for ${missing.length} rows in background.` });
  });

export type AppType = typeof app;
export default app;
