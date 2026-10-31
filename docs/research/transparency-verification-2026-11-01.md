# Government and Transparency data refresh — 1 November 2026

A deep scan of official sources for newer data on the Government and Transparency pages.
Every figure below was re-read from the official file on 2026-11-01 (spreadsheets parsed
cell by cell, PDFs read as text and checked visually where the text layer is unreliable).

## The City website (mati.gov.ph) is compromised

Checked on 2026-11-01 through the site's own WordPress REST API, its sitemaps and page
source:

- Every page loads `https://ohhhhhmoney.com/cT.js`, a script from an unrelated domain
  (confirmed in the page source of `/sangguniang-panglungsod/`). `/news/` and posts
  dated 2026-10-06 consist only of code loading `https://ohhhhhmoney.com/kbS0.js`.
- 51 of the site's 54 posts are French-language online-casino spam (2026-05-07 to
  2026-08-01), all by the single `admin` user.
- The uploads folder lists its contents publicly and holds
  `/wp-content/uploads/archives.1783802946.php`, a PHP file where only images and
  documents belong (not opened).
- The site has five pages (home, departments and offices, mayor, Sangguniang
  Panlungsod, a "coming soon" page) and no PDFs. The Citizen's Charter PDF of
  21 October 2025 returns HTTP 404.

**What the site changed in response:**

- `data/officials.json` and `data/city-offices.json` cite Internet Archive copies of the
  City's pages from 8 May 2026. Those copies list the same names as the live pages and do
  not load the outside script:
  - [Sangguniang Panlungsod](https://web.archive.org/web/20260508085431/https://mati.gov.ph/sangguniang-panglungsod/)
  - [Mayor](https://web.archive.org/web/20260508085458/https://mati.gov.ph/city-of-mati-mayor/)
  - [Departments and Offices](https://web.archive.org/web/20260508084318/https://mati.gov.ph/department-and-offices/)
- The footer, Contact page and Site index no longer link to mati.gov.ph; they point to
  `/government/links`. That page keeps one link to the City website, with a note.
  The Mayor, council, departments and `/news/` entries were removed from
  `data/official-links.json`.
- The City Information Office (cio.cityofmati@gmail.com) should be told.
  `trabawho.mati.gov.ph` loads no outside scripts.

## Government

### Officials

Unchanged from the 2026-11-01 transcription: the archived and live Sangguniang Panlungsod
pages list the same Vice Mayor and ten councilors in the same order.

### City offices

The City's Departments and Offices page lists **42 offices in 12 groups**, names only,
with no heads, phone numbers, emails or locations. The live page and the 8 May 2026
archived copy have identical headings. Recorded in `data/city-offices.json`.

- Two names fixed for an obvious typo, with the printed form kept in `printedAs`:
  - "Office of the City Planning and Development Coordinator (CPDC" (no closing bracket);
  - "City Muslim Community Affairs and Development Office E" (stray letter).
- Several of the page's descriptions are pasted from other offices (HRMDO shows CENRO's,
  Muslim Affairs shows City Health's, Tricycle Franchising shows CTMO's), so no
  descriptions were copied.
- The 17 offices that have a service guide on the site were renamed to the City's
  printed names. Examples: "SEEDO – Public Market" becomes "Mati Public Market";
  "Human Resource Management" becomes "City Human Resource Management and Development
  Office".

### Not added

- **Barangay captains:** barangay and SK elections were scheduled for 2 November 2026.
  No official list is online: the provincial site does not resolve and DILG XI has none.
  Wait for the post-election list.
- **Ordinances, resolutions and executive orders:** none are posted on any official
  site.
- **Facebook:** the City's homepage links `facebook.com/maticitylgu`, so the News page
  now embeds that page. `facebook.com/OfficialLGUMati` is not linked by the City.

## City finances

### FY2025 cross-check (BLGF)

[BLGF, SRE by LGU, FY2025 (Preliminary)](https://blgf.gov.ph/wp-content/uploads/2026/05/By-LGU-SRE-2025.xlsx),
sheet `SRE`, row 227 "Region XI / Davao Oriental / Mati City". Last-Modified 12 May 2026.

- Every amount matches the DBM BESF 2027 F.13 figures already on the site, rounded to
  PHP millions. Examples: local sources 252,550,872.83; NTA 1,776,965,115; total
  current operating expenditures 1,283,418,057.63; ending cash 296,543,097.69.
- BLGF's "Education, Culture & Sports" line (18,384,202.01, all from the Special
  Education Fund) sits inside its social services total (111,876,384.67). The page shows
  social services without education (93.49) and education (18.38) separately, and
  now labels them that way.

### January–September 2026 (BLGF)

[BLGF, SRE by LGU, FY2026 Q3](https://blgf.gov.ph/wp-content/uploads/2026/10/By-LGU-SRE-2026-Q3-1.xlsx),
sheet `FY2026-3 SRE`, row 224. Last-Modified 30 Oct 2026; cumulative from 1 January.

| Item                                                              |              PHP |    PHP M |
| ----------------------------------------------------------------- | ---------------: | -------: |
| Local sources (Q)                                                 |   237,162,198.53 |   237.16 |
| National Tax Allotment (R)                                        | 1,518,571,534.00 | 1,518.57 |
| Total external sources (V)                                        | 1,587,429,810.36 | 1,587.43 |
| Total non-income receipts (AQ)                                    |    74,482,104.14 |    74.48 |
| General public services (X)                                       |   558,583,642.73 |   558.58 |
| Social services, total (AD), of which education (Y) 16,146,867.72 |   106,487,857.99 |   106.49 |
| Economic services (AE)                                            |    49,588,219.27 |    49.59 |
| Debt service, interest (AF)                                       |    86,744,343.39 |    86.74 |
| Total non-operating expenditures (AZ)                             |   286,716,298.16 |   286.72 |
| Cash balance, beginning (BB)                                      |   296,706,576.15 |   296.71 |
| Fund/cash available (BC)                                          | 1,107,660,327.64 | 1,107.66 |
| Prior-year payables (BD)                                          |    95,199,829.88 |    95.20 |
| Continuing appropriation (BE)                                     |   109,290,559.91 |   109.29 |
| Fund/cash balance, end (BF)                                       |   903,169,937.85 |   903.17 |

**Checks:**

- Receipts: 237.16 + 1,587.43 + 74.48 = 1,899.07.
- Expenditures: 558.58 + 90.34 social excluding education + 16.15 education + 49.59
  - 86.74 + 286.72 = 1,088.12.
- Cash: 296.71 + 1,899.07 − 1,088.12 = 1,107.66; less 95.20 and 109.29 = 903.17.

**Gaps and inconsistencies:**

- The FY2026 beginning cash (296.71) is 0.16 above BLGF's FY2025 ending cash (296.54).
  This is a difference between BLGF's own two files, so the page does not bridge them.
- In BLGF's `SRE-QTR-2025.xlsx`, the Q1 sheet shows beginning cash 423.08M, while the Q2–Q4
  sheets show 3.41M (noted by the research pass, not used on the site).

### The City's own Q3 2026 SRE (FDP posting)

[City of Mati, SRE CY2026 Q3](https://fdpp.dilg.gov.ph/fdpp/report/document-download?id=267921),
DILG FDP portal id 267921, certified by the Acting City Treasurer.

- Its actual columns equal BLGF's, except ending cash 903,205,091.44. The 35,153.59
  difference is its "Add: advance payment for RPT" line.
- **Its "Income Target/Budget Appropriation" column gives the 2026 budget:**

| Item                                  | Budget column (PHP) |
| ------------------------------------- | ------------------: |
| Local sources target                  |      246,136,458.70 |
| National Tax Allotment                |    2,024,762,044.00 |
| Total current operating income target |    2,270,898,502.70 |
| Current operating expenditures        |    1,903,469,550.58 |
| Capital outlay                        |      306,765,434.84 |
| Debt service, principal               |      197,312,360.76 |

The NTA of 2,024,762,044 equals BESF 2027 F.14's 2,024.76M already on the site.

- **Year-to-date actuals on the same form:**
  - capital outlay 0.00;
  - principal 118,475,942.36;
  - "Other non-operating expenditures" 168,240,355.80.

### 20% Development Fund, Q3 2026 (FDP posting)

[City of Mati, FDP Form 7](https://fdpp.dilg.gov.ph/fdpp/report/document-download?id=267681),
portal id 267681, signed by the City Budget Officer and the Mayor.

- **Appropriation:** 482,147,315.09. The form lists 50 programs and projects, 27 marked
  "No Obligation Incurred".
- **Summary sheet obligations:** 117,243,675.19, made up of economic 107,375,757.19 and
  social 9,867,918.00. The economic line items sum exactly to 107,375,757.19, and the
  social items (1,972,568 + 2,947,900 + 2,947,450 + 2,000,000) to 9,867,918.
- **Error on the form:** the project table's total cost incurred is 127,111,593.19
  because the CCTV Monitoring Control Room line carries 9,867,918, the social subtotal,
  while saying "No Obligation Incurred". The site shows the summary's 117.24M and
  explains the difference.
- **Loan amortization:** 195,788,441.77 appropriated; 100,015,633.01 obligated.

### Disaster risk reduction fund, FY2025 (BLGF)

[BLGF, LDRRMF by LGU, FY2025 (Preliminary)](https://blgf.gov.ph/wp-content/uploads/2026/06/FY2025-LDRRMF-by-LGU.xlsx),
row 222:

| Part                            | Appropriation (PHP) |   Spent (PHP) |
| ------------------------------- | ------------------: | ------------: |
| 70% preparedness and mitigation |       70,408,764.13 | 18,487,709.50 |
| 30% Quick Response Fund         |       30,175,184.63 |          0.00 |
| Total                           |      100,583,948.76 | 18,487,709.50 |

The SEF workbook (`FY2025-SEF-Income-and-Expenditures.xlsx`) shows total SEF spending of
18,384,202.01, the same as the education line above.

### Fetching BLGF files

blgf.gov.ph answers plain `curl` with a 403 bot-challenge page. The workbooks were
fetched inside a browser session on https://blgf.gov.ph/lgu-fiscal-data/ and unzipped
there.

## Projects and procurement

### PhilGEPS (City of Mati, orgID 50396)

All 13 City notices were re-read on 2026-11-01. Each has the same status, ABC and
closing date as on 10-29; 11374254 is still Awarded.

- **New: 13320160**, ITB No. 2026 – 34, "Procurement of Rabies Vaccine (Animal Bite
  Treatment Center)":
  - Goods, ABC PHP 1,998,850.00, "Office of the City Mayor's Fund".
  - Published 31/10/2026, closing 24/11/2026 13:00, Active.
  - The abstract opens only inside a PhilGEPS browsing session.
- **Funding added from the invitation text:**
  - 13288972: "Department of Education – Basic Education Facilities Program under
    the General Appropriation Act 2026".
  - 13280306: "Special Purpose Appropriation - 20% Local Development Fund".
  - 13293157: "20% Local Development Fund".
- **Discrepancy within notice 13288972:** its title says "2-Storey 10-Classrooms" but its
  invitation text says "2-STOREY 4-CLASSROOMS". The site keeps the title.
- **BAC contact on the notices:** the BAC Secretariat landline (087) 3883-167 and
  bac_cityofmati@yahoo.com, from a City document. Not yet used on the site.
- **Not re-checked:** the FFEDIS rice notice (1713); ffedis.da.gov.ph timed out.

### Mati Airport

- [NEP FY2027, DOTr Office of the Secretary](https://www.dbm.gov.ph/wp-content/uploads/NEP2027/DOTr/A.pdf),
  printed p. 301 (PDF p. 14), lists airport projects for Laoag, Bicol, Busuanga,
  Bukidnon, New Manila, Kalibo and New Naga, plus a PHP 1M general aviation line. There
  is **no Mati Airport line**; the text was also searched in its letter-spaced form.
- **Secondary only, not on the site:** the Daily Tribune of 21 Sep 2026 reports that at
  the 18 September Senate hearing, DOTr said it had asked DBM to release the 2026 funds
  for Mati and other airports. The site lists only official (.gov.ph) sources, and no
  official record of this was found.

### Matiao–Magsaysay Coastal Road

[NEP FY2027, Volume II-B, Details of DPWH programs/projects](https://www.dbm.gov.ph/wp-content/uploads/NEP2027/DPWH/Details-of-DPWH.pdf),
printed p. 284 (PDF p. 174), under Region XI. The file was modified 13 Aug 2026.

- The row reads "Matiao-Magsaysay Coastal Road, Brgy. Matiao, Sta. 1717 + 985 - Sta.
  1718 + 039.17, Mati City, Davao Oriental", PHP 100,000,000.
- It was checked on a page image rendered at 110 dpi, because the text layer splits the
  row.
- The DPWH program heading above it could not be read reliably from the text layer, so
  the site cites the page and its Region XI section.
- Added as a proposal (`announced`, amount kind `proposed`), not as an appropriation.

### No change

- Fish port phases: the latest official report is still PNA, 4 Feb 2023.
- Macambol water: the latest is still PNA, 20 Jan 2026.
- DPWH's own transparency and procurement sites are behind bot challenges.

## Full Disclosure (DILG FDP portal)

### Collection

- **Filters:** the portal's Province and City filters POST to `/fdpp/report/load-province`
  and `/load-city-mun`, which redirect to a login page.
- **Listing:** the results list is a plain GET that needs no login:
  `/fdpp/report/index?region_filter=11&year_filter=YYYY&per-page=10&page=N`. Pages are
  capped at 10 rows whatever `per-page` says, and `year_filter` is the posting year.
- **Scrape:** all Region XI pages for posting years 2024 (236 pages), 2025 (239) and
  2026 (208) were read on 2026-11-01, keeping rows whose LGU reads "REGION XI - DAVAO
  REGION, DAVAO ORIENTAL, CITY OF MATI (Capital)".
- **Result:** 131 postings (44 + 45 + 42), with 131 unique ids.
- **What the listing gives:** report name, posting period, document period, a free-text
  description, and a download link `/fdpp/report/document-download?id=<id>`.
- **Description field:** for Mati this is always a note on where the printed report was
  posted (City Hall, market and terminal FDP boards). It is kept as `postedAt` and not
  used as a title.
- **Periods:** written in a readable form ("QUARTER 3 • CY 2026" becomes "Quarter 3,
  CY 2026"; "ANNUAL • CY 2026" becomes "Annual, CY 2026"). Document periods run from
  CY 2023 to Q3 2026.

### Download links

- **Method:** every link was requested in full, at most three at a time. Every failure
  was retried one at a time without a byte range.
- **Available:** 96 download links return an Excel file (`application/vnd.ms-excel`).
- **Unavailable:** 35 return HTTP 500 ("An internal server error occurred") both times.
  The site lists those as unavailable, with no link. The research pass's narrower check
  found 6 of them.
- **Unavailable ids:** 59779, 59867, 107148, 107597, 126425, 147452, 148165, 150921,
  157058, 157059, 190620, 190713, 190899, 190900, 190902, 205531, 206624, 207801,
  209500, 209524, 209546, 209565, 209584, 209600, 209686, 209710, 209750, 209770,
  212230, 213116, 214018, 232774, 233657, 252039, 267920.

| Report type                                                          | Listed | Opens | Server error |
| -------------------------------------------------------------------- | -----: | ----: | -----------: |
| Annual Budget Report                                                 |      3 |     0 |            3 |
| Annual Procurement Plan                                              |      4 |     2 |            2 |
| Supplemental Procurement Plan                                        |      3 |     1 |            2 |
| Annual Gender and Development Accomplishment Report                  |      3 |     2 |            1 |
| Statement of Receipts and Expenditures                               |     12 |    10 |            2 |
| Statement of Indebtedness Payments and Balances                      |     12 |     2 |           10 |
| Quarterly Statement of Cash Flow                                     |     12 |    10 |            2 |
| 20% of the National Tax Allotment Utilization                        |     12 |    10 |            2 |
| Report of Special Education Fund Utilization                         |     12 |    10 |            2 |
| Local Disaster Risk Reduction and Management Fund Utilization        |     12 |    11 |            1 |
| Trust Fund Utilization                                               |     12 |    11 |            1 |
| Unliquidated Cash Advances                                           |     12 |    10 |            2 |
| Bid Results on Civil Works Good and Services and Consulting Services |     11 |     7 |            4 |
| Manpower Complement                                                  |     11 |    10 |            1 |

### Not yet posted (as of 2026-11-01)

- Manpower Complement and Bid Results for Q3 2026.
- None of the posted Annual Budget Reports (CY 2024–2026) can be downloaded.

### Search

Site search indexes portal postings once per report type, not once per file, so a search
for a report name returns one entry instead of a dozen quarterly filings.

## Still blocked

- **COA Annual Audit Reports:** coa.gov.ph shows a Cloudflare "verify you are human" check.
- **DPWH project portals:** behind bot challenges.
- **Barangay captains:** no official post-election list yet.

All three are on the LGU checklist.

## Addendum: awarded civil works for the project map

The project map (`/transparency/projects#project-map`, teaser on Home) counts project
records by barangay. Its main source is new: the City's quarterly FDP Form 10a
"Bid Results on Civil Works" postings, transcribed to `data/awarded-civil-works.json`.

- **Reports:** 11 Bid Results postings for Q4 2023 to Q2 2026. The 7 that download were
  read (portal ids 59797, 87704, 125676, 150946, 157063, 233045, 253039). Q2 2024 and
  Q2–Q4 2025 return a server error and are listed as unavailable.
- **Extraction:**
  - Each file was parsed by locating the "FDP Form 10a" heading and its header row
    (Reference No., Name of Project, Approved Budget for Contract, Location, Winning
    Bidder, Name and Address, Bid Amount, Bidding Date).
  - Every table was then printed and checked by eye.
  - Two files hold the form twice: an empty sheet-1 copy, and the filled copy in columns
    S–AA of sheet 3. Q3 2024 holds it only in columns S–AA.
  - The consulting-services form (10c) also has a Location column and is excluded.
- **Result:** 38 works.

| Quarter | Works |
| ------- | ----: |
| Q4 2023 |     4 |
| Q1 2024 |     1 |
| Q3 2024 |     1 |
| Q4 2024 |    23 |
| Q1 2025 |     4 |
| Q1 2026 |     4 |
| Q2 2026 |     1 |

- **Locations as printed:**
  - Brgy. Central 24, Badas 4, Dahican 2, Sainz 2, and Dawan, Mayo, Sanghay, Don Martin
    Marundan and Mamali 1 each.
  - "Brgy. Central and Dahican" counts for both.
  - No work's Location column names "City of Mati" alone; citywide records on the map come
    from notices and major projects.
- **Left out or kept as printed:**
  - Q2 2026 rows 2–4 print only a location, with no project, amounts or bidder; they were
    left out.
  - The City's own numbering skips items 11 and 14 in Q4 2024.
  - Q1 2026 ref 115 prints its bid amount as "990,00.000.00". It is kept as printed
    (`bidAmountAsPrinted`) and the amount is left blank.
- **Duplicate:** Q4 2024 ref 3058 (Level II water system, Barangay Badas, ABC 2,500,000)
  is the same project as PhilGEPS 11374254 and is counted once (`sameAs`).
- **Spot-checked against the spreadsheet cells** (name, location, ABC, bidder, bid,
  date): 150946-2847 (Mayo farm-to-market road), 87704-176 (100 core shelters, Dahican),
  157063-42 (swine multiplier farm, Sainz).
- **Dates:** the spreadsheets store dates as serials, converted as 1899-12-30 + n days
  (45589 = 2024-10-24).
- **Map totals:** 48 records.
  - 38 awarded works.
  - 5 civil-works notices: PhilGEPS 13293157, 13288404, 13288972 and 13280306, and DPWH
    11439666; PhilGEPS 11374254 is counted as its awarded work.
  - 5 major projects. Macambol water is tagged Macambol and the Matiao coastal road
    Matiao; the airport and the two fish port items are citywide.
  - Barangay-attributed: 42 records across 11 barangays. Citywide or unassigned: 6.
- **Boundaries:** `data/mati/dist/mati_barangays.geojson` (faeldon/philippines-json-maps,
  PSGC 2023), projected to SVG paths by `web/scripts/build-barangay-paths.mjs` into
  `web/src/lib/barangayPaths.json`. A test fails if the two drift apart. The map carries
  the attribution `data/mati/CLAUDE.md` requires.
