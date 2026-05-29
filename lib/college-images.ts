export const collegeImageTitleOverrides: Record<string, string> = {
  "aiims-delhi": "All India Institute of Medical Sciences, New Delhi",
  "bits-pilani": "Birla Institute of Technology and Science, Pilani",
  "delhi-university-srcc": "Shri Ram College of Commerce",
  "iit-bhu-varanasi": "Indian Institute of Technology (BHU) Varanasi",
  "iit-ism-dhanbad": "Indian Institute of Technology (Indian School of Mines) Dhanbad",
  "manipal-institute-of-technology": "Manipal Institute of Technology",
  "mnnit-allahabad": "Motilal Nehru National Institute of Technology Allahabad",
  "nit-karnataka-surathkal": "National Institute of Technology Karnataka",
  "nit-trichy": "National Institute of Technology, Tiruchirappalli",
  "srm-ist-chennai": "SRM Institute of Science and Technology",
  "svnit-surat": "Sardar Vallabhbhai National Institute of Technology, Surat",
  "vit-vellore": "Vellore Institute of Technology",
  "vnit-nagpur": "Visvesvaraya National Institute of Technology Nagpur"
};

export const collegeDirectImageOverrides: Record<string, string> = {
  "bits-pilani":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20View%20BITS%20Pilani%2C%202014%20(cropped).png",
  "iit-bombay":
    "https://commons.wikimedia.org/wiki/Special:FilePath/IITCampusPano.JPG",
  "iit-delhi":
    "https://commons.wikimedia.org/wiki/Special:FilePath/IIT%20Delhi%20campus.jpg",
  "nit-trichy":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Clock%20Tower%20NITT.jpg"
};

export function collegeImagePath(slug: string) {
  if (collegeDirectImageOverrides[slug]) {
    return collegeDirectImageOverrides[slug];
  }

  return `/api/college-images/${slug}`;
}

export function fallbackCollegeSvg(title: string) {
  const safeTitle = escapeXml(title);
  const initials = title
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 4)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f6070"/>
      <stop offset="55%" stop-color="#1c2430"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="700" fill="url(#bg)"/>
  <rect x="70" y="70" width="1060" height="560" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
  <text x="600" y="320" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="700" fill="#ffffff">${escapeXml(initials || "CD")}</text>
  <text x="600" y="395" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff">${safeTitle}</text>
  <text x="600" y="448" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#d9e0ea">Verified image unavailable</text>
</svg>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
