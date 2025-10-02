import { Feature, ExamData, Resources } from '../types';

export const features: Feature[] = [
  { 
    icon: "https://img.icons8.com/color/96/000000/test-passed.png", 
    title: "Mock Tests", 
    desc: "Attempt full-length and sectional mock tests designed to match real exam patterns.", 
    link: "/mock-tests" 
  },
  { 
    icon: "https://img.icons8.com/color/96/000000/globe--v1.png", 
    title: "All India Live", 
    desc: "Compete live with aspirants across India and see your national ranking instantly.", 
    link: "/live-tests" 
  },
  { 
    icon: "https://img.icons8.com/color/96/000000/questions.png", 
    title: "PYQs & Practice", 
    desc: "Practice with a vast collection of previous year questions and topic-wise quizzes.", 
    link: "/pyq" 
  },
  { 
    icon: "https://img.icons8.com/color/96/000000/calendar--v1.png", 
    title: "Exam Calendar", 
    desc: "Never miss an important date with our regularly updated exam calendar.", 
    link: "/exam-calendar" 
  },
  { 
    icon: "https://img.icons8.com/color/96/000000/books.png", 
    title: "My Library", 
    desc: "Bookmark and organize your favorite tests, notes, and resources in one place.", 
    link: "/library" 
  },
  { 
    icon: "https://img.icons8.com/color/96/000000/combo-chart--v1.png", 
    title: "Performance Analytics", 
    desc: "Track your progress, analyze strengths, and identify areas to improve.", 
    link: "/analytics" 
  },
];

export const resources: Resources = {
  "Government Exams & Jobs": [
    "SSC CGL", "SSC CHSL", "SSC CPO", "UP Police", "RRB NTPC", 
    "RRB JE", "IBPS PO", "BPSC", "RRB NTPC", "DELHI POLICE"
  ],
  "Previous Year Papers": [
    "SSC CGL Question Paper", "SSC CHSL Question Paper", "IBPS PO Question Paper", 
    "NDA Question Paper", "BPSC Question Paper", "UGC NET Question Paper", 
    "RRB JE Question Paper", "RBI Grade B Question Paper", "RRB NTPC Question Paper", 
    "SBI PO Question Paper"
  ],
  "Notes": [
    "Current Affairs", "IAS Notes", "NDA Notes", "SBI PO Notes", "CDS Notes", 
    "SSC CGL Notes", "SSC MTS Notes", "SSC CHSL Notes", "RRB ALP Notes", "RRB NTPC Notes"
  ],
};

export const examData: ExamData = {
  "SSC Exams": [
    { name: "SSC CGL (Combined Graduate Level)", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/ssc/cgl" },
    { name: "SSC CHSL (10+2)", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/ssc/chsl" },
    { name: "SSC MTS", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/ssc/mts" },
    { name: "SSC GD Constable", icon: "https://img.icons8.com/color/48/000000/police-badge.png", link: "/exam-categories/ssc/constable" },
    { name: "SSC CPO (Delhi Police, CAPF)", icon: "https://img.icons8.com/color/48/000000/police-badge.png", link: "/exam-categories/ssc/cpo" },
    { name: "SSC JE (Junior Engineer)", icon: "https://img.icons8.com/color/48/000000/engineering.png", link: "/exam-categories/ssc/je" },
  ],
  "Railways (RRB)": [
    { name: "RRB NTPC", icon: "https://img.icons8.com/color/48/000000/train.png", link: "/exam-categories/railways/ntpc" },
    { name: "RRB Group D", icon: "https://img.icons8.com/color/48/000000/train.png", link: "/exam-categories/railways/group-d" },
    { name: "RRB JE", icon: "https://img.icons8.com/color/48/000000/engineering.png", link: "/exam-categories/railways/je" },
  ],
  "Banking": [
    { name: "IBPS PO / Clerk", icon: "https://img.icons8.com/color/48/000000/bank.png", link: "/exam-categories/banking/ibps" },
    { name: "SBI PO / Clerk", icon: "https://img.icons8.com/color/48/000000/bank.png", link: "/exam-categories/banking/sbi" },
    { name: "RBI Assistant", icon: "https://img.icons8.com/color/48/000000/bank.png", link: "/exam-categories/banking/rbi" },
    { name: "IBPS RRB (Officer & Assistant)", icon: "https://img.icons8.com/color/48/000000/bank.png", link: "/exam-categories/banking/rrb" },
  ],
  "Defence": [
    { name: "Agniveer (Army/Navy/Airforce)", icon: "https://img.icons8.com/color/48/000000/soldier.png", link: "/exam-categories/defence/agniveer" },
    { name: "NDA", icon: "https://img.icons8.com/color/48/000000/military-helmet.png", link: "/exam-categories/defence/nda" },
    { name: "CDS", icon: "https://img.icons8.com/color/48/000000/army-star.png", link: "/exam-categories/defence/cds" },
    { name: "AFCAT", icon: "https://img.icons8.com/color/48/000000/airport.png", link: "/exam-categories/defence/afcat" },
  ],
  "Teaching": [
    { name: "CTET (Central Teacher Eligibility Test)", icon: "https://img.icons8.com/color/48/000000/classroom.png", link: "/exam-categories/teaching/ctet" },
    { name: "UPTET / Other State TETs", icon: "https://img.icons8.com/color/48/000000/classroom.png", link: "/exam-categories/teaching/tet" },
    { name: "Super TET", icon: "https://img.icons8.com/color/48/000000/classroom.png", link: "/exam-categories/teaching/super-tet" },
  ],
  "UPSC": [
    { name: "IAS Exam", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/ias" },
    { name: "IES", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/ies" },
    { name: "CMS", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/cms" },
    { name: "EPFO", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/epfo" },
    { name: "CAPF", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/capf" },
    { name: "Geo Scientist", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/geo-scientist" },
    { name: "IES", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/ies" },
    { name: "IFoS", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/upsc/ifos" },
  ],
  "State-Level PSC Exams": [
    { name: "UPPSC / BPSC / MPPSC / RPSC / WBPSC / etc.", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/psc/state-psc" },
    { name: "Subordinate Services (Lower PCS)", icon: "https://img.icons8.com/color/48/000000/india.png", link: "/exam-categories/psc/lower-pcs" },
  ],
  "Police Recruitment": [
    { name: "UP Police (SI/Constable)", icon: "https://img.icons8.com/color/48/000000/police-badge.png", link: "/exam-categories/police/up-police" },
    { name: "Delhi Police Constable", icon: "https://img.icons8.com/color/48/000000/police-badge.png", link: "/exam-categories/police/delhi-police" },
    { name: "State-wise Police Exams", icon: "https://img.icons8.com/color/48/000000/police-badge.png", link: "/exam-categories/police/state-police" },
  ],
  "Other State Govt. Jobs": [
    { name: "Patwari / Lekhpal", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/state/patwari" },
    { name: "VDO / Gram Panchayat Adhikari", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/state/vdo" },
    { name: "Junior Assistant / Clerk posts", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/state/clerk" },
    { name: "State-Level Group C/D Exams", icon: "https://img.icons8.com/color/48/000000/contract-job.png", link: "/exam-categories/state/group-cd" },
  ],
  "Insurance Exams": [
    { name: "LIC AAO / ADO", icon: "https://img.icons8.com/color/48/000000/insurance.png", link: "/exam-categories/insurance/lic" },
    { name: "NIACL AO / Assistant", icon: "https://img.icons8.com/color/48/000000/insurance.png", link: "/exam-categories/insurance/niacl" },
  ],
  "High Court & Judiciary Exams": [
    { name: "District Court Clerk / Steno / Group C", icon: "https://img.icons8.com/color/48/000000/law.png", link: "/exam-categories/judiciary/court-clerk" },
    { name: "Judicial Services (for Law grads)", icon: "https://img.icons8.com/color/48/000000/law.png", link: "/exam-categories/judiciary/judicial-services" },
  ],
  "Entrance Exams for Govt Colleges": [
    { name: "CUET (UG/PG)", icon: "https://img.icons8.com/color/48/000000/university.png", link: "/exam-categories/entrance/cuet" },
    { name: "Polytechnic Entrance (JEECUP etc.)", icon: "https://img.icons8.com/color/48/000000/university.png", link: "/exam-categories/entrance/polytechnic" },
    { name: "ITI Entrance", icon: "https://img.icons8.com/color/48/000000/university.png", link: "/exam-categories/entrance/iti" },
  ],
};

export const examCategories = [
  "SSC Exams",
  "Railways (RRB)",
  "Banking",
  "Defence",
  "Teaching",
  "UPSC",
  "State-Level PSC Exams",
  "Police Recruitment",
  "Other State Govt. Jobs",
  "Insurance Exams",
  "High Court & Judiciary Exams",
  "Entrance Exams for Govt Colleges"
];

export const shortExamName = (name: string): string => {
  const mappings: { [key: string]: string } = {
    "SSC CGL": "SSC CGL",
    "SSC CHSL": "SSC CHSL",
    "SSC MTS": "SSC MTS",
    "SSC GD Constable": "SSC GD Constable",
    "SSC CPO": "SSC CPO",
    "SSC JE": "SSC JE",
    "RRB NTPC": "RRB NTPC",
    "RRB Group D": "RRB Group D",
    "RRB JE": "RRB JE",
    "IBPS PO": "IBPS PO",
    "IBPS Clerk": "IBPS Clerk",
    "SBI PO": "SBI PO",
    "SBI Clerk": "SBI Clerk",
    "RBI Assistant": "RBI Assistant",
    "Agniveer": "Agniveer",
    "NDA": "NDA",
    "CDS": "CDS",
    "AFCAT": "AFCAT",
    "CTET": "CTET",
    "UPTET": "UPTET",
    "Super TET": "Super TET",
    "IAS": "IAS",
    "UPSC": "UPSC",
    "IES": "IES",
    "CMS": "CMS",
    "EPFO": "EPFO",
    "CAPF": "CAPF",
    "Geo Scientist": "Geo Scientist",
    "IFoS": "IFoS",
    "UPPSC": "UPPSC",
    "BPSC": "BPSC",
    "MPPSC": "MPPSC",
    "RPSC": "RPSC",
    "WBPSC": "WBPSC",
    "Subordinate Services": "Lower PCS",
    "UP Police": "UP Police",
    "Delhi Police": "Delhi Police",
    "Patwari": "Patwari",
    "VDO": "VDO",
    "Junior Assistant": "Jr. Assistant",
    "LIC AAO": "LIC AAO",
    "NIACL AO": "NIACL AO",
    "District Court": "Court Clerk",
    "Judicial Services": "Judicial Services",
    "CUET": "CUET",
    "Polytechnic": "Polytechnic",
    "ITI": "ITI",
  };

  for (const [key, value] of Object.entries(mappings)) {
    if (name.includes(key)) return value;
  }
  
  return name.split(" ")[0];
}; 