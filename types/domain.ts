export type User = {
  id: string;
  name: string;
  email: string;
};

export type Course = {
  id?: string;
  name: string;
  degree: string;
  duration?: string;
  annualFee: number;
  seats?: number;
  exam: string;
  closingRank?: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type CollegeCardData = {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
  establishedYear: number;
  accreditation: string;
  overview: string;
  website: string;
  imageUrl: string;
  feeMin: number;
  feeMax: number;
  rating: number;
  reviewCount: number;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  topRecruiters: string[];
  examsAccepted: string[];
  tags: string[];
  courses: Course[];
  isSaved?: boolean;
};

export type CollegeDetailData = CollegeCardData & {
  courses: Required<Course>[];
  reviews: Review[];
};

export type CollegeListResponse = {
  items: CollegeCardData[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    states: string[];
    types: string[];
    exams: string[];
    courses: string[];
  };
};
