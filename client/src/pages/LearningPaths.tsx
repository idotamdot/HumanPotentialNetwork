import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight, 
  Award, 
  Filter,
  X,
  BarChart
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { LearningPath, UserLearningProgress } from "@shared/schema";

// Helper function to determine the card color based on path category
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Technology": "from-blue-600 to-cyan-600",
    "Climate": "from-green-600 to-emerald-600",
    "Health": "from-red-600 to-rose-600",
    "Education": "from-amber-600 to-yellow-600",
    "Social Justice": "from-purple-600 to-fuchsia-600",
    "Economics": "from-slate-600 to-gray-600",
  };
  
  return colors[category] || "from-indigo-600 to-purple-600";
};

// Helper function to determine difficulty badge color
const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    "Beginner": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Intermediate": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "Advanced": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  
  return colors[difficulty] || "";
};

export default function LearningPaths() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  // Fetch all learning paths
  const { data: learningPaths, isLoading: loadingPaths } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });
  
  // Fetch user's enrolled learning paths if logged in
  const { data: userProgress, isLoading: loadingUserProgress } = useQuery<{path: LearningPath, progress: UserLearningProgress}[]>({
    queryKey: ["/api/users", user?.id, "learning-paths"],
    enabled: !!user,
  });
  
  // Extract unique categories for filtering
  const categories = learningPaths 
    ? Array.from(new Set(learningPaths.map(path => path.category)))
    : [];
  
  // Filter learning paths based on active category, search query, and difficulty
  const filteredPaths = learningPaths 
    ? learningPaths.filter(path => {
        const matchesCategory = !activeCategory || path.category === activeCategory;
        const matchesSearch = !searchQuery || 
          path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDifficulty = !selectedDifficulty || path.difficulty === selectedDifficulty;
        
        return matchesCategory && matchesSearch && matchesDifficulty;
      })
    : [];
  
  // Get user enrolled paths data
  const getUserPathProgress = (pathId: number) => {
    if (!userProgress) return null;
    const match = userProgress.find(item => item.path.id === pathId);
    return match ? match.progress : null;
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveCategory(null);
    setSelectedDifficulty(null);
    setSearchQuery("");
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Learning Paths</h1>
            <p className="text-muted-foreground mt-1">
              Discover and follow curated learning paths to gain new skills and knowledge.
            </p>
          </div>
          
          {user && userProgress && userProgress.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 mt-4 md:mt-0"
              onClick={() => document.getElementById("my-paths")?.scrollIntoView({ behavior: "smooth" })}
            >
              <BookOpen className="h-4 w-4" />
              My Learning Paths
            </Button>
          )}
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search learning paths..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedDifficulty || "Difficulty"}
                  {selectedDifficulty && (
                    <X 
                      className="h-3.5 w-3.5 ml-1 text-muted-foreground" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDifficulty(null);
                      }}
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {["Beginner", "Intermediate", "Advanced"].map(difficulty => (
                    <DropdownMenuItem 
                      key={difficulty}
                      className={selectedDifficulty === difficulty ? "bg-accent" : ""}
                      onClick={() => setSelectedDifficulty(prev => prev === difficulty ? null : difficulty)}
                    >
                      {difficulty}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedDifficulty(null)}>
                  Clear filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Clear All Filters */}
            {(activeCategory || selectedDifficulty || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
          
          {/* Category Tabs */}
          <div className="overflow-x-auto pb-1">
            <div className="flex space-x-1 min-w-max">
              <Button
                variant={activeCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(null)}
                className="text-xs sm:text-sm"
              >
                All Categories
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(prev => prev === category ? null : category)}
                  className="text-xs sm:text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* User's Learning Paths Section (if authenticated and has any) */}
        {user && userProgress && userProgress.length > 0 && (
          <div id="my-paths" className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">My Learning Paths</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProgress.map(({ path, progress }) => (
                <Card key={path.id} className="overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(path.category)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <Badge>{path.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground gap-4 mt-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{path.estimatedHours} hours</span>
                      </div>
                      {progress.progress === 100 && (
                        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600">
                          <Award className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => navigate(`/learning-paths/${path.id}`)}
                      className="w-full gap-1"
                    >
                      {progress.progress === 100 ? "View Certificate" : "Continue Learning"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* All Learning Paths Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {activeCategory ? `${activeCategory} Paths` : "All Learning Paths"}
              </h2>
            </div>
            
            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              {filteredPaths.length} {filteredPaths.length === 1 ? "path" : "paths"} found
            </p>
          </div>
          
          {loadingPaths ? (
            <div className="text-center py-12">
              <p>Loading learning paths...</p>
            </div>
          ) : filteredPaths.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No learning paths found</h3>
              <p className="mt-1 text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {(activeCategory || selectedDifficulty || searchQuery) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPaths.map(path => {
                const userPathProgress = getUserPathProgress(path.id);
                const isEnrolled = !!userPathProgress;
                const isCompleted = isEnrolled && userPathProgress.progress === 100;
                
                return (
                  <Card key={path.id} className="overflow-hidden flex flex-col">
                    <div className={`h-2 bg-gradient-to-r ${getCategoryColor(path.category)}`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <Badge>{path.category}</Badge>
                      </div>
                      <CardTitle className="line-clamp-1">{path.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      {isEnrolled && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{userPathProgress.progress}%</span>
                          </div>
                          <Progress value={userPathProgress.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {path.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {path.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{path.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{path.estimatedHours} hours</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => navigate(`/learning-paths/${path.id}`)}
                        className={`w-full gap-1 ${
                          isCompleted 
                            ? "bg-gradient-to-r from-amber-600 to-amber-600" 
                            : isEnrolled 
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                              : ""
                        }`}
                      >
                        {isCompleted 
                          ? "View Certificate" 
                          : isEnrolled 
                            ? "Continue Learning" 
                            : "Explore Path"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}