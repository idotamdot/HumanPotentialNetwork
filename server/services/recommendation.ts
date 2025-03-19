import { storage } from "../storage";
import { 
  User, 
  Project,
  Skill,
  InsertProjectRecommendation 
} from "@shared/schema";

interface SkillMatch {
  matchedSkill: Skill;
  projectTag: string;
  weight: number;
}

interface InterestMatch {
  userCategory: string;
  projectTag: string;
  weight: number;
}

interface ProjectMatch {
  project: Project;
  score: number;
  skillMatches: SkillMatch[];
  interestMatches: InterestMatch[];
}

export class RecommendationService {
  // Configure weights for different matching factors
  private static readonly WEIGHTS = {
    CORE_SKILL_MATCH: 3,
    PASSION_MATCH: 2,
    LOCATION_MATCH: 1
  };

  private static readonly MIN_SCORE_THRESHOLD = 40; // Minimum score to recommend a project

  /**
   * Generate project recommendations for a user
   */
  public static async generateRecommendations(userId: number): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      // Get user's current projects to exclude from recommendations
      const userProjects = await storage.getUserProjects(userId);
      const userProjectIds = userProjects.map(up => up.project.id);

      // Get all available projects
      const allProjects = await storage.getAllProjects();
      
      // Filter out projects user is already part of
      const availableProjects = allProjects.filter(project => 
        !userProjectIds.includes(project.id)
      );

      // Get user skills
      const userSkills = await storage.getUserSkills(userId);

      // Calculate match scores for each project
      const projectMatches: ProjectMatch[] = availableProjects.map(project => {
        return this.calculateProjectMatch(user, project, userSkills);
      });

      // Filter projects that meet minimum threshold and sort by score
      const recommendedProjects = projectMatches
        .filter(match => match.score >= this.MIN_SCORE_THRESHOLD)
        .sort((a, b) => b.score - a.score);

      // Clear existing recommendations
      await this.clearExistingRecommendations(userId);

      // Create new recommendations
      await this.createRecommendations(userId, recommendedProjects);

      return true;
    } catch (error) {
      console.error("Failed to generate recommendations:", error);
      return false;
    }
  }

  /**
   * Calculate match score between a user and project
   */
  private static calculateProjectMatch(
    user: User, 
    project: Project, 
    userSkills: Skill[]
  ): ProjectMatch {
    let totalScore = 0;
    const skillMatches: SkillMatch[] = [];
    const interestMatches: InterestMatch[] = [];

    // Match skills to project tags
    for (const skill of userSkills) {
      for (const tag of project.tags) {
        // Determine if there's a skill match with project tags
        const match = this.matchSkillToTag(skill, tag);
        if (match) {
          const weight = skill.category === 'core' 
            ? this.WEIGHTS.CORE_SKILL_MATCH 
            : this.WEIGHTS.PASSION_MATCH;
          
          const matchScore = this.calculateSkillMatchScore(skill, weight);
          totalScore += matchScore;

          // Record the match for explanation
          if (skill.category === 'core') {
            skillMatches.push({
              matchedSkill: skill,
              projectTag: tag,
              weight
            });
          } else {
            interestMatches.push({
              userCategory: skill.category,
              projectTag: tag,
              weight
            });
          }
        }
      }
    }

    // Location-based matching (if project has location relevance)
    if (user.location && project.tags.some(tag => this.isLocationRelevant(tag, user.location!))) {
      totalScore += this.WEIGHTS.LOCATION_MATCH * 10;
    }

    // Normalize score to 0-100 range
    const maxPossibleScore = (userSkills.length * this.WEIGHTS.CORE_SKILL_MATCH * 10) + 
                            (this.WEIGHTS.LOCATION_MATCH * 10);
    const normalizedScore = Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100);

    return {
      project,
      score: normalizedScore,
      skillMatches,
      interestMatches
    };
  }

  /**
   * Calculate skill match score based on proficiency and weight
   */
  private static calculateSkillMatchScore(skill: Skill, weight: number): number {
    // Get proficiency level (0-100) or default to 50 if not specified
    const proficiency = skill.proficiency !== null ? skill.proficiency : 50;
    return (proficiency / 10) * weight; // Scale to 0-10 range and apply weight
  }

  /**
   * Match a skill to a project tag
   * This could be enhanced with NLP or AI for better matching
   */
  private static matchSkillToTag(skill: Skill, tag: string): boolean {
    const skillName = skill.name.toLowerCase();
    const tagName = tag.toLowerCase();

    // Direct match
    if (skillName === tagName) return true;

    // Partial match
    if (skillName.includes(tagName) || tagName.includes(skillName)) return true;

    // Related skills mapping (could be expanded)
    const relatedSkills: {[key: string]: string[]} = {
      'programming': ['web development', 'coding', 'software', 'tech', 'technology', 'computer'],
      'writing': ['content', 'blog', 'journalism', 'communication'],
      'design': ['ui', 'ux', 'graphic', 'visual', 'creative'],
      'education': ['teaching', 'training', 'mentoring', 'tutoring', 'learning'],
      'environment': ['climate', 'sustainability', 'green', 'conservation', 'ecology'],
      'healthcare': ['medical', 'health', 'wellness', 'care'],
      'community': ['social', 'local', 'neighborhood', 'volunteer']
    };

    // Check if skill and tag are related
    for (const [key, related] of Object.entries(relatedSkills)) {
      if ((skillName.includes(key) || key.includes(skillName)) &&
          (related.some(r => tagName.includes(r) || r.includes(tagName)))) {
        return true;
      }
      
      if ((tagName.includes(key) || key.includes(tagName)) &&
          (related.some(r => skillName.includes(r) || r.includes(skillName)))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a project tag is relevant to user's location
   */
  private static isLocationRelevant(tag: string, userLocation: string): boolean {
    const location = userLocation.toLowerCase();
    const tagLower = tag.toLowerCase();

    // Direct location match
    if (location.includes(tagLower) || tagLower.includes(location)) {
      return true;
    }

    // Check for 'local', 'community' tags which indicate location relevance
    const localTerms = ['local', 'community', 'neighborhood', 'city', 'regional', 'urban', 'rural'];
    return localTerms.some(term => tagLower.includes(term));
  }

  /**
   * Clear existing recommendations for a user
   */
  private static async clearExistingRecommendations(userId: number): Promise<void> {
    // In this in-memory implementation, we're just adding new recommendations
    // For a real database implementation, we would delete existing recommendations first
  }

  /**
   * Create recommendations based on project matches
   */
  private static async createRecommendations(
    userId: number, 
    projectMatches: ProjectMatch[]
  ): Promise<void> {
    for (const match of projectMatches) {
      // Generate reason code from match details
      const reasonCode = this.generateReasonCode(match);
      
      const recommendation: InsertProjectRecommendation = {
        userId,
        projectId: match.project.id,
        matchScore: match.score,
        reasonCode
      };

      await storage.createProjectRecommendation(recommendation);
    }
  }

  /**
   * Generate a reason code based on match details
   */
  private static generateReasonCode(match: ProjectMatch): string {
    if (match.skillMatches.length > 0) {
      const topSkillMatch = match.skillMatches.sort((a, b) => b.weight - a.weight)[0];
      return `skill_match:${topSkillMatch.matchedSkill.name.toLowerCase().replace(/ /g, '_')}`;
    }
    
    if (match.interestMatches.length > 0) {
      const topInterestMatch = match.interestMatches.sort((a, b) => b.weight - a.weight)[0];
      return `passion_match:${topInterestMatch.userCategory.toLowerCase().replace(/ /g, '_')}`;
    }
    
    return 'general_match';
  }
}