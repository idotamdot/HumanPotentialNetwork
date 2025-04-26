import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LearningPath, LearningModule } from "@shared/schema";

/**
 * Hook for generating learning paths using AI
 * 
 * @returns Mutation object for generating learning paths
 */
export function useLearningPathGenerator() {
  return useMutation({
    mutationFn: async ({ 
      topic,
      interests,
      timeConstraint,
      skills 
    }: { 
      topic: string; 
      interests?: string[]; 
      timeConstraint?: number; 
      skills?: string[] 
    }) => {
      // Input validation
      if (!topic) {
        throw new Error("Topic is required");
      }

      // Prepare payload
      const payload = {
        topic,
        interests: interests || [],
        timeConstraint: timeConstraint || 30,
        skills: skills || []
      };

      // Send request to generate micro-learning path using the API
      const response = await apiRequest("POST", "/api/micro-learning/generate", payload);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate learning path");
      }

      return data as {
        message: string;
        learningPath: LearningPath;
        modules: LearningModule[];
      };
    },
    onSuccess: () => {
      // Invalidate learning paths queries when a new path is created
      queryClient.invalidateQueries({ queryKey: ["/api/micro-learning"] });
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
    }
  });
}