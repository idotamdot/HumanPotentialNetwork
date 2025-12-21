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
import { passionCategories, getPassionsFromCategory, searchSkillsAndPassions } from "@/lib/utils";
import { Search, Plus, Heart } from "lucide-react";

interface PassionSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPassion: (passionName: string) => void;
  isLoading: boolean;
}

export function PassionSuggestionDialog({
  open,
  onOpenChange,
  onAddPassion,
  isLoading
}: PassionSuggestionDialogProps) {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassion, setSelectedPassion] = useState("");
  const [customPassion, setCustomPassion] = useState("");

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { skills: [], passions: [] };
    return searchSkillsAndPassions(searchQuery);
  }, [searchQuery]);

  const handleAddPassion = () => {
    const passionName = activeTab === "custom" ? customPassion : selectedPassion;
    if (!passionName.trim()) return;
    
    onAddPassion(passionName);
    
    // Reset form
    setSelectedPassion("");
    setCustomPassion("");
    setSearchQuery("");
    onOpenChange(false);
  };

  const selectPassion = (passion: string) => {
    setSelectedPassion(passion);
    setActiveTab("confirm");
  };

  const isValid = () => {
    if (activeTab === "custom") {
      return customPassion.trim().length > 0;
    }
    return selectedPassion.trim().length > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Add New Passion/Interest
          </DialogTitle>
          <DialogDescription>
            Choose from our curated passion categories or add a custom interest that drives you.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="confirm" disabled={!selectedPassion && !customPassion}>
              Confirm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {Object.entries(passionCategories).map(([key, category]) => (
                  <div key={key}>
                    <h3 className="font-medium text-sm text-gray-700 mb-3">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {category.passions.map((passion) => (
                        <Button
                          key={passion}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto py-2 px-3 text-left"
                          onClick={() => selectPassion(passion)}
                        >
                          <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-xs">{passion}</span>
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
                  placeholder="Search for passions and interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchQuery && (
                <ScrollArea className="h-[350px]">
                  <div className="space-y-4">
                    {searchResults.passions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Passions & Interests</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.passions.map((passion) => (
                            <Button
                              key={passion}
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-2 px-3 text-left"
                              onClick={() => selectPassion(passion)}
                            >
                              <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="text-xs">{passion}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {searchResults.passions.length === 0 && searchQuery && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No passions found matching "{searchQuery}"</p>
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
                <Label htmlFor="custom-passion">Custom Passion/Interest Name</Label>
                <Input
                  id="custom-passion"
                  placeholder="e.g., Sustainable Gardening"
                  value={customPassion}
                  onChange={(e) => setCustomPassion(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add any passion or interest that's not in our predefined categories
                </p>
              </div>
              
              {customPassion && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Preview:</p>
                  <Badge variant="outline" className="bg-white">
                    {customPassion}
                  </Badge>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="flex-1">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Confirm Passion/Interest</h3>
                <Badge variant="outline" className="text-base px-4 py-2 bg-red-50 text-red-700 border-red-200">
                  {selectedPassion || customPassion}
                </Badge>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Why add passions to your profile?</h4>
                <div className="text-sm text-red-700 space-y-2">
                  <p>• <strong>Better Project Matching:</strong> Find projects that align with your values</p>
                  <p>• <strong>Community Connection:</strong> Connect with like-minded individuals</p>
                  <p>• <strong>Impact Focus:</strong> Contribute to causes you care about</p>
                  <p>• <strong>Skill Development:</strong> Learn skills relevant to your interests</p>
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
            onClick={handleAddPassion}
            disabled={!isValid() || isLoading}
          >
            {isLoading ? "Adding..." : "Add Passion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}