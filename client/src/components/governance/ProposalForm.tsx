import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { InsertGovernanceProposal, Project } from "@shared/schema";

interface ProposalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProposalForm = ({ isOpen, onClose }: ProposalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("platform");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [threshold, setThreshold] = useState<number>(50);
  const [votingEndDate, setVotingEndDate] = useState<Date>(addDays(new Date(), 7));
  const [options, setOptions] = useState<string[]>(["Yes", "No"]);
  const [newOption, setNewOption] = useState("");

  // Fetch projects for the dropdown
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isOpen,
  });

  // Create proposal mutation
  const proposalMutation = useMutation({
    mutationFn: async (proposalData: InsertGovernanceProposal) => {
      const res = await apiRequest("POST", "/api/governance/proposals", proposalData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposal created",
        description: "Your governance proposal has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals"] });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating proposal",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot remove option",
        description: "A proposal must have at least two options.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a proposal.",
        variant: "destructive",
      });
      return;
    }
    
    if (options.length < 2) {
      toast({
        title: "More options needed",
        description: "A proposal must have at least two options.",
        variant: "destructive",
      });
      return;
    }
    
    const proposalData: InsertGovernanceProposal = {
      title,
      description,
      creatorId: user.id,
      projectId,
      type,
      votingEndDate,
      threshold,
      options,
    };
    
    proposalMutation.mutate(proposalData);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("platform");
    setProjectId(null);
    setThreshold(50);
    setVotingEndDate(addDays(new Date(), 7));
    setOptions(["Yes", "No"]);
    setNewOption("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Governance Proposal</DialogTitle>
          <DialogDescription>
            Create a new proposal for the community to vote on
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Proposal Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter a clear title for your proposal"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe the proposal in detail, including what it aims to achieve"
                rows={5}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Proposal Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(value) => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proposal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Platform Change</SelectItem>
                    <SelectItem value="policy">Policy Change</SelectItem>
                    <SelectItem value="funding">Funding Request</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="project">Related Project (Optional)</Label>
                <Select 
                  value={projectId?.toString() || ""} 
                  onValueChange={(value) => setProjectId(value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific project</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="threshold">Threshold (%)</Label>
                <Input 
                  id="threshold" 
                  type="number" 
                  min={1} 
                  max={100} 
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 50)} 
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of votes needed for the proposal to pass
                </p>
              </div>
              
              <div>
                <Label htmlFor="date">Voting End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !votingEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {votingEndDate ? format(votingEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={votingEndDate}
                      onSelect={(date) => date && setVotingEndDate(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">
                  Voting will be open until this date
                </p>
              </div>
            </div>
            
            <div>
              <Label>Voting Options</Label>
              <div className="space-y-2 mt-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={option} 
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }} 
                      required
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      className="p-2"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input 
                    value={newOption} 
                    onChange={(e) => setNewOption(e.target.value)} 
                    placeholder="Add another option..."
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="p-2"
                    onClick={handleAddOption}
                    disabled={!newOption.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  You must have at least two options. Add more if needed.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={proposalMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              Create Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalForm;