import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { sidebarIcons } from "@/lib/icons";

export default function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: sidebarIcons.home },
    { href: "/issues", label: "Issues", icon: sidebarIcons.earth },
    { href: "/projects", label: "Projects", icon: sidebarIcons.team },
    { href: "/profile", label: "Profile", icon: sidebarIcons.user },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex flex-col items-center py-2",
                location === item.href
                  ? "text-primary"
                  : "text-gray-500"
              )}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
