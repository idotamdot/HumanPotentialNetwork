import { useState, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Flame, // Energetic
  Laugh, // Playful
  Coffee, // Focused
  CloudRain, // Calm
  Zap, // Creative
  Scale, // Balanced
  Moon, // Reflective
  Sun, // Optimistic
} from "lucide-react";

import { setThemeColor, saveTheme, getTheme, MoodTheme } from "@/lib/utils";

// Define themes but don't export the constant
const moodThemes = [
  {
    name: "Energetic",
    value: "energetic",
    color: "#FF4500",
    icon: Flame,
    description: "High-energy, vibrant, and perfect for getting things done with enthusiasm."
  },
  {
    name: "Playful",
    value: "playful",
    color: "#8A2BE2", 
    icon: Laugh,
    description: "Fun, whimsical, and great for creative exploration and imagination."
  },
  {
    name: "Focused",
    value: "focused",
    color: "#1E90FF",
    icon: Coffee,
    description: "Clear, sharp, and designed for deep concentration and analysis."
  },
  {
    name: "Calm",
    value: "calm",
    color: "#00CED1",
    icon: CloudRain,
    description: "Serene, peaceful, and excellent for relaxation and mindfulness."
  },
  {
    name: "Creative",
    value: "creative",
    color: "#FF1493",
    icon: Zap,
    description: "Inspiring, bright, and ideal for brainstorming and ideation."
  },
  {
    name: "Balanced",
    value: "balanced",
    color: "#32CD32",
    icon: Scale,
    description: "Harmonious, well-rounded, and perfect for everyday productivity."
  },
  {
    name: "Reflective",
    value: "reflective",
    color: "#4B0082",
    icon: Moon,
    description: "Deep, thoughtful, and conducive to introspection and planning."
  },
  {
    name: "Optimistic",
    value: "optimistic",
    color: "#FFA500",
    icon: Sun,
    description: "Bright, hopeful, and encouraging a positive outlook."
  },
];

export function ThemeSelector({ className }: { className?: string }) {
  const [theme, setTheme] = useState<MoodTheme>(() => {
    const savedTheme = getTheme();
    return savedTheme || moodThemes[5]; // Default to Balanced
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Apply any saved theme on component mount
    const savedTheme = getTheme();
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme: MoodTheme) => {
    // Apply color to primary variable
    setThemeColor(selectedTheme.color);
    
    // Create glow effects based on the theme
    document.documentElement.style.setProperty('--theme-glow', `0 0 15px ${selectedTheme.color}80`);
    document.documentElement.style.setProperty('--theme-glow-strong', `0 0 25px ${selectedTheme.color}90`);
    
    // Remove all theme classes
    document.body.classList.remove(
      'theme-energetic',
      'theme-playful',
      'theme-focused',
      'theme-calm',
      'theme-creative',
      'theme-balanced',
      'theme-reflective',
      'theme-optimistic'
    );
    
    // Add the specific theme class
    document.body.classList.add(`theme-${selectedTheme.value}`);
  };

  const handleThemeChange = (selectedTheme: MoodTheme) => {
    setTheme(selectedTheme);
    
    // Apply theme changes
    applyTheme(selectedTheme);
    saveTheme(selectedTheme);
    
    toast({
      title: `Mood changed to ${selectedTheme.name}`,
      description: "Your interface colors have been updated to match your mood.",
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-4 gap-2">
        {moodThemes.map((moodTheme) => {
          const isActive = theme.value === moodTheme.value;
          
          return (
            <button
              key={moodTheme.value}
              className={cn(
                "w-full h-10 rounded-md flex items-center justify-center relative",
                isActive ? "ring-2 ring-offset-2" : "hover:opacity-90"
              )}
              style={{
                backgroundColor: moodTheme.color
              }}
              // This custom property is handled by Tailwind's ring utilities
              onClick={() => handleThemeChange(moodTheme)}
              title={moodTheme.name}
            >
              {isActive && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-gray-100 rounded-md p-2 flex items-center">
        <div 
          className="w-6 h-6 rounded-full mr-2 flex items-center justify-center" 
          style={{ backgroundColor: theme.color }}
        >
          {theme.icon && (() => {
            const Icon = theme.icon;
            return <Icon className="h-3 w-3 text-white" />;
          })()}
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium">{theme.name}</div>
          <div className="text-[10px] text-gray-500">{theme.description}</div>
        </div>
      </div>
    </div>
  );
}