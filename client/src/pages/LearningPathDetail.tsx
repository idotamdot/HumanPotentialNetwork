import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Video, 
  Code, 
  ExternalLink,
  Download,
  Printer,
  X
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LearningPath, LearningModule, UserLearningProgress, InsertUserLearningProgress } from "@shared/schema";
import Certificate from "../components/learning/Certificate";

export default function LearningPathDetail() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/learning-paths/:id");
  const pathId = match ? parseInt(params.id) : 0;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Fetch learning path data
  const { data: learningPath, isLoading: loadingPath } = useQuery<LearningPath>({
    queryKey: ["/api/learning-paths", pathId],
    enabled: pathId > 0,
  });

  // Fetch learning modules
  const { data: modules, isLoading: loadingModules } = useQuery<LearningModule[]>({
    queryKey: ["/api/learning-paths", pathId, "modules"],
    enabled: pathId > 0,
  });

  // Fetch user's progress if logged in
  const { data: userProgress, isLoading: loadingProgress } = useQuery<UserLearningProgress>({
    queryKey: ["/api/users", user?.id, "learning-paths", pathId, "progress"],
    enabled: !!user && pathId > 0,
  });

  // Mutations for user progress
  const enrollMutation = useMutation({
    mutationFn: async (data: InsertUserLearningProgress) => {
      const res = await apiRequest("POST", "/api/user-learning-progress", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in this learning path",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths", pathId, "progress"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { id: number, progress: Partial<UserLearningProgress> }) => {
      const res = await apiRequest("PATCH", `/api/user-learning-progress/${data.id}`, data.progress);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "learning-paths", pathId, "progress"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Helper function to determine if a module is completed
  const isModuleCompleted = (moduleId: number) => {
    if (!userProgress || !userProgress.completedModules) return false;
    return userProgress.completedModules.includes(moduleId);
  };

  // Helper function to mark a module as completed
  const markModuleCompleted = (moduleId: number) => {
    if (!userProgress || !user) return;
    
    // Get existing completed modules
    const completedModules = [...(userProgress.completedModules || [])];
    
    // Add the new module if not already there
    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }
    
    // Calculate new progress percentage
    const totalModules = modules?.length || 1;
    const newProgress = Math.round((completedModules.length / totalModules) * 100);
    
    // Update the progress
    const updatedProgress: Partial<UserLearningProgress> = {
      progress: newProgress,
      lastModuleId: moduleId,
      completedModules,
      lastAccessedAt: new Date(),
      // If completed all modules, set completedAt
      completedAt: newProgress === 100 ? new Date() : userProgress.completedAt
    };
    
    updateProgressMutation.mutate({ 
      id: userProgress.id, 
      progress: updatedProgress 
    });
  };

  // Handle enrollment
  const handleEnroll = () => {
    if (!user || !pathId) return;
    
    enrollMutation.mutate({
      userId: user.id,
      pathId: pathId,
      lastModuleId: null,
      completedModules: []
    });
  };

  // Print certificate
  const printCertificate = () => {
    if (certificateRef.current && window) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Certificate</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { margin: 0; padding: 20px; display: flex; justify-content: center; }
          @media print {
            body { margin: 0; padding: 0; }
            .certificate-container { page-break-inside: avoid; }
          }
          .certificate-container { 
            width: 800px; 
            height: 600px; 
            position: relative; 
            overflow: hidden;
            border: 2px solid #333;
          }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<div class="certificate-container">');
        
        // Clone the certificate content
        if (certificateRef.current) {
          printWindow.document.write(certificateRef.current.innerHTML);
        }
        
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  const downloadCertificateAsPDF = () => {
    // This is a placeholder as we'd normally use a library like html2canvas + jsPDF
    // For MVP, we're using the print functionality which allows saving as PDF
    printCertificate();
  };

  // Render module icon based on type
  const renderModuleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'article':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'quiz':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'exercise':
      case 'interactive':
        return <Code className="h-5 w-5 text-purple-500" />;
      case 'tutorial':
        return <BookOpen className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const isLoading = loadingPath || loadingModules || (!!user && loadingProgress);
  const isEnrolled = !!userProgress;
  const isCompleted = isEnrolled && userProgress?.progress === 100;
  
  if (!match) {
    return <div>Invalid learning path</div>;
  }

  return (
    <div className="py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-3 md:mb-4 flex items-center text-sm md:text-base"
          onClick={() => navigate("/learning-paths")}
        >
          <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" /> Back to Learning Paths
        </Button>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading learning path...</p>
          </div>
        ) : !learningPath ? (
          <div className="text-center py-12">
            <p>Learning path not found</p>
          </div>
        ) : (
          <>
            {/* Header Section - Mobile Optimized */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex-1">
                {/* Category and Difficulty Badges */}
                <div className="flex items-center gap-2 mb-2 md:mb-3 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                  <Badge className="whitespace-nowrap">{learningPath?.category}</Badge>
                  <Badge variant="outline" className="whitespace-nowrap">{learningPath?.difficulty}</Badge>
                  
                  {/* Move Timing Info to Top Row on Mobile */}
                  <div className="ml-auto flex items-center md:hidden text-xs whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{learningPath?.estimatedHours}h</span>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <BookOpen className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{modules?.length || 0} modules</span>
                  </div>
                </div>
                
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{learningPath?.title}</h1>
                
                {/* Description - Shorter on Mobile */}
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">
                  {learningPath?.description}
                </p>
                
                {/* Tags - Scrollable on Mobile */}
                <div className="flex gap-1.5 mb-3 md:mb-4 overflow-x-auto pb-1 md:pb-0 no-scrollbar md:flex-wrap">
                  {learningPath?.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="whitespace-nowrap text-xs md:text-sm">{tag}</Badge>
                  ))}
                </div>
                
                {/* Time Info - Hidden on Mobile (shown above), Visible on Desktop */}
                <div className="hidden md:flex flex-col xs:flex-row gap-3 sm:gap-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{learningPath?.estimatedHours} hours total</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{modules?.length || 0} modules</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Card - Mobile Friendly Version */}
              <div className="md:w-72 shrink-0">
                <Card className="shadow-sm md:shadow">
                  <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-4 px-3 md:px-4">
                    <CardTitle className="text-base md:text-lg">
                      {isEnrolled 
                        ? isCompleted 
                          ? "Path Completed! 🏆" 
                          : "Your Progress"
                        : "Start Learning"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-4 py-2 md:py-3">
                    {isEnrolled ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span>Overall progress</span>
                          <span className="font-medium">{userProgress?.progress || 0}%</span>
                        </div>
                        <Progress value={userProgress?.progress || 0} className="h-2 md:h-2.5" />
                        
                        {isCompleted && (
                          <div className="mt-3 md:mt-4 flex flex-col gap-2">
                            <Badge className="w-fit mx-auto mb-1 bg-gradient-to-r from-amber-400 to-amber-600">
                              <Award className="h-4 w-4 mr-1" /> Completed
                            </Badge>
                            <Button 
                              className="w-full text-sm md:text-base"
                              variant="outline"
                              onClick={() => setShowCertificate(true)}
                            >
                              <Award className="h-4 w-4 mr-1 md:mr-2" /> View Certificate
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Enroll to track progress and receive a certificate upon completion.
                        </p>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm md:text-base"
                          onClick={handleEnroll}
                          disabled={!user || enrollMutation.isPending}
                          size="sm"
                        >
                          {!user ? "Sign in to Enroll" : "Enroll Now"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Tabs - Touch Friendly */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 md:w-auto md:flex">
                <TabsTrigger 
                  value="overview"
                  className="text-sm md:text-base h-11 md:h-10 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="modules" 
                  className="text-sm md:text-base h-11 md:h-10 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white"
                >
                  Modules
                </TabsTrigger>
                {isEnrolled && isCompleted && (
                  <TabsTrigger 
                    value="certificate" 
                    className="text-sm md:text-base h-11 md:h-10 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white col-span-2 md:col-span-1"
                  >
                    Certificate
                  </TabsTrigger>
                )}
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">About this Learning Path</h2>
                    <p className="text-muted-foreground">{learningPath?.description}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modules?.slice(0, 4).map((module) => (
                        <div key={module.id} className="flex gap-3">
                          <div className="mt-1">
                            {renderModuleIcon(module.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                      ))}
                      {modules && modules.length > 4 && (
                        <Button 
                          variant="ghost" 
                          className="justify-start text-blue-600 dark:text-blue-400"
                          onClick={() => setActiveTab("modules")}
                        >
                          + {modules.length - 4} more modules
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills You'll Gain</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {learningPath?.tags?.map((tag) => (
                        <div key={tag} className="bg-accent/40 p-3 rounded-md flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Modules Tab */}
              <TabsContent value="modules" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Course Modules</h2>
                    <p className="text-muted-foreground">
                      {isEnrolled 
                        ? "Track your progress through each module"
                        : "Enroll to begin tracking your progress through these modules"}
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full touch-action-pan-y">
                    {modules?.map((module, index) => {
                      const completed = isModuleCompleted(module.id);
                      
                      return (
                        <AccordionItem 
                          key={module.id} 
                          value={`module-${module.id}`}
                          className="border rounded-md mb-3 overflow-hidden shadow-sm"
                        >
                          <AccordionTrigger className="hover:no-underline px-3 py-3 md:px-4 md:py-3 bg-accent/10 hover:bg-accent/20 active:bg-accent/30 transition-colors">
                            <div className="flex items-center gap-2 md:gap-3 text-left w-full pr-5">
                              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${completed ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'} text-xs font-medium shrink-0`}>
                                {completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <span className="text-sm">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm md:text-base truncate">{module.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mt-0.5">
                                  <span className="flex items-center whitespace-nowrap">
                                    {renderModuleIcon(module.type)} 
                                    <span className="ml-1">{module.type}</span>
                                  </span>
                                  <span className="flex items-center whitespace-nowrap">
                                    <Clock className="h-3 w-3 mr-1" /> 
                                    {module.duration} min
                                  </span>
                                  {completed && (
                                    <span className="flex items-center whitespace-nowrap text-green-600 dark:text-green-500">
                                      <CheckCircle2 className="h-3 w-3 mr-1" /> 
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="bg-white dark:bg-slate-950">
                            <div className="px-3 py-4 md:px-4 md:pl-12 space-y-4">
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                <a 
                                  href={module.content} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex"
                                >
                                  <Button variant="outline" size="sm" className="gap-1 h-9 text-sm">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="md:inline">Open Content</span>
                                  </Button>
                                </a>
                                
                                {isEnrolled && !completed && (
                                  <Button 
                                    size="sm"
                                    className="gap-1 bg-gradient-to-r from-green-600 to-teal-600 h-9 text-sm"
                                    onClick={() => markModuleCompleted(module.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="md:inline">Mark Complete</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </TabsContent>
              
              {/* Certificate Tab - Mobile Optimized */}
              {isCompleted && (
                <TabsContent value="certificate" className="mt-6">
                  <div className="space-y-5 md:space-y-6">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold mb-2">Your Certificate of Completion</h2>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Congratulations on completing this learning path! You can download or print your certificate.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3 md:p-4 flex flex-col items-center shadow-sm">
                      {/* Certificate - Pinch to zoom enabled on mobile */}
                      <div 
                        className="mb-4 md:mb-6 max-w-full overflow-auto touch-action-pan-y touch-pan-zoom" 
                        ref={certificateRef}
                        style={{
                          maxWidth: "100%",
                          overscrollBehavior: "contain"
                        }}
                      >
                        <div className="min-w-[280px] md:min-w-0">
                          <Certificate 
                            userName={user?.name || ""}
                            courseName={learningPath?.title || ""}
                            issueDate={format(new Date(), "MMMM dd, yyyy")}
                          />
                        </div>
                      </div>
                      
                      {/* Action Buttons - Responsive */}
                      <div className="flex flex-wrap md:flex-nowrap w-full gap-2 md:gap-3 mt-2 md:mt-4 justify-center">
                        <Button 
                          variant="outline" 
                          className="gap-1 text-sm md:gap-2 md:text-base flex-1"
                          onClick={printCertificate}
                        >
                          <Printer className="h-4 w-4" />
                          <span className="whitespace-nowrap">Print</span>
                        </Button>
                        <Button 
                          className="gap-1 text-sm md:gap-2 md:text-base bg-gradient-to-r from-purple-600 to-blue-600 flex-1"
                          onClick={downloadCertificateAsPDF}
                        >
                          <Download className="h-4 w-4" />
                          <span className="whitespace-nowrap">Download</span>
                        </Button>
                      </div>
                      
                      {/* Mobile Tip */}
                      <p className="text-xs text-muted-foreground mt-3 md:hidden">
                        <span className="italic">Tip: Pinch to zoom the certificate</span>
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </>
        )}
      </div>
      
      {/* Mobile Optimized Modal for Certificate */}
      {showCertificate && isCompleted && learningPath && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white dark:bg-slate-900 p-4 md:p-6 lg:p-8 rounded-lg max-w-4xl w-full space-y-4 md:space-y-6 max-h-[95vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 pb-2 border-b z-10">
              <h2 className="text-xl md:text-2xl font-bold">Your Certificate</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 rounded-full p-0" 
                onClick={() => setShowCertificate(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Certificate Display - Touch Friendly */}
            <div className="border rounded-lg p-3 md:p-4 overflow-hidden">
              <div className="overflow-auto touch-action-pan-y max-w-full" style={{ overscrollBehavior: "contain" }}>
                <div className="min-w-[280px]">
                  <Certificate 
                    userName={user?.name || ""}
                    courseName={learningPath?.title || ""}
                    issueDate={userProgress?.completedAt 
                      ? format(new Date(userProgress.completedAt), "MMMM dd, yyyy") 
                      : format(new Date(), "MMMM dd, yyyy")}
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Tip */}
            <p className="text-xs text-muted-foreground -mt-2 md:hidden text-center">
              <span className="italic">Tip: Pinch to zoom the certificate</span>
            </p>
            
            {/* Action Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 sm:justify-end mt-2">
              <Button 
                variant="outline" 
                className="gap-1 md:gap-2 sm:w-auto text-sm md:text-base"
                onClick={printCertificate}
              >
                <Printer className="h-4 w-4" />
                <span className="md:inline">Print Certificate</span>
              </Button>
              <Button 
                className="gap-1 md:gap-2 sm:w-auto text-sm md:text-base bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={downloadCertificateAsPDF}
              >
                <Download className="h-4 w-4" />
                <span className="md:inline">Download Certificate</span>
              </Button>
              <Button 
                variant="secondary" 
                className="sm:w-auto text-sm md:text-base mt-1 sm:mt-0"
                onClick={() => setShowCertificate(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}