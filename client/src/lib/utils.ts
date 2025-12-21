import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComponentType } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme management helpers
export interface MoodTheme {
  name: string;
  value: string;
  color: string;
  icon: ComponentType<any>;
  description?: string;
}

export function setThemeColor(color: string) {
  document.documentElement.style.setProperty("--primary", color);
}

export function saveTheme(theme: MoodTheme) {
  localStorage.setItem("hpn-user-mood-theme", JSON.stringify(theme));
}

export function getTheme(): MoodTheme | null {
  const saved = localStorage.getItem("hpn-user-mood-theme");
  return saved ? JSON.parse(saved) : null;
}

// Comprehensive skills and passions database for suggestions
export const skillCategories = {
  technical: {
    name: "Technical Skills",
    skills: [
      "Web Development", "Mobile Development", "Data Science", "Machine Learning", "AI/ML",
      "Cloud Computing", "DevOps", "Cybersecurity", "Database Management", "UI/UX Design",
      "Software Testing", "System Administration", "Network Engineering", "Blockchain",
      "Game Development", "3D Modeling", "CAD Design", "Robotics", "IoT Development",
      "API Development", "Full Stack Development", "Frontend Development", "Backend Development"
    ]
  },
  creative: {
    name: "Creative Skills",
    skills: [
      "Graphic Design", "Video Editing", "Photography", "Digital Art", "Content Writing",
      "Copywriting", "Creative Writing", "Animation", "Music Production", "Voice Acting",
      "Illustration", "Branding", "Logo Design", "Web Design", "Interior Design",
      "Fashion Design", "Product Design", "Marketing Design", "Social Media Content"
    ]
  },
  business: {
    name: "Business Skills",
    skills: [
      "Project Management", "Product Management", "Marketing", "Sales", "Business Analysis",
      "Financial Planning", "Strategy Planning", "Operations Management", "Supply Chain",
      "Human Resources", "Recruiting", "Training & Development", "Change Management",
      "Risk Management", "Quality Assurance", "Compliance", "Consulting", "Negotiation"
    ]
  },
  communication: {
    name: "Communication Skills",
    skills: [
      "Public Speaking", "Presentation Skills", "Writing", "Technical Writing", "Translation",
      "Editing", "Proofreading", "Social Media Management", "Community Management",
      "Customer Service", "Teaching", "Training", "Mentoring", "Coaching", "Facilitation",
      "Cross-cultural Communication", "Conflict Resolution", "Active Listening"
    ]
  },
  research: {
    name: "Research & Analysis",
    skills: [
      "Data Analysis", "Market Research", "Academic Research", "User Research", "Statistical Analysis",
      "Survey Design", "Interview Techniques", "Literature Review", "Competitive Analysis",
      "Trend Analysis", "Policy Research", "Scientific Research", "Field Research", "Ethnography"
    ]
  },
  social: {
    name: "Social Impact",
    skills: [
      "Community Organizing", "Fundraising", "Grant Writing", "Volunteer Management",
      "Event Planning", "Campaign Management", "Advocacy", "Policy Development",
      "Social Media Activism", "Environmental Conservation", "Sustainability Consulting",
      "Nonprofit Management", "Social Entrepreneurship", "Impact Measurement"
    ]
  }
};

export const passionCategories = {
  social: {
    name: "Social Issues",
    passions: [
      "Climate Change", "Education", "Healthcare", "Poverty Reduction", "Gender Equality",
      "Racial Justice", "Human Rights", "Refugee Support", "Disability Rights", "Mental Health",
      "Elderly Care", "Child Welfare", "Homelessness", "Food Security", "Water Access",
      "Digital Divide", "Criminal Justice Reform", "Immigration Rights"
    ]
  },
  environment: {
    name: "Environment",
    passions: [
      "Environmental Conservation", "Renewable Energy", "Sustainable Agriculture", "Wildlife Protection",
      "Ocean Conservation", "Forest Preservation", "Green Technology", "Recycling & Waste Reduction",
      "Carbon Footprint Reduction", "Biodiversity", "Ecosystem Restoration", "Clean Air",
      "Environmental Education", "Green Building", "Sustainable Transportation"
    ]
  },
  technology: {
    name: "Technology",
    passions: [
      "Open Source", "Digital Privacy", "AI Ethics", "Tech for Good", "Digital Accessibility",
      "Cybersecurity", "Innovation", "Emerging Technologies", "Tech Education", "Digital Literacy",
      "Internet Freedom", "Data Rights", "Automation Ethics", "Future of Work"
    ]
  },
  arts: {
    name: "Arts & Culture",
    passions: [
      "Visual Arts", "Performing Arts", "Music", "Literature", "Film & Media", "Cultural Preservation",
      "Arts Education", "Creative Expression", "Community Arts", "Public Art", "Digital Arts",
      "Traditional Crafts", "Dance", "Theater", "Photography", "Creative Writing"
    ]
  },
  education: {
    name: "Education & Learning",
    passions: [
      "Early Childhood Education", "Higher Education", "Vocational Training", "Adult Learning",
      "Educational Technology", "Literacy", "STEM Education", "Arts Education", "Special Education",
      "Online Learning", "Educational Equity", "Teacher Training", "Curriculum Development"
    ]
  },
  health: {
    name: "Health & Wellness",
    passions: [
      "Public Health", "Mental Health", "Nutrition", "Fitness", "Healthcare Access",
      "Medical Research", "Health Education", "Alternative Medicine", "Preventive Care",
      "Global Health", "Community Health", "Health Technology", "Wellness Programs"
    ]
  }
};

// Sample skill data for demo purposes
export const skillsData = [
  { id: 1, userId: 1, name: "Web Development", category: "core", proficiency: 85 },
  { id: 2, userId: 1, name: "Project Management", category: "core", proficiency: 72 },
  { id: 3, userId: 1, name: "Data Analysis", category: "core", proficiency: 65 },
  { id: 4, userId: 1, name: "Content Creation", category: "core", proficiency: 90 },
  { id: 5, userId: 1, name: "Climate Action", category: "passion" },
  { id: 6, userId: 1, name: "Education", category: "passion" },
  { id: 7, userId: 1, name: "Technology", category: "passion" },
  { id: 8, userId: 1, name: "Arts & Culture", category: "passion" },
];

// Helper function to get all skills from a category
export const getSkillsFromCategory = (categoryKey: string): string[] => {
  return skillCategories[categoryKey as keyof typeof skillCategories]?.skills || [];
};

// Helper function to get all passions from a category
export const getPassionsFromCategory = (categoryKey: string): string[] => {
  return passionCategories[categoryKey as keyof typeof passionCategories]?.passions || [];
};

// Helper function to search skills and passions
export const searchSkillsAndPassions = (query: string): { skills: string[], passions: string[] } => {
  const lowerQuery = query.toLowerCase();
  const allSkills = Object.values(skillCategories).flatMap(cat => cat.skills);
  const allPassions = Object.values(passionCategories).flatMap(cat => cat.passions);
  
  return {
    skills: allSkills.filter(skill => skill.toLowerCase().includes(lowerQuery)),
    passions: allPassions.filter(passion => passion.toLowerCase().includes(lowerQuery))
  };
};
