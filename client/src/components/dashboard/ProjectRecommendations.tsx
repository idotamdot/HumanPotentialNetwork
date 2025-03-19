import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Refresh, BadgeCheck, Clock } from "lucide-react";
import { Link } from "wouter";

export default function ProjectRecommendations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch project recommendations
  const {
    data: recommendations = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: user ? [`/api/users/${user.id}/recommendations`] : [],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Create a mutation for regenerating recommendations
  const regenerateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not logged in");
      setIsGenerating(true);
      const res = await apiRequest(
        "POST", 
        `/api/users/${user.id}/recommendations/generate`
      );
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate the recommendations query to refetch the data
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${user?.id}/recommendations`] 
      });
      
      toast({
        title: "Recommendations Updated",
        description: "Your project recommendations have been refreshed based on your skills and interests.",
        variant: "default",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update recommendations",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleRegenerateRecommendations = () => {
    regenerateMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Projects</CardTitle>
          <CardDescription>Based on your skills and interests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Updating recommendations...</div>
          <Button disabled variant="outline" size="sm">
            <Refresh className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Projects</CardTitle>
          <CardDescription>Based on your skills and interests</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load recommendations."}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleRegenerateRecommendations} 
            variant="outline" 
            size="sm"
            disabled={isGenerating || regenerateMutation.isPending}
          >
            <Refresh className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Projects</CardTitle>
        <CardDescription>Based on your skills and interests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground">No recommendations yet. Add more skills to your profile or generate new recommendations.</p>
          </div>
        ) : (
          <>
            {recommendations.slice(0, 3).map((rec: any) => (
              <Link key={rec.project.id} href={`/projects/${rec.project.id}`}>
                <div className="flex items-start p-2 rounded-md cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-4">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{rec.project.title}</h4>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-muted-foreground mr-2">
                        {rec.recommendation.matchScore}% match
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{rec.project.contributorCount} contributors</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {recommendations.length > 3 && (
              <div className="text-center">
                <Link href="/projects">
                  <Button variant="link" size="sm">
                    View all {recommendations.length} recommendations
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {recommendations.length > 0 
            ? `${recommendations.length} projects match your profile`
            : "Generate recommendations to find projects"}
        </div>
        <Button 
          onClick={handleRegenerateRecommendations} 
          variant="outline" 
          size="sm"
          disabled={isGenerating || regenerateMutation.isPending}
        >
          <Refresh className="mr-2 h-4 w-4" />
          {isGenerating || regenerateMutation.isPending ? "Generating..." : "Regenerate"}
        </Button>
      </CardFooter>
    </Card>
  );
}