import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { collegeImagePath } from "../lib/college-images";

const prisma = new PrismaClient();

const colleges = [
  {
    slug: "iit-delhi",
    name: "Indian Institute of Technology Delhi",
    type: "Public",
    city: "New Delhi",
    state: "Delhi",
    establishedYear: 1961,
    accreditation: "Institute of National Importance",
    overview:
      "IIT Delhi is one of India's strongest engineering institutes, known for research, startup culture, and high placement outcomes across core and technology roles.",
    website: "https://home.iitd.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    feeMin: 220000,
    feeMax: 250000,
    rating: 4.8,
    reviewCount: 612,
    placementRate: 91,
    averagePackage: 22.1,
    highestPackage: 82,
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Tata Steel"],
    examsAccepted: ["JEE Advanced", "GATE"],
    tags: ["Engineering", "Research", "Public", "Top Ranked"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 240000,
        seats: 95,
        exam: "JEE Advanced",
        closingRank: 115
      },
      {
        name: "Electrical Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 240000,
        seats: 110,
        exam: "JEE Advanced",
        closingRank: 590
      }
    ],
    reviews: [
      {
        author: "Aarav Sharma",
        rating: 5,
        title: "Excellent academic pressure with real outcomes",
        body: "The workload is intense, but the peer group, labs, and placement support make it worth it."
      },
      {
        author: "Nisha Rao",
        rating: 4,
        title: "Great for research and startups",
        body: "Professors are approachable if you take initiative. Clubs and incubation support are very strong."
      }
    ]
  },
  {
    slug: "iit-bombay",
    name: "Indian Institute of Technology Bombay",
    type: "Public",
    city: "Mumbai",
    state: "Maharashtra",
    establishedYear: 1958,
    accreditation: "Institute of National Importance",
    overview:
      "IIT Bombay combines elite engineering programs with a strong startup and technology ecosystem in Mumbai.",
    website: "https://www.iitb.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    feeMin: 230000,
    feeMax: 260000,
    rating: 4.9,
    reviewCount: 740,
    placementRate: 93,
    averagePackage: 23.7,
    highestPackage: 90,
    topRecruiters: ["Apple", "Google", "Jane Street", "Reliance"],
    examsAccepted: ["JEE Advanced", "GATE"],
    tags: ["Engineering", "Startup", "Public", "Top Ranked"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 250000,
        seats: 110,
        exam: "JEE Advanced",
        closingRank: 67
      },
      {
        name: "Mechanical Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 240000,
        seats: 150,
        exam: "JEE Advanced",
        closingRank: 1750
      }
    ],
    reviews: [
      {
        author: "Kabir Mehta",
        rating: 5,
        title: "Best mix of campus and career",
        body: "Placement opportunities are excellent and the Mumbai location helps with internships."
      },
      {
        author: "Riya Nair",
        rating: 5,
        title: "Strong peer learning",
        body: "You learn as much from classmates and clubs as you do from courses."
      }
    ]
  },
  {
    slug: "nit-trichy",
    name: "National Institute of Technology Tiruchirappalli",
    type: "Public",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    establishedYear: 1964,
    accreditation: "Institute of National Importance",
    overview:
      "NIT Trichy is a leading NIT with strong engineering placements, disciplined academics, and a large alumni network.",
    website: "https://www.nitt.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
    feeMin: 165000,
    feeMax: 190000,
    rating: 4.6,
    reviewCount: 534,
    placementRate: 88,
    averagePackage: 15.8,
    highestPackage: 52,
    topRecruiters: ["Amazon", "Oracle", "Larsen and Toubro", "Deloitte"],
    examsAccepted: ["JEE Main", "GATE"],
    tags: ["Engineering", "Public", "NIT", "Value"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 180000,
        seats: 120,
        exam: "JEE Main",
        closingRank: 980
      },
      {
        name: "Electronics and Communication",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 175000,
        seats: 120,
        exam: "JEE Main",
        closingRank: 4200
      }
    ],
    reviews: [
      {
        author: "Vikram S",
        rating: 5,
        title: "Very strong return on investment",
        body: "Fees are manageable and the placements are consistently strong for circuit branches."
      },
      {
        author: "Meera Iyer",
        rating: 4,
        title: "Balanced campus life",
        body: "Academics are serious, but festivals and clubs keep the experience healthy."
      }
    ]
  },
  {
    slug: "bits-pilani",
    name: "BITS Pilani",
    type: "Private",
    city: "Pilani",
    state: "Rajasthan",
    establishedYear: 1964,
    accreditation: "Deemed University",
    overview:
      "BITS Pilani is a private engineering university known for flexible academics, no attendance pressure, and strong technology placements.",
    website: "https://www.bits-pilani.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    feeMin: 540000,
    feeMax: 610000,
    rating: 4.7,
    reviewCount: 490,
    placementRate: 89,
    averagePackage: 18.4,
    highestPackage: 60,
    topRecruiters: ["Adobe", "Nvidia", "Swiggy", "Texas Instruments"],
    examsAccepted: ["BITSAT"],
    tags: ["Engineering", "Private", "Flexible Curriculum", "Startup"],
    courses: [
      {
        name: "Computer Science",
        degree: "B.E.",
        duration: "4 years",
        annualFee: 590000,
        seats: 160,
        exam: "BITSAT",
        closingRank: 330
      },
      {
        name: "Electronics and Instrumentation",
        degree: "B.E.",
        duration: "4 years",
        annualFee: 570000,
        seats: 130,
        exam: "BITSAT",
        closingRank: 1250
      }
    ],
    reviews: [
      {
        author: "Devansh Gupta",
        rating: 5,
        title: "Freedom with responsibility",
        body: "The academic flexibility is amazing, but you need discipline to use it well."
      },
      {
        author: "Tanvi Jain",
        rating: 4,
        title: "Expensive but strong outcomes",
        body: "Fees are high, yet internships and placements are impressive for software roles."
      }
    ]
  },
  {
    slug: "vit-vellore",
    name: "Vellore Institute of Technology",
    type: "Private",
    city: "Vellore",
    state: "Tamil Nadu",
    establishedYear: 1984,
    accreditation: "NAAC A++",
    overview:
      "VIT Vellore offers a large engineering ecosystem with flexible course registration, broad recruiter access, and multiple admission categories.",
    website: "https://vit.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=80",
    feeMin: 198000,
    feeMax: 495000,
    rating: 4.2,
    reviewCount: 826,
    placementRate: 82,
    averagePackage: 9.9,
    highestPackage: 44,
    topRecruiters: ["TCS", "Infosys", "Microsoft", "Wipro"],
    examsAccepted: ["VITEEE"],
    tags: ["Engineering", "Private", "Large Campus", "Flexible Credits"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 320000,
        seats: 720,
        exam: "VITEEE",
        closingRank: 7000
      },
      {
        name: "Information Technology",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 280000,
        seats: 360,
        exam: "VITEEE",
        closingRank: 14500
      }
    ],
    reviews: [
      {
        author: "Karthik R",
        rating: 4,
        title: "Good for students who stay proactive",
        body: "The batch size is large, so you need to build projects and network early."
      },
      {
        author: "Sneha P",
        rating: 4,
        title: "Many recruiters visit",
        body: "Placement process is competitive, but opportunities exist across many companies."
      }
    ]
  },
  {
    slug: "manipal-institute-of-technology",
    name: "Manipal Institute of Technology",
    type: "Private",
    city: "Manipal",
    state: "Karnataka",
    establishedYear: 1957,
    accreditation: "NAAC A++",
    overview:
      "MIT Manipal is known for project culture, strong campus life, and private engineering programs across core and software branches.",
    website: "https://manipal.edu/mit.html",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    feeMin: 335000,
    feeMax: 465000,
    rating: 4.3,
    reviewCount: 410,
    placementRate: 78,
    averagePackage: 10.6,
    highestPackage: 48,
    topRecruiters: ["Dell", "Mercedes-Benz", "Oracle", "Philips"],
    examsAccepted: ["MET"],
    tags: ["Engineering", "Private", "Projects", "Campus Life"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 455000,
        seats: 300,
        exam: "MET",
        closingRank: 1800
      },
      {
        name: "Data Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 430000,
        seats: 180,
        exam: "MET",
        closingRank: 3300
      }
    ],
    reviews: [
      {
        author: "Ananya Hegde",
        rating: 4,
        title: "Project culture is strong",
        body: "Student teams and labs are useful if you want hands-on engineering work."
      },
      {
        author: "Rahul Menon",
        rating: 4,
        title: "Campus life stands out",
        body: "Academics are good and the campus environment is one of the biggest strengths."
      }
    ]
  },
  {
    slug: "srm-ist-chennai",
    name: "SRM Institute of Science and Technology",
    type: "Private",
    city: "Chennai",
    state: "Tamil Nadu",
    establishedYear: 1985,
    accreditation: "NAAC A++",
    overview:
      "SRM IST offers a broad range of engineering and science programs with a large recruiter network and practical campus infrastructure.",
    website: "https://www.srmist.edu.in",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
    feeMin: 250000,
    feeMax: 475000,
    rating: 4.0,
    reviewCount: 690,
    placementRate: 75,
    averagePackage: 8.2,
    highestPackage: 42,
    topRecruiters: ["Cognizant", "Amazon", "TCS", "Capgemini"],
    examsAccepted: ["SRMJEEE"],
    tags: ["Engineering", "Private", "Chennai", "Large Campus"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 375000,
        seats: 600,
        exam: "SRMJEEE",
        closingRank: 9000
      },
      {
        name: "Artificial Intelligence",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 420000,
        seats: 240,
        exam: "SRMJEEE",
        closingRank: 12500
      }
    ],
    reviews: [
      {
        author: "Pranav B",
        rating: 4,
        title: "Good infrastructure",
        body: "The campus has solid labs and a steady placement process for students who prepare early."
      },
      {
        author: "Ishita Roy",
        rating: 3,
        title: "Large batch size",
        body: "There are opportunities, but you must be self-driven because many students compete."
      }
    ]
  },
  {
    slug: "delhi-university-srcc",
    name: "Shri Ram College of Commerce",
    type: "Public",
    city: "New Delhi",
    state: "Delhi",
    establishedYear: 1926,
    accreditation: "NAAC A++",
    overview:
      "SRCC is one of India's most selective commerce colleges, known for finance placements, societies, and alumni outcomes.",
    website: "https://www.srcc.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    feeMin: 45000,
    feeMax: 70000,
    rating: 4.7,
    reviewCount: 384,
    placementRate: 84,
    averagePackage: 13.2,
    highestPackage: 35,
    topRecruiters: ["McKinsey", "Bain", "Deloitte", "KPMG"],
    examsAccepted: ["CUET"],
    tags: ["Commerce", "Public", "Finance", "Delhi University"],
    courses: [
      {
        name: "Commerce Honours",
        degree: "B.Com",
        duration: "3 years",
        annualFee: 55000,
        seats: 626,
        exam: "CUET",
        closingRank: 250
      },
      {
        name: "Economics Honours",
        degree: "B.A.",
        duration: "3 years",
        annualFee: 56000,
        seats: 123,
        exam: "CUET",
        closingRank: 180
      }
    ],
    reviews: [
      {
        author: "Simran Kaur",
        rating: 5,
        title: "Best for commerce",
        body: "Societies, alumni, and placement prep are excellent for finance and consulting."
      },
      {
        author: "Aryan Jain",
        rating: 4,
        title: "Highly competitive",
        body: "The environment pushes you to participate beyond classes."
      }
    ]
  },
  {
    slug: "christ-university",
    name: "Christ University",
    type: "Private",
    city: "Bengaluru",
    state: "Karnataka",
    establishedYear: 1969,
    accreditation: "NAAC A+",
    overview:
      "Christ University is a multidisciplinary private university with strong programs in management, commerce, psychology, and computer applications.",
    website: "https://christuniversity.in",
    imageUrl:
      "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?auto=format&fit=crop&w=1200&q=80",
    feeMin: 125000,
    feeMax: 285000,
    rating: 4.1,
    reviewCount: 522,
    placementRate: 72,
    averagePackage: 7.1,
    highestPackage: 21,
    topRecruiters: ["Deloitte", "EY", "Accenture", "Wells Fargo"],
    examsAccepted: ["CUET", "Christ Entrance Test"],
    tags: ["Commerce", "Management", "Private", "Bengaluru"],
    courses: [
      {
        name: "Business Administration",
        degree: "BBA",
        duration: "3 years",
        annualFee: 210000,
        seats: 420,
        exam: "Christ Entrance Test",
        closingRank: 1600
      },
      {
        name: "Computer Applications",
        degree: "BCA",
        duration: "3 years",
        annualFee: 175000,
        seats: 240,
        exam: "CUET",
        closingRank: 6500
      }
    ],
    reviews: [
      {
        author: "Neel Thomas",
        rating: 4,
        title: "Structured and disciplined",
        body: "Attendance and rules are strict, but the academic process is reliable."
      },
      {
        author: "Lavanya S",
        rating: 4,
        title: "Good industry exposure",
        body: "Bengaluru location helps with internships and guest lectures."
      }
    ]
  },
  {
    slug: "nmims-mumbai",
    name: "NMIMS Mumbai",
    type: "Private",
    city: "Mumbai",
    state: "Maharashtra",
    establishedYear: 1981,
    accreditation: "NAAC A+",
    overview:
      "NMIMS Mumbai is a private university known for management, commerce, and applied technology programs with strong industry connections.",
    website: "https://www.nmims.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1532649842991-60f6a04df35c?auto=format&fit=crop&w=1200&q=80",
    feeMin: 260000,
    feeMax: 550000,
    rating: 4.2,
    reviewCount: 376,
    placementRate: 76,
    averagePackage: 8.8,
    highestPackage: 26,
    topRecruiters: ["JP Morgan", "KPMG", "ICICI Bank", "Deloitte"],
    examsAccepted: ["NPAT", "NMIMS CET"],
    tags: ["Management", "Commerce", "Private", "Mumbai"],
    courses: [
      {
        name: "Business Administration",
        degree: "BBA",
        duration: "3 years",
        annualFee: 325000,
        seats: 600,
        exam: "NPAT",
        closingRank: 1400
      },
      {
        name: "Computer Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: 420000,
        seats: 180,
        exam: "NMIMS CET",
        closingRank: 4800
      }
    ],
    reviews: [
      {
        author: "Yash Shah",
        rating: 4,
        title: "Industry network is useful",
        body: "Mumbai location and alumni network help with internships."
      },
      {
        author: "Aditi Rao",
        rating: 4,
        title: "Good for management",
        body: "Curriculum is industry-oriented and presentations are frequent."
      }
    ]
  },
  {
    slug: "aiims-delhi",
    name: "All India Institute of Medical Sciences Delhi",
    type: "Public",
    city: "New Delhi",
    state: "Delhi",
    establishedYear: 1956,
    accreditation: "Institute of National Importance",
    overview:
      "AIIMS Delhi is India's leading public medical institute with elite clinical exposure, research facilities, and low tuition fees.",
    website: "https://www.aiims.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    feeMin: 7000,
    feeMax: 12000,
    rating: 4.9,
    reviewCount: 298,
    placementRate: 96,
    averagePackage: 18,
    highestPackage: 38,
    topRecruiters: ["AIIMS Hospitals", "Fortis", "Apollo", "Research Institutes"],
    examsAccepted: ["NEET UG", "INI CET"],
    tags: ["Medical", "Public", "Research", "Top Ranked"],
    courses: [
      {
        name: "Medicine and Surgery",
        degree: "MBBS",
        duration: "5.5 years",
        annualFee: 9000,
        seats: 132,
        exam: "NEET UG",
        closingRank: 57
      },
      {
        name: "Nursing",
        degree: "B.Sc.",
        duration: "4 years",
        annualFee: 7000,
        seats: 96,
        exam: "AIIMS Nursing",
        closingRank: 900
      }
    ],
    reviews: [
      {
        author: "Drishti Verma",
        rating: 5,
        title: "Unmatched clinical exposure",
        body: "Patient diversity and faculty mentorship are exceptional."
      },
      {
        author: "Mohit Arora",
        rating: 5,
        title: "Very demanding",
        body: "It is intense from day one, but the learning curve is unmatched."
      }
    ]
  },
  {
    slug: "symbiosis-pune",
    name: "Symbiosis Institute of Computer Studies and Research",
    type: "Private",
    city: "Pune",
    state: "Maharashtra",
    establishedYear: 1985,
    accreditation: "NAAC A++",
    overview:
      "SICSR Pune offers computer applications and IT programs with a practical curriculum and access to Pune's technology ecosystem.",
    website: "https://www.sicsr.ac.in",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    feeMin: 185000,
    feeMax: 310000,
    rating: 4.0,
    reviewCount: 214,
    placementRate: 70,
    averagePackage: 6.8,
    highestPackage: 18,
    topRecruiters: ["Infosys", "Persistent", "Deloitte", "Cognizant"],
    examsAccepted: ["SET", "CUET"],
    tags: ["Computer Applications", "Private", "Pune", "IT"],
    courses: [
      {
        name: "Computer Applications",
        degree: "BCA",
        duration: "3 years",
        annualFee: 220000,
        seats: 180,
        exam: "SET",
        closingRank: 2300
      },
      {
        name: "Information Technology",
        degree: "B.Sc.",
        duration: "3 years",
        annualFee: 190000,
        seats: 120,
        exam: "CUET",
        closingRank: 7800
      }
    ],
    reviews: [
      {
        author: "Ojas Kulkarni",
        rating: 4,
        title: "Good for practical IT learning",
        body: "The curriculum includes useful project work and practical assignments."
      },
      {
        author: "Mansi Patil",
        rating: 4,
        title: "Pune ecosystem helps",
        body: "Internship access is better because many technology companies are nearby."
      }
    ]
  }
];

const sourceUrls = {
  iit: "https://www.education.gov.in/en/iits",
  nit: "https://www.education.gov.in/en/node/2545",
  iiit: "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/list_iiits.pdf",
  nirf: "https://www.nirfindia.org/Rankings/2025/EngineeringRanking.html"
};

const directoryInstitutes = [
  { group: "IIT", slug: "iit-madras", name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu", establishedYear: 1959, website: "https://www.iitm.ac.in" },
  { group: "IIT", slug: "iit-kanpur", name: "Indian Institute of Technology Kanpur", city: "Kanpur", state: "Uttar Pradesh", establishedYear: 1959, website: "https://www.iitk.ac.in" },
  { group: "IIT", slug: "iit-kharagpur", name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", state: "West Bengal", establishedYear: 1951, website: "https://www.iitkgp.ac.in" },
  { group: "IIT", slug: "iit-roorkee", name: "Indian Institute of Technology Roorkee", city: "Roorkee", state: "Uttarakhand", establishedYear: 1847, website: "https://www.iitr.ac.in" },
  { group: "IIT", slug: "iit-guwahati", name: "Indian Institute of Technology Guwahati", city: "Guwahati", state: "Assam", establishedYear: 1994, website: "https://www.iitg.ac.in" },
  { group: "IIT", slug: "iit-hyderabad", name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", state: "Telangana", establishedYear: 2008, website: "https://www.iith.ac.in" },
  { group: "IIT", slug: "iit-bhu-varanasi", name: "Indian Institute of Technology BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh", establishedYear: 1919, website: "https://www.iitbhu.ac.in" },
  { group: "IIT", slug: "iit-ism-dhanbad", name: "Indian Institute of Technology Indian School of Mines Dhanbad", city: "Dhanbad", state: "Jharkhand", establishedYear: 1926, website: "https://www.iitism.ac.in" },
  { group: "IIT", slug: "iit-indore", name: "Indian Institute of Technology Indore", city: "Indore", state: "Madhya Pradesh", establishedYear: 2009, website: "https://www.iiti.ac.in" },
  { group: "IIT", slug: "iit-mandi", name: "Indian Institute of Technology Mandi", city: "Mandi", state: "Himachal Pradesh", establishedYear: 2009, website: "https://www.iitmandi.ac.in" },
  { group: "IIT", slug: "iit-jodhpur", name: "Indian Institute of Technology Jodhpur", city: "Jodhpur", state: "Rajasthan", establishedYear: 2008, website: "https://www.iitj.ac.in" },
  { group: "IIT", slug: "iit-gandhinagar", name: "Indian Institute of Technology Gandhinagar", city: "Gandhinagar", state: "Gujarat", establishedYear: 2008, website: "https://www.iitgn.ac.in" },
  { group: "IIT", slug: "iit-patna", name: "Indian Institute of Technology Patna", city: "Patna", state: "Bihar", establishedYear: 2008, website: "https://www.iitp.ac.in" },
  { group: "IIT", slug: "iit-bhubaneswar", name: "Indian Institute of Technology Bhubaneswar", city: "Bhubaneswar", state: "Odisha", establishedYear: 2008, website: "https://www.iitbbs.ac.in" },
  { group: "IIT", slug: "iit-ropar", name: "Indian Institute of Technology Ropar", city: "Rupnagar", state: "Punjab", establishedYear: 2008, website: "https://www.iitrpr.ac.in" },
  { group: "IIT", slug: "iit-tirupati", name: "Indian Institute of Technology Tirupati", city: "Tirupati", state: "Andhra Pradesh", establishedYear: 2015, website: "https://www.iittp.ac.in" },
  { group: "IIT", slug: "iit-palakkad", name: "Indian Institute of Technology Palakkad", city: "Palakkad", state: "Kerala", establishedYear: 2015, website: "https://www.iitpkd.ac.in" },
  { group: "IIT", slug: "iit-goa", name: "Indian Institute of Technology Goa", city: "Ponda", state: "Goa", establishedYear: 2016, website: "https://www.iitgoa.ac.in" },
  { group: "IIT", slug: "iit-jammu", name: "Indian Institute of Technology Jammu", city: "Jammu", state: "Jammu and Kashmir", establishedYear: 2016, website: "https://www.iitjammu.ac.in" },
  { group: "IIT", slug: "iit-dharwad", name: "Indian Institute of Technology Dharwad", city: "Dharwad", state: "Karnataka", establishedYear: 2016, website: "https://www.iitdh.ac.in" },
  { group: "IIT", slug: "iit-bhilai", name: "Indian Institute of Technology Bhilai", city: "Bhilai", state: "Chhattisgarh", establishedYear: 2016, website: "https://www.iitbhilai.ac.in" },

  { group: "NIT", slug: "nit-karnataka-surathkal", name: "National Institute of Technology Karnataka Surathkal", city: "Surathkal", state: "Karnataka", establishedYear: 1960 },
  { group: "NIT", slug: "nit-warangal", name: "National Institute of Technology Warangal", city: "Warangal", state: "Telangana", establishedYear: 1959 },
  { group: "NIT", slug: "nit-rourkela", name: "National Institute of Technology Rourkela", city: "Rourkela", state: "Odisha", establishedYear: 1961 },
  { group: "NIT", slug: "nit-calicut", name: "National Institute of Technology Calicut", city: "Kozhikode", state: "Kerala", establishedYear: 1961 },
  { group: "NIT", slug: "nit-jamshedpur", name: "National Institute of Technology Jamshedpur", city: "Jamshedpur", state: "Jharkhand", establishedYear: 1960 },
  { group: "NIT", slug: "nit-kurukshetra", name: "National Institute of Technology Kurukshetra", city: "Kurukshetra", state: "Haryana", establishedYear: 1963 },
  { group: "NIT", slug: "nit-durgapur", name: "National Institute of Technology Durgapur", city: "Durgapur", state: "West Bengal", establishedYear: 1960 },
  { group: "NIT", slug: "mnnit-allahabad", name: "Motilal Nehru National Institute of Technology Allahabad", city: "Prayagraj", state: "Uttar Pradesh", establishedYear: 1961 },
  { group: "NIT", slug: "manit-bhopal", name: "Maulana Azad National Institute of Technology Bhopal", city: "Bhopal", state: "Madhya Pradesh", establishedYear: 1960 },
  { group: "NIT", slug: "vnit-nagpur", name: "Visvesvaraya National Institute of Technology Nagpur", city: "Nagpur", state: "Maharashtra", establishedYear: 1960 },
  { group: "NIT", slug: "svnit-surat", name: "Sardar Vallabhbhai National Institute of Technology Surat", city: "Surat", state: "Gujarat", establishedYear: 1961 },
  { group: "NIT", slug: "nit-silchar", name: "National Institute of Technology Silchar", city: "Silchar", state: "Assam", establishedYear: 1967 },
  { group: "NIT", slug: "nit-hamirpur", name: "National Institute of Technology Hamirpur", city: "Hamirpur", state: "Himachal Pradesh", establishedYear: 1986 },
  { group: "NIT", slug: "nit-jalandhar", name: "Dr. B. R. Ambedkar National Institute of Technology Jalandhar", city: "Jalandhar", state: "Punjab", establishedYear: 1987 },
  { group: "NIT", slug: "mnit-jaipur", name: "Malaviya National Institute of Technology Jaipur", city: "Jaipur", state: "Rajasthan", establishedYear: 1963 },
  { group: "NIT", slug: "nit-patna", name: "National Institute of Technology Patna", city: "Patna", state: "Bihar", establishedYear: 1886 },
  { group: "NIT", slug: "nit-raipur", name: "National Institute of Technology Raipur", city: "Raipur", state: "Chhattisgarh", establishedYear: 1956 },
  { group: "NIT", slug: "nit-agartala", name: "National Institute of Technology Agartala", city: "Agartala", state: "Tripura", establishedYear: 1965 },
  { group: "NIT", slug: "nit-arunachal-pradesh", name: "National Institute of Technology Arunachal Pradesh", city: "Yupia", state: "Arunachal Pradesh", establishedYear: 2010 },
  { group: "NIT", slug: "nit-delhi", name: "National Institute of Technology Delhi", city: "New Delhi", state: "Delhi", establishedYear: 2010 },
  { group: "NIT", slug: "nit-goa", name: "National Institute of Technology Goa", city: "Ponda", state: "Goa", establishedYear: 2010 },
  { group: "NIT", slug: "nit-manipur", name: "National Institute of Technology Manipur", city: "Imphal", state: "Manipur", establishedYear: 2010 },
  { group: "NIT", slug: "nit-meghalaya", name: "National Institute of Technology Meghalaya", city: "Shillong", state: "Meghalaya", establishedYear: 2010 },
  { group: "NIT", slug: "nit-mizoram", name: "National Institute of Technology Mizoram", city: "Aizawl", state: "Mizoram", establishedYear: 2010 },
  { group: "NIT", slug: "nit-nagaland", name: "National Institute of Technology Nagaland", city: "Chumoukedima", state: "Nagaland", establishedYear: 2010 },
  { group: "NIT", slug: "nit-puducherry", name: "National Institute of Technology Puducherry", city: "Karaikal", state: "Puducherry", establishedYear: 2010 },
  { group: "NIT", slug: "nit-sikkim", name: "National Institute of Technology Sikkim", city: "Ravangla", state: "Sikkim", establishedYear: 2010 },
  { group: "NIT", slug: "nit-uttarakhand", name: "National Institute of Technology Uttarakhand", city: "Srinagar", state: "Uttarakhand", establishedYear: 2009 },
  { group: "NIT", slug: "nit-andhra-pradesh", name: "National Institute of Technology Andhra Pradesh", city: "Tadepalligudem", state: "Andhra Pradesh", establishedYear: 2015 },
  { group: "NIT", slug: "nit-srinagar", name: "National Institute of Technology Srinagar", city: "Srinagar", state: "Jammu and Kashmir", establishedYear: 1960 },
  { group: "NIT", slug: "iiest-shibpur", name: "Indian Institute of Engineering Science and Technology Shibpur", city: "Howrah", state: "West Bengal", establishedYear: 1856 },

  { group: "IIIT", slug: "abv-iiitm-gwalior", name: "Atal Bihari Vajpayee Indian Institute of Information Technology and Management Gwalior", city: "Gwalior", state: "Madhya Pradesh", establishedYear: 1997 },
  { group: "IIIT", slug: "iiit-allahabad", name: "Indian Institute of Information Technology Allahabad", city: "Prayagraj", state: "Uttar Pradesh", establishedYear: 1999 },
  { group: "IIIT", slug: "iiitdm-jabalpur", name: "Indian Institute of Information Technology Design and Manufacturing Jabalpur", city: "Jabalpur", state: "Madhya Pradesh", establishedYear: 2005 },
  { group: "IIIT", slug: "iiitdm-kancheepuram", name: "Indian Institute of Information Technology Design and Manufacturing Kancheepuram", city: "Chennai", state: "Tamil Nadu", establishedYear: 2007 },
  { group: "IIIT", slug: "iiit-sri-city", name: "Indian Institute of Information Technology Sri City", city: "Sri City", state: "Andhra Pradesh", establishedYear: 2013 },
  { group: "IIIT", slug: "iiit-guwahati", name: "Indian Institute of Information Technology Guwahati", city: "Guwahati", state: "Assam", establishedYear: 2013 },
  { group: "IIIT", slug: "iiit-vadodara", name: "Indian Institute of Information Technology Vadodara", city: "Gandhinagar", state: "Gujarat", establishedYear: 2013 },
  { group: "IIIT", slug: "iiit-kota", name: "Indian Institute of Information Technology Kota", city: "Kota", state: "Rajasthan", establishedYear: 2013 },
  { group: "IIIT", slug: "iiit-tiruchirappalli", name: "Indian Institute of Information Technology Tiruchirappalli", city: "Tiruchirappalli", state: "Tamil Nadu", establishedYear: 2013 },
  { group: "IIIT", slug: "iiit-una", name: "Indian Institute of Information Technology Una", city: "Una", state: "Himachal Pradesh", establishedYear: 2014 },
  { group: "IIIT", slug: "iiit-sonepat", name: "Indian Institute of Information Technology Sonepat", city: "Sonepat", state: "Haryana", establishedYear: 2014 },
  { group: "IIIT", slug: "iiit-kalyani", name: "Indian Institute of Information Technology Kalyani", city: "Kalyani", state: "West Bengal", establishedYear: 2014 },
  { group: "IIIT", slug: "iiit-lucknow", name: "Indian Institute of Information Technology Lucknow", city: "Lucknow", state: "Uttar Pradesh", establishedYear: 2015 },
  { group: "IIIT", slug: "iiit-dharwad", name: "Indian Institute of Information Technology Dharwad", city: "Dharwad", state: "Karnataka", establishedYear: 2015 },
  { group: "IIIT", slug: "iiit-design-manufacturing-kurnool", name: "Indian Institute of Information Technology Design and Manufacturing Kurnool", city: "Kurnool", state: "Andhra Pradesh", establishedYear: 2015 },
  { group: "IIIT", slug: "iiit-kottayam", name: "Indian Institute of Information Technology Kottayam", city: "Kottayam", state: "Kerala", establishedYear: 2015 },
  { group: "IIIT", slug: "iiit-manipur", name: "Indian Institute of Information Technology Manipur", city: "Imphal", state: "Manipur", establishedYear: 2015 },
  { group: "IIIT", slug: "iiit-nagpur", name: "Indian Institute of Information Technology Nagpur", city: "Nagpur", state: "Maharashtra", establishedYear: 2016 },
  { group: "IIIT", slug: "iiit-pune", name: "Indian Institute of Information Technology Pune", city: "Pune", state: "Maharashtra", establishedYear: 2016 },
  { group: "IIIT", slug: "iiit-ranchi", name: "Indian Institute of Information Technology Ranchi", city: "Ranchi", state: "Jharkhand", establishedYear: 2016 },
  { group: "IIIT", slug: "iiit-surat", name: "Indian Institute of Information Technology Surat", city: "Surat", state: "Gujarat", establishedYear: 2017 },
  { group: "IIIT", slug: "iiit-bhopal", name: "Indian Institute of Information Technology Bhopal", city: "Bhopal", state: "Madhya Pradesh", establishedYear: 2017 },
  { group: "IIIT", slug: "iiit-bhagalpur", name: "Indian Institute of Information Technology Bhagalpur", city: "Bhagalpur", state: "Bihar", establishedYear: 2017 },
  { group: "IIIT", slug: "iiit-agartala", name: "Indian Institute of Information Technology Agartala", city: "Agartala", state: "Tripura", establishedYear: 2018 },
  { group: "IIIT", slug: "iiit-raichur", name: "Indian Institute of Information Technology Raichur", city: "Raichur", state: "Karnataka", establishedYear: 2019 },

  { group: "PRIVATE", slug: "amrita-vishwa-vidyapeetham", name: "Amrita Vishwa Vidyapeetham", city: "Coimbatore", state: "Tamil Nadu", establishedYear: 1994 },
  { group: "PRIVATE", slug: "thapar-institute-of-engineering-and-technology", name: "Thapar Institute of Engineering and Technology", city: "Patiala", state: "Punjab", establishedYear: 1956 },
  { group: "PRIVATE", slug: "siksha-o-anusandhan", name: "Siksha 'O' Anusandhan", city: "Bhubaneswar", state: "Odisha", establishedYear: 1996 },
  { group: "PRIVATE", slug: "chandigarh-university", name: "Chandigarh University", city: "Mohali", state: "Punjab", establishedYear: 2012 },
  { group: "PRIVATE", slug: "kl-university", name: "Koneru Lakshmaiah Education Foundation", city: "Vaddeswaram", state: "Andhra Pradesh", establishedYear: 1980 },
  { group: "PRIVATE", slug: "kalasalingam-academy", name: "Kalasalingam Academy of Research and Education", city: "Krishnan Koil", state: "Tamil Nadu", establishedYear: 1984 },
  { group: "PRIVATE", slug: "sastra-deemed-university", name: "SASTRA Deemed University", city: "Thanjavur", state: "Tamil Nadu", establishedYear: 1984 },
  { group: "PRIVATE", slug: "shiv-nadar-university", name: "Shiv Nadar University", city: "Greater Noida", state: "Uttar Pradesh", establishedYear: 2011 },
  { group: "PRIVATE", slug: "upes-dehradun", name: "University of Petroleum and Energy Studies", city: "Dehradun", state: "Uttarakhand", establishedYear: 2003 },
  { group: "PRIVATE", slug: "lovely-professional-university", name: "Lovely Professional University", city: "Phagwara", state: "Punjab", establishedYear: 2005 },
  { group: "PRIVATE", slug: "amity-university-noida", name: "Amity University Noida", city: "Noida", state: "Uttar Pradesh", establishedYear: 2005 },
  { group: "PRIVATE", slug: "nirma-university", name: "Nirma University", city: "Ahmedabad", state: "Gujarat", establishedYear: 2003 },
  { group: "PRIVATE", slug: "gitam-visakhapatnam", name: "Gandhi Institute of Technology and Management", city: "Visakhapatnam", state: "Andhra Pradesh", establishedYear: 1980 },
  { group: "PRIVATE", slug: "kiit-bhubaneswar", name: "Kalinga Institute of Industrial Technology", city: "Bhubaneswar", state: "Odisha", establishedYear: 1992 },
  { group: "PRIVATE", slug: "lnmiit-jaipur", name: "The LNM Institute of Information Technology", city: "Jaipur", state: "Rajasthan", establishedYear: 2002 },
  { group: "PRIVATE", slug: "daiict-gandhinagar", name: "Dhirubhai Ambani Institute of Information and Communication Technology", city: "Gandhinagar", state: "Gujarat", establishedYear: 2001 },
  { group: "PRIVATE", slug: "pes-university", name: "PES University", city: "Bengaluru", state: "Karnataka", establishedYear: 1988 },
  { group: "PRIVATE", slug: "rv-college-of-engineering", name: "R. V. College of Engineering", city: "Bengaluru", state: "Karnataka", establishedYear: 1963 },
  { group: "PRIVATE", slug: "bms-college-of-engineering", name: "BMS College of Engineering", city: "Bengaluru", state: "Karnataka", establishedYear: 1946 },
  { group: "PRIVATE", slug: "ramaiah-institute-of-technology", name: "Ramaiah Institute of Technology", city: "Bengaluru", state: "Karnataka", establishedYear: 1962 },
  { group: "PRIVATE", slug: "ssn-college-of-engineering", name: "Sri Sivasubramaniya Nadar College of Engineering", city: "Chennai", state: "Tamil Nadu", establishedYear: 1996 },
  { group: "PRIVATE", slug: "psg-college-of-technology", name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu", establishedYear: 1951 },
  { group: "PRIVATE", slug: "sathyabama-institute", name: "Sathyabama Institute of Science and Technology", city: "Chennai", state: "Tamil Nadu", establishedYear: 1987 },
  { group: "PRIVATE", slug: "hindustan-institute-of-technology-and-science", name: "Hindustan Institute of Technology and Science", city: "Chennai", state: "Tamil Nadu", establishedYear: 1985 },
  { group: "PRIVATE", slug: "bit-mesra", name: "Birla Institute of Technology Mesra", city: "Ranchi", state: "Jharkhand", establishedYear: 1955 },
  { group: "PRIVATE", slug: "jaypee-institute-of-information-technology", name: "Jaypee Institute of Information Technology", city: "Noida", state: "Uttar Pradesh", establishedYear: 2001 }
] as const;

function buildDirectoryCollege(
  institute: (typeof directoryInstitutes)[number],
  index: number
) {
  const isPrivate = institute.group === "PRIVATE";
  const isIiit = institute.group === "IIIT";
  const feeMin = isPrivate ? 240000 + (index % 7) * 25000 : isIiit ? 190000 : 155000;
  const feeMax = feeMin + (isPrivate ? 160000 : 65000);
  const averagePackage = isPrivate
    ? 7 + (index % 8) * 0.7
    : isIiit
      ? 10 + (index % 8) * 0.8
      : institute.group === "IIT"
        ? 17 + (index % 8) * 0.9
        : 11 + (index % 8) * 0.7;
  const rating = Number((isPrivate ? 3.9 + (index % 6) * 0.1 : 4.1 + (index % 7) * 0.1).toFixed(1));
  const exam = isPrivate ? "JEE Main" : institute.group === "IIT" ? "JEE Advanced" : "JEE Main";
  const closingRankBase = institute.group === "IIT" ? 350 + index * 220 : institute.group === "NIT" ? 2500 + index * 900 : institute.group === "IIIT" ? 3500 + index * 1100 : 12000 + index * 1400;
  const sourceUrl = institute.group === "IIT" ? sourceUrls.iit : institute.group === "NIT" ? sourceUrls.nit : institute.group === "IIIT" ? sourceUrls.iiit : sourceUrls.nirf;

  return {
    slug: institute.slug,
    name: institute.name,
    type: isPrivate ? "Private" : "Public",
    city: institute.city,
    state: institute.state,
    establishedYear: institute.establishedYear,
    accreditation: isPrivate ? "NIRF-listed / Recognized Institution" : "Institute of National Importance",
    overview: `${institute.name} is included in the expanded college directory for discovery, filtering, comparison, and predictor workflows. Institution identity and location are seeded from official public institute directories; fees and placement fields are demo MVP values until official annual reports are imported.`,
    website: "website" in institute ? institute.website : sourceUrl,
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    feeMin,
    feeMax,
    rating,
    reviewCount: 80 + index * 3,
    placementRate: Math.min(94, Math.round(68 + averagePackage)),
    averagePackage: Number(averagePackage.toFixed(1)),
    highestPackage: Number((averagePackage * 2.8).toFixed(1)),
    topRecruiters: isPrivate
      ? ["TCS", "Infosys", "Deloitte", "Accenture"]
      : ["Google", "Microsoft", "Amazon", "Deloitte"],
    examsAccepted: [exam],
    tags: [institute.group, isPrivate ? "Private" : "Public", "Expanded Directory"],
    courses: [
      {
        name: "Computer Science and Engineering",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: feeMin,
        seats: isPrivate ? 240 : 120,
        exam,
        closingRank: closingRankBase
      },
      {
        name: isIiit ? "Electronics and Communication" : "Artificial Intelligence",
        degree: "B.Tech",
        duration: "4 years",
        annualFee: feeMin + 15000,
        seats: isPrivate ? 180 : 90,
        exam,
        closingRank: closingRankBase + 2200
      }
    ],
    reviews: [
      {
        author: "Seeded Student",
        rating: Math.min(5, Math.round(rating)),
        title: "Useful directory profile",
        body:
          "This profile is part of the expanded seeded dataset used to test search, comparison, predictor, reviews, and saved colleges."
      }
    ]
  };
}

const existingSlugs = new Set(colleges.map((college) => college.slug));
const generatedColleges = directoryInstitutes
  .filter((institute) => !existingSlugs.has(institute.slug))
  .map(buildDirectoryCollege);
const allColleges = [...colleges, ...generatedColleges];

async function main() {
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "demo@student.com",
      passwordHash: await bcrypt.hash("Password@123", 12)
    }
  });

  const createdColleges = [];

  for (const college of allColleges) {
    const { courses, reviews, ...collegeData } = college;
    const createdCollege = await prisma.college.create({
      data: {
        ...collegeData,
        imageUrl: collegeImagePath(collegeData.slug),
        courses: {
          create: courses
        },
        reviews: {
          create: reviews
        }
      }
    });

    createdColleges.push(createdCollege);
  }

  await prisma.savedCollege.createMany({
    data: createdColleges.slice(0, 3).map((college) => ({
      userId: demoUser.id,
      collegeId: college.id
    }))
  });

  console.log(
    `Seed complete. ${allColleges.length} colleges loaded. Demo login: demo@student.com / Password@123`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
