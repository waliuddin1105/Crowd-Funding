import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Users, Target, Clock, ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar.jsx"
import RecentDonors from "@/components/RecentDonors.jsx"
import CampaignUpdates from "@/components/CampaignUpdates.jsx"
import CampaignComments from "@/components/CampaignComments"
import { getUser } from "@/lib/auth.js"

export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true)
        setError(null)

        const backendUrl = import.meta.env.VITE_BACKEND_URL
        const response = await fetch(`${backendUrl}/campaigns/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error(`Campaign not found`)
        }

        const data = await response.json()
        if (data.success && data.campaign) {
          setCampaign(data.campaign)

        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching campaign:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    if (id) {
      fetchCampaign()
    }
  }, [id])

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount)
    if (!donationAmount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      })
      return
    }
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const user = getUser()
    const donationData = {
      user_id: user.user_id,
      campaign_id: id,
      amount: amount,
      created_at: new Date().toISOString(),
      status: "pending"
    };

    try {
      const response = await fetch(`${backendUrl}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Donation created successfully:', data);

    } catch (error) {
      console.error('❌ Error creating donation:', error);
    }

    console.log(`Donating $${amount} to campaign ${id}`)
    toast({
      title: "Thank you!",
      description: `Your donation of $${amount} is being processed.`,
    })
  }

  const handleFollowButton = async (e) => {
    const user = getUser();
    if (!user) {
      alert("You need to be logged in to follow campaigns.");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(
        `${backendUrl}/follows/toggle-follow/${user.user_id}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setIsFollowed(data.action === "followed");
      } else {
        console.error("Error toggling follow:", data.message);
        alert(data.message || "Failed to toggle follow");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaign...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Campaign Not Found</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/all-campaigns')}>
              Back to Campaigns
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDaysRemaining = () => {
    const today = new Date()
    const endDate = new Date(campaign.end_date)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getCategoryStyle = (category) => {
    const styles = {
      charity: "bg-primary text-primary-foreground",
      medical: "bg-destructive text-destructive-foreground",
      education: "bg-accent text-accent-foreground",
      emergency: "bg-warning text-warning-foreground",
      personal: "bg-secondary text-secondary-foreground"
    }
    return styles[category] || styles.personal
  }

  const daysRemaining = getDaysRemaining()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/all-campaigns')}
            variant="ghost"
            className="mb-6 gap-2 border border-gray-500 bg-gray-50 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
            Back to All Campaigns
          </Button>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Campaign Image */}
              <div className="relative aspect-video mb-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize ${getCategoryStyle(campaign.category)}`}>
                    {campaign.category}
                  </span>
                </div>
              </div>

              {/* Campaign Title and Description */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">{campaign.title}</h1>
                <div className="prose prose-gray max-w-none">
                  <p className="text-foreground">{campaign.description}</p>
                </div>
              </div>


              {/* Campaign Stats */}
              <Card className="mb-6 shadow-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(campaign.raised_amount)}</div>
                      <div className="text-sm text-muted-foreground">Raised</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{formatCurrency(campaign.goal_amount)}</div>
                      <div className="text-sm text-muted-foreground">Goal</div>
                    </div>
                    <div>
                      <div className="text-2xl text-black font-bold text-accent">{progressPercentage.toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">Funded</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">{daysRemaining}</div>
                      <div className="text-sm text-muted-foreground">Days Left</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Details, Updates, and Comments */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details">Campaign Details</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                {/* Campaign Details Tab */}
                <TabsContent value="details">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Campaign Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Started on {new Date(campaign.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Ends on {new Date(campaign.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Users className="h-5 w-5 text-primary" />
                        <span>
                          Created by {campaign.creator ? campaign.creator.username : "Unknown"}
                        </span>

                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates">
                  <CampaignUpdates campaign_id={id} creator_name={campaign.creator.username} />
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments">
                  <CampaignComments campaign_id={id} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Donation Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Donation Card */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium text-primary">{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Funding Info */}
                    <div className="mb-6">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {formatCurrency(campaign.raised_amount)}
                      </div>
                      <div className="text-muted-foreground mb-4">
                        raised of {formatCurrency(campaign.goal_amount)} goal
                      </div>
                    </div>

                    {/* Donation Form */}
                    {progressPercentage < 100 && daysRemaining > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Donation Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                          <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-input bg-background"
                            placeholder="Enter amount"
                            min="1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {progressPercentage >= 100 ? (
                        <div className="text-center py-4">
                          <div className="flex items-center justify-center gap-2 text-success mb-2">
                            <Target className="h-5 w-5" />
                            <span className="font-semibold">Campaign Funded!</span>
                          </div>
                          <p className="text-sm text-muted-foreground">This campaign has reached its goal.</p>
                        </div>
                      ) : daysRemaining === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-destructive font-semibold mb-2">Campaign Ended</div>
                          <p className="text-sm text-muted-foreground">This campaign is no longer accepting donations.</p>
                        </div>
                      ) : (
                        <Button
                          onClick={handleDonate}
                          disabled={!donationAmount || parseFloat(donationAmount) <= 0 || isNaN(parseFloat(donationAmount))}
                          className="w-full"
                          size="lg"
                        >
                          Donate Now
                        </Button>
                      )}

                      <div className="flex gap-2">

                        <Button
                          onClick={handleFollowButton}
                          disabled={loading}
                          className={`flex-1 gap-2 transition-colors duration-300 ${isFollowed
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${isFollowed ? "text-white fill-current" : "text-red-600"
                              }`}
                          />
                          {isFollowed ? "Following" : "Follow"}
                        </Button>

                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Donors Card */}
                <RecentDonors campaign_id={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
