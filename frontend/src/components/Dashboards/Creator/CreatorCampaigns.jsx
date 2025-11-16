import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Trash2, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getToken } from "@/lib/auth.js"

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })

const getCategoryStyle = (category) => {
    const styles = {
        charity: "bg-blue-500 text-white",
        medical: "bg-red-500 text-white",
        education: "bg-green-500 text-white",
        emergency: "bg-orange-500 text-white",
        personal: "bg-purple-500 text-white",
    }
    return styles[category] || styles.personal
}

const getStatusBadge = (status) => {
    const styles = {
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        draft: "bg-gray-100 text-gray-800",
    }
    return styles[status] || styles.draft
}

function CreatorCampaigns() {
    const [campaigns, setCampaigns] = useState([])
    const [updateContent, setUpdateContent] = useState("")
    const [selectedCampaignId, setSelectedCampaignId] = useState(null)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [campaignToDelete, setCampaignToDelete] = useState(null)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        const access_token = getToken()
        const response = await fetch(`${backendUrl}/creator/campaigns`, {
            headers: access_token
                ? { Authorization: `Bearer ${access_token}` }
                : {},
        })
        const data = await response.json()
        if (data?.campaigns) setCampaigns(data.campaigns)
    }

    // Show delete confirmation modal
    const confirmDeleteCampaign = (campaign) => {
        setCampaignToDelete(campaign)
        setDeleteModalOpen(true)
    }

    // Actually delete the campaign
    const handleDeleteCampaign = async () => {
        if (!campaignToDelete) return
        const access_token = getToken()
        const response = await fetch(
            `${backendUrl}/campaigns/delete-campaign/${campaignToDelete.campaign_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )
        const data = await response.json()
        if (data?.success) {
            setCampaigns((prev) =>
                prev.filter((c) => c.campaign_id !== campaignToDelete.campaign_id)
            )
        } else {
            alert(data.message || "Failed to delete campaign")
        }
        setDeleteModalOpen(false)
        setCampaignToDelete(null)
    }

    const handlePostUpdate = async () => {
        if (!updateContent.trim() || !selectedCampaignId) return
        setLoadingUpdate(true)

        const access_token = getToken()
        const response = await fetch(`${backendUrl}/campaigns/post-update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                campaign_id: selectedCampaignId,
                content: updateContent,
            }),
        })

        const data = await response.json()
        setLoadingUpdate(false)

        if (data?.success) {
            alert("Update posted successfully!")
            setUpdateContent("")
            setSelectedCampaignId(null)
        } else {
            alert(data.message || "Failed to post update")
        }
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-1 gap-4">
                {campaigns.length === 0 ? (
                    <Card className="text-center p-10 bg-muted/50">
                        <CardContent>
                            <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
                            <p className="text-muted-foreground mb-4">
                                You haven't created any campaigns yet. Start your first campaign and reach your goals!
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/create-campaign")}
                            >
                                Create Campaign
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    campaigns.map((campaign) => {
                        const progress = (campaign.raised_amount / campaign.goal_amount) * 100
                        return (
                            <Card key={campaign.campaign_id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <img
                                            src={campaign.image}
                                            alt={campaign.title}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-1">{campaign.title}</h3>
                                                    <div className="flex gap-2 items-center">
                                                        <Badge className={getCategoryStyle(campaign.category)}>
                                                            {campaign.category}
                                                        </Badge>
                                                        <Badge className={getStatusBadge(campaign.status)}>
                                                            {campaign.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            navigate(`/all-campaigns/${campaign.campaign_id}`)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {campaign.status !== "completed" && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => confirmDeleteCampaign(campaign)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setSelectedCampaignId(campaign.campaign_id)
                                                                }
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {campaign.status !== "completed" && (
                                                <>
                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span>
                                                                {formatCurrency(campaign.raised_amount)} raised of{" "}
                                                                {formatCurrency(campaign.goal_amount)}
                                                            </span>
                                                            <span className="font-medium">{progress.toFixed(0)}%</span>
                                                        </div>
                                                        <Progress value={progress} className="h-2" />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Donors</p>
                                                            <p className="font-semibold text-foreground">
                                                                {campaign.total_donors}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Start Date</p>
                                                            <p className="font-semibold">
                                                                {formatDate(campaign.start_date)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">End Date</p>
                                                            <p className="font-semibold">
                                                                {formatDate(campaign.end_date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedCampaignId === campaign.campaign_id && (
                                                        <div className="mt-4">
                                                            <Input
                                                                placeholder="Write an update..."
                                                                value={updateContent}
                                                                onChange={(e) => setUpdateContent(e.target.value)}
                                                            />
                                                            <Button
                                                                className="mt-2"
                                                                onClick={handlePostUpdate}
                                                                disabled={loadingUpdate}
                                                            >
                                                                {loadingUpdate ? "Posting..." : "Post Update"}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>


            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Card className="w-96 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Confirm Delete</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                <X />
                            </Button>
                        </div>
                        <p className="mb-4">
                            Are you sure you want to delete the campaign "
                            {campaignToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteCampaign}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default CreatorCampaigns
