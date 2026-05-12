# Task: Add Attendance % to Politician Profile

## Plan
1. [x] Find sansad.in attendance API
2. [ ] Add columns to schema: attendanceDays, totalSessionDays, attendanceSession
3. [ ] Push schema change to DB
4. [ ] Write scraper to fetch & match all MPs
5. [ ] Update candidate.tsx to show attendance card
6. [ ] Push to GitHub

## API Found
- https://sansad.in/api_ls/member/getMemberAttendanceMemberWise?loksabha=18&session=7&locale=en
- Returns: mpsno, memberName, constituency, state, signedDaysCount
- Session 7 has 31 total days
- 542 entries, 480 non-zero

## DB Changes
- Add: attendanceDays INTEGER DEFAULT NULL (signed register days)
- Add: totalSessionDays INTEGER DEFAULT NULL (total days in session) 
- Add: attendanceSession TEXT DEFAULT NULL (e.g. "LS18-S7")

## Name Matching Strategy
- Normalize both names: lowercase, remove punctuation, compress spaces
- Match on normalized name + constituency state overlap
- Store unmatched for review
