import React, { useState, useEffect } from "react";
import { Check, Palette, Flame, Laugh, Coffee, CloudRain, Zap, Scale, Moon, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { setThemeColor, saveTheme, getTheme, MoodTheme } from "@/lib/utils";

// Define themes for mobile selector
const moodThemes: MoodTheme[] = [
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

export function MobileThemeSelector() {
  const [theme, setTheme] = useState<MoodTheme>(() => {
    const savedTheme = getTheme();
    return savedTheme || moodThemes[5]; // Default to Balanced
  });
  
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

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
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
          <span>Change Mood</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Mood</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {moodThemes.map((moodTheme) => {
            const MoodIcon = moodTheme.icon;
            const isActive = theme.value === moodTheme.value;
            
            return (
              <Button
                key={moodTheme.value}
                variant="outline"
                className={cn(
                  "h-24 flex flex-col items-center justify-center gap-2 p-2",
                  isActive && "border-2 border-primary"
                )}
                style={{
                  backgroundColor: `${moodTheme.color}15`,
                  borderColor: isActive ? moodTheme.color : undefined
                }}
                onClick={() => handleThemeChange(moodTheme)}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: moodTheme.color }}
                >
                  <MoodIcon className="h-4 w-4 text-white" />
                </div>
                <span>{moodTheme.name}</span>
                {isActive && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}