import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
function AnalyticsTab() {



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    return (
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


        </div>
    )
}

export default AnalyticsTab
