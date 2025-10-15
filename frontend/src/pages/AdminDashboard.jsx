import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast.js';
import {
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  Ban,
  Trash2,
  Edit,
  Download,
  BarChart3,
  Shield,
  Plus,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

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

const mockRejectedCampaigns = [
  {
    id: 5,
    title: "Suspicious Campaign",
    creator: "Unknown User",
    category: "Personal",
    goalAmount: 1000000,
    dateRejected: "2025-01-12",
    reason: "Insufficient documentation and verification",
  },
];

const mockCreators = [
  {
    id: "c1",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    campaigns: 3,
    totalRaised: 45000,
    joinDate: "2024-10-15",
    status: "active",
  },
  {
    id: "c2",
    name: "Mike Chen",
    email: "mike@example.com",
    campaigns: 5,
    totalRaised: 120000,
    joinDate: "2024-08-20",
    status: "active",
  },
];

const mockDonors = [
  {
    id: "d1",
    name: "Emily Johnson",
    email: "emily@example.com",
    totalDonations: 5000,
    campaignsSupported: 8,
    joinDate: "2024-11-05",
    status: "active",
  },
  {
    id: "d2",
    name: "Robert Taylor",
    email: "robert@example.com",
    totalDonations: 12000,
    campaignsSupported: 15,
    joinDate: "2024-09-10",
    status: "active",
  },
];



const mockTransactions = [
  {
    id: "t1",
    type: "donation",
    donor: "Emily Johnson",
    campaign: "Community Food Bank",
    amount: 500,
    date: "2025-01-15 14:30",
    status: "completed",
  },
  {
    id: "t2",
    type: "donation",
    donor: "Robert Taylor",
    campaign: "Disaster Relief Fund",
    amount: 1000,
    date: "2025-01-15 12:15",
    status: "completed",
  },
];



const AdminDashboard = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Calculate stats
  const totalCampaigns = mockPendingCampaigns.length + mockApprovedCampaigns.length + mockRejectedCampaigns.length;
  const activeCampaigns = mockApprovedCampaigns.filter(c => c.status === 'active').length;
  const totalDonationsRaised = mockApprovedCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalUsers = mockCreators.length + mockDonors.length;
  const pendingCount = mockPendingCampaigns.length;

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

  const handleApprovePayout = (payoutId) => {
    toast({
      title: "Payout Approved",
      description: "Payout has been processed successfully.",
    });
  };

  

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage campaigns, users, and platform operations</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalDonationsRaised)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Platform-wide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockCreators.length} creators, {mockDonors.length} donors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(200000)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Disaster Relief Fund
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            {/* Pending Campaigns */}
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

            {/* Approved Campaigns */}
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

            {/* Rejected Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Rejected Campaigns</CardTitle>
                <CardDescription>Campaigns that were rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date Rejected</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRejectedCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.title}</TableCell>
                        <TableCell>{campaign.creator}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryStyle(campaign.category)} variant="outline">
                            {campaign.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(campaign.dateRejected)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {campaign.reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Creators */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Creators</CardTitle>
                <CardDescription>Registered creators and their statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Campaigns</TableHead>
                      <TableHead>Total Raised</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCreators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} />
                              <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{creator.name}</div>
                              <div className="text-sm text-muted-foreground">{creator.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{creator.campaigns}</TableCell>
                        <TableCell>{formatCurrency(creator.totalRaised)}</TableCell>
                        <TableCell>{formatDate(creator.joinDate)}</TableCell>
                        <TableCell>
                          <Badge variant={creator.status === 'active' ? 'default' : 'destructive'}>
                            {creator.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Donors */}
            <Card>
              <CardHeader>
                <CardTitle>Donors</CardTitle>
                <CardDescription>Registered donors and their contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Total Donations</TableHead>
                      <TableHead>Campaigns Supported</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${donor.name}`} />
                              <AvatarFallback>{donor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{donor.name}</div>
                              <div className="text-sm text-muted-foreground">{donor.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(donor.totalDonations)}</TableCell>
                        <TableCell>{donor.campaignsSupported}</TableCell>
                        <TableCell>{formatDate(donor.joinDate)}</TableCell>
                        <TableCell>
                          <Badge variant={donor.status === 'active' ? 'default' : 'destructive'}>
                            {donor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-4">
            {/* Payout Monitoring */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Payout Requests</CardTitle>
                <CardDescription>Review and approve withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">{payout.creator}</TableCell>
                        <TableCell>{payout.campaign}</TableCell>
                        <TableCell>{formatCurrency(payout.amount)}</TableCell>
                        <TableCell>{payout.method}</TableCell>
                        <TableCell>{formatDate(payout.requestDate)}</TableCell>
                        <TableCell>
                          <Badge variant={payout.status === 'pending' ? 'outline' : 'default'}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payout.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleApprovePayout(payout.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          )}
                          {payout.status === 'completed' && (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(payout.processedDate)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card> */}

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge variant="outline">{transaction.type}</Badge>
                        </TableCell>
                        <TableCell>{transaction.donor}</TableCell>
                        <TableCell>{transaction.campaign}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge variant="default">{transaction.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Top Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Funded Campaigns</CardTitle>
                  <CardDescription>Highest performing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApprovedCampaigns.slice(0, 5).map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(campaign.raisedAmount)} • {campaign.donors} donors
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              
            </div>
          </TabsContent>

          {/* Admin Controls Tab */}
          <TabsContent value="controls" className="space-y-4">
            {/* Manage Categories */}
            

            {/* Admin Roles */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Admin Accounts & Roles</CardTitle>
                    <CardDescription>Manage admin users and their permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Admin User</div>
                        <div className="text-sm text-muted-foreground">admin@platform.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>
                        <Shield className="mr-1 h-3 w-3" />
                        Super Admin
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Moderation */}
           
          </TabsContent>
        </Tabs>
      </div>

      {/* Approve Dialog */}
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

      {/* Reject Dialog */}
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
    </div>
    </>
  );
};

export default AdminDashboard;