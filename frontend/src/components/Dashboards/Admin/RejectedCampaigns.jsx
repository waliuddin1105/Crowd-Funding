import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

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



const RejectedCampaigns = () => {
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
  return (
    <>
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
    </>
  )
}

export default RejectedCampaigns
