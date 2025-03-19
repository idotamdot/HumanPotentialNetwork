import { useAuth } from "@/hooks/use-auth";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatCards from "@/components/dashboard/StatCards";
import ProfileCard from "@/components/dashboard/ProfileCard";
import ProjectRecommendations from "@/components/dashboard/ProjectRecommendations";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import GlobalIssues from "@/components/dashboard/GlobalIssues";
import ImpactMap from "@/components/dashboard/ImpactMap";

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Stat Cards */}
        <StatCards />

        {/* Two column layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Profile Card */}
          <ProfileCard />

          {/* Project Recommendations */}
          <ProjectRecommendations />
        </div>

        {/* Impact Map (full width) */}
        <div className="mt-8 grid grid-cols-1 gap-8">
          <ImpactMap />
        </div>

        {/* Three column layout (2:1 ratio) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Active Projects (spans 2 columns) */}
          <div className="lg:col-span-2">
            <ActiveProjects />
          </div>

          {/* Global Issues */}
          <div>
            <GlobalIssues />
          </div>
        </div>
      </div>
    </div>
  );
}
