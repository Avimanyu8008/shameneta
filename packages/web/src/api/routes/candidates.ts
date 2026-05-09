import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, desc, asc, like, and, or, sql } from "drizzle-orm";

export const candidates = new Hono()
  .get("/", async (c) => {
    const { search, state, party, year, sort, integrity } = c.req.query();

    let query = db.select().from(schema.politicians);
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(schema.politicians.displayName, `%${search}%`),
          like(schema.politicians.constituency, `%${search}%`)
        )
      );
    }
    if (state) conditions.push(eq(schema.politicians.state, state));
    if (party) conditions.push(eq(schema.politicians.partyShort, party));
    if (year) conditions.push(eq(schema.politicians.electionYear, parseInt(year)));
    if (integrity === "true") conditions.push(eq(schema.politicians.seriousCases, 0));

    let results = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query;

    if (sort === "asc") {
      results = results.sort((a, b) => a.publicRiskScore - b.publicRiskScore);
    } else {
      results = results.sort((a, b) => b.publicRiskScore - a.publicRiskScore);
    }

    return c.json({ candidates: results, total: results.length }, 200);
  })
  .get("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const [politician] = await db
      .select()
      .from(schema.politicians)
      .where(eq(schema.politicians.id, id));

    if (!politician) {
      return c.json({ error: "Candidate not found" }, 404);
    }

    const caseList = await db
      .select()
      .from(schema.cases)
      .where(eq(schema.cases.politicianId, id));

    return c.json({ candidate: politician, cases: caseList }, 200);
  });
