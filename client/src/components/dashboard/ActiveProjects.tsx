import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ActiveProjects() {
  const { user } = useAuth();
  
  const { data: userProjects, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/projects`],
    enabled: !!user?.id,
  });

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium text-gray-900">My Active Projects</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your current project commitments</p>
        </div>
        <Link href="/projects">
          <Button variant="link" className="text-primary">Manage All</Button>
        </Link>
      </CardHeader>
      <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading your projects...</div>
        ) : userProjects && userProjects.length > 0 ? (
          userProjects.map(({ project }: any) => (
            <div key={project.id} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium text-gray-900">{project.title}</h4>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-500">Progress: </span>
                    <span className="ml-1 text-sm font-medium text-primary">{project.progress}%</span>
                  </div>
                </div>
                <Badge variant="outline" className={
                  project.progress > 80 
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                  {project.progress > 80 ? "Final Stage" : "Active"}
                </Badge>
              </div>
              <div className="mt-2">
                <Progress value={project.progress} />
              </div>
              <div className="mt-3 text-sm text-gray-500">
                <p>{project.description}</p>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{project.nextMilestone}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p>You haven't joined any projects yet.</p>
            <Link href="/issues">
              <Button variant="link" className="text-primary mt-2">Browse Global Issues</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
