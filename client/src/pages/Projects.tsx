import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect, useState } from "react";

export default function Projects() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [defaultTab, setDefaultTab] = useState("my-projects");
  
  // Parse the URL to get the issueId if present
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const issueId = urlParams.get('issueId');
  
  // If issueId is present, set the default tab to "all"
  useEffect(() => {
    if (issueId) {
      setDefaultTab("all");
    }
  }, [issueId]);
  
  const { data: userProjects, isLoading: loadingUserProjects } = useQuery({
    queryKey: [`/api/users/${user?.id}/projects`],
    enabled: !!user?.id,
  });
  
  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: [`/api/users/${user?.id}/recommendations`],
    enabled: !!user?.id,
  });
  
  // If issueId is present, fetch projects for that issue, otherwise fetch all projects
  const projectsQueryKey = issueId ? [`/api/issues/${issueId}/projects`] : ["/api/projects"];
  
  const { data: projects, isLoading: loadingAllProjects } = useQuery({
    queryKey: projectsQueryKey,
  });
  
  // If we have an issueId, also fetch the issue details
  const { data: issueDetails } = useQuery({
    queryKey: [`/api/issues/${issueId}`],
    enabled: !!issueId,
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {issueId && issueDetails ? `Projects for ${issueDetails.title}` : "Projects"}
        </h1>
        <p className="mt-2 text-gray-600">
          {issueId && issueDetails 
            ? issueDetails.description 
            : "Manage your projects and find new opportunities to contribute."
          }
        </p>
        {issueId && (
          <div className="mt-4">
            <Link href="/issues">
              <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10">
                ← Back to Global Issues
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="all">{issueId ? `${issueDetails?.title} Projects` : "All Projects"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-projects" className="mt-6">
            {loadingUserProjects ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading your projects...</div>
              </div>
            ) : userProjects && userProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userProjects.map(({ project, userProject }: any) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap md:flex-nowrap items-start">
                        <div className="w-full md:w-3/4 pr-0 md:pr-6">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium">{project.title}</h3>
                            <Badge className={
                              project.progress > 80 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }>
                              {project.progress > 80 ? "Final Stage" : "Active"}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                              {userProject.role}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{project.description}</p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} />
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag: string, i: number) => (
                              <Badge key={i} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {project.nextMilestone && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Next milestone:</span> {project.nextMilestone}
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full md:w-1/4 mt-4 md:mt-0 flex md:flex-col md:items-end justify-between">
                          <div className="text-sm text-gray-600">
                            <div className="mb-2"><span className="font-medium">{project.contributorCount}</span> contributors</div>
                          </div>
                          
                          <div className="space-y-2">
                            <Link href={`/projects/${project.id}`}>
                              <Button className="w-full" size="sm">View Project</Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              size="sm"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  await apiRequest("DELETE", `/api/user-projects/${user?.id}/${project.id}`, {});
                                  queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/projects`] });
                                } catch (error) {
                                  console.error("Error leaving project:", error);
                                }
                              }}
                            >
                              Leave Project
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't joined any projects yet. Check out recommendations based on your skills!</p>
                  <Button onClick={() => document.querySelector('[data-value="recommended"]')?.click()}>
                    View Recommended Projects
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-6">
            {loadingRecommendations ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Finding recommendations for you...</div>
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(({ project, recommendation }: any) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium">{project.title}</h3>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {recommendation.matchScore}% match
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 3).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">{project.contributorCount}</span> contributors
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={async () => {
                            try {
                              await apiRequest("POST", "/api/user-projects", {
                                userId: user?.id,
                                projectId: project.id,
                                role: "Contributor",
                                joinDate: new Date().toISOString(),
                              });
                              
                              // Invalidate relevant queries to refresh the data
                              queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/projects`] });
                              queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/recommendations`] });
                              
                              // Optionally switch to my projects tab
                              document.querySelector('[data-value="my-projects"]')?.click();
                            } catch (error) {
                              console.error("Error joining project:", error);
                            }
                          }}
                        >
                          Join Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations</h3>
                  <p className="text-gray-600 mb-6">
                    We don't have any project recommendations for you yet. 
                    Try updating your skills and interests in your profile.
                  </p>
                  <Button>Browse All Projects</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {loadingAllProjects ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading projects...</div>
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 3).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">{project.contributorCount}</span> contributors
                        </div>
                        
                        <Link href={`/projects/${project.id}`}>
                          <Button className="w-full">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">No projects available</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
