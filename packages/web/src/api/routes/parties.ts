import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { desc } from "drizzle-orm";

export const parties = new Hono()
  .get("/", async (c) => {
    const stats = await db
      .select()
      .from(schema.partyStats)
      .orderBy(desc(schema.partyStats.avgRiskScore));

    return c.json({ parties: stats }, 200);
  });
