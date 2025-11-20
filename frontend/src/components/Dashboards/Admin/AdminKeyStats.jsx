import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

function AdminKeyStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    fetch(`${backendUrl}/campaigns/admin-key-stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading stats...</p>;
  }

  if (!stats) {
    return <p className="text-center text-red-500">Failed to load statistics.</p>;
  }

  const {
    total_campaigns,
    total_raised,
    total_users,
    pending_campaigns,
    top_campaign,
  } = stats;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Campaigns */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {total_campaigns.count}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {total_campaigns.active} active
            </p>
          </CardContent>
        </Card>

        {/* Total Raised */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(total_raised)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {total_users.count}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {total_users.creators} creators, {total_users.donors} donors
            </p>
          </CardContent>
        </Card>

        {/* Pending Campaigns */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {pending_campaigns}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        {/* Top Campaign */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(top_campaign.raised)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {top_campaign.title || "No campaigns"}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AdminKeyStats;
