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
import ActiveCampaigns from "@/components/Dashboards/Donor/ActiveCampaigns"

// Mock data
const mockDonationHistory = [
  {
    id: "1",
    campaign: "Help Build a Community Center",
    amount: 100,
    date: "2024-02-15",
    status: "completed",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
    category: "charity"
  },
  {
    id: "2",
    campaign: "Medical Treatment for Sarah",
    amount: 250,
    date: "2024-02-10",
    status: "completed",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    category: "medical"
  },
  {
    id: "3",
    campaign: "Scholarships for Underprivileged Students",
    amount: 150,
    date: "2024-02-05",
    status: "completed",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    category: "education"
  },
  {
    id: "4",
    campaign: "Emergency Food Relief",
    amount: 75,
    date: "2024-01-28",
    status: "pending",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
    category: "emergency"
  }
]

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

const mockFollowCampaigns = [
  {
    id: "1",
    title: "Wildlife Conservation Fund",
    category: "charity",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Children's Hospital Equipment",
    category: "medical",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop"
  }
]

export default function DonorDashboard() {
  const [anonymousDonations, setAnonymousDonations] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [campaignUpdates, setCampaignUpdates] = useState(true)
  const [user, setUser] = useState([])
  const totalDonated = mockDonationHistory
    .filter(d => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0)
  
  const currentYearDonations = mockDonationHistory
    .filter(d => {
      const donationYear = new Date(d.date).getFullYear()
      const currentYear = new Date().getFullYear()
      return donationYear === currentYear && d.status === "completed"
    })
    .reduce((sum, d) => sum + d.amount, 0)

  const totalCampaignsSupported = new Set(mockDonationHistory.map(d => d.campaign)).size
  const recentDonation = mockDonationHistory[0]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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

  const downloadReceipt = (donationId) => {
    console.log(`Downloading receipt for donation ${donationId}`)
    // Implement receipt download logic
  }

  const downloadTaxSummary = () => {
    console.log("Downloading annual tax summary")
    // Implement tax summary download logic
  }
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
            <Card>
              <CardHeader>
                <CardTitle>Campaigns You Follow</CardTitle>
                <CardDescription>Quick access to campaigns you're interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFollowCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="relative group overflow-hidden rounded-lg border hover:shadow-lg transition-all"
                    >
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(campaign.category)}`}>
                          {campaign.category}
                        </span>
                        <h4 className="font-semibold text-foreground mt-2">{campaign.title}</h4>
                        <div className="flex gap-2 mt-3">
                          <Button className="flex-1" size="sm">Donate Again</Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your donations are displayed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {anonymousDonations ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">Anonymous Donations</div>
                        <div className="text-sm text-muted-foreground">
                          Hide your identity on public donation lists
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={anonymousDonations}
                      onCheckedChange={setAnonymousDonations}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive receipts and updates via email
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Get text alerts for important updates
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">Campaign Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Receive progress updates from campaigns you support
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={campaignUpdates}
                      onCheckedChange={setCampaignUpdates}
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
