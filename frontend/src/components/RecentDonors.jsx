import {  TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Mock recent donors
const now = new Date();

const mockDonors = [
  { name: "Messi", amount: 500, created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString() }, // 10 minutes ago
  { name: "Jennifer Lee", amount: 100, created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() }, // 5 hours ago
  { name: "Robert Kim", amount: 250, created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
  { name: "Maria Garcia", amount: 150, created_at: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString() }, // ~1 day ago
  { name: "James Wilson", amount: 75, created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

function RecentDonors({campaign_id}) {
    // will setup API key to get name,amount and time    w.r.t cmapaign_id. For now using mock data
  return (
    <>
        <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recent Donors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDonors.map((donor, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground">{donor.name}</p>
                            <p className="text-sm text-muted-foreground">{formatTimeAgo( donor.created_at)}</p>
                          </div>
                          <span className="font-bold text-primary">{formatCurrency(donor.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
    </>
  )
}

export default RecentDonors
