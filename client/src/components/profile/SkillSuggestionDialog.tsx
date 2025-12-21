import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { skillCategories, getSkillsFromCategory, searchSkillsAndPassions } from "@/lib/utils";
import { Search, Plus, Sparkles } from "lucide-react";

interface SkillSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skillName: string, proficiency: number) => void;
  isLoading: boolean;
}

export function SkillSuggestionDialog({
  open,
  onOpenChange,
  onAddSkill,
  isLoading
}: SkillSuggestionDialogProps) {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiency, setProficiency] = useState(70);
  const [customSkill, setCustomSkill] = useState("");

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { skills: [], passions: [] };
    return searchSkillsAndPassions(searchQuery);
  }, [searchQuery]);

  const handleAddSkill = () => {
    const skillName = activeTab === "custom" ? customSkill : selectedSkill;
    if (!skillName.trim()) return;
    
    onAddSkill(skillName, proficiency);
    
    // Reset form
    setSelectedSkill("");
    setCustomSkill("");
    setProficiency(70);
    setSearchQuery("");
  };

  const selectSkill = (skill: string) => {
    setSelectedSkill(skill);
    setActiveTab("confirm");
  };

  const isValid = () => {
    if (activeTab === "custom") {
      return customSkill.trim().length > 0;
    }
    return selectedSkill.trim().length > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Add New Skill
          </DialogTitle>
          <DialogDescription>
            Choose from our curated skill categories or add a custom skill to your profile.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="confirm" disabled={!selectedSkill && !customSkill}>
              Confirm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {Object.entries(skillCategories).map(([key, category]) => (
                  <div key={key}>
                    <h3 className="font-medium text-sm text-gray-700 mb-3">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {category.skills.map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto py-2 px-3 text-left"
                          onClick={() => selectSkill(skill)}
                        >
                          <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-xs">{skill}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search" className="flex-1">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchQuery && (
                <ScrollArea className="h-[350px]">
                  <div className="space-y-4">
                    {searchResults.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Skills</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.skills.map((skill) => (
                            <Button
                              key={skill}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-2 px-3 text-left"
                              onClick={() => selectSkill(skill)}
                            >
                              <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="text-xs">{skill}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {searchResults.skills.length === 0 && searchQuery && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No skills found matching "{searchQuery}"</p>
                        <p className="text-sm mt-1">Try the Custom tab to add it yourself!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="flex-1">
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-skill">Custom Skill Name</Label>
                <Input
                  id="custom-skill"
                  placeholder="e.g., Underwater Basket Weaving"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add any skill that's not in our predefined categories
                </p>
              </div>
              
              {customSkill && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Preview:</p>
                  <Badge variant="outline" className="bg-white">
                    {customSkill}
                  </Badge>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="flex-1">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Confirm Skill</h3>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {selectedSkill || customSkill}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proficiency">
                    Proficiency Level: {proficiency}%
                  </Label>
                  <Input
                    id="proficiency"
                    type="range"
                    min="1"
                    max="100"
                    value={proficiency}
                    onChange={(e) => setProficiency(parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                    <span>Expert</span>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Proficiency Guide</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>1-25%:</strong> Beginner - Basic understanding</p>
                    <p><strong>26-50%:</strong> Novice - Some experience</p>
                    <p><strong>51-75%:</strong> Intermediate - Confident user</p>
                    <p><strong>76-90%:</strong> Advanced - Highly skilled</p>
                    <p><strong>91-100%:</strong> Expert - Teaching/mentoring level</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSkill}
            disabled={!isValid() || isLoading}
          >
            {isLoading ? "Adding..." : "Add Skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}