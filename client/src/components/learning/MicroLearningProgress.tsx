import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LearningModule, UserLearningProgress } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, Clock, Award, ChevronRight } from "lucide-react";

interface MicroLearningProgressProps {
  pathId: number;
  modules?: LearningModule[];
  userProgress?: UserLearningProgress;
  onNavigateToPath?: () => void;
  showDetailed?: boolean;
}

export default function MicroLearningProgress({
  pathId,
  modules = [],
  userProgress,
  onNavigateToPath,
  showDetailed = false,
}: MicroLearningProgressProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // If no progress is provided, fetch it
  const { data: fetchedProgress } = useQuery<UserLearningProgress>({
    queryKey: ["/api/users", user?.id, "learning-paths", pathId, "progress"],
    enabled: !!user && !userProgress && pathId > 0,
  });
  
  // Combine provided or fetched progress
  const progress = userProgress || fetchedProgress;
  
  // Is the user enrolled in this path?
  const isEnrolled = !!progress;
  
  // Is the path completed?
  const isCompleted = isEnrolled && progress?.progress === 100;
  
  // Calculate time to complete
  const totalTimeMinutes = modules.reduce((acc, module) => acc + (module.duration || 5), 0);
  const timeRemaining = !isEnrolled || !progress?.completedModules 
    ? totalTimeMinutes 
    : modules
        .filter(m => !progress.completedModules?.includes(m.id))
        .reduce((acc, m) => acc + (m.duration || 5), 0);
  
  // Format time display
  const formatTimeDisplay = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !pathId) throw new Error("Cannot enroll: user or path ID missing");
      
      const res = await apiRequest("POST", "/api/user-learning-progress", {
        userId: user.id,
        pathId: pathId,
        lastModuleId: null,
        completedModules: []
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrolled successfully",
        description: "You've been enrolled in this micro-learning path",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths", pathId, "progress"] });
      setAnimateProgress(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle enrollment
  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in learning paths",
        variant: "destructive",
      });
      return;
    }
    
    enrollMutation.mutate();
  };
  
  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Simple version shows just the progress bar and minimal info
  if (!showDetailed) {
    return (
      <div className="space-y-2">
        {isEnrolled && (
          <>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {isCompleted 
                  ? "Completed" 
                  : `${Math.round(progress?.progress || 0)}% complete`}
              </span>
              <span className="text-muted-foreground flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {isCompleted 
                  ? formatTimeDisplay(totalTimeMinutes) 
                  : timeRemaining > 0 
                    ? `${formatTimeDisplay(timeRemaining)} left` 
                    : "Almost done!"}
              </span>
            </div>
            <Progress 
              value={progress?.progress || 0} 
              className={`h-2 transition-all duration-1000 ease-out ${animateProgress ? "" : "w-0"}`} 
            />
          </>
        )}
        
        <div className="flex justify-between mt-2">
          <div>
            {isCompleted && (
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600">
                <Award className="h-3.5 w-3.5 mr-1" /> Completed
              </Badge>
            )}
          </div>
          
          <Button
            size="sm"
            variant={isEnrolled ? "default" : "outline"}
            onClick={isEnrolled ? onNavigateToPath : handleEnroll}
            className={isEnrolled ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending 
              ? "Enrolling..." 
              : isEnrolled 
                ? (isCompleted ? "View Certificate" : "Continue") 
                : "Start Learning"}
            {isEnrolled && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    );
  }
  
  // Detailed version shows modules, progress, and more information
  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Your Progress</span>
          {isCompleted && (
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600">
              <Award className="h-3.5 w-3.5 mr-1" /> Completed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEnrolled ? (
          <>
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium">{Math.round(progress?.progress || 0)}%</span>
                <span className="text-muted-foreground flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {isCompleted 
                    ? `Completed in ${formatTimeDisplay(totalTimeMinutes)}` 
                    : timeRemaining > 0 
                      ? `${formatTimeDisplay(timeRemaining)} remaining` 
                      : "Almost done!"}
                </span>
              </div>
              <Progress 
                value={progress?.progress || 0} 
                className={`h-2.5 transition-all duration-1000 ease-out ${animateProgress ? "" : "w-0"}`} 
              />
            </div>
            
            {/* Module progress list */}
            <div className="space-y-2.5 mt-4">
              {modules.map((module, index) => {
                const isModuleCompleted = progress?.completedModules?.includes(module.id);
                
                return (
                  <div key={module.id} className="flex items-center gap-3">
                    <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                      isModuleCompleted 
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isModuleCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : index + 1}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{module.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration || 5} min
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={onNavigateToPath}
            >
              {isCompleted ? "View Certificate" : "Continue Learning"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Track your progress and earn a certificate when you complete this micro-learning path.
            </p>
            <Button 
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {enrollMutation.isPending ? "Enrolling..." : "Start Learning"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}