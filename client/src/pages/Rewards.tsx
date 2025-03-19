import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { sidebarIcons } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

export default function Rewards() {
  const { user } = useAuth();
  const { toast } = useToast();

  const redeemReward = (rewardName: string) => {
    toast({
      title: "Reward Redeemed",
      description: `You've successfully redeemed: ${rewardName}`,
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Rewards</h1>
        <p className="mt-2 text-gray-600">
          Redeem your potential points for personal development resources and more.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary bg-opacity-10 rounded-full p-4 mr-4">
                  {sidebarIcons.award}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.potentialPoints?.toLocaleString() || "0"}
                  </h2>
                  <p className="text-gray-500">Available Potential Points</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600 mb-1">
                  Next milestone: Global Summit Invitation
                </p>
                <div className="w-full md:w-64 mb-2">
                  <Progress value={70} className="h-2" />
                </div>
                <p className="text-xs text-gray-500">
                  7,000 / 10,000 points needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="courses">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="rewards-history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course 1 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Premium Course
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      750 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Advanced Data Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Master techniques for creating impactful visualizations that communicate complex data effectively.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      8 modules (12 hours)
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                      Certificate included
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Advanced Data Visualization Course")}
                    disabled={!user || (user.potentialPoints || 0) < 750}
                  >
                    Redeem Course
                  </Button>
                </CardContent>
              </Card>

              {/* Course 2 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Premium Course
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      500 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Project Management for Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn how to manage projects that deliver measurable social and environmental impact.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      6 modules (10 hours)
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                      Certificate included
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Project Management for Impact Course")}
                    disabled={!user || (user.potentialPoints || 0) < 500}
                  >
                    Redeem Course
                  </Button>
                </CardContent>
              </Card>

              {/* Course 3 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Premium Course
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      650 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Community Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Develop skills to lead communities toward sustainable goals and meaningful impact.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      7 modules (14 hours)
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                      Certificate included
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Community Leadership Course")}
                    disabled={!user || (user.potentialPoints || 0) < 650}
                  >
                    Redeem Course
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event 1 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Virtual Event
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      1000 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Climate Action Summit 2023</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Join global leaders and experts to discuss innovative solutions to climate change.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      October 15-17, 2023
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Virtual (Zoom)
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Climate Action Summit 2023 Ticket")}
                    disabled={!user || (user.potentialPoints || 0) < 1000}
                  >
                    Redeem Event Pass
                  </Button>
                </CardContent>
              </Card>

              {/* Event 2 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      In-Person Event
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      2500 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Human Potential Global Conference</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Network with change-makers from around the world and share your impact journey.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center mb-1">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      December 5-7, 2023
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      San Francisco, CA
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Human Potential Global Conference Ticket")}
                    disabled={!user || (user.potentialPoints || 0) < 2500}
                  >
                    Redeem Event Pass
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resource 1 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Digital Resource
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      300 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Sustainability Toolkit Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Comprehensive digital tools and templates for planning sustainable community projects.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Sustainability Toolkit Pro")}
                    disabled={!user || (user.potentialPoints || 0) < 300}
                  >
                    Redeem Resource
                  </Button>
                </CardContent>
              </Card>

              {/* Resource 2 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Digital Resource
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      200 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Impact Measurement Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Research-backed framework for measuring social and environmental impact of your projects.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Impact Measurement Framework")}
                    disabled={!user || (user.potentialPoints || 0) < 200}
                  >
                    Redeem Resource
                  </Button>
                </CardContent>
              </Card>

              {/* Resource 3 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Digital Resource
                    </Badge>
                    <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
                      150 points
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Community Engagement Playbook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Strategies and methods for effectively engaging diverse communities in your initiatives.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => redeemReward("Community Engagement Playbook")}
                    disabled={!user || (user.potentialPoints || 0) < 150}
                  >
                    Redeem Resource
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards-history" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {user && user.potentialPoints && user.potentialPoints > 0 ? (
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Data Visualization Workshop Series</h3>
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-gray-500">Redeemed on May 12, 2023</span>
                        <span className="font-medium text-primary">450 points</span>
                      </div>
                      <Badge className="mt-2" variant="outline">
                        Certificate Issued
                      </Badge>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Sustainable Project Planning Guide</h3>
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-gray-500">Redeemed on April 3, 2023</span>
                        <span className="font-medium text-primary">200 points</span>
                      </div>
                      <Badge className="mt-2" variant="outline">
                        Download Available
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">Clean Energy Hackathon - Virtual Pass</h3>
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-gray-500">Redeemed on February 27, 2023</span>
                        <span className="font-medium text-primary">800 points</span>
                      </div>
                      <Badge className="mt-2" variant="outline">
                        Event Completed
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Rewards History</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      You haven't redeemed any rewards yet. Start by contributing to projects and earning potential
                      points!
                    </p>
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
