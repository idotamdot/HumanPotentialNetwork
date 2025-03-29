import { useState, useEffect } from "react";
import { Check, ChevronUp, ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

type SimplifiedMoodTheme = {
  name: string;
  value: string;
  color: string;
  iconName: string;
  description: string;
};

// Define themes without storing the icon components directly
const moodThemes: SimplifiedMoodTheme[] = [
  {
    name: "Energetic",
    value: "energetic",
    color: "#FF3300", // Deeper red-orange
    iconName: "flame",
    description: "High-energy, vibrant, and perfect for getting things done with enthusiasm."
  },
  {
    name: "Playful",
    value: "playful",
    color: "#7B00FF", // Deeper purple
    iconName: "laugh",
    description: "Fun, whimsical, and great for creative exploration and imagination."
  },
  {
    name: "Focused",
    value: "focused",
    color: "#0066FF", // Deeper blue
    iconName: "coffee",
    description: "Clear, sharp, and designed for deep concentration and analysis."
  },
  {
    name: "Calm",
    value: "calm",
    color: "#00AAAA", // Deeper teal
    iconName: "cloudRain", 
    description: "Serene, peaceful, and excellent for relaxation and mindfulness."
  },
  {
    name: "Creative",
    value: "creative",
    color: "#FF0066", // Deeper pink
    iconName: "zap",
    description: "Inspiring, bright, and ideal for brainstorming and ideation."
  },
  {
    name: "Balanced",
    value: "balanced",
    color: "#00AA00", // Deeper green
    iconName: "scale",
    description: "Harmonious, well-rounded, and perfect for everyday productivity."
  },
  {
    name: "Reflective",
    value: "reflective",
    color: "#4B0082", // Deep indigo (kept the same)
    iconName: "moon",
    description: "Deep, thoughtful, and conducive to introspection and planning."
  },
  {
    name: "Optimistic",
    value: "optimistic",
    color: "#FF8000", // Deeper orange
    iconName: "sun",
    description: "Bright, hopeful, and encouraging a positive outlook."
  },
];

// Helper function to get icon component by name
function getIconByName(iconName: string) {
  switch (iconName) {
    case "flame": return Flame;
    case "laugh": return Laugh;
    case "coffee": return Coffee;
    case "cloudRain": return CloudRain;
    case "zap": return Zap;
    case "scale": return Scale;
    case "moon": return Moon;
    case "sun": return Sun;
    default: return Flame;
  }
}

// Save theme without the component
function saveThemeToStorage(theme: SimplifiedMoodTheme) {
  localStorage.setItem("hpn-user-mood-theme", JSON.stringify(theme));
}

// Get theme from storage
function getThemeFromStorage(): SimplifiedMoodTheme | null {
  const saved = localStorage.getItem("hpn-user-mood-theme");
  return saved ? JSON.parse(saved) : null;
}

// Get/save the theme selector open state
function getSelectorOpenState(): boolean {
  const saved = localStorage.getItem("hpn-theme-selector-open");
  return saved ? JSON.parse(saved) : false; // Default to closed
}

function saveSelectorOpenState(isOpen: boolean) {
  localStorage.setItem("hpn-theme-selector-open", JSON.stringify(isOpen));
}

export function ThemeSelector({ className }: { className?: string }) {
  const [theme, setTheme] = useState<SimplifiedMoodTheme>(() => {
    const savedTheme = getThemeFromStorage();
    return savedTheme || moodThemes[5]; // Default to Balanced
  });
  
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    return getSelectorOpenState();
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Apply any saved theme on component mount
    const savedTheme = getThemeFromStorage();
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme: SimplifiedMoodTheme) => {
    // Apply color to primary variable
    document.documentElement.style.setProperty("--primary", selectedTheme.color);
    
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

  const handleThemeChange = (selectedTheme: SimplifiedMoodTheme) => {
    setTheme(selectedTheme);
    
    // Apply theme changes
    applyTheme(selectedTheme);
    saveThemeToStorage(selectedTheme);
    
    toast({
      title: `Mood changed to ${selectedTheme.name}`,
      description: "Your interface colors have been updated to match your mood.",
    });
  };
  
  const handleCollapsibleChange = (open: boolean) => {
    setIsOpen(open);
    saveSelectorOpenState(open);
  };

  const IconComponent = getIconByName(theme.iconName);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleCollapsibleChange}
      className={cn("w-full", className)}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full p-2 bg-white hover:bg-gray-50 rounded-md border border-gray-200 cursor-pointer shadow-sm mb-2">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Theme</span>
            <div className="flex space-x-1">
              {moodThemes.map((moodTheme) => (
                <div
                  key={moodTheme.value}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    theme.value === moodTheme.value && "ring-1 ring-offset-1"
                  )}
                  style={{ backgroundColor: moodTheme.color }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: theme.color }}
            >
              <IconComponent className="h-3 w-3 text-white" />
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="space-y-3 p-2 bg-white rounded-md border border-gray-200 mb-2">
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
              <IconComponent className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium">{theme.name}</div>
              <div className="text-[10px] text-gray-500">{theme.description}</div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}