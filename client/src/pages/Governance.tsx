import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { GovernanceProposal, GovernanceVote, GovernanceComment } from "@shared/schema";

// Import our custom components
import ProposalDetail from "@/components/governance/ProposalDetail";
import ProposalForm from "@/components/governance/ProposalForm";

// Helper to format dates
const formatDate = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Helper to get status badge color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "open":
      return "bg-blue-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const Governance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch all proposals
  const { data: proposals, isLoading, error } = useQuery<GovernanceProposal[]>({
    queryKey: ["/api/governance/proposals"],
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading governance proposals...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading proposals</div>;
  }

  const activeProposals = proposals?.filter((p) => p.status === "open") || [];
  const pastProposals = proposals?.filter((p) => p.status !== "open") || [];

  const handleViewProposal = (proposalId: number) => {
    setSelectedProposalId(proposalId);
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Collaborative Governance
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Participate in platform decisions and shape the future of the Human Potential Network
        </p>
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto max-w-full min-w-[320px] md:min-w-[450px] grid-cols-2 p-1">
              <TabsTrigger 
                value="active" 
                className="px-2 md:px-4 py-2 text-xs md:text-sm whitespace-normal h-auto data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white font-medium"
              >
                Active Proposals ({activeProposals.length})
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="px-2 md:px-4 py-2 text-xs md:text-sm whitespace-normal h-auto data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white font-medium"
              >
                Past Proposals ({pastProposals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeProposals.length === 0 ? (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No active proposals at the moment</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {activeProposals.map((proposal) => (
                    <ProposalCard 
                      key={proposal.id} 
                      proposal={proposal} 
                      onClick={() => handleViewProposal(proposal.id)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                  onClick={() => setIsFormOpen(true)}
                  disabled={!user}
                >
                  Create New Proposal
                </Button>
              </div>
              {!user && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  You must be logged in to create a proposal
                </p>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastProposals.length === 0 ? (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No past proposals</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {pastProposals.map((proposal) => (
                    <ProposalCard 
                      key={proposal.id} 
                      proposal={proposal} 
                      onClick={() => handleViewProposal(proposal.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProposalId && (
        <ProposalDetail
          proposalId={selectedProposalId}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      <ProposalForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

interface ProposalCardProps {
  proposal: GovernanceProposal;
  onClick: () => void;
}

const ProposalCard = ({ proposal, onClick }: ProposalCardProps) => {
  return (
    <Card className="overflow-hidden border border-border/40 hover:border-border duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{proposal.title}</CardTitle>
          <Badge className={`${getStatusColor(proposal.status)} text-white`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" /> 
          {formatDate(proposal.createdAt || new Date())}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-card-foreground mb-4">
          {proposal.description.length > 150 
            ? `${proposal.description.substring(0, 150)}...` 
            : proposal.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {proposal.options.map((option, index) => (
            <Badge key={index} variant="outline" className="bg-muted">
              {option}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> 
            Ends: {formatDate(proposal.votingEndDate)}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> 
            Threshold: {proposal.threshold}%
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          size="sm" 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={onClick}
        >
          {proposal.status === "open" ? "View & Vote" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Governance;