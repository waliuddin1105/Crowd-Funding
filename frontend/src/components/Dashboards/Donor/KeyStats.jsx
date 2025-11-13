import React, { useEffect, useState } from 'react'
import { getUser } from '@/lib/auth'
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Star 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function KeyStats() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedUser = getUser()
    setUser(storedUser)

    if (storedUser && storedUser.user_id) {
      fetchDonorStats(storedUser.user_id)
    }
  }, [])

  const fetchDonorStats = async (donorId) => {
    try {
      setLoading(true)
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${backendUrl}/donations/donor-stats/${donorId}`)
      if (!res.ok) throw new Error("Failed to fetch donor stats")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading donor stats...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>
  }

  if (!stats) {
    return <p className="text-center text-muted-foreground">No stats available.</p>
  }

  const totalDonated = stats.total_donated || 0
  const totalCampaignsSupported = stats.campaigns_supported || 0
  const recentDonation = stats.recent_campaign || {}
  const impactScore = stats.impact_score || "0/5"

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Donated */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalDonated)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalDonated)} total contributions
            </p>
          </CardContent>
        </Card>

        {/* Campaigns Supported */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCampaignsSupported}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completed_campaigns_supported} completed
            </p>
          </CardContent>
        </Card>

        {/* Most Recent Donation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentDonation ? (
              <>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(recentDonation.amount || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {recentDonation.title || "N/A"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No recent donations</p>
            )}
          </CardContent>
        </Card>

        {/* Impact Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{impactScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your contributions and completed campaigns
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default KeyStats
