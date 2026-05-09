import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { sql } from "drizzle-orm";

export const stats = new Hono()
  .get("/", async (c) => {
    const politicians = await db.select().from(schema.politicians);
    const cases = await db.select().from(schema.cases);

    const totalPoliticians = politicians.length;
    const withCases = politicians.filter(p => p.totalCases > 0).length;
    const withSeriousCases = politicians.filter(p => p.seriousCases > 0).length;
    const totalCases = cases.length;
    const convictions = cases.filter(c => c.status === "convicted").length;
    const avgScore = totalPoliticians > 0
      ? politicians.reduce((s, p) => s + p.publicRiskScore, 0) / totalPoliticians
      : 0;
    const highestScore = politicians.reduce((max, p) => p.publicRiskScore > max ? p.publicRiskScore : max, 0);

    return c.json({
      totalPoliticians,
      withCases,
      withSeriousCases,
      totalCases,
      convictions,
      avgScore: Math.round(avgScore * 10) / 10,
      highestScore,
      cleanCandidates: totalPoliticians - withCases,
    }, 200);
  });
