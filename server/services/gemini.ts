import { GoogleGenerativeAI } from '@google/generative-ai';
import { LearningPath, LearningModule, InsertLearningPath, InsertLearningModule } from "@shared/schema";
import { storage } from "../storage";

// Function to check if we have a valid API key
function hasValidApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY && 
    typeof process.env.GEMINI_API_KEY === 'string' &&
    process.env.GEMINI_API_KEY.length > 10;
}

// Initialize the Google Generative AI client
console.log("Initializing Gemini API key exists:", !!process.env.GEMINI_API_KEY);

// We need to ask for a Gemini API key
if (!hasValidApiKey()) {
  console.warn("Missing or invalid Gemini API key. AI-powered features will not work.");
}

// Create the client only if we have a key
const genAI = hasValidApiKey() 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
  : null;

// Get the generative model (Gemini Pro)
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

export class GeminiService {
  // Generate a micro-learning path based on a topic and user interests
  static async generateMicroLearningPath(
    topic: string,
    userInterests?: string[],
    userId?: number,
    timeConstraint?: number, // in minutes
    selectedSkills?: string[] // Skills selected by user during generation
  ): Promise<{ learningPath: LearningPath; modules: LearningModule[] }> {
    try {
      // Check if we have the Gemini client
      if (!model) {
        throw new Error("Gemini API client not initialized. Please check your API key.");
      }

      // Get user skills if userId is provided
      let userSkills: string[] = [];
      if (userId) {
        // If selected skills are provided, use those instead
        if (selectedSkills && selectedSkills.length > 0) {
          userSkills = selectedSkills;
        } else {
          // Otherwise fetch from database
          const skills = await storage.getUserSkills(userId);
          userSkills = skills.map((s) => s.name);
        }
      } else if (selectedSkills && selectedSkills.length > 0) {
        // Use selected skills even if no user ID
        userSkills = selectedSkills;
      }

      // Prepare the prompt for Gemini
      const prompt = this.createMicroLearningPathPrompt(
        topic, 
        userInterests || [], 
        userSkills,
        timeConstraint
      );

      // Call the Gemini API
      console.log("Calling Gemini API for topic:", topic);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      console.log("Gemini API call successful");
      
      // Parse the response - extract the JSON
      if (!content) {
        throw new Error("Failed to generate learning path content");
      }

      // Find the JSON part of the response (usually between ``` markers)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                         content.match(/```\n([\s\S]*?)\n```/) ||
                         content.match(/({[\s\S]*})/);
                         
      let jsonContent = jsonMatch ? jsonMatch[1] : content;
      
      // Remove any text before the first { and after the last }
      jsonContent = jsonContent.trim();
      const firstBraceIndex = jsonContent.indexOf('{');
      const lastBraceIndex = jsonContent.lastIndexOf('}');
      
      if (firstBraceIndex >= 0 && lastBraceIndex >= 0) {
        jsonContent = jsonContent.substring(firstBraceIndex, lastBraceIndex + 1);
      }
      
      // Parse the JSON
      const pathData = JSON.parse(jsonContent);

      // Create the learning path
      const insertLearningPath: InsertLearningPath = {
        title: pathData.title,
        description: pathData.description,
        category: pathData.category,
        difficulty: pathData.difficulty,
        estimatedHours: pathData.estimatedHours,
        tags: pathData.tags,
        thumbnail: pathData.imageUrl || null,
        creatorId: userId || null,
        isPublished: true,
        imageUrl: pathData.imageUrl || null,
        isMicroLearning: true,
      };

      const learningPath = await storage.createLearningPath(insertLearningPath);

      // Create the modules
      const modules: LearningModule[] = [];
      for (const moduleData of pathData.modules) {
        // Set default type if not provided
        const moduleType = "content";
        
        // Create a description from title or content if not provided
        const moduleDescription = moduleData.description || moduleData.title || 
          (moduleData.content && moduleData.content.length > 100 
            ? moduleData.content.substring(0, 100) + '...' 
            : moduleData.content || 'No description available');
        
        // Map the module data to our schema
        const insertModule: InsertLearningModule = {
          pathId: learningPath.id,
          title: moduleData.title,
          description: moduleDescription,
          type: moduleType,
          content: moduleData.content,
          duration: moduleData.estimatedMinutes || 5,
          sequence: moduleData.order || 1,
          order: moduleData.order || 1,
          estimatedMinutes: moduleData.estimatedMinutes || 5,
          resourceLinks: moduleData.resourceLinks || [],
          quizQuestions: moduleData.quizQuestions || [],
        };

        const module = await storage.createLearningModule(insertModule);
        modules.push(module);
      }

      return { learningPath, modules };
    } catch (error) {
      console.error("Error generating micro-learning path:", error);
      throw new Error("Failed to generate micro-learning path");
    }
  }

  static createMicroLearningPathPrompt(
    topic: string,
    userInterests: string[],
    userSkills: string[],
    timeConstraint?: number
  ): string {
    let maxTimeMinutes = timeConstraint || 30;
    let maxModules = Math.max(3, Math.min(5, Math.floor(maxTimeMinutes / 5)));

    return `Create a micro-learning path on the topic of "${topic}".
${userInterests.length > 0 ? `The user is interested in: ${userInterests.join(", ")}.` : ""}
${userSkills.length > 0 ? `The user already has skills in: ${userSkills.join(", ")}.` : ""}
The total time for this micro-learning path should be no more than ${maxTimeMinutes} minutes.

Create a learning path with ${maxModules} modules that can be completed in small chunks of time.
For each module, include 1-2 quiz questions to test understanding.

Return the result in JSON format with the following structure:
{
  "title": "Title of the learning path",
  "description": "A concise description of what will be learned",
  "category": "One of: Technology, Climate, Health, Education, Social Justice, Economics",
  "difficulty": "One of: Beginner, Intermediate, Advanced",
  "estimatedHours": Number (keep this low for micro-learning, usually under 1),
  "tags": ["tag1", "tag2", "tag3"],
  "imageUrl": null,
  "modules": [
    {
      "title": "Module title",
      "content": "Detailed content for the module, including examples, explanations, and insights. Format with markdown.",
      "order": 1,
      "estimatedMinutes": number,
      "resourceLinks": ["url1", "url2"],
      "quizQuestions": [
        {
          "question": "Question text?",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "The correct option"
        }
      ]
    }
  ]
}

Make the content educational, engaging, and actionable. ONLY respond with the JSON, nothing else.`;
  }
}