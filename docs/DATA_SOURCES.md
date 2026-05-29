# Data Sources And Truthfulness

The expanded seed includes 115 colleges.

## Verified Directory Fields

The following fields are intended as directory-level data:

- institute name
- city
- state
- institute group, such as IIT, NIT, IIIT, or private

Sources used for the directory expansion:

- Ministry of Education IIT list: https://www.education.gov.in/en/iits
- Ministry of Education NIT page: https://www.education.gov.in/en/node/2545
- Ministry of Education IIIT PDF: https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/list_iiits.pdf
- NIRF Engineering Ranking 2025: https://www.nirfindia.org/Rankings/2025/EngineeringRanking.html

## Demo MVP Fields

Some fields are still generated demo values because they require separate annual official sources for every institute and every course:

- fee ranges
- placement rates
- average package
- highest package
- course closing ranks
- seeded review counts
- seeded rating

This is acceptable for an MVP demo, but in an interview you should explain it honestly:

> The product is database-backed and the directory was expanded from public sources. For production-grade truth, the next step would be importing official JoSAA opening/closing rank files, institute fee PDFs, and placement reports with source timestamps.

## Why Not Fake Full Verification?

Fees, placements, and cutoffs change every year. If we pretend all of those values are verified without importing the exact annual files, that becomes misleading. The current architecture supports real imports later because colleges and courses are already separated in the schema.

## College Images

Images are no longer generic stock photos. The app now uses:

- direct Wikimedia Commons file URLs for some high-visibility colleges such as IIT Bombay, IIT Delhi, NIT Trichy, and BITS Pilani
- a browser-side Wikipedia/Wikimedia page-image lookup for the remaining colleges
- a local generated fallback image if no verified public image can be resolved

This avoids blank cards and avoids showing the same random campus photo for every college.
