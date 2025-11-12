import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  
  Eye,
  Trash2,
  Plus,
  Download,
  Send,
  Settings,
  CreditCard,
  MessageCircle,
  Target,
  CheckCircle,
  FileText,
  Shield,
  Bell,
  User,
  Wallet,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"

// Mock data
const mockCreatorCampaigns = [
  {
    id: "1",
    title: "Medical Treatment for Sarah",
    category: "medical",
    status: "active",
    goal_amount: 50000,
    raised_amount: 32500,
    donor_count: 124,
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Community School Project",
    category: "education",
    status: "active",
    goal_amount: 100000,
    raised_amount: 78000,
    donor_count: 256,
    start_date: "2024-02-01",
    end_date: "2024-04-01",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Emergency Relief Fund",
    category: "emergency",
    status: "completed",
    goal_amount: 25000,
    raised_amount: 28500,
    donor_count: 189,
    start_date: "2023-12-01",
    end_date: "2024-01-01",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "New Art Studio Setup",
    category: "personal",
    status: "draft",
    goal_amount: 15000,
    raised_amount: 0,
    donor_count: 0,
    start_date: "",
    end_date: "",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop",
  },
]

const mockRecentDonations = [
  {
    id: "1",
    donor_name: "John Smith",
    donor_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    amount: 500,
    campaign_title: "Medical Treatment for Sarah",
    date: "2024-01-20T14:30:00",
    is_anonymous: false,
  },
  {
    id: "2",
    donor_name: "Anonymous",
    donor_avatar: "",
    amount: 1000,
    campaign_title: "Community School Project",
    date: "2024-01-20T10:15:00",
    is_anonymous: true,
  },
  {
    id: "3",
    donor_name: "Emily Johnson",
    donor_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
    amount: 250,
    campaign_title: "Medical Treatment for Sarah",
    date: "2024-01-19T16:45:00",
    is_anonymous: false,
  },
  {
    id: "4",
    donor_name: "Michael Chen",
    donor_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    amount: 750,
    campaign_title: "Community School Project",
    date: "2024-01-19T09:20:00",
    is_anonymous: false,
  },
]

const mockWithdrawals = [
  {
    id: "1",
    amount: 15000,
    status: "completed",
    date: "2024-01-15T10:00:00",
    method: "Bank Transfer",
    reference: "WD-2024-001",
  },
  {
    id: "2",
    amount: 8500,
    status: "pending",
    date: "2024-01-18T14:30:00",
    method: "PayPal",
    reference: "WD-2024-002",
  },
  {
    id: "3",
    amount: 12000,
    status: "completed",
    date: "2024-01-10T11:15:00",
    method: "Bank Transfer",
    reference: "WD-2024-003",
  },
]

export default function CreatorDashboard() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState(mockCreatorCampaigns)
  const [updateMessage, setUpdateMessage] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Calculate stats
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised_amount, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donor_count, 0)
  const pendingWithdrawals = mockWithdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0)
  const lifetimeWithdrawals = mockWithdrawals
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0)

  const mostRecentDonation = mockRecentDonations[0]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const handlePostUpdate = () => {
    if (!updateMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter an update message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Update Posted",
      description: "Your campaign update has been sent to all donors",
    })
    setUpdateMessage("")
  }

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (amount > totalRaised - lifetimeWithdrawals - pendingWithdrawals) {
      toast({
        title: "Error",
        description: "Insufficient funds available for withdrawal",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal request for ${formatCurrency(amount)} has been submitted`,
    })
    setWithdrawalAmount("")
  }

  const handleDeleteCampaign = (campaignId) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignId))
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been removed",
      })
    }
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and track your impact</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Raised
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRaised)}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeCampaigns.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalDonors}</div>
              <p className="text-xs text-muted-foreground mt-1">Supporting your cause</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recent Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(mostRecentDonation.amount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{mostRecentDonation.donor_name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalRaised - lifetimeWithdrawals - pendingWithdrawals)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Your Campaigns</h2>
              <Button onClick={() => navigate("/create-campaign")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((campaign) => {
                const progress = (campaign.raised_amount / campaign.goal_amount) * 100
                return (
                  <Card key={campaign.id}>
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
                              <h3 className="text-lg font-semibold text-foreground mb-1">
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
                                onClick={() => navigate(`/all-campaigns/${campaign.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {campaign.status !== "completed" && (
                                <>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteCampaign(campaign.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {campaign.status !== "draft" && (
                            <>
                              <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-muted-foreground">
                                    {formatCurrency(campaign.raised_amount)} raised of{" "}
                                    {formatCurrency(campaign.goal_amount)}
                                  </span>
                                  <span className="text-foreground font-medium">
                                    {progress.toFixed(0)}%
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>

                              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Donors</p>
                                  <p className="font-semibold text-foreground">
                                    {campaign.donor_count}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Start Date</p>
                                  <p className="font-semibold text-foreground">
                                    {formatDate(campaign.start_date)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">End Date</p>
                                  <p className="font-semibold text-foreground">
                                    {formatDate(campaign.end_date)}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}

                          {campaign.status === "draft" && (
                            <p className="text-muted-foreground text-sm mt-2">
                              This campaign is in draft mode. Complete the setup to publish.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Recent Donations</h2>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockRecentDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          {donation.donor_avatar && !donation.is_anonymous ? (
                            <AvatarImage src={donation.donor_avatar} alt={donation.donor_name} />
                          ) : (
                            <AvatarFallback>
                              {donation.is_anonymous ? "?" : donation.donor_name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{donation.donor_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.campaign_title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(donation.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(donation.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Donor Engagement</h2>

            {/* Post Update */}
            <Card>
              <CardHeader>
                <CardTitle>Post Campaign Update</CardTitle>
                <CardDescription>
                  Share progress and thank your donors (sent to all supporters)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update-message">Update Message</Label>
                  <Textarea
                    id="update-message"
                    placeholder="Share your progress, thank donors, or provide updates..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={handlePostUpdate}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Update
                </Button>
              </CardContent>
            </Card>

            {/* Thank You Message */}
            <Card>
              <CardHeader>
                <CardTitle>Send Thank You Message</CardTitle>
                <CardDescription>Send personalized messages to specific donors</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Account Settings</h2>

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Enter phone number" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new donations
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Updates</p>
                    <p className="text-sm text-muted-foreground">Receive weekly summary emails</p>
                  </div>
                  <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
