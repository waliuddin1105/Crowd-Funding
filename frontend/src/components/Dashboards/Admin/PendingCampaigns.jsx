import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast.js';
import {
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getUser } from '@/lib/auth.js';



// Calculate stats
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryStyle = (category) => {
  const styles = {
    Medical: 'bg-red-500/10 text-red-500 border-red-500/20',
    Education: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Emergency: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Charity: 'bg-green-500/10 text-green-500 border-green-500/20',
    Personal: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };
  return styles[category] || 'bg-muted text-muted-foreground';
};

function PendingCampaigns() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingCount, setPendingCount] = useState(0)
  const [user, setUser] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [pendingCampaigns, SetPendingCampaigns] = useState([])
  useEffect(() => {
    const u = getUser()
    if (u) {
      setUser(u)
    }
  }, [])

  useEffect(() => {
    const fetchPendingStats = async () => {
      const response = await fetch(`${backendUrl}/campaigns/status/pending`)
      const data = await response.json()
      if (data?.status === "success") {
        SetPendingCampaigns(data.data)
        setPendingCount(data.data.length)
      }
    }

    fetchPendingStats()
  }, [])
  const handleApproveCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowApproveDialog(true);
  };

  const handleRejectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowRejectDialog(true);
  };
  const updateCampaignStatus = async ({ campaign_id, decision, comments }) => {
    try {
      const response = await fetch(`${backendUrl}/admin-reviews/handle-campaign-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          admin_id: user?.user_id,
          campaign_id,
          decision,
          comments
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", message: error.message };
    }
  };

  const confirmApproval = async () => {
    const data = await updateCampaignStatus({
      campaign_id: selectedCampaign.campaign_id,
      decision: "approved",
      comments: "Approved by the admin"
    });

    if (data.status === "success") {
      toast({
        title: "Campaign Approved",
        description: `"${selectedCampaign.title}" has been approved successfully.`,
      });

      SetPendingCampaigns(prev =>
        prev.filter(c => c.campaign_id !== selectedCampaign.campaign_id)
      );
      setPendingCount(prev => prev - 1);
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to approve the campaign.",
        variant: "destructive",
      });
    }

    setShowApproveDialog(false);
    setSelectedCampaign(null);
  };


  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    const data = await updateCampaignStatus({
      campaign_id: selectedCampaign.campaign_id,
      decision: "rejected",
      comments: rejectionReason
    });

    if (data.status === "success") {
      toast({
        title: "Campaign Rejected",
        description: `"${selectedCampaign.title}" has been rejected.`,
      });

      SetPendingCampaigns(prev =>
        prev.filter(c => c.campaign_id !== selectedCampaign.campaign_id)
      );
      setPendingCount(prev => prev - 1);
    } else {
      toast({
        title: "Error",
        description: data.message || "Failed to reject the campaign.",
        variant: "destructive",
      });
    }

    setShowRejectDialog(false);
    setSelectedCampaign(null);
    setRejectionReason("");
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Campaigns</CardTitle>
              <CardDescription>Campaigns awaiting approval</CardDescription>
            </div>
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              {pendingCount} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
  {pendingCount === 0 ? (
    <div className="text-center py-10 text-muted-foreground">
      <p className="text-lg font-medium">No pending campaigns 🎉</p>
      <p className="text-sm">All campaigns have been reviewed.</p>
    </div>
  ) : (
    pendingCampaigns.map((campaign) => (
      <div key={campaign.campaign_id} className="border rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-foreground">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground">
              by {campaign.creator.username} • {formatDate(campaign.created_at)}
            </p>
          </div>
          <Badge className={getCategoryStyle(campaign.category)}>
            {campaign.category}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Goal: {formatCurrency(campaign.goal_amount)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleApproveCampaign(campaign)}
            className="flex-1"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleRejectCampaign(campaign)}
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>
    ))
  )}
</div>

        </CardContent>
      </Card>
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Campaign</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this campaign. The creator will be notified.
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{selectedCampaign.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Creator: {selectedCampaign.creator.username}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explain why this campaign is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejection}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this campaign? It will become visible to all users.
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="py-4">
              <h4 className="font-semibold mb-2">{selectedCampaign.title}</h4>
              <p className="text-sm text-muted-foreground">
                Creator: {selectedCampaign.creator.username}<br />
                Goal: {formatCurrency(selectedCampaign.goal_amount)}<br />
                Category: {selectedCampaign.category}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproval}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PendingCampaigns
