import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLearningPathGenerator } from "@/hooks/useLearningPathGenerator";
import { Skill } from "@shared/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ChevronRight, Clock, Lightbulb, Brain, LightbulbIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function MicroLearningGenerator() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("topic");
  const [topic, setTopic] = useState("");
  const [interests, setInterests] = useState("");
  const [timeConstraint, setTimeConstraint] = useState("15");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Fetch user skills if available
  const { data: userSkills } = useQuery<Skill[]>({
    queryKey: ["/api/users", user?.id, "skills"],
    enabled: !!user && open,
  });
  
  // Process user skills from comma-separated list if needed
  const processedSkills = useMemo(() => {
    if (!userSkills || userSkills.length === 0) return [];
    
    // Handle both array of skill objects and potential comma-separated strings
    const expandedSkills: {id: number, name: string}[] = [];
    
    userSkills.forEach(skill => {
      // Check if the skill name contains commas (comma-separated list)
      if (skill.name.includes(',')) {
        // Split the comma-separated skill names and create virtual skill objects
        const skillNames = skill.name.split(',').map(s => s.trim()).filter(Boolean);
        skillNames.forEach((name, index) => {
          expandedSkills.push({
            id: skill.id * 100 + index, // Generate unique IDs
            name
          });
        });
      } else {
        // Just add the skill as-is
        expandedSkills.push({
          id: skill.id,
          name: skill.name
        });
      }
    });
    
    return expandedSkills;
  }, [userSkills]);
  
  // Use the new hook for generating a micro-learning path
  const generateMutation = useLearningPathGenerator();
  
  // Handle success of path generation
  useEffect(() => {
    if (generateMutation.isSuccess && generateMutation.data) {
      toast({
        title: "Learning path generated!",
        description: `Your custom learning path "${generateMutation.data.learningPath.title}" is ready.`,
      });
      
      // Reset form state
      setTimeout(() => {
        setOpen(false);
        setTopic("");
        setInterests("");
        setSelectedSkills([]);
        setActiveTab("topic");
        setGenerationStep(0);
        setGenerationProgress(0);
        
        // Navigate to the newly created learning path
        navigate(`/learning-paths/${generateMutation.data.learningPath.id}`);
      }, 1000);
    }
  }, [generateMutation.isSuccess, generateMutation.data, toast, navigate]);

  // Track generation progress with animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (generateMutation.isPending && generationStep < 3) {
      interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generateMutation.isPending]);
  
  // Progress animation effect
  useEffect(() => {
    if (generateMutation.isPending) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          // Increment progress but never reach 100% until complete
          const nextProgress = prev + (Math.random() * 5);
          return Math.min(nextProgress, 95);
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else if (!generateMutation.isPending && generateMutation.isSuccess) {
      // Complete the progress instantly on success
      setGenerationProgress(100);
    } else {
      // Reset progress
      setGenerationProgress(0);
    }
  }, [generateMutation.isPending, generateMutation.isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Topic is required",
        description: "Please enter a topic for your learning path.",
        variant: "destructive",
      });
      return;
    }

    // Process interests into an array
    const interestsArray = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0);

    generateMutation.mutate({
      topic: topic.trim(),
      interests: interestsArray,
      skills: selectedSkills,
      timeConstraint: parseInt(timeConstraint),
    });
  };
  
  // Handle skill selection toggle
  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName)
        ? prev.filter(sk => sk !== skillName)
        : [...prev, skillName]
    );
  };
  
  // Move to next tab
  const goToNextTab = () => {
    if (activeTab === "topic") {
      setActiveTab("skills");
    } else if (activeTab === "skills") {
      setActiveTab("generate");
    }
  };
  
  // Get the generation step description
  const getGenerationStepDescription = () => {
    switch (generationStep) {
      case 0:
        return "Analyzing your topic and preferences...";
      case 1:
        return "Creating customized learning modules...";
      case 2:
        return "Organizing your micro-learning path...";
      case 3:
        return "Finalizing and preparing content...";
      default:
        return "Processing your request...";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate Micro-Learning Path
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Micro-Learning Path Generator
          </DialogTitle>
          <DialogDescription>
            Create a personalized, bite-sized learning path on any topic using AI.
            Perfect for quick skill building with automatic progress tracking!
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
          {/* Tab List */}
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="topic" disabled={generateMutation.isPending}>
              1. Topic
            </TabsTrigger>
            <TabsTrigger value="skills" disabled={!topic.trim() || generateMutation.isPending}>
              2. Skills
            </TabsTrigger>
            <TabsTrigger value="generate" disabled={!topic.trim() || generateMutation.isPending}>
              3. Generate
            </TabsTrigger>
          </TabsList>
          
          {/* Topic Tab */}
          <TabsContent value="topic">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-foreground">
                  What would you like to learn about? <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g., Climate resilience, Digital storytelling, Community organizing"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-foreground">
                  Your interests (comma separated)
                </Label>
                <Textarea
                  id="interests"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="E.g., Technology, Environment, Education"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Adding your interests helps the AI personalize your learning path.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-constraint" className="text-foreground">
                  Time available (minutes)
                </Label>
                <Select
                  value={timeConstraint}
                  onValueChange={setTimeConstraint}
                >
                  <SelectTrigger id="time-constraint">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={goToNextTab} 
                  disabled={!topic.trim()} 
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="text-base font-medium">Select Your Skills</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose skills you already have to help tailor the learning path to your knowledge level.
                </p>
                
                {processedSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {processedSkills.map(skill => (
                      <div key={skill.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill.id}`} 
                          checked={selectedSkills.includes(skill.name)}
                          onCheckedChange={() => toggleSkill(skill.name)}
                        />
                        <Label htmlFor={`skill-${skill.id}`} className="text-sm">
                          {skill.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 mb-4 border rounded-md">
                    <LightbulbIcon className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {user ? "You haven't added any skills yet." : "Sign in to use your profile skills."}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-foreground">Additional skills (selected: {selectedSkills.length})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill} ✕
                      </Badge>
                    ))}
                    
                    {selectedSkills.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No skills selected. The generator will create content for beginners.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("topic")}
                >
                  Back
                </Button>
                <Button 
                  onClick={goToNextTab} 
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Generate Tab */}
          <TabsContent value="generate">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <h3 className="text-base font-medium mb-2">Ready to Generate Your Learning Path</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Topic:
                    </span>
                    <span className="font-medium">{topic}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Time:
                    </span>
                    <span>{timeConstraint} minutes</span>
                  </div>
                  
                  {interests && (
                    <div className="text-sm">
                      <span className="flex items-center gap-1 mb-1">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Interests:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {interests.split(',').map((interest, i) => interest.trim() && (
                          <Badge key={i} variant="outline" className="text-xs">{interest.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedSkills.length > 0 && (
                    <div className="text-sm">
                      <span className="flex items-center gap-1 mb-1">
                        <Brain className="h-4 w-4 text-indigo-500" />
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSkills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {generateMutation.isPending && (
                <div className="text-center py-2 space-y-3">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-muted-foreground">{getGenerationStepDescription()}</span>
                    <span className="font-medium">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <div className="flex justify-center mt-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("skills")}
                  disabled={generateMutation.isPending}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={generateMutation.isPending || !topic.trim()}
                  className="gap-2"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Path
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}