import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import React from 'react'
const formatTimeAgo = (dateString) => {
  const dateUTC = new Date(dateString);
  const datePK = new Date(dateUTC.getTime() + 5 * 60 * 60 * 1000);

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - datePK.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;

  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

function CampaignUpdates({ campaign_id, creator_name }) {
    const [updates,setUpdates] = useState([])

useEffect(() => {
  const fetchUpdates = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/campaigns/get-updates/${campaign_id}`);
      const data = await response.json(); // ✅ added 'await'

      if (data.success && data.updates.length > 0) {
        setUpdates(data.updates);
        console.log(data.updates)
      } else {
        setUpdates([]); 
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
      setUpdates([]); // prevent infinite loading
    }
  };

  fetchUpdates();
}, []);
    return (
        <>
            <div className="space-y-4">
                {updates.map((update) => (
                    <Card key={update.update_id} className="shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {formatTimeAgo(update.created_at)}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                    {creator_name}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground">{update.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </>
    )
}

export default CampaignUpdates
