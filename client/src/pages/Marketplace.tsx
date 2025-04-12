import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RewardItem, TokenRedemption } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, 
  Gift, 
  Sparkles, 
  Award, 
  Package, 
  Dumbbell, 
  BookOpen, 
  Globe,
  CheckCircle2,
  Info,
  Clock,
  CircleDot,
  AlertCircle,
  Lightbulb,
  Flame
} from "lucide-react";

export default function Marketplace() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's token balance
  const { data: tokenBalance, isLoading: loadingBalance } = useQuery<{userId: number, balance: number}>({
    queryKey: ["/api/users", user?.id, "token-balance"],
    enabled: !!user,
  });

  // Fetch all reward items
  const { data: rewards, isLoading: loadingRewards } = useQuery<RewardItem[]>({
    queryKey: ["/api/rewards"],
    enabled: !!user,
  });

  // Fetch user's redemption history
  const { data: redemptions, isLoading: loadingRedemptions } = useQuery<{redemption: TokenRedemption, reward: RewardItem}[]>({
    queryKey: ["/api/users", user?.id, "redemptions"],
    enabled: !!user,
  });

  // Redeem token mutation
  const redeemMutation = useMutation({
    mutationFn: async (rewardItemId: number) => {
      if (!user) throw new Error("Not authenticated");
      
      const res = await apiRequest("POST", "/api/redemptions", {
        userId: user.id,
        rewardItemId,
        tokenAmount: selectedReward?.tokenCost || 0,
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reward redeemed!",
        description: `You've successfully redeemed ${selectedReward?.name}`,
      });
      
      // Close dialogs
      setOpenDialog(false);
      setConfirmationOpen(false);
      
      // Reset selected reward
      setSelectedReward(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "token-balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "redemptions"] });
    },
    onError: (error) => {
      toast({
        title: "Redemption failed",
        description: `There was an error: ${error.message}`,
        variant: "destructive",
      });
      setConfirmationOpen(false);
    },
  });

  // Get unique categories
  const categories = rewards 
    ? Array.from(new Set(rewards.map(reward => reward.category)))
    : [];

  // Filter rewards based on active category and search query
  const filteredRewards = rewards
    ? rewards.filter(reward => {
        const matchesCategory = !activeCategory || reward.category === activeCategory;
        const matchesSearch = !searchQuery || 
          reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reward.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch && reward.available;
      })
    : [];

  // Handle reward selection
  const handleSelectReward = (reward: RewardItem) => {
    setSelectedReward(reward);
    setOpenDialog(true);
  };

  // Handle redemption confirmation
  const handleConfirmRedemption = () => {
    if (!selectedReward) return;
    
    // Check if user has enough tokens
    if ((tokenBalance?.balance || 0) < selectedReward.tokenCost) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${selectedReward.tokenCost} tokens to redeem this reward. Earn more by completing learning paths and projects!`,
        variant: "destructive",
      });
      return;
    }
    
    setConfirmationOpen(true);
  };

  // Process redemption
  const handleProcessRedemption = () => {
    if (!selectedReward) return;
    redeemMutation.mutate(selectedReward.id);
  };

  // Get the icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'digital':
        return <Gift className="h-5 w-5" />;
      case 'physical':
        return <Package className="h-5 w-5" />;
      case 'experience':
        return <Globe className="h-5 w-5" />;
      case 'learning':
        return <BookOpen className="h-5 w-5" />;
      case 'skill':
        return <Dumbbell className="h-5 w-5" />;
      case 'donation':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  // Format redemption status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'fulfilled':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Fulfilled
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <AlertCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <CircleDot className="h-3 w-3 mr-1" /> {status}
          </Badge>
        );
    }
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to access the marketplace and redeem rewards with your impact tokens.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600" onClick={() => window.location.href = "/auth"}>
            Log In to Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Marketplace</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Redeem your impact tokens for rewards, experiences, and more.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 px-4 py-2 rounded-lg flex items-center">
              <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              <div>
                <div className="text-sm font-medium">Your Balance</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {loadingBalance ? "Loading..." : `${tokenBalance?.balance || 0} Tokens`}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Browse Rewards
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Redemption History
            </TabsTrigger>
          </TabsList>
          
          {/* Browse Rewards Tab */}
          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search rewards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <ShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(null)}
                  className="text-xs sm:text-sm"
                >
                  All Categories
                </Button>
                
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(prev => prev === category ? null : category)}
                    className="text-xs sm:text-sm flex items-center gap-1"
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Info Alert */}
            <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
              <Info className="h-4 w-4" />
              <AlertTitle>How to earn more tokens</AlertTitle>
              <AlertDescription>
                Complete learning paths, contribute to projects, and participate in governance to earn impact tokens.
              </AlertDescription>
            </Alert>
            
            {/* Rewards Grid */}
            {loadingRewards ? (
              <div className="text-center py-12">
                <p>Loading rewards...</p>
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No rewards found</h3>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRewards.map(reward => (
                  <Card key={reward.id} className="overflow-hidden flex flex-col">
                    {reward.image && (
                      <div className="h-48 bg-muted overflow-hidden">
                        <img 
                          src={reward.image} 
                          alt={reward.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {getCategoryIcon(reward.category)}
                          <span className="ml-1">{reward.category}</span>
                        </Badge>
                        <Badge variant="secondary" className="font-bold">
                          {reward.tokenCost} Tokens
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-1">{reward.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{reward.description}</CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="mt-auto pt-2">
                      <Button 
                        className="w-full gap-2"
                        variant="default"
                        disabled={(tokenBalance?.balance || 0) < reward.tokenCost}
                        onClick={() => handleSelectReward(reward)}
                      >
                        {(tokenBalance?.balance || 0) < reward.tokenCost ? (
                          <>Not Enough Tokens</>
                        ) : (
                          <>Redeem Reward</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Redemption History Tab */}
          <TabsContent value="history">
            {loadingRedemptions ? (
              <div className="text-center py-12">
                <p>Loading your redemption history...</p>
              </div>
            ) : !redemptions || redemptions.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No redemptions yet</h3>
                <p className="mt-1 text-muted-foreground">
                  You haven't redeemed any rewards yet. Browse the marketplace to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {redemptions.map(({ redemption, reward }) => (
                  <Card key={redemption.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {reward.image && (
                        <div className="w-full md:w-24 h-24 flex-shrink-0 bg-muted">
                          <img 
                            src={reward.image} 
                            alt={reward.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <h3 className="font-semibold">{reward.name}</h3>
                            {getStatusBadge(redemption.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Redeemed on {new Date(redemption.redemptionDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Award className="h-3.5 w-3.5" />
                            {redemption.tokenAmount} Tokens
                          </Badge>
                          
                          {redemption.status === 'fulfilled' && redemption.fulfillmentDate && (
                            <span className="text-xs text-muted-foreground">
                              Fulfilled on {new Date(redemption.fulfillmentDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Redemption Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Redeem Reward
            </DialogTitle>
            <DialogDescription>
              You are about to redeem this reward with your impact tokens.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="space-y-4 py-4">
              {selectedReward.image && (
                <div className="h-48 rounded-md overflow-hidden">
                  <img 
                    src={selectedReward.image} 
                    alt={selectedReward.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedReward.name}</h3>
                <Badge className="mb-2">{selectedReward.category}</Badge>
                <p className="text-muted-foreground">{selectedReward.description}</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-bold ml-2">{selectedReward.tokenCost} Tokens</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className={`font-bold ml-2 ${(tokenBalance?.balance || 0) < selectedReward.tokenCost ? 'text-red-500' : 'text-green-500'}`}>
                    {tokenBalance?.balance || 0} Tokens
                  </span>
                </div>
              </div>
              
              {(tokenBalance?.balance || 0) < selectedReward.tokenCost && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Insufficient tokens</AlertTitle>
                  <AlertDescription>
                    You need {selectedReward.tokenCost - (tokenBalance?.balance || 0)} more tokens to redeem this reward.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedemption} 
              disabled={(tokenBalance?.balance || 0) < (selectedReward?.tokenCost || 0)}
            >
              {(tokenBalance?.balance || 0) < (selectedReward?.tokenCost || 0) ? 'Not Enough Tokens' : 'Redeem Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Confirm Redemption
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="font-semibold">{selectedReward.name}</div>
                <div className="text-sm text-muted-foreground">Cost: {selectedReward.tokenCost} Tokens</div>
              </div>
              
              <Alert className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Your token balance will be reduced by {selectedReward.tokenCost} tokens after this redemption.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleProcessRedemption}
              disabled={redeemMutation.isPending}
              className="bg-gradient-to-r from-amber-600 to-amber-700"
            >
              {redeemMutation.isPending ? 'Processing...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}