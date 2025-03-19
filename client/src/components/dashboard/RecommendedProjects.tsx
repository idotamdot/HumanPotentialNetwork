import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { sidebarIcons } from "@/lib/icons";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RecommendedProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [joiningProject, setJoiningProject] = useState<number | null>(null);
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/recommendations`],
    enabled: !!user?.id,
  });

  const handleJoinProject = async (projectId: number) => {
    if (!user) return;
    
    setJoiningProject(projectId);
    try {
      await apiRequest("POST", "/api/user-projects", {
        userId: user.id,
        projectId,
        role: "contributor"
      });
      
      // Invalidate both recommendations and user projects queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/recommendations`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/projects`] });
      
      toast({
        title: "Success!",
        description: "You've joined the project. Check 'My Projects' to see it.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setJoiningProject(null);
    }
  };

  const getIconForProject = (iconName: string) => {
    // Map icon names to actual React components
    const iconMap: Record<string, React.ReactNode> = {
      "ri-book-open-line": (
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
          {sidebarIcons.book}
        </span>
      ),
      "ri-earth-line": (
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
          {sidebarIcons.earth}
        </span>
      ),
      "ri-code-line": (
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </span>
      )
    };
    
    return iconMap[iconName] || (
      <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-gray-500 text-white">
        {sidebarIcons.project}
      </span>
    );
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      "Education": "bg-purple-100 text-purple-800 border-purple-200",
      "High Impact": "bg-green-100 text-green-800 border-green-200",
      "Medium Impact": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Low Impact": "bg-gray-100 text-gray-800 border-gray-200",
      "Climate Action": "bg-green-100 text-green-800 border-green-200",
      "Technology": "bg-blue-100 text-blue-800 border-blue-200",
      "Content Creation": "bg-gray-100 text-gray-800 border-gray-200",
      "Web Development": "bg-gray-100 text-gray-800 border-gray-200",
      "Project Management": "bg-gray-100 text-gray-800 border-gray-200",
    };
    
    return colors[tag] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium text-gray-900">Recommended Projects</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your skills and interests</p>
        </div>
        <Link href="/projects">
          <Button variant="link" className="text-primary">View All</Button>
        </Link>
      </CardHeader>
      <div className="border-t border-gray-200">
        {isLoading ? (
          <CardContent className="px-4 py-5">
            <div className="text-center text-gray-500">Loading recommendations...</div>
          </CardContent>
        ) : recommendations && recommendations.length > 0 ? (
          recommendations.map(({ project }: any) => (
            <div key={project.id} className="px-4 py-5 sm:p-6 border-b border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIconForProject(project.icon)}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-medium text-gray-900">{project.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={getTagColor(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{project.contributorCount} contributors</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinProject(project.id)}
                      disabled={joiningProject === project.id}
                    >
                      {joiningProject === project.id ? "Joining..." : "Join Project"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <CardContent className="px-4 py-5">
            <div className="text-center text-gray-500">No recommended projects yet.</div>
          </CardContent>
        )}
      </div>
    </Card>
  );
}
