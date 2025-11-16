import { useState, useEffect } from "react"
import {
    DollarSign, TrendingUp, Users, Target, Wallet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getToken, getUser } from "@/lib/auth.js"

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function CreatorKeyStats() {
    const [stats, setStats] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const fetchStats = async () => {
            const storedUser = getUser()
            const access_token = getToken()
            const response = await fetch(`${backendUrl}/creator/dashboard`, {
                headers: {
                    Authorization: access_token ? `Bearer ${access_token}` : ""
                }
            })

            const data = await response.json()
            if (data?.Success) setStats(data.Success)
        }

        fetchStats()
    }, [])

    if (!stats) return <div>Loading...</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Total Raised
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats.total_raised)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4" /> Active Campaigns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.active_campaigns}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" /> Total Donors
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.total_donors}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Recent Donation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats.recent_donation.amount)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Available
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats.available)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatorKeyStats
