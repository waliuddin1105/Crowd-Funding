import { useState, useEffect } from 'react';
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

const RejectedCampaigns = () => {
  const [rejectedCampaigns, setRejectedCampaigns] = useState([]);

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${backendUrl}/campaigns/status/rejected`);
        const data = await res.json();

        if (data?.status === "success") {
          setRejectedCampaigns(data.data);
          console.log("Rejected: ",data.data)
        }
      } catch (err) {
        console.error("Error fetching rejected campaigns:", err);
      }
    };

    fetchRejected();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryStyle = (category) => {
    const styles = {
      medical: 'bg-red-500/10 text-red-500 border-red-500/20',
      education: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      emergency: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      charity: 'bg-green-500/10 text-green-500 border-green-500/20',
      personal: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };
    return styles[category?.toLowerCase()] || 'bg-muted text-muted-foreground';
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
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rejectedCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No rejected campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                rejectedCampaigns.map((campaign) => (
                  <TableRow key={campaign.campaign_id}>
                    <TableCell className="font-medium">{campaign.title}</TableCell>

                    <TableCell>{campaign.creator.username}</TableCell>

                    <TableCell>
                      <Badge className={getCategoryStyle(campaign.category)} variant="outline">
                        {campaign.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {campaign.rejection_reason}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default RejectedCampaigns;
