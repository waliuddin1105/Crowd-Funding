import { useState, useEffect } from "react";
import { TrendingUp, DollarSign } from "lucide-react";
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

  date.setHours(date.getHours() + 5);

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
    <Card className="shadow-2xl bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-800/50">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          Recent Donors
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {donors.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700 mb-3">
                <DollarSign className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-400">No donations yet.</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to support!</p>
            </div>
          ) : (
            donors.map((donor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-blue-400 font-bold text-sm">
                      {donor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{donor.name}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(donor.created_at)}</p>
                  </div>
                </div>
                <span className="font-bold text-blue-400 text-lg">{formatCurrency(donor.amount)}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentDonors;