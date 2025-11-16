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
import CreatorKeyStats from "@/components/Dashboards/Creator/CreatorKeyStats"
import CreatorCampaigns from "@/components/Dashboards/Creator/CreatorCampaigns"
import RecentCampaignDonations from "@/components/Dashboards/Creator/RecentCampaignDonations"
import ProfileSettings from "@/components/Dashboards/Creator/ProfileSettings"

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
        <CreatorKeyStats />

        {/* Main Content Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-12">
          <TabsList className="grid w-full grid-cols-3">


            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
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
            <CreatorCampaigns />
            
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Recent Donations</h2>
            <RecentCampaignDonations />
            
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Account Settings</h2>

            {/* Profile Settings */}
            <ProfileSettings />

            
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
