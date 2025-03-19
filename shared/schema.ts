import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
