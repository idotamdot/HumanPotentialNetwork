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
  learningPathSkills, LearningPathSkill, InsertLearningPathSkill
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
