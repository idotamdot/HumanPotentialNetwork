import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function GlobalIssues() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["/api/issues"],
  });

  const getIconForIssue = (iconName: string) => {
    // Map icon names to actual JSX
    const iconMap: Record<string, JSX.Element> = {
      "ri-temp-hot-line": (
        <div className="flex-shrink-0 bg-emerald-100 rounded-md p-2">
          <svg className="h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
        </div>
      ),
      "ri-water-flash-line": (
        <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
          </svg>
        </div>
      ),
      "ri-book-open-line": (
        <div className="flex-shrink-0 bg-amber-100 rounded-md p-2">
          <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
      ),
      "ri-heart-pulse-line": (
        <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
          <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
      ),
      "ri-women-line": (
        <div className="flex-shrink-0 bg-pink-100 rounded-md p-2">
          <svg className="h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.6 1.4 3 3 3s3-1.4 3-3a3 3 0 0 0-3-3z" />
            <path d="M13 9h-2v12h2" />
            <path d="M9 15h6" />
          </svg>
        </div>
      )
    };
    
    return iconMap[iconName] || (
      <div className="flex-shrink-0 bg-gray-100 rounded-md p-2">
        <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return (
          <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            High
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Medium
          </span>
        );
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium text-gray-900">Global Issues</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Top challenges right now</p>
        </div>
        <Link href="/issues">
          <Button variant="link" className="text-primary">Browse All</Button>
        </Link>
      </CardHeader>
      <div className="border-t border-gray-200">
        {isLoading ? (
          <CardContent className="p-4">
            <div className="text-center text-gray-500">Loading issues...</div>
          </CardContent>
        ) : (
          <ul className="divide-y divide-gray-200">
            {issues?.map((issue: any) => (
              <li key={issue.id}>
                <Link href={`/issues/${issue.id}`}>
                  <a className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getIconForIssue(issue.icon)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                            <p className="text-xs text-gray-500">{issue.projectCount} projects worldwide</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          {getUrgencyBadge(issue.urgency)}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
