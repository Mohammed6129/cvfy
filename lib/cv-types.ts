export type Language = "arabic" | "english" | "both" | "";

export type WorkExperience = {
  id: string;
  jobTitle: string;
  company: string;
  department: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent?: boolean;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
  provider: string;
  date: string;
  year: string;
};

export type CvFormData = {
  language: Language;
  name: string;
  currentJobTitle: string;
  city: string;
  phone: string;
  email: string;
  linkedIn: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  courses: Course[];
  selfDescription: string;
};

export type GeneratedExperience = {
  jobTitle: string;
  company: string;
  period: string;
  description: string;
};

export type GeneratedEducation = {
  degree: string;
  institution: string;
  period: string;
};

export type GeneratedCourse = {
  name: string;
  provider: string;
  year: string;
};

export type GeneratedCvContent = {
  headline: string;
  summary: string;
  experiences: GeneratedExperience[];
  education: GeneratedEducation[];
  skills: string[];
  courses: GeneratedCourse[];
};

export type GeneratedCv = {
  name: string;
  email: string;
  phone: string;
  city: string;
  linkedIn?: string;
  language?: Language;
  content: GeneratedCvContent;
  contentEn?: GeneratedCvContent;
  aiEnhanced?: boolean;
  generatedWithFallback?: boolean;
  warning?: string;
};

export type AtsCategoryScore = {
  name: string;
  score: number;
  maxScore: number;
  note: string;
};

export type AtsScoreResult = {
  score: number;
  summary: string;
  passed: string[];
  improvements: string[];
  categories: AtsCategoryScore[];
};

export type CvRecord = {
  id: string;
  title: string;
  generatedCv: GeneratedCv;
  formData: CvFormData | null;
  isPaid: boolean;
  paidPlan: string | null;
  atsResult: AtsScoreResult | null;
  updatedAt: string;
  createdAt: string;
};
