import { useState,useEffect } from "react"
import { 
  CreditCard, 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import KeyStats from "@/components/Dashboards/Donor/KeyStats"
import DonationHistory from "@/components/Dashboards/Donor/DonationHistory"
import { getUser } from "@/lib/auth"
import ActiveCampaigns from "@/components/Dashboards/Donor/ActiveCampaigns"
import FollowingCampaigns from "@/components/Dashboards/Donor/FollowingCampaigns"
import ProfileSettings from "@/components/Dashboards/Creator/ProfileSettings"


const mockPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiry: "09/26",
    isDefault: false
  }
]
export default function DonorDashboard() {
  const [user, setUser] = useState([])
  useEffect(() => {
      const storedUser = getUser()
      setUser(storedUser)
    }, [])
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Donor Dashboard</h1>
          <p className="text-muted-foreground">Track your impact and manage your donations</p>
        </div>

        {/* Key Stats */}
        <KeyStats />  

        {/* Main Content Tabs */}
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="favorites">Campaigns Following</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Donation History Tab */}
          <TabsContent value="donations" className="space-y-6">
            <DonationHistory donorId={user.user_id}/>
          </TabsContent>

          {/* Active Campaigns Tab */}
          <TabsContent value="active" className="space-y-6">
            <ActiveCampaigns />
          </TabsContent>

          {/* Follows Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <FollowingCampaigns />
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-primary to-accent rounded flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {method.type.toUpperCase()} •••• {method.last4}
                          </div>
                          <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                        </div>
                        {method.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">Set as Default</Button>
                        )}
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
