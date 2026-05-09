import { useState, useEffect } from "react";

export function getRiskLevel(score: number): { label: string; color: string; textColor: string } {
  if (score === 0) return { label: "CLEAN", color: "#16a34a", textColor: "#4ade80" };
  if (score < 5) return { label: "LOW", color: "#ca8a04", textColor: "#fbbf24" };
  if (score < 15) return { label: "MODERATE", color: "#d97706", textColor: "#f59e0b" };
  if (score < 30) return { label: "HIGH", color: "#dc2626", textColor: "#f87171" };
  if (score < 50) return { label: "SEVERE", color: "#b91c1c", textColor: "#ef4444" };
  return { label: "CRITICAL", color: "#7f1d1d", textColor: "#c41e3a" };
}

export function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    murder: "Murder / Attempt to Murder",
    rape: "Rape (Alleged)",
    kidnapping: "Kidnapping / Abduction",
    corruption: "Corruption / Fraud",
    violent: "Violent Offence",
    other: "Other Criminal",
  };
  return map[cat] ?? cat;
}

export function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    murder: "#c41e3a",
    rape: "#c41e3a",
    kidnapping: "#dc7a22",
    corruption: "#d4af37",
    violent: "#dc7a22",
    other: "#8a8a8a",
  };
  return map[cat] ?? "#8a8a8a";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending Trial",
    convicted: "Convicted",
    acquitted: "Acquitted",
    withdrawn: "Withdrawn",
  };
  return map[status] ?? status;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const STATES = [
  "Andhra Pradesh", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const PARTIES = [
  "BJP", "INC", "SP", "AAP", "DMK", "AITC", "CPI(M)", "CPI",
  "TDP", "YSRCP", "SHS", "NCP", "RJD", "JD(U)", "JMM", "SAD"
];

export const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];

export function formatScore(score: number): string {
  return Math.round(score * 10) / 10 + "";
}

export function formatWealth(rupees: number | null | undefined): string {
  if (rupees == null) return "—";
  if (rupees >= 1e9) return `₹${(rupees / 1e9).toFixed(2)}B`;
  if (rupees >= 1e7) return `₹${(rupees / 1e7).toFixed(1)} Cr`;
  if (rupees >= 1e5) return `₹${(rupees / 1e5).toFixed(1)} L`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

// Mobile detection hook
export function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}
