import {
  users, User, InsertUser,
  skills, Skill, InsertSkill,
  issues, Issue, InsertIssue,
  projects, Project, InsertProject,
  userProjects, UserProject, InsertUserProject,
  projectRecommendations, ProjectRecommendation, InsertProjectRecommendation,
  impacts, Impact, InsertImpact,
  learningPaths, LearningPath, InsertLearningPath,
  learningModules, LearningModule, InsertLearningModule,
  userLearningProgress, UserLearningProgress, InsertUserLearningProgress,
  learningPathSkills, LearningPathSkill, InsertLearningPathSkill,
  governanceProposals, GovernanceProposal, InsertGovernanceProposal,
  governanceVotes, GovernanceVote, InsertGovernanceVote,
  governanceComments, GovernanceComment, InsertGovernanceComment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Skills methods
  getUserSkills(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Issues methods
  getAllIssues(): Promise<Issue[]>;
  getIssue(id: number): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  
  // Projects methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByIssue(issueId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<Project>): Promise<Project | undefined>;
  
  // User-Project methods
  getUserProjects(userId: number): Promise<{project: Project, userProject: UserProject}[]>;
  addUserToProject(userProject: InsertUserProject): Promise<UserProject>;
  removeUserFromProject(userId: number, projectId: number): Promise<boolean>;
  
  // Recommendations methods
  getProjectRecommendations(userId: number): Promise<{project: Project, recommendation: ProjectRecommendation}[]>;
  createProjectRecommendation(rec: InsertProjectRecommendation): Promise<ProjectRecommendation>;
  clearProjectRecommendations(userId: number): Promise<boolean>;
  
  // Impact methods
  getAllImpacts(): Promise<Impact[]>;
  getUserImpacts(userId: number): Promise<Impact[]>;
  createImpact(impact: InsertImpact): Promise<Impact>;
  getImpact(id: number): Promise<Impact | undefined>;
  
  // Learning Path methods
  getAllLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<LearningPath | undefined>;
  getLearningPathsByCategory(category: string): Promise<LearningPath[]>;
  getLearningPathsByTag(tag: string): Promise<LearningPath[]>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: number, data: Partial<LearningPath>): Promise<LearningPath | undefined>;
  
  // Learning Module methods
  getLearningModulesByPath(pathId: number): Promise<LearningModule[]>;
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  updateLearningModule(id: number, data: Partial<LearningModule>): Promise<LearningModule | undefined>;
  
  // User Learning Progress methods
  getUserLearningPaths(userId: number): Promise<{path: LearningPath, progress: UserLearningProgress}[]>;
  getUserPathProgress(userId: number, pathId: number): Promise<UserLearningProgress | undefined>;
  createUserLearningProgress(progress: InsertUserLearningProgress): Promise<UserLearningProgress>;
  updateUserLearningProgress(id: number, data: Partial<UserLearningProgress>): Promise<UserLearningProgress | undefined>;
  
  // Learning Path Skills methods
  getLearningPathSkills(pathId: number): Promise<LearningPathSkill[]>;
  createLearningPathSkill(skill: InsertLearningPathSkill): Promise<LearningPathSkill>;
  deleteLearningPathSkill(id: number): Promise<boolean>;
  
  // Governance Proposal methods
  getAllProposals(): Promise<GovernanceProposal[]>;
  getProposal(id: number): Promise<GovernanceProposal | undefined>;
  getProjectProposals(projectId: number): Promise<GovernanceProposal[]>;
  getUserProposals(userId: number): Promise<GovernanceProposal[]>;
  createProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal>;
  updateProposal(id: number, data: Partial<GovernanceProposal>): Promise<GovernanceProposal | undefined>;
  
  // Governance Vote methods
  getProposalVotes(proposalId: number): Promise<{vote: GovernanceVote, user: User}[]>;
  getUserVote(userId: number, proposalId: number): Promise<GovernanceVote | undefined>;
  createVote(vote: InsertGovernanceVote): Promise<GovernanceVote>;
  deleteVote(userId: number, proposalId: number): Promise<boolean>;
  
  // Governance Comment methods
  getProposalComments(proposalId: number): Promise<{comment: GovernanceComment, user: User}[]>;
  getComment(id: number): Promise<GovernanceComment | undefined>;
  createComment(comment: InsertGovernanceComment): Promise<GovernanceComment>;
  deleteComment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private skills: Map<number, Skill>;
  private issues: Map<number, Issue>;
  private projects: Map<number, Project>;
  private userProjects: Map<number, UserProject>;
  private projectRecommendations: Map<number, ProjectRecommendation>;
  private impacts: Map<number, Impact>;
  private learningPaths: Map<number, LearningPath>;
  private learningModules: Map<number, LearningModule>;
  private userLearningProgress: Map<number, UserLearningProgress>;
  private learningPathSkills: Map<number, LearningPathSkill>;
  private governanceProposals: Map<number, GovernanceProposal>;
  private governanceVotes: Map<number, GovernanceVote>;
  private governanceComments: Map<number, GovernanceComment>;
  
  private nextIds: {
    users: number;
    skills: number;
    issues: number;
    projects: number;
    userProjects: number;
    projectRecommendations: number;
    impacts: number;
    learningPaths: number;
    learningModules: number;
    userLearningProgress: number;
    learningPathSkills: number;
    governanceProposals: number;
    governanceVotes: number;
    governanceComments: number;
  };

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.issues = new Map();
    this.projects = new Map();
    this.userProjects = new Map();
    this.projectRecommendations = new Map();
    this.impacts = new Map();
    this.learningPaths = new Map();
    this.learningModules = new Map();
    this.userLearningProgress = new Map();
    this.learningPathSkills = new Map();
    this.governanceProposals = new Map();
    this.governanceVotes = new Map();
    this.governanceComments = new Map();
    
    this.nextIds = {
      users: 1,
      skills: 1,
      issues: 1,
      projects: 1,
      userProjects: 1,
      projectRecommendations: 1,
      impacts: 1,
      learningPaths: 1,
      learningModules: 1,
      userLearningProgress: 1,
      learningPathSkills: 1,
      governanceProposals: 1,
      governanceVotes: 1,
      governanceComments: 1,
    };
    
    // Initialize with some data
    this.initData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextIds.users++;
    const user: User = { ...insertUser, id, potentialPoints: 0, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Skills methods
  async getUserSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId
    );
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.nextIds.skills++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;
    
    const updatedSkill = { ...skill, ...data };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Issues methods
  async getAllIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values());
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.nextIds.issues++;
    const issue: Issue = { ...insertIssue, id, projectCount: 0 };
    this.issues.set(id, issue);
    return issue;
  }

  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByIssue(issueId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.issueId === issueId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.nextIds.projects++;
    const project: Project = { 
      ...insertProject, 
      id, 
      progress: 0, 
      contributorCount: 0,
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    
    // Increment issue project count
    if (project.issueId) {
      const issue = await this.getIssue(project.issueId);
      if (issue) {
        await this.issues.set(issue.id, {
          ...issue,
          projectCount: issue.projectCount + 1
        });
      }
    }
    
    return project;
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...data };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // User-Project methods
  async getUserProjects(userId: number): Promise<{ project: Project, userProject: UserProject }[]> {
    const userProjectEntries = Array.from(this.userProjects.values()).filter(
      (up) => up.userId === userId
    );
    
    return userProjectEntries.map(up => {
      const project = this.projects.get(up.projectId);
      if (!project) throw new Error(`Project not found for id: ${up.projectId}`);
      return { project, userProject: up };
    });
  }

  async addUserToProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const id = this.nextIds.userProjects++;
    const userProject: UserProject = { 
      ...insertUserProject, 
      id, 
      joinedAt: new Date() 
    };
    this.userProjects.set(id, userProject);
    
    // Increment project contributor count
    const project = await this.getProject(userProject.projectId);
    if (project) {
      await this.projects.set(project.id, {
        ...project,
        contributorCount: project.contributorCount + 1
      });
    }
    
    return userProject;
  }

  async removeUserFromProject(userId: number, projectId: number): Promise<boolean> {
    const entry = Array.from(this.userProjects.values()).find(
      (up) => up.userId === userId && up.projectId === projectId
    );
    
    if (!entry) return false;
    
    const result = this.userProjects.delete(entry.id);
    
    // Decrement project contributor count
    if (result) {
      const project = await this.getProject(projectId);
      if (project && project.contributorCount > 0) {
        await this.projects.set(project.id, {
          ...project,
          contributorCount: project.contributorCount - 1
        });
      }
    }
    
    return result;
  }

  // Recommendations methods
  async getProjectRecommendations(userId: number): Promise<{ project: Project, recommendation: ProjectRecommendation }[]> {
    const recommendations = Array.from(this.projectRecommendations.values()).filter(
      (rec) => rec.userId === userId
    );
    
    return recommendations.map(rec => {
      const project = this.projects.get(rec.projectId);
      if (!project) throw new Error(`Project not found for id: ${rec.projectId}`);
      return { project, recommendation: rec };
    }).sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore);
  }

  async createProjectRecommendation(insertRec: InsertProjectRecommendation): Promise<ProjectRecommendation> {
    const id = this.nextIds.projectRecommendations++;
    const recommendation: ProjectRecommendation = { 
      ...insertRec, 
      id, 
      createdAt: new Date() 
    };
    this.projectRecommendations.set(id, recommendation);
    return recommendation;
  }
  
  async clearProjectRecommendations(userId: number): Promise<boolean> {
    // Find all recommendations for this user
    const recommendations = Array.from(this.projectRecommendations.values())
      .filter(rec => rec.userId === userId);
      
    // Delete each recommendation
    recommendations.forEach(rec => {
      this.projectRecommendations.delete(rec.id);
    });
    
    return true;
  }
  
  // Impact methods
  async getAllImpacts(): Promise<Impact[]> {
    return Array.from(this.impacts.values());
  }
  
  async getUserImpacts(userId: number): Promise<Impact[]> {
    return Array.from(this.impacts.values()).filter(
      (impact) => impact.userId === userId
    );
  }
  
  async createImpact(insertImpact: InsertImpact): Promise<Impact> {
    const id = this.nextIds.impacts++;
    const impact: Impact = {
      ...insertImpact,
      id,
      date: new Date()
    };
    this.impacts.set(id, impact);
    return impact;
  }
  
  async getImpact(id: number): Promise<Impact | undefined> {
    return this.impacts.get(id);
  }

  // Learning Path methods
  async getAllLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values());
  }

  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async getLearningPathsByCategory(category: string): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).filter(
      (path) => path.category === category
    );
  }

  async getLearningPathsByTag(tag: string): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).filter(
      (path) => path.tags.includes(tag)
    );
  }

  async createLearningPath(insertPath: InsertLearningPath): Promise<LearningPath> {
    const id = this.nextIds.learningPaths++;
    const path: LearningPath = { 
      ...insertPath, 
      id,
      createdAt: new Date()
    };
    this.learningPaths.set(id, path);
    return path;
  }

  async updateLearningPath(id: number, data: Partial<LearningPath>): Promise<LearningPath | undefined> {
    const path = await this.getLearningPath(id);
    if (!path) return undefined;
    
    const updatedPath = { ...path, ...data };
    this.learningPaths.set(id, updatedPath);
    return updatedPath;
  }

  // Learning Module methods
  async getLearningModulesByPath(pathId: number): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values())
      .filter(module => module.pathId === pathId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async createLearningModule(insertModule: InsertLearningModule): Promise<LearningModule> {
    const id = this.nextIds.learningModules++;
    const module: LearningModule = {
      ...insertModule,
      id,
      createdAt: new Date()
    };
    this.learningModules.set(id, module);
    return module;
  }

  async updateLearningModule(id: number, data: Partial<LearningModule>): Promise<LearningModule | undefined> {
    const module = await this.getLearningModule(id);
    if (!module) return undefined;
    
    const updatedModule = { ...module, ...data };
    this.learningModules.set(id, updatedModule);
    return updatedModule;
  }

  // User Learning Progress methods
  async getUserLearningPaths(userId: number): Promise<{ path: LearningPath, progress: UserLearningProgress }[]> {
    const progressEntries = Array.from(this.userLearningProgress.values())
      .filter(progress => progress.userId === userId);
    
    return progressEntries.map(progress => {
      const path = this.learningPaths.get(progress.pathId);
      if (!path) throw new Error(`Learning path not found for id: ${progress.pathId}`);
      return { path, progress };
    });
  }

  async getUserPathProgress(userId: number, pathId: number): Promise<UserLearningProgress | undefined> {
    return Array.from(this.userLearningProgress.values()).find(
      progress => progress.userId === userId && progress.pathId === pathId
    );
  }

  async createUserLearningProgress(insertProgress: InsertUserLearningProgress): Promise<UserLearningProgress> {
    const id = this.nextIds.userLearningProgress++;
    const progress: UserLearningProgress = {
      ...insertProgress,
      id,
      progress: 0,
      enrolled: true,
      completedModules: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completedAt: null
    };
    this.userLearningProgress.set(id, progress);
    return progress;
  }

  async updateUserLearningProgress(id: number, data: Partial<UserLearningProgress>): Promise<UserLearningProgress | undefined> {
    const progress = this.userLearningProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...data, lastAccessedAt: new Date() };
    this.userLearningProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Learning Path Skills methods
  async getLearningPathSkills(pathId: number): Promise<LearningPathSkill[]> {
    return Array.from(this.learningPathSkills.values())
      .filter(skill => skill.pathId === pathId);
  }

  async createLearningPathSkill(insertSkill: InsertLearningPathSkill): Promise<LearningPathSkill> {
    const id = this.nextIds.learningPathSkills++;
    const skill: LearningPathSkill = {
      ...insertSkill,
      id,
      proficiencyGain: insertSkill.proficiencyGain || 10
    };
    this.learningPathSkills.set(id, skill);
    return skill;
  }

  async deleteLearningPathSkill(id: number): Promise<boolean> {
    return this.learningPathSkills.delete(id);
  }
  
  // Governance Proposal methods
  async getAllProposals(): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values());
  }
  
  async getProposal(id: number): Promise<GovernanceProposal | undefined> {
    return this.governanceProposals.get(id);
  }
  
  async getProjectProposals(projectId: number): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values()).filter(
      (proposal) => proposal.projectId === projectId
    );
  }
  
  async getUserProposals(userId: number): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values()).filter(
      (proposal) => proposal.creatorId === userId
    );
  }
  
  async createProposal(insertProposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const id = this.nextIds.governanceProposals++;
    const proposal: GovernanceProposal = {
      ...insertProposal,
      id,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.governanceProposals.set(id, proposal);
    return proposal;
  }
  
  async updateProposal(id: number, data: Partial<GovernanceProposal>): Promise<GovernanceProposal | undefined> {
    const proposal = await this.getProposal(id);
    if (!proposal) return undefined;
    
    const updatedProposal = {
      ...proposal,
      ...data,
      updatedAt: new Date()
    };
    this.governanceProposals.set(id, updatedProposal);
    return updatedProposal;
  }
  
  // Governance Vote methods
  async getProposalVotes(proposalId: number): Promise<{ vote: GovernanceVote, user: User }[]> {
    const votes = Array.from(this.governanceVotes.values()).filter(
      (vote) => vote.proposalId === proposalId
    );
    
    return Promise.all(votes.map(async (vote) => {
      const user = await this.getUser(vote.userId);
      if (!user) throw new Error(`User not found for id: ${vote.userId}`);
      return { vote, user };
    }));
  }
  
  async getUserVote(userId: number, proposalId: number): Promise<GovernanceVote | undefined> {
    return Array.from(this.governanceVotes.values()).find(
      (vote) => vote.userId === userId && vote.proposalId === proposalId
    );
  }
  
  async createVote(insertVote: InsertGovernanceVote): Promise<GovernanceVote> {
    // Check if user already voted
    const existingVote = await this.getUserVote(insertVote.userId, insertVote.proposalId);
    if (existingVote) {
      // Delete existing vote
      await this.deleteVote(insertVote.userId, insertVote.proposalId);
    }
    
    const id = this.nextIds.governanceVotes++;
    const vote: GovernanceVote = {
      ...insertVote,
      id,
      weight: 1, // Default weight value
      createdAt: new Date()
    };
    
    this.governanceVotes.set(id, vote);
    
    // Update proposal status if voting is over and threshold is met
    await this.checkProposalStatus(insertVote.proposalId);
    
    return vote;
  }
  
  async deleteVote(userId: number, proposalId: number): Promise<boolean> {
    const vote = Array.from(this.governanceVotes.values()).find(
      (v) => v.userId === userId && v.proposalId === proposalId
    );
    
    if (!vote) return false;
    
    const result = this.governanceVotes.delete(vote.id);
    
    // Update proposal status after vote removal
    if (result) {
      await this.checkProposalStatus(proposalId);
    }
    
    return result;
  }
  
  // Governance Comment methods
  async getProposalComments(proposalId: number): Promise<{ comment: GovernanceComment, user: User }[]> {
    const comments = Array.from(this.governanceComments.values()).filter(
      (comment) => comment.proposalId === proposalId
    );
    
    return Promise.all(comments.map(async (comment) => {
      const user = await this.getUser(comment.userId);
      if (!user) throw new Error(`User not found for id: ${comment.userId}`);
      return { comment, user };
    }));
  }
  
  async getComment(id: number): Promise<GovernanceComment | undefined> {
    return this.governanceComments.get(id);
  }
  
  async createComment(insertComment: InsertGovernanceComment): Promise<GovernanceComment> {
    const id = this.nextIds.governanceComments++;
    const comment: GovernanceComment = {
      ...insertComment,
      id,
      createdAt: new Date()
    };
    this.governanceComments.set(id, comment);
    return comment;
  }
  
  async deleteComment(id: number): Promise<boolean> {
    return this.governanceComments.delete(id);
  }
  
  // Helper method to check proposal status
  private async checkProposalStatus(proposalId: number): Promise<void> {
    const proposal = await this.getProposal(proposalId);
    if (!proposal) return;
    
    // If proposal is not open, don't update status
    if (proposal.status !== "open") return;
    
    const votes = Array.from(this.governanceVotes.values()).filter(
      (vote) => vote.proposalId === proposalId
    );
    
    // If proposal end date is in the future, don't update status
    if (new Date(proposal.votingEndDate) > new Date()) return;
    
    // Count votes for each option
    const voteCounts: Record<string, number> = {};
    let totalVotes = 0;
    
    votes.forEach(vote => {
      const weight = vote.weight || 1;
      voteCounts[vote.vote] = (voteCounts[vote.vote] || 0) + weight;
      totalVotes += weight;
    });
    
    // No votes? Keep it open
    if (totalVotes === 0) return;
    
    // Find the winning option
    let winningOption = "";
    let winningVotes = 0;
    
    for (const [option, count] of Object.entries(voteCounts)) {
      if (count > winningVotes) {
        winningOption = option;
        winningVotes = count;
      }
    }
    
    // Calculate percentage of votes for the winning option
    const winPercentage = (winningVotes / totalVotes) * 100;
    
    // If winning option met threshold, approve the proposal
    if (winPercentage >= proposal.threshold) {
      await this.updateProposal(proposalId, { status: "approved" });
    } else {
      // Otherwise, reject it
      await this.updateProposal(proposalId, { status: "rejected" });
    }
  }

  // Initialize with sample data
  private async initData() {
    // Create sample user
    const user = await this.createUser({
      username: "erodriguez",
      password: "password123", // In a real app, this would be hashed
      name: "Elena Rodriguez",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      availableHours: 10
    });
    
    // Update with potential points
    await this.updateUser(user.id, { potentialPoints: 5742 });
    
    // Add skills for the user
    await this.createSkill({ userId: user.id, name: "Web Development", category: "core", proficiency: 85 });
    await this.createSkill({ userId: user.id, name: "Project Management", category: "core", proficiency: 72 });
    await this.createSkill({ userId: user.id, name: "Data Analysis", category: "core", proficiency: 65 });
    await this.createSkill({ userId: user.id, name: "Content Creation", category: "core", proficiency: 90 });
    
    await this.createSkill({ userId: user.id, name: "Climate Action", category: "passion" });
    await this.createSkill({ userId: user.id, name: "Education", category: "passion" });
    await this.createSkill({ userId: user.id, name: "Technology", category: "passion" });
    await this.createSkill({ userId: user.id, name: "Arts & Culture", category: "passion" });
    
    // Add global issues
    const climateIssue = await this.createIssue({
      title: "Climate Change",
      description: "Addressing global warming and its effects on our planet",
      category: "Environment",
      icon: "ri-temp-hot-line",
      urgency: "urgent"
    });
    await this.issues.set(climateIssue.id, { ...climateIssue, projectCount: 2145 });
    
    const waterIssue = await this.createIssue({
      title: "Clean Water Access",
      description: "Ensuring clean water availability for all communities",
      category: "Health",
      icon: "ri-water-flash-line",
      urgency: "urgent"
    });
    await this.issues.set(waterIssue.id, { ...waterIssue, projectCount: 1872 });
    
    const educationIssue = await this.createIssue({
      title: "Global Education",
      description: "Providing quality education for all children",
      category: "Education",
      icon: "ri-book-open-line",
      urgency: "high"
    });
    await this.issues.set(educationIssue.id, { ...educationIssue, projectCount: 2583 });
    
    const healthcareIssue = await this.createIssue({
      title: "Healthcare Access",
      description: "Improving access to healthcare services globally",
      category: "Health",
      icon: "ri-heart-pulse-line",
      urgency: "high"
    });
    await this.issues.set(healthcareIssue.id, { ...healthcareIssue, projectCount: 1624 });
    
    const genderIssue = await this.createIssue({
      title: "Gender Equality",
      description: "Working toward equal rights and opportunities",
      category: "Social",
      icon: "ri-women-line",
      urgency: "high"
    });
    await this.issues.set(genderIssue.id, { ...genderIssue, projectCount: 1346 });
    
    // Add sample projects
    const ruralEducation = await this.createProject({
      title: "Rural Education Initiative",
      description: "Create digital learning materials for underserved communities in rural areas.",
      icon: "ri-book-open-line",
      issueId: educationIssue.id,
      status: "active",
      tags: ["Education", "High Impact", "Content Creation"],
      nextMilestone: "",
      nextMilestoneDate: undefined
    });
    await this.projects.set(ruralEducation.id, { ...ruralEducation, contributorCount: 18 });
    
    const urbanGarden = await this.createProject({
      title: "Urban Garden Network",
      description: "Connect city dwellers to create sustainable urban gardens for food security.",
      icon: "ri-earth-line",
      issueId: climateIssue.id,
      status: "active",
      tags: ["Climate Action", "Medium Impact", "Project Management"],
      nextMilestone: "",
      nextMilestoneDate: undefined
    });
    await this.projects.set(urbanGarden.id, { ...urbanGarden, contributorCount: 32 });
    
    const cleanWaterTech = await this.createProject({
      title: "Clean Water Tech",
      description: "Develop a web platform to track and coordinate clean water initiatives globally.",
      icon: "ri-code-line",
      issueId: waterIssue.id,
      status: "active",
      tags: ["Technology", "High Impact", "Web Development"],
      nextMilestone: "",
      nextMilestoneDate: undefined
    });
    await this.projects.set(cleanWaterTech.id, { ...cleanWaterTech, contributorCount: 24 });
    
    // Active projects for user
    const renewableEnergy = await this.createProject({
      title: "Renewable Energy Advocates",
      description: "Creating educational content about renewable energy solutions.",
      icon: "ri-flashlight-line",
      issueId: climateIssue.id,
      status: "active",
      tags: ["Climate Action", "Education", "Content Creation"],
      nextMilestone: "Next meeting: Tomorrow, 3:00 PM",
      nextMilestoneDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    });
    await this.projects.set(renewableEnergy.id, { ...renewableEnergy, progress: 62, contributorCount: 15 });
    
    const localFood = await this.createProject({
      title: "Local Food Network",
      description: "Developing a platform connecting local farmers to community members.",
      icon: "ri-plant-line",
      issueId: climateIssue.id,
      status: "active",
      tags: ["Food Security", "Community", "Web Development"],
      nextMilestone: "Website launch in 2 weeks",
      nextMilestoneDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks
    });
    await this.projects.set(localFood.id, { ...localFood, progress: 28, contributorCount: 22 });
    
    const digitalLiteracy = await this.createProject({
      title: "Digital Literacy Program",
      description: "Teaching basic computer skills to seniors in the community.",
      icon: "ri-computer-line",
      issueId: educationIssue.id,
      status: "active",
      tags: ["Education", "Technology", "Community"],
      nextMilestone: "Final session: This Saturday, 10:00 AM",
      nextMilestoneDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // This Saturday
    });
    await this.projects.set(digitalLiteracy.id, { ...digitalLiteracy, progress: 85, contributorCount: 8 });
    
    // Add user to active projects
    await this.addUserToProject({ userId: user.id, projectId: renewableEnergy.id, role: "contributor" });
    await this.addUserToProject({ userId: user.id, projectId: localFood.id, role: "leader" });
    await this.addUserToProject({ userId: user.id, projectId: digitalLiteracy.id, role: "contributor" });
    
    // Create project recommendations for user
    await this.createProjectRecommendation({
      userId: user.id,
      projectId: ruralEducation.id,
      matchScore: 92,
      reasonCode: "skill_match:content_creation"
    });
    
    await this.createProjectRecommendation({
      userId: user.id,
      projectId: urbanGarden.id,
      matchScore: 78,
      reasonCode: "passion_match:climate_action"
    });
    
    await this.createProjectRecommendation({
      userId: user.id,
      projectId: cleanWaterTech.id,
      matchScore: 85,
      reasonCode: "skill_match:web_development"
    });
    
    // Sample impact data
    await this.createImpact({
      userId: user.id,
      projectId: renewableEnergy.id,
      region: "North America",
      country: "United States",
      location: "San Francisco, CA",
      latitude: 37,
      longitude: -122,
      impactType: "personal",
      amount: 125,
      description: "Created educational materials for renewable energy adoption"
    });
    
    await this.createImpact({
      userId: user.id,
      projectId: localFood.id, 
      region: "North America",
      country: "United States",
      location: "Oakland, CA",
      latitude: 37,
      longitude: -122,
      impactType: "personal",
      amount: 75,
      description: "Connected 5 local farmers to community members"
    });
    
    await this.createImpact({
      userId: user.id,
      projectId: digitalLiteracy.id,
      region: "North America",
      country: "United States",
      location: "Berkeley, CA",
      latitude: 37,
      longitude: -122,
      impactType: "personal",
      amount: 200,
      description: "Taught 20 seniors basic computer skills"
    });
    
    // Global impact examples
    await this.createImpact({
      userId: null,
      projectId: ruralEducation.id,
      region: "South America",
      country: "Brazil",
      location: "Rural Amazon",
      latitude: -3,
      longitude: -60,
      impactType: "collective",
      amount: 1250,
      description: "Provided digital education materials to 500 children"
    });
    
    await this.createImpact({
      userId: null,
      projectId: urbanGarden.id,
      region: "Europe",
      country: "Germany",
      location: "Berlin",
      latitude: 52,
      longitude: 13,
      impactType: "collective",
      amount: 850,
      description: "Created 15 community gardens providing food for 120 families"
    });
    
    await this.createImpact({
      userId: null,
      projectId: cleanWaterTech.id,
      region: "Africa",
      country: "Kenya",
      location: "Nairobi",
      latitude: -1,
      longitude: 36,
      impactType: "collective",
      amount: 2000,
      description: "Provided clean water access to 1,500 people"
    });
    
    // Create sample governance proposals
    const fundingProposal = await this.createProposal({
      title: "Increase Project Funding",
      description: "Proposal to increase funding for the Digital Literacy Program by 20% to expand to more community centers.",
      creatorId: user.id,
      projectId: digitalLiteracy.id,
      type: "funding",
      votingEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      threshold: 60, // 60% required to pass
      options: ["Yes", "No"]
    });
    
    const policyProposal = await this.createProposal({
      title: "New Volunteer Guidelines",
      description: "Proposal to establish new guidelines for volunteer onboarding to ensure quality and commitment for all projects.",
      creatorId: user.id,
      projectId: null, // Platform-wide policy
      type: "policy",
      votingEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      threshold: 50, // Simple majority
      options: ["Approve", "Reject", "Modify"]
    });
    
    const featureProposal = await this.createProposal({
      title: "Add Skill Certificates",
      description: "Proposal to add digital certificates that users can earn upon completing projects and verifying skills.",
      creatorId: user.id,
      projectId: null, // Platform-wide feature
      type: "platform",
      votingEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      threshold: 70, // 70% required to pass
      options: ["Implement", "Reject", "Consider Later"]
    });
    
    // Add some votes to the proposals
    await this.createVote({
      proposalId: fundingProposal.id,
      userId: user.id,
      vote: "Yes",
      reason: "This will help us reach more seniors who need digital literacy training."
    });
    
    // Add comments to proposals
    await this.createComment({
      proposalId: fundingProposal.id,
      userId: user.id,
      content: "I've been volunteering with the Digital Literacy Program for 6 months and can attest to the positive impact it has. We definitely need more funding to expand our reach.",
      parentId: null
    });
    
    await this.createComment({
      proposalId: policyProposal.id,
      userId: user.id,
      content: "I've noticed inconsistencies in the volunteer onboarding process across different projects. Standardizing guidelines would be helpful.",
      parentId: null
    });
    
    // Create sample learning paths
    const climatePath = await this.createLearningPath({
      title: "Climate Action Fundamentals",
      description: "Learn the basics of climate science and how to take effective action on climate change.",
      category: "issue-specific",
      difficulty: "beginner",
      estimatedHours: 10,
      tags: ["Climate Change", "Sustainability", "Environmental Science"],
      thumbnail: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const webDevPath = await this.createLearningPath({
      title: "Web Development for Social Impact",
      description: "Learn how to build web applications that address social challenges and create positive change.",
      category: "skill-focused",
      difficulty: "intermediate",
      estimatedHours: 20,
      tags: ["Web Development", "Social Impact", "Technology", "Programming"],
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const communityPath = await this.createLearningPath({
      title: "Community Organizing Toolkit",
      description: "Essential skills and strategies for organizing communities around shared goals and values.",
      category: "skill-focused",
      difficulty: "beginner",
      estimatedHours: 8,
      tags: ["Community", "Leadership", "Organizing", "Social Change"],
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    // Create sample modules for climate path
    await this.createLearningModule({
      pathId: climatePath.id,
      title: "Introduction to Climate Science",
      description: "Basic concepts and terminology of climate science and global warming.",
      type: "article",
      content: "https://example.com/climate-science-intro",
      duration: 30,
      sequence: 1
    });
    
    await this.createLearningModule({
      pathId: climatePath.id,
      title: "Climate Change Impacts",
      description: "How climate change is affecting different regions and ecosystems around the world.",
      type: "video",
      content: "https://example.com/climate-impacts-video",
      duration: 45,
      sequence: 2
    });
    
    await this.createLearningModule({
      pathId: climatePath.id,
      title: "Individual Climate Action",
      description: "Practical steps individuals can take to reduce their carbon footprint.",
      type: "interactive",
      content: "https://example.com/climate-action-calculator",
      duration: 60,
      sequence: 3
    });
    
    // Create sample modules for web dev path
    await this.createLearningModule({
      pathId: webDevPath.id,
      title: "HTML & CSS for Social Impact",
      description: "Build accessible, inclusive websites using semantic HTML and responsive CSS.",
      type: "tutorial",
      content: "https://example.com/html-css-social-impact",
      duration: 90,
      sequence: 1
    });
    
    await this.createLearningModule({
      pathId: webDevPath.id,
      title: "JavaScript for Interactive Advocacy",
      description: "Create interactive data visualizations and tools for advocacy campaigns.",
      type: "tutorial",
      content: "https://example.com/js-advocacy",
      duration: 120,
      sequence: 2
    });
    
    // Create sample learning path skills
    await this.createLearningPathSkill({
      pathId: climatePath.id,
      skillName: "Climate Action",
      proficiencyGain: 25
    });
    
    await this.createLearningPathSkill({
      pathId: webDevPath.id,
      skillName: "Web Development", 
      proficiencyGain: 30
    });
    
    await this.createLearningPathSkill({
      pathId: communityPath.id,
      skillName: "Project Management",
      proficiencyGain: 15
    });
    
    // Enroll user in a learning path
    await this.createUserLearningProgress({
      userId: user.id,
      pathId: webDevPath.id
    });
    
    const progress = await this.getUserPathProgress(user.id, webDevPath.id);
    if (progress) {
      await this.updateUserLearningProgress(progress.id, {
        progress: 35,
        lastModuleId: 1,
        completedModules: [1]
      });
    }
  }
}

export const storage = new MemStorage();
