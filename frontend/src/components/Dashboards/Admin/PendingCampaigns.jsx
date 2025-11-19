import { useState } from 'react';
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
// Mock Data
const mockPendingCampaigns = [
  {
    id: 1,
    title: "Emergency Medical Fund for John",
    creator: "Sarah Wilson",
    creatorId: "c1",
    category: "Medical",
    goalAmount: 50000,
    dateCreated: "2025-01-15",
    description: "Urgent medical treatment needed...",
  },
  {
    id: 2,
    title: "Education Support for Underprivileged Kids",
    creator: "Mike Chen",
    creatorId: "c2",
    category: "Education",
    goalAmount: 25000,
    dateCreated: "2025-01-14",
    description: "Help provide quality education...",
  },
];



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
     const pendingCount = mockPendingCampaigns.length;
   const handleApproveCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowApproveDialog(true);
  };

  const handleRejectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowRejectDialog(true);
  };

  const confirmApproval = () => {
    toast({
      title: "Campaign Approved",
      description: `"${selectedCampaign.title}" has been approved successfully.`,
    });
    setShowApproveDialog(false);
    setSelectedCampaign(null);
  };

  const confirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Campaign Rejected",
      description: `"${selectedCampaign.title}" has been rejected.`,
    });
    setShowRejectDialog(false);
    setSelectedCampaign(null);
    setRejectionReason('');
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
                  {mockPendingCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {campaign.creator} • {formatDate(campaign.dateCreated)}
                          </p>
                        </div>
                        <Badge className={getCategoryStyle(campaign.category)}>
                          {campaign.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
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
                  ))}
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
                  Creator: {selectedCampaign.creator}
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
                Creator: {selectedCampaign.creator}<br />
                Goal: {formatCurrency(selectedCampaign.goalAmount)}<br />
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
