import { useState,useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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



  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

function AdminKeyStats() {


  const totalCampaigns = mockPendingCampaigns.length + mockApprovedCampaigns.length + mockRejectedCampaigns.length;
  const activeCampaigns = mockApprovedCampaigns.filter(c => c.status === 'active').length;
  const totalDonationsRaised = mockApprovedCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalUsers = mockCreators.length + mockDonors.length;
  const pendingCount = mockPendingCampaigns.length;
    return (
    <>
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
    </>
  )
}

export default AdminKeyStats
