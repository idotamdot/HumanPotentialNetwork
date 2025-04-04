import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

export default function MicroLearningGenerator() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [interests, setInterests] = useState("");
  const [timeConstraint, setTimeConstraint] = useState("15");

  // Mutation for generating a micro-learning path
  const generateMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      interests?: string[];
      timeConstraint?: number;
    }) => {
      const res = await apiRequest("POST", "/api/micro-learning/generate", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Learning path generated!",
        description: `Your custom learning path "${data.learningPath.title}" is ready.`,
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      queryClient.invalidateQueries({ queryKey: ["/api/micro-learning"] });
      // Navigate to the newly created learning path
      setTimeout(() => {
        navigate(`/learning-paths/${data.learningPath.id}`);
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate learning path",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

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
      timeConstraint: parseInt(timeConstraint),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          Generate Micro-Learning Path
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Micro-Learning Path Generator
          </DialogTitle>
          <DialogDescription>
            Create a personalized, bite-sized learning path on any topic using AI.
            Perfect for quick skill building!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-foreground">
              What would you like to learn about? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., Climate resilience, Digital storytelling, Community organizing"
              className="col-span-3"
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
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}