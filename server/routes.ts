import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertSkillSchema, 
  insertUserProjectSchema, 
  insertImpactSchema,
  insertLearningPathSchema,
  insertLearningModuleSchema,
  insertUserLearningProgressSchema,
  insertLearningPathSkillSchema,
  insertGovernanceProposalSchema,
  insertGovernanceVoteSchema,
  insertGovernanceCommentSchema,
  insertMessageSchema,
  insertNotificationSchema,
  insertImpactTokenSchema,
  insertRewardItemSchema,
  insertTokenRedemptionSchema,
  insertProjectResourceSchema
} from "@shared/schema";
import { setupAuth } from "./auth";
import { RecommendationService } from "./services/recommendation";
import { OpenAIService } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Remove password before sending
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.patch("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password before sending
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Skills routes
  app.get("/api/users/:userId/skills", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const skills = await storage.getUserSkills(userId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user skills" });
    }
  });
  
  app.post("/api/skills", async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid skill data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create skill" });
    }
  });
  
  // Issues routes
  app.get("/api/issues", async (req, res) => {
    try {
      const issues = await storage.getAllIssues();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to get issues" });
    }
  });
  
  app.get("/api/issues/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }
    
    const issue = await storage.getIssue(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    res.json(issue);
  });
  
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });
  
  app.get("/api/issues/:issueId/projects", async (req, res) => {
    const issueId = parseInt(req.params.issueId);
    if (isNaN(issueId)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }
    
    try {
      const projects = await storage.getProjectsByIssue(issueId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects for issue" });
    }
  });
  
  // User-Project routes
  app.get("/api/users/:userId/projects", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const userProjects = await storage.getUserProjects(userId);
      res.json(userProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user projects" });
    }
  });
  
  app.post("/api/user-projects", async (req, res) => {
    try {
      const userProjectData = insertUserProjectSchema.parse(req.body);
      const userProject = await storage.addUserToProject(userProjectData);
      res.status(201).json(userProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add user to project" });
    }
  });
  
  app.delete("/api/user-projects/:userId/:projectId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const projectId = parseInt(req.params.projectId);
    
    if (isNaN(userId) || isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid user or project ID" });
    }
    
    try {
      const success = await storage.removeUserFromProject(userId, projectId);
      if (!success) {
        return res.status(404).json({ message: "User-project relationship not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove user from project" });
    }
  });
  
  // Project recommendations
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const recommendations = await storage.getProjectRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project recommendations" });
    }
  });
  
  // Generate recommendations using the enhanced algorithm
  app.post("/api/users/:userId/recommendations/generate", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      // Check if the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate new recommendations
      const success = await RecommendationService.generateRecommendations(userId);
      
      if (success) {
        const recommendations = await storage.getProjectRecommendations(userId);
        return res.status(200).json({ 
          message: "Recommendations generated successfully", 
          count: recommendations.length,
          recommendations
        });
      } else {
        return res.status(500).json({ message: "Failed to generate recommendations" });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "An error occurred while generating recommendations" });
    }
  });
  
  // Current user is now handled by /api/user in auth.ts

  // Impact data routes
  app.get("/api/impacts", async (req, res) => {
    try {
      const impacts = await storage.getAllImpacts();
      res.json(impacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get impact data" });
    }
  });

  app.get("/api/users/:userId/impacts", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const impacts = await storage.getUserImpacts(userId);
      res.json(impacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user impact data" });
    }
  });

  app.get("/api/impacts/collective", async (req, res) => {
    try {
      // Get all impacts and filter for collective ones (where userId is null)
      const allImpacts = await storage.getAllImpacts();
      const collectiveImpacts = allImpacts.filter(impact => impact.userId === null);
      res.json(collectiveImpacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collective impact data" });
    }
  });

  app.post("/api/impacts", async (req, res) => {
    try {
      const impactData = insertImpactSchema.parse(req.body);
      const impact = await storage.createImpact(impactData);
      res.status(201).json(impact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid impact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create impact" });
    }
  });
  
  // Micro Learning Path Generation routes
  app.post("/api/micro-learning/generate", isAuthenticated, async (req, res) => {
    try {
      const { topic, interests, timeConstraint, skills } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }
      
      const userId = req.user?.id;
      const result = await OpenAIService.generateMicroLearningPath(
        topic, 
        interests || [], 
        userId,
        timeConstraint,
        skills || []
      );
      
      res.status(201).json({
        message: "Micro-learning path generated successfully",
        learningPath: result.learningPath,
        modules: result.modules
      });
    } catch (error) {
      console.error("Error generating micro-learning path:", error);
      res.status(500).json({ message: "Failed to generate micro-learning path" });
    }
  });
  
  // Find micro-learning paths
  app.get("/api/micro-learning", async (req, res) => {
    try {
      const paths = await storage.getAllLearningPaths();
      const microPaths = paths.filter(path => path.isMicroLearning);
      res.json(microPaths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get micro-learning paths" });
    }
  });

  // Learning Paths routes
  app.get("/api/learning-paths", async (req, res) => {
    try {
      const paths = await storage.getAllLearningPaths();
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning paths" });
    }
  });
  
  app.get("/api/learning-paths/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }
    
    const path = await storage.getLearningPath(id);
    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    res.json(path);
  });
  
  app.get("/api/learning-paths/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const paths = await storage.getLearningPathsByCategory(category);
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning paths by category" });
    }
  });
  
  app.get("/api/learning-paths/tag/:tag", async (req, res) => {
    try {
      const tag = req.params.tag;
      const paths = await storage.getLearningPathsByTag(tag);
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning paths by tag" });
    }
  });
  
  app.post("/api/learning-paths", async (req, res) => {
    try {
      const pathData = insertLearningPathSchema.parse(req.body);
      const path = await storage.createLearningPath(pathData);
      res.status(201).json(path);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid learning path data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning path" });
    }
  });
  
  // Learning Modules routes
  app.get("/api/learning-paths/:pathId/modules", async (req, res) => {
    const pathId = parseInt(req.params.pathId);
    if (isNaN(pathId)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }
    
    try {
      const modules = await storage.getLearningModulesByPath(pathId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning modules" });
    }
  });
  
  app.post("/api/learning-modules", async (req, res) => {
    try {
      const moduleData = insertLearningModuleSchema.parse(req.body);
      const module = await storage.createLearningModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid learning module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning module" });
    }
  });
  
  // User Learning Progress routes
  app.get("/api/users/:userId/learning-paths", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const userPaths = await storage.getUserLearningPaths(userId);
      res.json(userPaths);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user learning paths" });
    }
  });
  
  app.get("/api/users/:userId/learning-paths/:pathId/progress", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const pathId = parseInt(req.params.pathId);
    
    if (isNaN(userId) || isNaN(pathId)) {
      return res.status(400).json({ message: "Invalid user or path ID" });
    }
    
    try {
      const progress = await storage.getUserPathProgress(userId, pathId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user learning progress" });
    }
  });
  
  app.post("/api/user-learning-progress", async (req, res) => {
    try {
      const progressData = insertUserLearningProgressSchema.parse(req.body);
      const progress = await storage.createUserLearningProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user learning progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user learning progress" });
    }
  });
  
  app.patch("/api/user-learning-progress/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid progress ID" });
    }
    
    try {
      const updatedProgress = await storage.updateUserLearningProgress(id, req.body);
      if (!updatedProgress) {
        return res.status(404).json({ message: "User learning progress not found" });
      }
      
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user learning progress" });
    }
  });
  
  // Learning Path Skills routes
  app.get("/api/learning-paths/:pathId/skills", async (req, res) => {
    const pathId = parseInt(req.params.pathId);
    if (isNaN(pathId)) {
      return res.status(400).json({ message: "Invalid learning path ID" });
    }
    
    try {
      const skills = await storage.getLearningPathSkills(pathId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning path skills" });
    }
  });
  
  app.post("/api/learning-path-skills", async (req, res) => {
    try {
      const skillData = insertLearningPathSkillSchema.parse(req.body);
      const skill = await storage.createLearningPathSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid learning path skill data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning path skill" });
    }
  });
  
  // Governance Proposal Routes
  app.get("/api/governance/proposals", async (req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get governance proposals" });
    }
  });
  
  app.get("/api/governance/proposals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }
    
    try {
      const proposal = await storage.getProposal(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to get proposal" });
    }
  });
  
  app.get("/api/projects/:projectId/proposals", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    try {
      const proposals = await storage.getProjectProposals(projectId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project proposals" });
    }
  });
  
  app.get("/api/users/:userId/proposals", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const proposals = await storage.getUserProposals(userId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user proposals" });
    }
  });
  
  app.post("/api/governance/proposals", async (req, res) => {
    try {
      const proposalData = insertGovernanceProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });
  
  app.patch("/api/governance/proposals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }
    
    try {
      const updatedProposal = await storage.updateProposal(id, req.body);
      if (!updatedProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });
  
  // Governance Vote Routes
  app.get("/api/governance/proposals/:proposalId/votes", async (req, res) => {
    const proposalId = parseInt(req.params.proposalId);
    if (isNaN(proposalId)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }
    
    try {
      const votes = await storage.getProposalVotes(proposalId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get proposal votes" });
    }
  });
  
  app.get("/api/governance/proposals/:proposalId/users/:userId/vote", async (req, res) => {
    const proposalId = parseInt(req.params.proposalId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(proposalId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid proposal or user ID" });
    }
    
    try {
      const vote = await storage.getUserVote(userId, proposalId);
      if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
      }
      
      res.json(vote);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user vote" });
    }
  });
  
  app.post("/api/governance/votes", async (req, res) => {
    try {
      const voteData = insertGovernanceVoteSchema.parse(req.body);
      const vote = await storage.createVote(voteData);
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vote" });
    }
  });
  
  app.delete("/api/governance/proposals/:proposalId/users/:userId/vote", async (req, res) => {
    const proposalId = parseInt(req.params.proposalId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(proposalId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid proposal or user ID" });
    }
    
    try {
      const success = await storage.deleteVote(userId, proposalId);
      if (!success) {
        return res.status(404).json({ message: "Vote not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vote" });
    }
  });
  
  // Governance Comment Routes
  app.get("/api/governance/proposals/:proposalId/comments", async (req, res) => {
    const proposalId = parseInt(req.params.proposalId);
    if (isNaN(proposalId)) {
      return res.status(400).json({ message: "Invalid proposal ID" });
    }
    
    try {
      const comments = await storage.getProposalComments(proposalId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get proposal comments" });
    }
  });
  
  app.post("/api/governance/comments", async (req, res) => {
    try {
      const commentData = insertGovernanceCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  
  app.delete("/api/governance/comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    
    try {
      const success = await storage.deleteComment(id);
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  
  app.delete("/api/learning-path-skills/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid skill ID" });
    }
    
    try {
      const success = await storage.deleteLearningPathSkill(id);
      if (!success) {
        return res.status(404).json({ message: "Learning path skill not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete learning path skill" });
    }
  });

  // Impact Token routes
  app.get("/api/users/:userId/tokens", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const tokens = await storage.getUserTokenHistory(userId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user tokens" });
    }
  });
  
  app.get("/api/users/:userId/token-balance", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const balance = await storage.getUserTokenBalance(userId);
      res.json({ userId, balance });
    } catch (error) {
      res.status(500).json({ message: "Failed to get token balance" });
    }
  });
  
  app.post("/api/tokens", async (req, res) => {
    try {
      const tokenData = insertImpactTokenSchema.parse(req.body);
      const token = await storage.awardTokens(tokenData);
      res.status(201).json(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid token data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to award tokens" });
    }
  });
  
  // Reward Item routes
  app.get("/api/rewards", async (req, res) => {
    try {
      // If ?available=true is in the query params, get only available rewards
      if (req.query.available === "true") {
        const rewards = await storage.getAvailableRewardItems();
        return res.json(rewards);
      }
      
      const rewards = await storage.getAllRewardItems();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reward items" });
    }
  });
  
  app.get("/api/rewards/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid reward ID" });
    }
    
    const reward = await storage.getRewardItem(id);
    if (!reward) {
      return res.status(404).json({ message: "Reward item not found" });
    }
    
    res.json(reward);
  });
  
  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardItemSchema.parse(req.body);
      const reward = await storage.createRewardItem(rewardData);
      res.status(201).json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reward item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reward item" });
    }
  });
  
  app.patch("/api/rewards/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid reward ID" });
    }
    
    try {
      const updatedReward = await storage.updateRewardItem(id, req.body);
      if (!updatedReward) {
        return res.status(404).json({ message: "Reward item not found" });
      }
      
      res.json(updatedReward);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reward item" });
    }
  });
  
  // Token Redemption routes
  app.get("/api/users/:userId/redemptions", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const redemptions = await storage.getUserRedemptions(userId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user redemptions" });
    }
  });
  
  app.post("/api/redemptions", async (req, res) => {
    try {
      const redemptionData = insertTokenRedemptionSchema.parse(req.body);
      const redemption = await storage.createRedemption(redemptionData);
      res.status(201).json(redemption);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid redemption data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create redemption" });
    }
  });
  
  app.patch("/api/redemptions/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid redemption ID" });
    }
    
    // Check for status in the body
    if (!req.body.status || !["pending", "fulfilled", "cancelled"].includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid or missing status. Must be one of: pending, fulfilled, cancelled" });
    }
    
    try {
      // Get original redemption before update
      const originalRedemption = await storage.getRedemptionById(id);
      if (!originalRedemption) {
        return res.status(404).json({ message: "Redemption not found" });
      }
      
      // Check if we're cancelling a pending redemption (only refund if it's currently pending)
      if (req.body.status === "cancelled" && originalRedemption.status === "pending") {
        // Get the reward item to include proper description
        const rewardItem = await storage.getRewardItem(originalRedemption.rewardItemId);
        if (!rewardItem) {
          return res.status(404).json({ message: "Associated reward item not found" });
        }
        
        // Refund the tokens to the user
        await storage.addUserTokens({
          userId: originalRedemption.userId,
          amount: originalRedemption.tokenAmount, // Positive amount for refund
          source: "refund",
          sourceId: originalRedemption.id,
          description: `Refund for cancelled redemption: ${rewardItem.name}`
        });
      }
      
      const updatedRedemption = await storage.updateRedemptionStatus(
        id, 
        req.body.status,
        req.body.status === "fulfilled" ? new Date() : undefined
      );
      
      if (!updatedRedemption) {
        return res.status(404).json({ message: "Redemption not found" });
      }
      
      res.json(updatedRedemption);
    } catch (error) {
      console.error("Error updating redemption status:", error);
      res.status(500).json({ message: "Failed to update redemption status" });
    }
  });

  // Message routes
  app.get("/api/users/:userId/messages", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const messages = await storage.getUserMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user messages" });
    }
  });
  
  app.get("/api/messages/conversation/:user1Id/:user2Id", async (req, res) => {
    const user1Id = parseInt(req.params.user1Id);
    const user2Id = parseInt(req.params.user2Id);
    
    if (isNaN(user1Id) || isNaN(user2Id)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }
    
    try {
      const conversation = await storage.getConversation(user1Id, user2Id);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });
  
  app.get("/api/users/:userId/messages/unread-count", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get unread message count" });
    }
  });
  
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  app.patch("/api/messages/:id/read", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    
    try {
      const message = await storage.markMessageAsRead(id);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });
  
  app.post("/api/users/:userId/messages/mark-all-read", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      await storage.markAllMessagesAsRead(userId);
      res.status(200).json({ message: "All messages marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark all messages as read" });
    }
  });
  
  // Notification routes
  app.get("/api/users/:userId/notifications", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user notifications" });
    }
  });
  
  app.get("/api/users/:userId/notifications/unread-count", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get unread notification count" });
    }
  });
  
  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notification" });
    }
  });
  
  app.patch("/api/notifications/:id/read", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }
    
    try {
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  
  app.post("/api/users/:userId/notifications/mark-all-read", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      await storage.markAllNotificationsAsRead(userId);
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });
  
  // Project Resource routes
  app.get("/api/projects/:projectId/resources", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    try {
      const resources = await storage.getProjectResources(projectId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project resources" });
    }
  });
  
  app.get("/api/project-resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    
    const resource = await storage.getProjectResource(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    res.json(resource);
  });
  
  app.get("/api/project-resources-public", async (req, res) => {
    try {
      const resources = await storage.getPublicProjectResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to get public resources" });
    }
  });
  
  app.post("/api/project-resources", async (req, res) => {
    try {
      const resourceData = insertProjectResourceSchema.parse(req.body);
      const resource = await storage.createProjectResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project resource" });
    }
  });
  
  app.patch("/api/project-resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    
    try {
      const updatedResource = await storage.updateProjectResource(id, req.body);
      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(updatedResource);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project resource" });
    }
  });
  
  app.delete("/api/project-resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    
    try {
      const success = await storage.deleteProjectResource(id);
      if (!success) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project resource" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
