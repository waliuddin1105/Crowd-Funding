import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

const getCategoryStyle = (category) => {
  const styles = {
    charity: "bg-blue-500 text-white",
    medical: "bg-red-500 text-white",
    education: "bg-green-500 text-white",
    emergency: "bg-orange-500 text-white",
    personal: "bg-purple-500 text-white"
  }
  return styles[category] || styles.personal
}

function FollowingCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const user = getUser()
    if (!user || !user.user_id) return
    
    fetchFollowing(user.user_id)
  }, [])
  const handleClick = (campaign_id)=>{
    navigate(`/all-campaigns/${campaign_id}`)
  }

  const fetchFollowing = async (donorId) => {
    try {
      setLoading(true)
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${backendUrl}/follows/get-following/${donorId}`)

      if (!res.ok) throw new Error("Failed to fetch followed campaigns")

      const data = await res.json()
      setCampaigns(data.following || [])
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaigns You Follow</CardTitle>
        <CardDescription>
          Quick access to campaigns you're interested in
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* No Following */}
        {!loading && campaigns.length === 0 && (
          <p className="text-muted-foreground">You are not following any campaigns.</p>
        )}

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {campaigns.map((campaign) => (
    <div
      key={campaign.campaign_id}
      className="relative group overflow-hidden rounded-lg border hover:shadow-lg transition-all"
    >
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(
              campaign.category
            )}`}
          >
            {campaign.category}
          </span>

          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
            {campaign.status}
          </span>
        </div>

        <h4 className="font-semibold text-foreground mt-2">
          {campaign.title}
        </h4>

        <div className="flex gap-2 mt-3" onClick={() => handleClick(campaign.campaign_id)}>
          <Button className="flex-1" size="sm">View Details</Button>
        </div>
      </div>
    </div>
  ))}
</div>

      </CardContent>
    </Card>
  )
}

export default FollowingCampaigns
