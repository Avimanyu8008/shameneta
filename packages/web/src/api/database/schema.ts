import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const politicians = sqliteTable("politicians", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  normalizedName: text("normalized_name").notNull(),
  displayName: text("display_name").notNull(),
  party: text("party").notNull(),
  partyShort: text("party_short").notNull(),
  partyColor: text("party_color").notNull().default("#888888"),
  state: text("state").notNull(),
  constituency: text("constituency").notNull(),
  electionYear: integer("election_year").notNull(),
  electionType: text("election_type").notNull().default("Lok Sabha"), // Lok Sabha, Vidhan Sabha
  photoUrl: text("photo_url"),
  totalCases: integer("total_cases").notNull().default(0),
  seriousCases: integer("serious_cases").notNull().default(0),
  pendingCases: integer("pending_cases").notNull().default(0),
  convictions: integer("convictions").notNull().default(0),
  acquittals: integer("acquittals").notNull().default(0),
  publicRiskScore: real("public_risk_score").notNull().default(0),
  totalAssets: integer("total_assets"), // in rupees, from ECI affidavit
  totalLiabilities: integer("total_liabilities"), // in rupees, from ECI affidavit
  attendanceDays: integer("attendance_days"), // days signed register (from sansad.in)
  totalSessionDays: integer("total_session_days"), // total sitting days in session
  attendanceSession: text("attendance_session"), // e.g. "LS18-S7"
  sourceUrl: text("source_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const cases = sqliteTable("cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  politicianId: integer("politician_id")
    .notNull()
    .references(() => politicians.id),
  ipcSection: text("ipc_section").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // murder, rape, kidnapping, corruption, violent, other
  seriousnessWeight: integer("seriousness_weight").notNull().default(2),
  status: text("status").notNull().default("pending"), // pending, convicted, acquitted, withdrawn
  statusMultiplier: real("status_multiplier").notNull().default(1.0),
  year: integer("year"),
  court: text("court"),
});

export const partyStats = sqliteTable("party_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  partyShort: text("party_short").notNull().unique(),
  partyName: text("party_name").notNull(),
  partyColor: text("party_color").notNull().default("#888888"),
  totalCandidates: integer("total_candidates").notNull().default(0),
  candidatesWithCases: integer("candidates_with_cases").notNull().default(0),
  candidatesWithSeriousCases: integer("candidates_with_serious_cases").notNull().default(0),
  avgRiskScore: real("avg_risk_score").notNull().default(0),
  totalCases: integer("total_cases").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
