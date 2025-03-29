import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiDownload, FiPrinter, FiStar, FiCpu, FiUsers, FiBookOpen, FiEye } from "react-icons/fi";
import KidsZoneBackground from "./KidsZoneBackground";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

export default function KidsZone() {
  const [age, setAge] = useState<string>("under8");

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Young Changemakers</h1>
            <p className="mt-2 text-gray-600">
              Fun activities and learning for our youngest community members!
            </p>
          </div>
          <div className="hidden md:block">
            <img 
              src="/kids-hero.svg" 
              alt="Kids exploring the world" 
              className="h-24" 
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-lg font-medium text-primary">
                Welcome to our Young Changemakers section!
              </p>
              <p>
                You're never too young to make a difference. This special area is designed for children, 
                parents, and teachers who want to help young people learn about global issues and 
                participate in positive change.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose Your Age Group</h2>
          <div className="flex space-x-4">
            <Button 
              variant={age === "under8" ? "default" : "outline"} 
              onClick={() => setAge("under8")}
              className="flex-1 md:flex-none"
            >
              Under 8
            </Button>
            <Button 
              variant={age === "8to12" ? "default" : "outline"} 
              onClick={() => setAge("8to12")}
              className="flex-1 md:flex-none"
            >
              Ages 8-12
            </Button>
            <Button 
              variant={age === "teen" ? "default" : "outline"} 
              onClick={() => setAge("teen")}
              className="flex-1 md:flex-none"
            >
              Teens
            </Button>
            <Button 
              variant={age === "educators" ? "default" : "outline"} 
              onClick={() => setAge("educators")}
              className="flex-1 md:flex-none"
            >
              Educators
            </Button>
          </div>
        </div>

        {age === "under8" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActivityCard 
              title="Coloring Pages" 
              description="Fun coloring activities that teach about nature and our planet."
              icon={<FiStar className="h-5 w-5" />}
              activities={[
                { title: "Save the Oceans", type: "coloring" },
                { title: "Friendly Forest", type: "coloring" },
                { title: "Clean Energy Heroes", type: "coloring" },
              ]}
            />
            <ActivityCard 
              title="Simple Games" 
              description="Easy puzzles and matching games about helping others."
              icon={<FiCpu className="h-5 w-5" />}
              activities={[
                { title: "Match the Helpers", type: "matching" },
                { title: "Earth Puzzle", type: "puzzle" },
                { title: "Animal Friends", type: "memory" },
              ]}
            />
            <ActivityCard 
              title="Story Time" 
              description="Short stories about kids who make a difference."
              icon={<FiBookOpen className="h-5 w-5" />}
              activities={[
                { title: "Penny Plants a Tree", type: "story" },
                { title: "Leo Learns to Recycle", type: "story" },
                { title: "Mia's Clean Beach Day", type: "story" },
              ]}
            />
          </div>
        )}

        {age === "8to12" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActivityCard 
              title="Creative Projects" 
              description="Hands-on projects using recycled materials."
              icon={<FiStar className="h-5 w-5" />}
              activities={[
                { title: "Bottle Plant Holders", type: "craft" },
                { title: "Paper Recycling Workshop", type: "craft" },
                { title: "Bird Feeders from Milk Cartons", type: "craft" },
              ]}
            />
            <ActivityCard 
              title="Interactive Learning" 
              description="Fun quizzes and games about global issues."
              icon={<FiCpu className="h-5 w-5" />}
              activities={[
                { title: "Climate Change Quiz", type: "quiz" },
                { title: "Water Conservation Game", type: "game" },
                { title: "Endangered Species Challenge", type: "quiz" },
              ]}
            />
            <ActivityCard 
              title="Mini-Missions" 
              description="Small challenges kids can do at home or school."
              icon={<FiUsers className="h-5 w-5" />}
              activities={[
                { title: "One-Week Food Waste Tracker", type: "challenge" },
                { title: "Neighborhood Clean-up Plan", type: "challenge" },
                { title: "Energy Detective", type: "challenge" },
              ]}
            />
          </div>
        )}

        {age === "teen" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActivityCard 
              title="Youth Projects" 
              description="Project ideas teens can lead or participate in."
              icon={<FiStar className="h-5 w-5" />}
              activities={[
                { title: "Start a School Sustainability Club", type: "project" },
                { title: "Community Garden Initiative", type: "project" },
                { title: "Tech for Good Challenge", type: "project" },
              ]}
            />
            <ActivityCard 
              title="Digital Skills" 
              description="Learn to use technology for positive impact."
              icon={<FiCpu className="h-5 w-5" />}
              activities={[
                { title: "Build a Cause Website", type: "tutorial" },
                { title: "Social Media for Change", type: "tutorial" },
                { title: "Data Visualization Basics", type: "tutorial" },
              ]}
            />
            <ActivityCard 
              title="Leadership Skills" 
              description="Develop skills to lead change in your community."
              icon={<FiUsers className="h-5 w-5" />}
              activities={[
                { title: "Public Speaking Workshop", type: "workshop" },
                { title: "Project Management Basics", type: "tutorial" },
                { title: "Team Building Exercises", type: "workshop" },
              ]}
            />
          </div>
        )}

        {age === "educators" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActivityCard 
              title="Lesson Plans" 
              description="Ready-to-use lesson plans on global issues."
              icon={<FiBookOpen className="h-5 w-5" />}
              activities={[
                { title: "Climate Action (Grades K-2)", type: "lesson" },
                { title: "Global Citizenship (Grades 3-5)", type: "lesson" },
                { title: "Sustainable Development (Grades 6-8)", type: "lesson" },
              ]}
            />
            <ActivityCard 
              title="Classroom Activities" 
              description="Group activities to engage students in problem-solving."
              icon={<FiUsers className="h-5 w-5" />}
              activities={[
                { title: "Model UN Mini-Simulation", type: "activity" },
                { title: "Community Mapping Exercise", type: "activity" },
                { title: "Design Thinking Workshop", type: "activity" },
              ]}
            />
            <ActivityCard 
              title="School Integration" 
              description="Ways to integrate HPN into your curriculum."
              icon={<FiStar className="h-5 w-5" />}
              activities={[
                { title: "Class Projects Guide", type: "guide" },
                { title: "Cross-School Collaborations", type: "guide" },
                { title: "Service Learning Framework", type: "guide" },
              ]}
            />
          </div>
        )}

        <div className="mt-12 bg-primary/5 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3">
              <h2 className="text-xl font-semibold mb-2">School Integration Program</h2>
              <p className="text-gray-600 mb-4">
                We partner with schools to bring real-world problem-solving into the classroom. Our school program helps teachers integrate global issues into their curriculum while giving students hands-on experience with collaborative projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">K-12 Compatible</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">STEM Integration</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Cross-curriculum</Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Service Learning</Badge>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Button className="w-full md:w-auto">Learn More About School Programs</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActivityProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  activities: {
    title: string;
    type: string;
  }[];
}

function ActivityCard({ title, description, icon, activities }: ActivityProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  // Convert activity title to file name format
  const getFileName = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };
  
  // Get file path for preview, download, or print
  const getFilePath = (title: string) => {
    return `/coloring-pages/${getFileName(title)}.svg`;
  };
  
  // Handle print functionality
  const handlePrint = (title: string) => {
    const path = getFilePath(title);
    const printWindow = window.open(path);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
              </div>
              <div className="flex space-x-2">
                {activity.type === "coloring" && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Preview">
                          <FiEye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle className="text-center">{activity.title}</DialogTitle>
                          <DialogDescription className="text-center">
                            Preview the coloring page before downloading or printing
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center p-4 border rounded-lg bg-white">
                          <img 
                            src={getFilePath(activity.title)} 
                            alt={activity.title} 
                            className="max-w-full max-h-[60vh] object-contain"
                          />
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                          <a 
                            href={getFilePath(activity.title)} 
                            download={`${getFileName(activity.title)}.svg`}
                          >
                            <Button variant="outline">
                              <FiDownload className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </a>
                          <Button 
                            variant="outline"
                            onClick={() => handlePrint(activity.title)}
                          >
                            <FiPrinter className="mr-2 h-4 w-4" />
                            Print
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <a 
                      href={getFilePath(activity.title)} 
                      download={`${getFileName(activity.title)}.svg`}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                        <FiDownload className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      title="Print"
                      onClick={() => handlePrint(activity.title)}
                    >
                      <FiPrinter className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {activity.type !== "coloring" && (
                  <>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                      <FiDownload className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Print">
                      <FiPrinter className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}