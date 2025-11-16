import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getToken } from "@/lib/auth.js"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  useEffect(() => {
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

    fetchCampaigns()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4">
      {campaigns.map((campaign) => {
        const progress =
          (campaign.raised_amount / campaign.goal_amount) * 100

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
                      <h3 className="text-lg font-semibold mb-1">
                        {campaign.title}
                      </h3>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteCampaign(campaign.campaign_id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

                          <span className="font-medium">
                            {progress.toFixed(0)}%
                          </span>
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
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default CreatorCampaigns
