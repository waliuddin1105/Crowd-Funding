import { useState,useEffect } from "react"
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Download, 
  CreditCard, 
  Bell, 
  Shield, 
  Star,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import KeyStats from "@/components/Dashboards/Donor/KeyStats"
import DonationHistory from "@/components/Dashboards/Donor/DonationHistory"
import { getUser } from "@/lib/auth"
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
const mockActiveCampaigns = [
  {
    id: "1",
    title: "Help Build a Community Center",
    progress: 65,
    raisedAmount: 32500,
    goalAmount: 50000,
    lastUpdate: "2 days ago"
  },
  {
    id: "2",
    title: "Medical Treatment for Sarah",
    progress: 60,
    raisedAmount: 45000,
    goalAmount: 75000,
    lastUpdate: "5 days ago"
  },
  {
    id: "3",
    title: "Scholarships for Underprivileged Students",
    progress: 67,
    raisedAmount: 67000,
    goalAmount: 100000,
    lastUpdate: "1 week ago"
  }
]
function ActiveCampaigns() {
  return (
    <>
      <Card>
                    <CardHeader>
                      <CardTitle>Active Campaigns You Support</CardTitle>
                      <CardDescription>Track the progress of campaigns you've donated to</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockActiveCampaigns.map((campaign) => (
                          <div key={campaign.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-foreground">{campaign.title}</h4>
                                
                              </div>
                              <Badge variant="outline">{campaign.progress}% Funded</Badge>
                            </div>
                            <div className="space-y-2">
                              <Progress value={campaign.progress} className="h-2" />
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {formatCurrency(campaign.raisedAmount)} raised
                                </span>
                                <span className="text-muted-foreground">
                                  Goal: {formatCurrency(campaign.goalAmount)}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full" size="sm">
                              View Campaign Updates
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
    </>
  )
}

export default ActiveCampaigns
