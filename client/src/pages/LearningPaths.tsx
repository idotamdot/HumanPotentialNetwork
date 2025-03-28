import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Activity, 
  Tag, 
  Filter, 
  GraduationCap 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LearningPath } from "@shared/schema";

export default function LearningPaths() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Get all learning paths
  const { data: learningPaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });

  // Get user's learning progress
  const { data: userProgress } = useQuery<{path: LearningPath, progress: any}[]>({
    queryKey: ["/api/users", user?.id, "learning-paths"],
    enabled: !!user,
  });

  // Filter learning paths based on search and filters
  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || path.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || path.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get user's progress for a specific path
  const getUserProgressForPath = (pathId: number) => {
    if (!userProgress) return null;
    return userProgress.find(p => p.path.id === pathId)?.progress;
  };

  const getCategories = () => {
    if (!learningPaths) return [];
    const categories = new Set(learningPaths.map(path => path.category));
    return Array.from(categories);
  };

  const getDifficulties = () => {
    if (!learningPaths) return [];
    const difficulties = new Set(learningPaths.map(path => path.difficulty));
    return Array.from(difficulties);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Learning Paths</h1>
            <p className="text-gray-600">
              Curated learning experiences to help you develop skills and knowledge for global challenges
            </p>
          </div>
          {user && (
            <Button 
              onClick={() => navigate("/knowledge-commons")}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Knowledge Commons
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Search and Filter Section */}
        <div className="bg-muted/50 p-4 rounded-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 relative">
              <Search className="h-4 w-4 absolute left-3 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description or tags..."
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getCategories().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="all">All Levels</SelectItem>
                      {getDifficulties().map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading learning paths...</p>
          </div>
        ) : filteredPaths && filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => {
              const userPathProgress = getUserProgressForPath(path.id);
              const isEnrolled = !!userPathProgress;
              
              return (
                <Card key={path.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{path.category}</Badge>
                      <Badge variant="outline">{path.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-xl">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center mb-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" /> 
                      <span>Est. {path.estimatedHours} hours</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {path.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isEnrolled && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Progress</span>
                          <span>{userPathProgress.progress}%</span>
                        </div>
                        <Progress value={userPathProgress.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                      onClick={() => navigate(`/learning-paths/${path.id}`)}
                    >
                      {isEnrolled ? "Continue Learning" : "View Path"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1">No learning paths found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== "all" || difficultyFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Learning paths will be available soon"}
            </p>
            {(searchTerm || categoryFilter !== "all" || difficultyFilter !== "all") && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setDifficultyFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}