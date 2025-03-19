import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { SkillBar } from "@/components/ui/skill-bar";
import { Link } from "wouter";

export default function ProfileCard() {
  const { user } = useAuth();
  
  const { data: skills, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/skills`],
    enabled: !!user?.id,
  });

  // Separate skills by category
  const coreSkills = skills?.filter((skill: any) => skill.category === "core") || [];
  const passions = skills?.filter((skill: any) => skill.category === "passion") || [];

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">My Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your skills and passion map</p>
        </div>
        <Link href="/profile">
          <Button variant="link" className="text-primary">Edit Profile</Button>
        </Link>
      </div>
      <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 sm:mr-8 mb-4 sm:mb-0">
            <img
              className="h-24 w-24 rounded-full"
              src={user?.avatar || "https://via.placeholder.com/96"}
              alt="Profile picture"
            />
            <div className="mt-3 flex justify-center">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Available: {user?.availableHours || 0}h/week
              </Badge>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-900">{user?.name || "User"}</h4>
            <p className="text-sm text-gray-500">{user?.location || "Location"}</p>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Core Skills</h5>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {isLoading ? (
                  <div className="text-sm text-gray-500">Loading skills...</div>
                ) : (
                  coreSkills.map((skill: any) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      proficiency={skill.proficiency}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Passions</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {isLoading ? (
                  <div className="text-sm text-gray-500">Loading passions...</div>
                ) : (
                  passions.map((passion: any) => (
                    <Badge
                      key={passion.id}
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {passion.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <span className="font-medium text-gray-500">AI Insight:</span>
          <span className="ml-1 text-gray-500">
            Your content creation skills would be valuable in the "Rural Education Initiative" project.
          </span>
          <Button variant="link" className="ml-2 text-primary text-sm">
            View Project
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
