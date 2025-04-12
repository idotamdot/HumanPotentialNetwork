import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { sidebarIcons } from "@/lib/icons";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSelector } from "@/components/ui/theme-selector";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: sidebarIcons.home },
    { href: "/profile", label: "My Profile", icon: sidebarIcons.user },
    { href: "/issues", label: "Global Issues", icon: sidebarIcons.earth },
    { href: "/projects", label: "My Projects", icon: sidebarIcons.team },
    { href: "/knowledge", label: "Knowledge Commons", icon: sidebarIcons.book },
    { href: "/learning-paths", label: "Learning Paths", icon: sidebarIcons.learning },
    { href: "/governance", label: "Governance", icon: sidebarIcons.governance },
    { href: "/rewards", label: "Rewards", icon: sidebarIcons.award },
    { href: "/marketplace", label: "Marketplace", icon: sidebarIcons.marketplace },
    { href: "/kids", label: "Young Changemakers", icon: sidebarIcons.kids },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <svg
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-900">HPN</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                    location === item.href
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div
                    className={cn(
                      "mr-3 text-xl",
                      location === item.href
                        ? item.href === "/kids" 
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-500" 
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400"
                        : "text-gray-500"
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className={cn(
                    location === item.href
                      ? item.href === "/kids" 
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-500" 
                        : "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400"
                      : ""
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
        {/* Theme selector */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <ThemeSelector className="w-full" />
        </div>
        
        {/* User menu */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={user?.avatar || "https://via.placeholder.com/36"}
                  alt="Profile"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {user?.potentialPoints?.toLocaleString() || "0"} Potential Points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
