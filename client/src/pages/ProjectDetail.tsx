import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Get project details
  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  // Get user's projects to check if they're already a member
  const { data: userProjects, isLoading: loadingUserProjects } = useQuery({
    queryKey: [`/api/users/${user?.id}/projects`],
    enabled: !!user?.id,
  });

  // Check if user is already a member of this project
  const userProjectData = userProjects?.find(
    (up: any) => up.project.id === Number(id)
  );
  const isMember = !!userProjectData;

  // Join project function
  const handleJoinProject = async () => {
    if (!user) return;
    
    setIsJoining(true);
    try {
      await apiRequest("POST", "/api/user-projects", {
        userId: user.id,
        projectId: Number(id),
        role: "Contributor", // Default role
        joinDate: new Date().toISOString(),
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/projects`] });
      
      toast({
        title: "Success",
        description: "You've successfully joined the project.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Leave project function
  const handleLeaveProject = async () => {
    if (!user) return;
    
    setIsLeaving(true);
    try {
      await apiRequest("DELETE", `/api/user-projects/${user.id}/${id}`, {});
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/projects`] });
      
      toast({
        title: "Success",
        description: "You've successfully left the project.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading project details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Project not found</div>
            <Button onClick={() => setLocation("/projects")} className="mt-4">
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 text-sm">
          <button onClick={() => setLocation("/projects")} className="text-gray-500 hover:text-gray-700">
            Projects
          </button>
          <span className="mx-2 text-gray-500">›</span>
          <span className="text-gray-900">{project.title}</span>
        </div>
        
        {/* Project header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
                <Badge className={
                  project.progress > 80 
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                  {project.progress > 80 ? "Final Stage" : "Active"}
                </Badge>
              </div>
              
              <p className="mt-2 text-base text-gray-600">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-start lg:items-end">
              <div className="text-sm text-gray-600 mb-4">
                <div className="mb-1"><span className="font-medium">{project.contributorCount}</span> contributors</div>
                <div><span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</div>
              </div>
              
              {!loadingUserProjects && (
                isMember ? (
                  <Button 
                    variant="outline" 
                    onClick={handleLeaveProject}
                    disabled={isLeaving}
                  >
                    {isLeaving ? "Leaving..." : "Leave Project"}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinProject}
                    disabled={isJoining}
                  >
                    {isJoining ? "Joining..." : "Join Project"}
                  </Button>
                )
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Project Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
        
        {/* Project details tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          {/* Overview tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-2">Mission</h3>
                        <p className="text-gray-600">
                          {project.mission || "Our mission is to create sustainable solutions that address " + project.title + " through collaborative efforts and innovative approaches."}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-2">Impact Goals</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {project.impactGoals ? (
                            project.impactGoals.map((goal: string, idx: number) => (
                              <li key={idx}>{goal}</li>
                            ))
                          ) : (
                            <>
                              <li>Support at least 1,000 direct beneficiaries through project initiatives</li>
                              <li>Reduce environmental impact by implementing sustainable practices</li>
                              <li>Create a scalable model that can be replicated in other communities</li>
                              <li>Empower local stakeholders to continue the work independently</li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-2">Next Milestone</h3>
                        <div className="bg-blue-50 rounded-md p-4">
                          <div className="font-medium text-blue-800 mb-1">{project.nextMilestone}</div>
                          <div className="text-sm text-blue-700">Target completion date: {project.milestoneDate || "In progress"}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.skillsNeeded ? (
                        project.skillsNeeded.map((skill: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{skill.name}</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {skill.count} needed
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <span>Project Management</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">2 needed</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Content Creation</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">3 needed</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Data Analysis</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">Filled</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Web Development</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">1 needed</Badge>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Weekly Commitment</h3>
                      <p className="text-sm text-gray-600">
                        {project.weeklyCommitment || "This project requires approximately 3-5 hours per week from contributors."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Team tab */}
          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.team ? (
                    project.team.map((member: any, idx: number) => (
                      <div key={idx} className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                          <div className="text-sm text-gray-500">Member since {new Date(member.joinedDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://via.placeholder.com/40" alt="Project Lead" />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Maria Chen</div>
                          <div className="text-sm text-gray-500">Project Lead</div>
                          <div className="text-sm text-gray-500">Member since Jan 2023</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://via.placeholder.com/40" alt="Technical Lead" />
                          <AvatarFallback>J</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">James Wilson</div>
                          <div className="text-sm text-gray-500">Technical Lead</div>
                          <div className="text-sm text-gray-500">Member since Feb 2023</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://via.placeholder.com/40" alt="Content Creator" />
                          <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Layla Johnson</div>
                          <div className="text-sm text-gray-500">Content Creator</div>
                          <div className="text-sm text-gray-500">Member since Mar 2023</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {isMember && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Your Role</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar || "https://via.placeholder.com/40"} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-gray-500">{userProjectData?.userProject?.role || "Contributor"}</div>
                        <div className="text-sm text-gray-500">
                          Joined {userProjectData?.userProject?.joinDate 
                            ? new Date(userProjectData.userProject.joinDate).toLocaleDateString() 
                            : "recently"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Discussions tab */}
          <TabsContent value="discussions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.discussions ? (
                    project.discussions.map((discussion: any, idx: number) => (
                      <div key={idx} className="pb-6 border-b last:border-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
                            <AvatarFallback>{discussion.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{discussion.user.name}</div>
                              <div className="text-xs text-gray-500">{new Date(discussion.date).toLocaleString()}</div>
                            </div>
                            <div className="mt-1 text-gray-700">{discussion.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="pb-6 border-b">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://via.placeholder.com/32" alt="Project Lead" />
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">Maria Chen</div>
                              <div className="text-xs text-gray-500">Yesterday, 9:41 AM</div>
                            </div>
                            <div className="mt-1 text-gray-700">
                              Welcome to the project discussion board! This is where we can coordinate our efforts and share updates.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pb-6 border-b">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://via.placeholder.com/32" alt="Technical Lead" />
                            <AvatarFallback>J</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">James Wilson</div>
                              <div className="text-xs text-gray-500">Yesterday, 11:23 AM</div>
                            </div>
                            <div className="mt-1 text-gray-700">
                              I've started work on the technical implementation. We should schedule a meeting to discuss the architecture in more detail.
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {isMember && (
                  <div className="mt-6">
                    <div className="mb-3">
                      <Textarea 
                        placeholder="Add to the discussion..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button disabled={!comment.trim()}>Post Comment</Button>
                  </div>
                )}
                
                {!isMember && (
                  <div className="mt-6 text-center p-4 border rounded-md bg-gray-50">
                    <p className="text-gray-600 mb-3">Join this project to participate in discussions</p>
                    <Button onClick={handleJoinProject} disabled={isJoining}>
                      {isJoining ? "Joining..." : "Join Project"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resources tab */}
          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {project.resources ? (
                  <div className="space-y-4">
                    {project.resources.map((resource: any, idx: number) => (
                      <div key={idx} className="flex items-start p-3 border rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-gray-600">{resource.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Added by {resource.addedBy} • {new Date(resource.dateAdded).toLocaleDateString()}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">Project Plan Document</div>
                        <div className="text-sm text-gray-600">Detailed overview of project goals, timeline, and milestones</div>
                        <div className="text-xs text-gray-500 mt-1">Added by Maria Chen • March 15, 2023</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-start p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">Research Data</div>
                        <div className="text-sm text-gray-600">Baseline data and initial research findings</div>
                        <div className="text-xs text-gray-500 mt-1">Added by James Wilson • April 2, 2023</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-start p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">Design Assets</div>
                        <div className="text-sm text-gray-600">Logos, graphics, and design templates for the project</div>
                        <div className="text-xs text-gray-500 mt-1">Added by Layla Johnson • April 10, 2023</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                )}
                
                {isMember && (
                  <div className="mt-6">
                    <Button variant="outline">Upload New Resource</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}