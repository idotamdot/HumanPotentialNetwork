import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SkillBar } from "@/components/ui/skill-bar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MobileThemeSelector } from "@/components/ui/mobile-theme-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { skillsData } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [availableHours, setAvailableHours] = useState(user?.availableHours?.toString() || "0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [passionDialogOpen, setPassionDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState(70);
  const [newPassionName, setNewPassionName] = useState("");
  
  const { data: skills = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/skills`],
    enabled: !!user?.id,
  });

  // Separate skills by category
  const coreSkills = skills.filter((skill) => skill.category === "core");
  const passions = skills.filter((skill) => skill.category === "passion");
  
  // Add skill mutation
  const addSkillMutation = useMutation({
    mutationFn: async (skillData: { name: string; proficiency: number }) => {
      return await apiRequest("POST", "/api/skills", {
        userId: user?.id,
        name: skillData.name,
        category: "core",
        proficiency: skillData.proficiency
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/skills`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/recommendations`] });
      toast({
        title: "Skill added",
        description: "Your new skill has been added successfully."
      });
      setNewSkillName("");
      setNewSkillProficiency(70);
      setSkillDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Add passion mutation
  const addPassionMutation = useMutation({
    mutationFn: async (passionName: string) => {
      return await apiRequest("POST", "/api/skills", {
        userId: user?.id,
        name: passionName,
        category: "passion"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/skills`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/recommendations`] });
      toast({
        title: "Passion added",
        description: "Your new passion/interest has been added successfully."
      });
      setNewPassionName("");
      setPassionDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add passion/interest. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name.",
        variant: "destructive"
      });
      return;
    }
    
    addSkillMutation.mutate({
      name: newSkillName,
      proficiency: newSkillProficiency
    });
  };
  
  const handleAddPassion = () => {
    if (!newPassionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a passion/interest name.",
        variant: "destructive"
      });
      return;
    }
    
    addPassionMutation.mutate(newPassionName);
  };

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
                <div className="flex space-x-2">
                  <div className="md:hidden">
                    <MobileThemeSelector />
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
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
                      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mt-4" size="sm">
                            Add Skill
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Skill</DialogTitle>
                            <DialogDescription>
                              Add a new skill to your profile. This will help match you with relevant projects.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="skill-name">Skill Name</Label>
                              <Input
                                id="skill-name"
                                placeholder="e.g., Python Programming"
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="skill-proficiency">Proficiency (1-100)</Label>
                              <Input
                                id="skill-proficiency"
                                type="number"
                                min="1"
                                max="100"
                                value={newSkillProficiency}
                                onChange={(e) => setNewSkillProficiency(parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleAddSkill}
                              disabled={addSkillMutation.isPending || !newSkillName}
                            >
                              {addSkillMutation.isPending ? "Adding..." : "Add Skill"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={passionDialogOpen} onOpenChange={setPassionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mt-4" size="sm">
                            Add Passion
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Passion/Interest</DialogTitle>
                            <DialogDescription>
                              Add a new passion or interest to your profile. This will help you find projects that align with your values.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="passion-name">Passion/Interest Name</Label>
                              <Input
                                id="passion-name"
                                placeholder="e.g., Climate Action"
                                value={newPassionName}
                                onChange={(e) => setNewPassionName(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleAddPassion}
                              disabled={addPassionMutation.isPending || !newPassionName}
                            >
                              {addPassionMutation.isPending ? "Adding..." : "Add Passion"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                    <p className="text-sm text-green-600 mb-3">
                      Your content creation skills would be highly valuable in education-focused projects, especially those targeting underserved communities.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/projects">View Projects</a>
                      </Button>
                    </div>
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
