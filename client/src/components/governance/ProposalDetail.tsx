import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ThumbsUp, 
  MessageSquare, 
  Send,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GovernanceProposal, GovernanceVote, GovernanceComment, InsertGovernanceVote, InsertGovernanceComment } from "@shared/schema";

interface ProposalDetailProps {
  proposalId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProposalDetail = ({ proposalId, isOpen, onClose }: ProposalDetailProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voteReason, setVoteReason] = useState("");
  const [comment, setComment] = useState("");

  // Fetch proposal details
  const { data: proposal, isLoading: loadingProposal } = useQuery<GovernanceProposal>({
    queryKey: ["/api/governance/proposals", proposalId],
    enabled: isOpen && proposalId > 0,
  });

  // Fetch proposal votes
  const { data: votesData, isLoading: loadingVotes } = useQuery<{ vote: GovernanceVote, user: any }[]>({
    queryKey: ["/api/governance/proposals", proposalId, "votes"],
    enabled: isOpen && proposalId > 0,
  });

  // Fetch proposal comments
  const { data: commentsData, isLoading: loadingComments } = useQuery<{ comment: GovernanceComment, user: any }[]>({
    queryKey: ["/api/governance/proposals", proposalId, "comments"],
    enabled: isOpen && proposalId > 0,
  });

  // Fetch current user's vote on this proposal
  const { data: userVote } = useQuery<GovernanceVote>({
    queryKey: ["/api/governance/proposals", proposalId, "users", user?.id, "vote"],
    enabled: isOpen && proposalId > 0 && !!user,
    onSuccess: (data: GovernanceVote) => {
      if (data) {
        setSelectedOption(data.vote);
        setVoteReason(data.reason || "");
      }
    },
    onError: () => {
      // If 404, it means user hasn't voted yet, which is fine
    }
  });

  // Submit vote mutation
  const voteMutation = useMutation({
    mutationFn: async (voteData: InsertGovernanceVote) => {
      const res = await apiRequest("POST", "/api/governance/votes", voteData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals", proposalId, "votes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals", proposalId, "users", user?.id, "vote"] });
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals", proposalId] });
      setVoteReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting vote",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Submit comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentData: InsertGovernanceComment) => {
      const res = await apiRequest("POST", "/api/governance/comments", commentData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment submitted",
        description: "Your comment has been added to the discussion.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/governance/proposals", proposalId, "comments"] });
      setComment("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleVoteSubmit = () => {
    if (!user || !selectedOption) return;
    
    voteMutation.mutate({
      proposalId,
      userId: user.id,
      vote: selectedOption,
      reason: voteReason || null
    });
  };

  const handleCommentSubmit = () => {
    if (!user || !comment.trim()) return;
    
    commentMutation.mutate({
      proposalId,
      userId: user.id,
      content: comment,
      parentId: null
    });
  };

  // Calculate vote statistics
  const calculateVoteStats = () => {
    if (!votesData || votesData.length === 0) {
      return {
        totalVotes: 0,
        votesByOption: {}
      };
    }

    // Count votes by option
    const votesByOption: Record<string, { count: number, percentage: number }> = {};
    
    proposal?.options.forEach(option => {
      votesByOption[option] = { count: 0, percentage: 0 };
    });

    votesData.forEach(({ vote }) => {
      if (votesByOption[vote.vote]) {
        votesByOption[vote.vote].count += 1;
      }
    });

    // Calculate percentages
    const totalVotes = votesData.length;
    Object.keys(votesByOption).forEach(option => {
      votesByOption[option].percentage = totalVotes > 0 
        ? (votesByOption[option].count / totalVotes) * 100 
        : 0;
    });

    return {
      totalVotes,
      votesByOption
    };
  };

  const voteStats = calculateVoteStats();
  const isLoading = loadingProposal || loadingVotes || loadingComments;
  const hasVoted = !!userVote;
  const isProposalOpen = proposal?.status === "open";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading proposal details...</div>
        ) : !proposal ? (
          <div className="text-center p-4 text-destructive">
            Proposal not found
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl">{proposal.title}</DialogTitle>
                <Badge className={`text-white ${
                  proposal.status === "open" 
                    ? "bg-blue-500" 
                    : proposal.status === "approved" 
                    ? "bg-green-500" 
                    : "bg-red-500"
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" /> 
                Created {format(new Date(proposal.createdAt || new Date()), "PPP")}
                <span className="mx-1">•</span>
                Voting ends {format(new Date(proposal.votingEndDate), "PPP")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Proposal Description */}
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{proposal.description}</p>
              </div>

              {/* Voting Section */}
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Voting</h3>
                
                {/* Vote stats visualization */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Total votes: {voteStats.totalVotes}</span>
                    <span>Required to pass: {proposal.threshold}%</span>
                  </div>
                  
                  {proposal.options.map(option => {
                    const optionStats = voteStats.votesByOption[option] || { count: 0, percentage: 0 };
                    return (
                      <div key={option} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>{option}</span>
                          <span>{optionStats.count} votes ({Math.round(optionStats.percentage)}%)</span>
                        </div>
                        <Progress value={optionStats.percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                {/* Voting Form - Only for open proposals and authenticated users */}
                {isProposalOpen && user ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Cast your vote</h4>
                    
                    {hasVoted && (
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-md mb-4 text-sm">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          You've already voted: <strong>{userVote?.vote || ""}</strong>
                        </span>
                        <p className="text-muted-foreground mt-1">
                          You can change your vote until the proposal closes.
                        </p>
                      </div>
                    )}
                    
                    <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
                      {proposal.options.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${option}`} />
                          <Label htmlFor={`option-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div>
                      <Label htmlFor="vote-reason">Reason (optional)</Label>
                      <Textarea 
                        id="vote-reason"
                        placeholder="Explain your vote..."
                        value={voteReason}
                        onChange={(e) => setVoteReason(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleVoteSubmit}
                      disabled={!selectedOption || voteMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {hasVoted ? "Update Vote" : "Submit Vote"}
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="bg-muted-foreground/20 p-4 rounded-md text-center">
                    <p>Please log in to vote on this proposal</p>
                  </div>
                ) : (
                  <div className="bg-muted-foreground/20 p-4 rounded-md text-center">
                    <p>Voting is closed for this proposal</p>
                  </div>
                )}
              </div>

              {/* Recent Votes */}
              <div>
                <h3 className="text-lg font-medium mb-2">Recent Votes</h3>
                {votesData && votesData.length > 0 ? (
                  <div className="space-y-3">
                    {votesData.slice(0, 5).map(({ vote, user }) => (
                      <div key={vote.id} className="flex items-center gap-3 p-2 bg-muted rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || ""} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              voted {format(new Date(vote.createdAt || new Date()), "PPp")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{vote.vote}</Badge>
                            {vote.reason && <span className="text-xs text-muted-foreground">- {vote.reason}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {votesData.length > 5 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{votesData.length - 5} more votes
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-md">
                    <p className="text-muted-foreground">No votes yet</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Discussion</h3>
                
                {/* Comment Input - For authenticated users only */}
                {user && (
                  <div className="mb-4 flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Add to the discussion..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim() || commentMutation.isPending}
                      className="p-2 bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Comments List */}
                {commentsData && commentsData.length > 0 ? (
                  <div className="space-y-4">
                    {commentsData.map(({ comment, user }) => (
                      <div key={comment.id} className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || ""} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt || new Date()), "PPp")}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-md">
                    <p className="text-muted-foreground">No comments yet</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDetail;