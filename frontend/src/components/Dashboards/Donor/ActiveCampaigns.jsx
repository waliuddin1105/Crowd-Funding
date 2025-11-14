import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/auth"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
function ActiveCampaigns() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeCampaigns, setActiveCampaigns] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [updatesLoading, setUpdatesLoading] = useState(false)
    const [updatesError, setUpdatesError] = useState(null)

    useEffect(() => {
        const storedUser = getUser()
        setUser(storedUser)

        if (storedUser && storedUser.user_id) {
            fetchActiveCampaigns(storedUser.user_id)
        }
    }, [])

    const fetchActiveCampaigns = async (donorId) => {
        try {
            setLoading(true)
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            const res = await fetch(`${backendUrl}/donations/active-campaigns/${donorId}`)
            if (!res.ok) throw new Error("Failed to fetch active campaigns")
            const data = await res.json()
            setActiveCampaigns(data.active_campaigns || [])
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchCampaignUpdates = async (campaignId) => {
        try {
            setUpdatesLoading(true)
            setUpdatesError(null)
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            const res = await fetch(`${backendUrl}/campaigns/get-updates/${campaignId}`)
            if (!res.ok) throw new Error("Failed to fetch campaign updates")
            const data = await res.json()
            setSelectedCampaign((prev) => ({
                ...prev,
                updates: data.updates || []
            }))
        } catch (err) {
            console.error(err)
            setUpdatesError(err.message)
        } finally {
            setUpdatesLoading(false)
        }
    }

    const handleViewUpdates = (campaign) => {
        setSelectedCampaign({ ...campaign, updates: [] }) // initialize updates empty
        fetchCampaignUpdates(campaign.campaign_id)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Active Campaigns You Support</CardTitle>
                    <CardDescription>
                        Track the progress of campaigns you've donated to
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {activeCampaigns.map((campaign) => {
                            const progress = campaign.goal_amount
                                ? Math.round((campaign.raised_amount / campaign.goal_amount) * 100)
                                : 0

                            return (
                                <div key={campaign.campaign_id} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-foreground">{campaign.title}</h4>
                                        <Badge variant="outline">{progress}% Funded</Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <Progress value={progress} className="h-2" />

                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {formatCurrency(campaign.raised_amount)} raised
                                            </span>
                                            <span className="text-muted-foreground">
                                                Goal: {formatCurrency(campaign.goal_amount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ---------- View Updates Dialog ---------- */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                size="sm"
                                                onClick={() => handleViewUpdates(campaign)}
                                            >
                                                View Campaign Updates
                                            </Button>
                                        </DialogTrigger>

                                        {selectedCampaign && selectedCampaign.campaign_id === campaign.campaign_id && (
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Updates – {selectedCampaign.title}
                                                    </DialogTitle>
                                                </DialogHeader>

                                                {updatesLoading ? (
                                                    <p>Loading updates...</p>
                                                ) : updatesError ? (
                                                    <p className="text-red-500">{updatesError}</p>
                                                ) : selectedCampaign.updates?.length ? (
                                                    <div className="mt-4 space-y-4">
                                                        {selectedCampaign.updates.map((u, i) => (
                                                            <div key={i} className="p-3 border rounded-lg bg-muted/20">
                                                                <p className="text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                                                                <p className="mt-1 text-sm">{u.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>No updates available.</p>
                                                )}
                                            </DialogContent>
                                        )}
                                    </Dialog>
                                    {/* ------------------------------------------ */}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ActiveCampaigns
