import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useRoute } from "wouter";

export default function GlobalIssues() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["/api/issues"],
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Global Issues</h1>
        <p className="mt-2 text-gray-600">
          Explore global challenges where your skills can make a difference.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading global issues...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues?.map((issue: any) => (
              <Card key={issue.id} className="overflow-hidden">
                <div className={`h-2 ${
                  issue.urgency === 'urgent' 
                    ? 'bg-red-500' 
                    : issue.urgency === 'high' 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                }`} />
                
                <CardHeader>
                  <Badge 
                    variant="outline" 
                    className={`self-start ${getUrgencyColor(issue.urgency)}`}
                  >
                    {issue.urgency === 'urgent' ? 'Urgent' : issue.urgency === 'high' ? 'High Priority' : 'Medium Priority'}
                  </Badge>
                  <CardTitle className="mt-2">{issue.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-6">{issue.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{issue.projectCount}</span> active projects
                    </div>
                    <Link href={`/projects?issueId=${issue.id}`}>
                      <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary/10">
                        View Projects
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
