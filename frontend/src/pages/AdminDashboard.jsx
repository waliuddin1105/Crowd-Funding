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
import AdminKeyStats from '@/components/Dashboards/Admin/AdminKeyStats';
import PendingCampaigns from '@/components/Dashboards/Admin/PendingCampaigns';
import ApprovedCampaigns from '@/components/Dashboards/Admin/ApprovedCampaigns';
import RejectedCampaigns from '@/components/Dashboards/Admin/RejectedCampaigns';
import UsersTab from '@/components/Dashboards/Admin/UsersTab';
import TransactionHistory from '@/components/Dashboards/Admin/TransactionHistory';
import AnalyticsTab from '@/components/Dashboards/Admin/AnalyticsTab';
import AdminControls from '@/components/Dashboards/Admin/AdminControls';

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
        <AdminKeyStats />

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
            <PendingCampaigns />

            {/* Approved Campaigns */}
            <ApprovedCampaigns />

            {/* Rejected Campaigns */}
            <RejectedCampaigns />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UsersTab />
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-4">
            
            {/* Transaction History */}
            <TransactionHistory />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab />
          </TabsContent>

          {/* Admin Controls Tab */}
          <TabsContent value="controls" className="space-y-4">        
            {/* Admin Controls */}
            <AdminControls />
           
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
    </>
  );
};

export default AdminDashboard;