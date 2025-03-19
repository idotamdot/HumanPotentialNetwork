import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function WelcomeCard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <Card className="mt-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {firstName}!
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                You're making great progress on your journey to unlock human potential. 
                Here's what's happening in your network.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <Button>Weekly Summary</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
