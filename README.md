# 🇮🇳 ShameNeta

### India's Political Transparency Dashboard

> **Your Favourite Politician's Good Deeds**

ShameNeta is a civic-tech platform that turns publicly available Indian election-affidavit data into an accessible political transparency dashboard.

Instead of forcing voters to navigate large, difficult-to-read affidavit datasets, ShameNeta provides a structured way to explore **politicians, declared criminal cases, case status, risk scores, declared wealth, parliament attendance, party-level statistics, and candidate comparisons**.

The goal is simple:

**Make political information easier to discover, understand, compare, and question.**

---

## 🎯 The Problem

Indian election candidates are required to disclose important information through their election affidavits, including:

- Criminal cases
- Status of criminal cases
- Assets
- Liabilities
- Other candidate information

However, this information is often difficult for ordinary voters to interpret because it is distributed across large datasets and individual candidate pages.

A voter may want to answer questions such as:

- What criminal cases has a candidate declared?
- How serious are those declared cases?
- Are the cases pending or have convictions been declared?
- How does one candidate compare with another?
- What is the candidate's declared wealth?
- How active was the candidate during a parliamentary session?
- How does a political party compare with others?
- Which candidates have no declared criminal cases?

ShameNeta converts these questions into a **searchable, visual, data-driven interface**.

---

# 💡 Our Solution

ShameNeta combines publicly available political data with a transparent scoring and visualization layer.

The platform provides:

### 👤 Candidate Profiles
Detailed profiles containing:

- Candidate name
- Political party
- Constituency
- State
- Election year
- Candidate photograph
- Declared criminal cases
- Case status
- IPC sections
- Serious-case classification
- Public Risk Score
- Declared assets
- Declared liabilities
- Estimated net worth
- Parliament attendance information
- Original data source

### 📊 National Leaderboard

Candidates can be explored through a national leaderboard ordered by their **Public Risk Score**.

Users can:

- Search by candidate name
- Search by constituency
- Filter by state
- Filter by political party
- Filter by election year
- Sort candidates by risk score

### ⚖️ Public Risk Score

ShameNeta does not treat every criminal charge as equally serious.

The platform uses a transparent weighted scoring methodology based on declared IPC sections and case status.

This makes the scoring system:

- Explainable
- Reproducible
- Data-driven
- Visible to the user

The complete scoring methodology is available inside the application.

### 🏛️ Parliament Attendance

Candidate profiles can display parliamentary attendance for the tracked Lok Sabha session.

The dashboard presents:

- Attendance percentage
- Signed attendance days
- Total sitting days
- Attendance classification
- Session identifier

Attendance data is sourced from official Sansad records.

### 💰 Declared Wealth

Candidate profiles can display:

- Total declared assets
- Total declared liabilities
- Calculated net worth
- Relative wealth visualization

This information comes from candidate affidavit data.

### 🏛️ Party Transparency Dashboard

Party-level statistics aggregate candidate information to provide:

- Number of tracked candidates
- Candidates with declared cases
- Candidates with serious declared cases
- Average Public Risk Score
- Total declared cases

This allows users to move from an individual candidate view to a broader political-party view.

### 🔍 Integrity Leaderboard

ShameNeta provides an integrity-focused leaderboard for candidates with:

> **Zero serious declared criminal cases**

Candidates can be explored from the lowest Public Risk Score upward.

### ⚔️ Candidate Comparison

The comparison interface allows users to select two candidates and compare them side-by-side.

Comparison includes:

- Public Risk Score
- Risk classification
- Total cases
- Serious cases
- Convictions
- Declared assets
- Declared liabilities
- Net worth

This turns raw political data into a direct decision-support interface.

### 📚 Methodology & Transparency

The platform includes a dedicated methodology page explaining:

- How the Public Risk Score is calculated
- IPC section weights
- Case-status multipliers
- Risk categories
- Worked scoring examples
- Why different cases receive different weights
- Why acquittals do not contribute to the score

The methodology is intentionally visible instead of hiding the scoring logic inside the backend.

---

# 🧠 Public Risk Score

The core scoring formula is:

```text
Public Risk Score = Σ (Weight × Count × Status Multiplier)
```markdown
> **Project Status:** 🚧 Active Prototype  
> **Current Focus:** Political transparency, candidate analysis, criminal-case data, wealth, parliamentary attendance and candidate comparison.  
> **Roadmap:** Historical tracking, state-level coverage, geographic analytics, AI-assisted exploration, multilingual access and open-data capabilities.

# 🚀 Future Roadmap

ShameNeta is designed as a foundation for a broader political-transparency platform. The current implementation focuses on candidate transparency, criminal-case analysis, wealth, attendance, party statistics, and candidate comparison.

The following features are planned as the platform evolves.

---

## 🗺️ Phase 1 — Expand Political Coverage

### 🏛️ State Assembly Coverage

Expand beyond Lok Sabha representatives to include:

- State Legislative Assembly candidates
- MLAs
- State-wise candidate rankings
- Constituency-level comparisons
- State-level political transparency dashboards

This would transform ShameNeta from a Lok Sabha-focused platform into a broader Indian political transparency system.

---

### 📜 Historical Election Tracking

Add historical election datasets so users can explore how a candidate's public record changes over time.

Example:

```text
2014 → 2019 → 2024
  ↓      ↓      ↓
Assets
Cases
Risk Score
Election Result
Attendance

Users could identify trends instead of viewing a candidate only at a single point in time.

📊 Phase 2 — Advanced Political Analytics
📈 Candidate Timeline

Create a chronological profile showing:

Elections contested
Party changes
Constituencies
Declared assets
Criminal-case changes
Risk-score changes
Parliamentary attendance

This would allow users to understand a politician's public record over their political career.

🗺️ Geographic Transparency Map

Introduce an interactive India map showing:

Candidate risk distribution
State-level statistics
Constituency-level statistics
Party dominance
Average declared assets
Criminal-case concentration
Parliamentary attendance

Users could zoom from:

India
  ↓
State
  ↓
Constituency
  ↓
Candidate
🏛️ Constituency Transparency Score

Create a constituency-level analytical view combining:

Candidate risk information
Attendance
Declared wealth
Number of candidates
Election history

This would allow voters to explore transparency at the constituency level rather than only at the candidate level.

🤖 Phase 3 — AI-Assisted Public Data Exploration
🧠 Political Data Assistant

Introduce an AI-powered assistant capable of answering questions using ShameNeta's structured public dataset.

Example queries:

"Compare the candidates from this constituency."

"Which candidate has the lowest risk score?"

"Show candidates with zero serious declared cases."

"How has this candidate's declared wealth changed?"

"Explain why this candidate received this risk score."

The assistant would be grounded in the platform's structured data rather than generating unsupported political claims.

🔎 Natural-Language Search

Instead of requiring users to understand filters, users could search using natural language.

For example:

"Show BJP candidates from Bihar with
low risk scores and high attendance."

The system could convert the request into structured filters.

📝 AI-Assisted Data Summaries

Candidate pages could optionally provide concise summaries of publicly available information:

Candidate
    ↓
Verified Structured Data
    ↓
AI Summary
    ↓
Source References

Every generated summary would remain linked to the underlying source data.

🔍 Phase 4 — Better Transparency & Verification
🔗 Source-Level Evidence

Expand source traceability so individual data points can be connected directly to their original records.

For example:

Risk Score: 18.5
     ↓
Case #1
     ↓
IPC Section
     ↓
Case Status
     ↓
Original Affidavit

This would make the platform easier to audit.

🔄 Automated Data Refresh

Introduce scheduled ingestion jobs that periodically check supported public sources for updated information.

Public Source
      ↓
Scheduled Fetch
      ↓
Change Detection
      ↓
Validation
      ↓
Database Update
      ↓
Dashboard

The system could maintain historical versions rather than silently overwriting previous records.

🧪 Data Quality & Verification Dashboard

Build internal tooling to identify:

Unmatched candidates
Duplicate candidates
Missing fields
Invalid party mappings
Attendance matching failures
Unexpected source changes
Incomplete records

This would make the data pipeline more reliable as the dataset grows.

📱 Phase 5 — Citizen Experience
📱 Dedicated Mobile Application

Expand the existing Expo/React Native foundation into a dedicated mobile experience optimized for:

Candidate discovery
Constituency search
Candidate comparison
Risk-score exploration
Attendance
Saved candidates
🔔 Candidate Updates

Allow users to follow candidates and receive notifications when tracked public information changes.

Possible updates:

New affidavit
Asset changes
Case-status changes
Attendance updates
Election participation
🌐 Multilingual Support

Introduce Indian-language interfaces so political transparency information is accessible to a much larger audience.

Potential languages include:

Hindi
Tamil
Telugu
Bengali
Marathi
Kannada
Malayalam
Gujarati
Punjabi

The goal is to make political information accessible beyond English-speaking users.

🔬 Phase 6 — Research & Open Data
📥 Public Data Export

Allow researchers and civic organizations to export structured datasets in formats such as:

CSV
JSON

with appropriate attribution and source metadata.

📊 Research Dashboard

Provide advanced analytical tools for researchers, journalists, and civic organizations.

Potential analysis:

Party-level trends
State-level trends
Historical risk changes
Wealth distribution
Attendance trends
Criminal-case categories
Election-to-election comparisons
🔌 Public API

Expose selected non-sensitive public datasets through a documented API.

Example:

GET /api/candidates
GET /api/candidates/:id
GET /api/parties
GET /api/states
GET /api/constituencies
GET /api/statistics

This could allow researchers and civic-tech developers to build applications on top of ShameNeta's structured data.

🏗️ Long-Term Vision

The long-term goal is to evolve ShameNeta into a comprehensive civic-information platform:

                    SHAMENETA
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Candidates       Parties      Constituencies
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                Political Data
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Criminal Cases    Wealth       Attendance
        │              │              │
        └──────────────┼──────────────┘
                       ↓
              Transparency Analytics
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Comparison       Search        AI Assistant
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                Informed Citizens

The vision is not to tell citizens who to vote for.

The vision is to give citizens better access to the information they need to make their own informed decisions.

🎯 Development Priorities

Future development will prioritize:

Priority	Goal
🥇 Data Accuracy	Improve validation, matching, and source traceability
🥈 Coverage	Expand elections, states, and historical records
🥉 Accessibility	Make political information easier to understand
🔐 Transparency	Keep methodologies and source information visible
📊 Analytics	Turn raw records into useful comparisons
🤖 Responsible AI	Use AI for exploration without replacing source evidence
🌐 Accessibility	Support multiple Indian languages
🔌 Open Data	Enable researchers and civic-tech developers to use structured data
