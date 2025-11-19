import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast.js';
import {
  Eye,
  Ban,
  Edit
} from 'lucide-react';



const mockApprovedCampaigns = [
  {
    id: 3,
    title: "Community Food Bank",
    creator: "Lisa Anderson",
    category: "Charity",
    goalAmount: 100000,
    raisedAmount: 75000,
    donors: 245,
    status: "active",
    dateApproved: "2025-01-10",
  },
  {
    id: 4,
    title: "Disaster Relief Fund",
    creator: "David Brown",
    category: "Emergency",
    goalAmount: 200000,
    raisedAmount: 200000,
    donors: 1250,
    status: "completed",
    dateApproved: "2024-12-20",
  },
];







const ApprovedCampaigns = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');



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

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      pending: 'outline',
    };
    return variants[status] || 'outline';
  };

  
  return (
    <>
      <Card>
                    <CardHeader>
                      <CardTitle>Approved Campaigns</CardTitle>
                      <CardDescription>Active and completed campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Creator</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockApprovedCampaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{campaign.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {campaign.donors} donors
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{campaign.creator}</TableCell>
                              <TableCell>
                                <Badge className={getCategoryStyle(campaign.category)} variant="outline">
                                  {campaign.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    {formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.goalAmount)}
                                  </div>
                                  <Progress value={(campaign.raisedAmount / campaign.goalAmount) * 100} />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadge(campaign.status)}>
                                  {campaign.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
    </>
  )
}

export default ApprovedCampaigns
