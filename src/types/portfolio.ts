export interface SkillItem {
  id: string;
  name: string;
  percentage: number;
  iconName: string;
  category: 'Infrastructure' | 'Cybersecurity' | 'AIOps' | 'Cloud';
  tags: string[];
}

export interface DeploymentProject {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  isPrivate?: boolean;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  badge: string;
  description: string;
  url: string;
  doi?: string;
}

export interface CareerExperience {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  responsibilities: string[];
  keyHighlight?: string;
  techStack?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  image: string;
  verifyUrl: string;
  credentialId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  url: string;
}

export interface ProductItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: 'Production' | 'Beta' | 'Internal';
  tags: string[];
  url?: string;
}
