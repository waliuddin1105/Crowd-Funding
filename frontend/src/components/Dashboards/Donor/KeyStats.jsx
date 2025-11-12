import { getUser } from '@/lib/auth'
import React, { useEffect, useState } from 'react'
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }


function KeyStats() {
    const [user,setUser] = useState([])
    useEffect(()=>{
        const storedUser = getUser()
        setUser(storedUser)
    },[])
    return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalDonated)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(currentYearDonations)} this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalCampaignsSupported}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockActiveCampaigns.length} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(recentDonation.amount)}</div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {recentDonation.campaign}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">4.8/5</div>
              <p className="text-xs text-muted-foreground mt-1">Based on your contributions</p>
            </CardContent>
          </Card>
        </div>
    </>
  )
}

export default KeyStats
