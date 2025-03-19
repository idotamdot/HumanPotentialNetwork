import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { SkillBar } from "@/components/ui/skill-bar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [availableHours, setAvailableHours] = useState(user?.availableHours?.toString() || "0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: skills, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/skills`],
    enabled: !!user?.id,
  });

  // Separate skills by category
  const coreSkills = skills?.filter((skill: any) => skill.category === "core") || [];
  const passions = skills?.filter((skill: any) => skill.category === "passion") || [];

  const handleSave = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, {
        name,
        location,
        availableHours: parseInt(availableHours),
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    ) : (
                      <div className="mt-1 text-base text-gray-900">{user?.name}</div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input 
                        id="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                      />
                    ) : (
                      <div className="mt-1 text-base text-gray-900">{user?.location || "Not specified"}</div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="availability">Weekly Availability (hours)</Label>
                    {isEditing ? (
                      <Input 
                        id="availability" 
                        type="number" 
                        min="0" 
                        max="40" 
                        value={availableHours} 
                        onChange={(e) => setAvailableHours(e.target.value)} 
                      />
                    ) : (
                      <div className="mt-1 text-base text-gray-900">{user?.availableHours} hours/week</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="mt-1 flex items-center">
                      <img 
                        src={user?.avatar || "https://via.placeholder.com/100"} 
                        alt="Profile" 
                        className="h-24 w-24 rounded-full" 
                      />
                      {isEditing && (
                        <Button variant="outline" className="ml-5" disabled={true}>
                          Change
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Potential Points</Label>
                    <div className="mt-1 text-base text-gray-900 font-semibold">
                      {user?.potentialPoints?.toLocaleString() || "0"} points
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Earned through your contributions to projects
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading skills...</div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Core Skills</h3>
                      <div className="grid gap-4">
                        {coreSkills.map((skill: any) => (
                          <SkillBar
                            key={skill.id}
                            name={skill.name}
                            proficiency={skill.proficiency}
                          />
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4" size="sm" disabled={true}>
                        Add Skill
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Passions & Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {passions.map((passion: any) => (
                          <Badge
                            key={passion.id}
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {passion.name}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4" size="sm" disabled={true}>
                        Add Passion
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-700 mb-1">Skill Development</h3>
                    <p className="text-sm text-blue-600">
                      Based on your current skills and interests, you could benefit from developing knowledge in data visualization to complement your web development and data analysis skills.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-700 mb-1">Project Recommendations</h3>
                    <p className="text-sm text-green-600">
                      Your content creation skills would be highly valuable in education-focused projects, especially those targeting underserved communities.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-700 mb-1">Potential Collaboration</h3>
                    <p className="text-sm text-purple-600">
                      You might find value in connecting with David Kim, who shares your interest in climate action and has complementary technical skills.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
