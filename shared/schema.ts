import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Learning path related schemas
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // skill-focused, issue-specific, project-related, etc.
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedHours: integer("estimated_hours").notNull(),
  tags: text("tags").array().notNull(),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
});

export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull().references(() => learningPaths.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // video, article, quiz, exercise, etc.
  content: text("content").notNull(), // URL or markdown content
  duration: integer("duration").notNull(), // in minutes
  sequence: integer("sequence").notNull(), // order in the learning path
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
  createdAt: true,
});

export const userLearningProgress = pgTable("user_learning_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  pathId: integer("path_id").notNull().references(() => learningPaths.id),
  progress: integer("progress").default(0), // 0-100
  enrolled: boolean("enrolled").default(true),
  lastModuleId: integer("last_module_id").references(() => learningModules.id),
  completedModules: integer("completed_modules").array().default([]),
  startedAt: timestamp("started_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserLearningProgressSchema = createInsertSchema(userLearningProgress).omit({
  id: true,
  progress: true,
  enrolled: true,
  startedAt: true,
  lastAccessedAt: true,
  completedAt: true,
});

export const learningPathSkills = pgTable("learning_path_skills", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull().references(() => learningPaths.id),
  skillName: text("skill_name").notNull(),
  proficiencyGain: integer("proficiency_gain").default(10), // how much this path helps with skill
});

export const insertLearningPathSkillSchema = createInsertSchema(learningPathSkills).omit({
  id: true,
});

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location"),
  avatar: text("avatar"),
  availableHours: integer("available_hours"),
  potentialPoints: integer("potential_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  potentialPoints: true,
  createdAt: true,
});

// Skills schema
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // core or passion
  proficiency: integer("proficiency"), // For core skills, 0-100
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

// Issues schema (global challenges)
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  urgency: text("urgency").notNull(), // urgent, high, medium, low
  projectCount: integer("project_count").default(0),
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
  projectCount: true,
});

// Projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  issueId: integer("issue_id").references(() => issues.id),
  progress: integer("progress").default(0), // 0-100
  status: text("status").notNull(), // active, completed, etc.
  tags: text("tags").array().notNull(), // skills, categories, impact level
  contributorCount: integer("contributor_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  nextMilestone: text("next_milestone"),
  nextMilestoneDate: timestamp("next_milestone_date"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  progress: true,
  contributorCount: true,
  createdAt: true,
});

// User-Project relationship (active projects)
export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
  role: text("role"), // contributor, leader, etc.
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertUserProjectSchema = createInsertSchema(userProjects).omit({
  id: true,
  joinedAt: true,
});

// Project recommendations
export const projectRecommendations = pgTable("project_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
  matchScore: integer("match_score").notNull(), // 0-100
  reasonCode: text("reason_code"), // skill match, passion match, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectRecommendationSchema = createInsertSchema(projectRecommendations).omit({
  id: true,
  createdAt: true,
});

// Impact data schema
export const impacts = pgTable("impacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // null for collective/global impacts
  projectId: integer("project_id").references(() => projects.id),
  region: text("region").notNull(), // Continent or major region
  country: text("country").notNull(),
  location: text("location").notNull(), // City or specific area
  latitude: integer("latitude").notNull(), // Stored as number
  longitude: integer("longitude").notNull(), // Stored as number
  impactType: text("impact_type").notNull(), // personal or collective
  amount: integer("amount").notNull(), // Quantified impact value (points, people affected, etc.)
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
});

export const insertImpactSchema = createInsertSchema(impacts).omit({
  id: true,
  date: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type UserProject = typeof userProjects.$inferSelect;
export type InsertUserProject = z.infer<typeof insertUserProjectSchema>;

export type ProjectRecommendation = typeof projectRecommendations.$inferSelect;
export type InsertProjectRecommendation = z.infer<typeof insertProjectRecommendationSchema>;

export type Impact = typeof impacts.$inferSelect;
export type InsertImpact = z.infer<typeof insertImpactSchema>;

// Learning path types
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type UserLearningProgress = typeof userLearningProgress.$inferSelect;
export type InsertUserLearningProgress = z.infer<typeof insertUserLearningProgressSchema>;

export type LearningPathSkill = typeof learningPathSkills.$inferSelect;
export type InsertLearningPathSkill = z.infer<typeof insertLearningPathSkillSchema>;
