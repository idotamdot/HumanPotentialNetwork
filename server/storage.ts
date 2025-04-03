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
  governanceComments, GovernanceComment, InsertGovernanceComment,
  messages, Message, InsertMessage,
  notifications, Notification, InsertNotification,
  impactTokens, ImpactToken, InsertImpactToken,
  rewardItems, RewardItem, InsertRewardItem,
  tokenRedemptions, TokenRedemption, InsertTokenRedemption,
  projectResources, ProjectResource, InsertProjectResource
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
  
  // Message methods
  getUserMessages(userId: number): Promise<Message[]>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  getUnreadMessageCount(userId: number): Promise<number>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message>;
  markAllMessagesAsRead(userId: number): Promise<void>;
  
  // Notification methods
  getUserNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  
  // Impact Token methods
  getUserTokenHistory(userId: number): Promise<ImpactToken[]>;
  getUserTokenBalance(userId: number): Promise<number>;
  awardTokens(token: InsertImpactToken): Promise<ImpactToken>;
  addUserTokens(token: InsertImpactToken): Promise<ImpactToken>;
  
  // Reward Item methods
  getAllRewardItems(): Promise<RewardItem[]>;
  getAvailableRewardItems(): Promise<RewardItem[]>;
  getRewardItem(id: number): Promise<RewardItem | undefined>;
  createRewardItem(item: InsertRewardItem): Promise<RewardItem>;
  updateRewardItem(id: number, data: Partial<RewardItem>): Promise<RewardItem | undefined>;
  
  // Token Redemption methods
  getUserRedemptions(userId: number): Promise<{redemption: TokenRedemption, reward: RewardItem}[]>;
  createRedemption(redemption: InsertTokenRedemption): Promise<TokenRedemption>;
  getRedemptionById(id: number): Promise<TokenRedemption | undefined>;
  updateRedemptionStatus(id: number, status: string, fulfillmentDate?: Date): Promise<TokenRedemption | undefined>;
  
  // Project Resource methods
  getProjectResources(projectId: number): Promise<ProjectResource[]>;
  getProjectResource(id: number): Promise<ProjectResource | undefined>;
  createProjectResource(resource: InsertProjectResource): Promise<ProjectResource>;
  updateProjectResource(id: number, data: Partial<ProjectResource>): Promise<ProjectResource | undefined>;
  deleteProjectResource(id: number): Promise<boolean>;
  getPublicProjectResources(): Promise<ProjectResource[]>;
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
  private messages: Map<number, Message>;
  private notifications: Map<number, Notification>;
  private impactTokens: Map<number, ImpactToken>;
  private rewardItems: Map<number, RewardItem>;
  private tokenRedemptions: Map<number, TokenRedemption>;
  private projectResources: Map<number, ProjectResource>;
  
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
    messages: number;
    notifications: number;
    impactTokens: number;
    rewardItems: number;
    tokenRedemptions: number;
    projectResources: number;
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
    this.messages = new Map();
    this.notifications = new Map();
    this.impactTokens = new Map();
    this.rewardItems = new Map();
    this.tokenRedemptions = new Map();
    this.projectResources = new Map();
    
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
      messages: 1,
      notifications: 1,
      impactTokens: 1,
      rewardItems: 1,
      tokenRedemptions: 1,
      projectResources: 1,
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
  
  // Message methods
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.recipientId === userId
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Newest first
  }
  
  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.recipientId === user2Id) ||
        (message.senderId === user2Id && message.recipientId === user1Id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Oldest first in conversations
  }
  
  async getUnreadMessageCount(userId: number): Promise<number> {
    return Array.from(this.messages.values()).filter(
      (message) => message.recipientId === userId && !message.read
    ).length;
  }
  
  async sendMessage(message: InsertMessage): Promise<Message> {
    const id = this.nextIds.messages++;
    const newMessage: Message = {
      ...message,
      id,
      read: false,
      createdAt: new Date()
    };
    this.messages.set(id, newMessage);
    
    // Create a notification for the recipient
    await this.createNotification({
      userId: message.recipientId,
      type: 'message',
      title: 'New Message',
      content: `You have a new message from ${(await this.getUser(message.senderId))?.name || 'a user'}`,
      read: false,
      linkUrl: `/messages/${message.senderId}`
    });
    
    return newMessage;
  }
  
  async markMessageAsRead(id: number): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) throw new Error(`Message not found with id: ${id}`);
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async markAllMessagesAsRead(userId: number): Promise<void> {
    const userMessages = Array.from(this.messages.values()).filter(
      (message) => message.recipientId === userId && !message.read
    );
    
    userMessages.forEach(message => {
      this.messages.set(message.id, { ...message, read: true });
    });
  }
  
  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Newest first
  }
  
  async getUnreadNotificationCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read)
      .length;
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.nextIds.notifications++;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date()
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) throw new Error(`Notification not found with id: ${id}`);
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read);
    
    userNotifications.forEach(notification => {
      this.notifications.set(notification.id, { ...notification, read: true });
    });
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
  
  // Impact Token methods
  async getUserTokenHistory(userId: number): Promise<ImpactToken[]> {
    return Array.from(this.impactTokens.values())
      .filter(token => token.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getUserTokenBalance(userId: number): Promise<number> {
    const tokens = await this.getUserTokenHistory(userId);
    return tokens.reduce((sum, token) => sum + token.amount, 0);
  }
  
  async awardTokens(insertToken: InsertImpactToken): Promise<ImpactToken> {
    const id = this.nextIds.impactTokens++;
    const token: ImpactToken = {
      ...insertToken,
      id,
      createdAt: new Date()
    };
    this.impactTokens.set(id, token);
    
    // Also update user's potential points
    const user = await this.getUser(token.userId);
    if (user) {
      const currentPoints = user.potentialPoints || 0;
      await this.updateUser(user.id, {
        potentialPoints: currentPoints + token.amount
      });
    }
    
    return token;
  }
  
  // Reward Item methods
  async getAllRewardItems(): Promise<RewardItem[]> {
    return Array.from(this.rewardItems.values());
  }
  
  async getAvailableRewardItems(): Promise<RewardItem[]> {
    return Array.from(this.rewardItems.values())
      .filter(item => item.available);
  }
  
  async getRewardItem(id: number): Promise<RewardItem | undefined> {
    return this.rewardItems.get(id);
  }
  
  async createRewardItem(insertItem: InsertRewardItem): Promise<RewardItem> {
    const id = this.nextIds.rewardItems++;
    const item: RewardItem = {
      ...insertItem,
      id,
      createdAt: new Date()
    };
    this.rewardItems.set(id, item);
    return item;
  }
  
  async updateRewardItem(id: number, data: Partial<RewardItem>): Promise<RewardItem | undefined> {
    const item = await this.getRewardItem(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...data };
    this.rewardItems.set(id, updatedItem);
    return updatedItem;
  }
  
  // Token Redemption methods
  async getUserRedemptions(userId: number): Promise<{redemption: TokenRedemption, reward: RewardItem}[]> {
    const redemptions = Array.from(this.tokenRedemptions.values())
      .filter(redemption => redemption.userId === userId)
      .sort((a, b) => b.redemptionDate.getTime() - a.redemptionDate.getTime());
    
    return redemptions.map(redemption => {
      const reward = this.rewardItems.get(redemption.rewardItemId);
      if (!reward) throw new Error(`Reward item not found for id: ${redemption.rewardItemId}`);
      return { redemption, reward };
    });
  }
  
  async createRedemption(insertRedemption: InsertTokenRedemption): Promise<TokenRedemption> {
    // Verify user has enough tokens
    const userBalance = await this.getUserTokenBalance(insertRedemption.userId);
    const rewardItem = await this.getRewardItem(insertRedemption.rewardItemId);
    
    if (!rewardItem) {
      throw new Error(`Reward item not found for id: ${insertRedemption.rewardItemId}`);
    }
    
    if (userBalance < insertRedemption.tokenAmount) {
      throw new Error(`Insufficient token balance: ${userBalance} < ${insertRedemption.tokenAmount}`);
    }
    
    if (!rewardItem.available) {
      throw new Error(`Reward item is not available: ${rewardItem.name}`);
    }
    
    // Create redemption record
    const id = this.nextIds.tokenRedemptions++;
    const redemption: TokenRedemption = {
      ...insertRedemption,
      id,
      status: "pending",
      redemptionDate: new Date(),
      fulfillmentDate: null
    };
    this.tokenRedemptions.set(id, redemption);
    
    // Record the token spend as a negative amount
    await this.awardTokens({
      userId: insertRedemption.userId,
      amount: -insertRedemption.tokenAmount,
      source: "redemption",
      sourceId: id,
      description: `Redeemed for: ${rewardItem.name}`
    });
    
    return redemption;
  }
  
  async getRedemptionById(id: number): Promise<TokenRedemption | undefined> {
    return this.tokenRedemptions.get(id);
  }
  
  async updateRedemptionStatus(id: number, status: string, fulfillmentDate?: Date): Promise<TokenRedemption | undefined> {
    const redemption = this.tokenRedemptions.get(id);
    if (!redemption) return undefined;
    
    const updatedRedemption: TokenRedemption = {
      ...redemption,
      status,
      fulfillmentDate: status === "fulfilled" ? fulfillmentDate || new Date() : redemption.fulfillmentDate
    };
    
    this.tokenRedemptions.set(id, updatedRedemption);
    return updatedRedemption;
  }
  
  async addUserTokens(insertToken: InsertImpactToken): Promise<ImpactToken> {
    // This is an alias for awardTokens, used for refunds and other token additions
    return this.awardTokens(insertToken);
  }
  
  // Project Resource methods
  async getProjectResources(projectId: number): Promise<ProjectResource[]> {
    return Array.from(this.projectResources.values()).filter(
      (resource) => resource.projectId === projectId
    );
  }

  async getProjectResource(id: number): Promise<ProjectResource | undefined> {
    return this.projectResources.get(id);
  }

  async createProjectResource(insertResource: InsertProjectResource): Promise<ProjectResource> {
    const id = this.nextIds.projectResources++;
    const resource: ProjectResource = {
      ...insertResource,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projectResources.set(id, resource);
    return resource;
  }

  async updateProjectResource(id: number, data: Partial<ProjectResource>): Promise<ProjectResource | undefined> {
    const resource = await this.getProjectResource(id);
    if (!resource) return undefined;
    
    const updatedResource = {
      ...resource,
      ...data,
      updatedAt: new Date()
    };
    this.projectResources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteProjectResource(id: number): Promise<boolean> {
    return this.projectResources.delete(id);
  }

  async getPublicProjectResources(): Promise<ProjectResource[]> {
    return Array.from(this.projectResources.values()).filter(
      (resource) => resource.visibility === "public"
    );
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
    
    // Create sample Impact Tokens for the user
    await this.awardTokens({
      userId: user.id,
      amount: 150,
      source: "project_completion",
      sourceId: digitalLiteracy.id,
      description: "Completed Digital Literacy Program milestone"
    });
    
    await this.awardTokens({
      userId: user.id,
      amount: 75,
      source: "governance",
      sourceId: fundingProposal.id,
      description: "Created and participated in governance proposal"
    });
    
    await this.awardTokens({
      userId: user.id,
      amount: 200,
      source: "learning_path",
      sourceId: 1, // Placeholder for a learning path
      description: "Completed Climate Action Learning Path"
    });
    
    // Create sample reward items
    await this.createRewardItem({
      name: "HPN Digital Certificate",
      description: "A digital certificate recognizing your contributions to the Human Potential Network",
      category: "digital",
      tokenCost: 100,
      available: true,
      image: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f"
    });
    
    await this.createRewardItem({
      name: "30-min Mentoring Session",
      description: "A private mentoring session with a subject matter expert of your choice",
      category: "experience",
      tokenCost: 200,
      available: true,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    });
    
    await this.createRewardItem({
      name: "Donate to Selected Cause",
      description: "Donate your tokens to a cause you care about (we'll match your donation)",
      category: "donation",
      tokenCost: 50,
      available: true,
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6"
    });
    
    await this.createRewardItem({
      name: "HPN Sustainable T-shirt",
      description: "An eco-friendly t-shirt featuring the Human Potential Network logo",
      category: "physical",
      tokenCost: 300,
      available: true, 
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531"
    });
    
    await this.createRewardItem({
      name: "Featured Profile Spotlight",
      description: "Get your profile featured on the HPN homepage for one week",
      category: "digital",
      tokenCost: 150,
      available: true,
      image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d"
    });
    
    // Create a sample redemption
    await this.createRedemption({
      userId: user.id,
      rewardItemId: 1, // Digital Certificate
      tokenAmount: 100
    });
    
    // Create sample project resources
    await this.createProjectResource({
      type: "document",
      title: "Project Charter",
      description: "Official project charter outlining goals and objectives",
      projectId: renewableEnergy.id,
      addedById: user.id,
      content: "# Renewable Energy Advocates Project Charter\n\n## Mission\nTo educate and inspire communities about renewable energy solutions.\n\n## Goals\n- Create educational materials for different age groups\n- Host 5 community workshops\n- Develop a simple starter guide for home solar implementation",
      tags: ["documentation", "guidelines"],
      url: null,
      visibility: "project"
    });
    
    await this.createProjectResource({
      type: "link",
      title: "Educational Resources Directory",
      description: "Collection of external resources for renewable energy education",
      projectId: renewableEnergy.id,
      addedById: user.id,
      content: null,
      tags: ["education", "external"],
      url: "https://www.energy.gov/energysaver/renewable-energy",
      visibility: "public"
    });
    
    await this.createProjectResource({
      type: "code",
      title: "Solar Calculator",
      description: "Simple calculator to estimate solar panel requirements and savings",
      projectId: renewableEnergy.id,
      addedById: user.id,
      content: "function calculateSolarNeeds(monthlyKWh, sunHoursPerDay) {\n  const systemSize = monthlyKWh / (30 * sunHoursPerDay * 0.78);\n  const panelCount = Math.ceil(systemSize * 1000 / 350);\n  return {\n    systemSizeKW: systemSize.toFixed(2),\n    recommendedPanels: panelCount,\n    estimatedCost: (panelCount * 500).toFixed(2)\n  };\n}",
      tags: ["tool", "calculator"],
      url: null,
      visibility: "project"
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
