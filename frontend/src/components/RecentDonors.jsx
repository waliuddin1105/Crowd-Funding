import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

function RecentDonors({ campaign_id }) {
  const [donors, setDonors] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${backendUrl}/donations/recent-donors/${campaign_id}`);
      const data = await res.json();

      // Map to normalized format
      const recentDonors = (data.donors || []).map((d) => ({
        name: d.user?.username || "Anonymous",
        amount: d.amount || 0,
        created_at: d.created_at,
      }));

      setDonors(recentDonors);
    } catch (err) {
      console.error("Error fetching recent donors:", err);
      setDonors([]);
    }
  };

  useEffect(() => {
    if (campaign_id) fetchDonors();
  }, [campaign_id]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Recent Donors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {donors.length === 0 ? (
            <p className="text-muted-foreground text-center">No donations yet.</p>
          ) : (
            donors.map((donor, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground">{donor.name}</p>
                  <p className="text-sm text-muted-foreground">{formatTimeAgo(donor.created_at)}</p>
                </div>
                <span className="font-bold text-primary">{formatCurrency(donor.amount)}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentDonors;
