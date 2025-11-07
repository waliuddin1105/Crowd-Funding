import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Users, Target, Clock, ArrowLeft, Share2, Heart, MessageCircle, ThumbsUp, Send, TrendingUp } from "lucide-react"
import mockCampaigns from "../lib/campaigns.js"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar.jsx"
import RecentDonors from "@/components/RecentDonors.jsx"
import CampaignUpdates from "@/components/CampaignUpdates.jsx"

// Mock comments data
const mockComments = [
  {
    id: 1,
    user_name: "Sarah Johnson",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    message: "This is such an amazing cause! I'm so glad I could contribute. Wishing you all the best!",
    created_at: "2024-01-15T10:30:00Z",
    likes: 12
  },
  {
    id: 2,
    user_name: "Michael Chen",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    message: "Thank you for making a difference in our community. This campaign really touched my heart.",
    created_at: "2024-01-14T15:45:00Z",
    likes: 8
  },
  {
    id: 3,
    user_name: "Emily Rodriguez",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    message: "Shared this with all my friends and family. Let's help reach the goal together! 💙",
    created_at: "2024-01-14T09:20:00Z",
    likes: 15
  },
  {
    id: 4,
    user_name: "David Thompson",
    user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    message: "Keep up the great work! Every donation counts and I'm proud to support this.",
    created_at: "2024-01-13T18:10:00Z",
    likes: 6
  }
]

// Mock recent donors
const mockDonors = [
  { name: "Anonymous", amount: 500, time: "2 hours ago" },
  { name: "Jennifer Lee", amount: 100, time: "5 hours ago" },
  { name: "Robert Kim", amount: 250, time: "1 day ago" },
  { name: "Maria Garcia", amount: 150, time: "1 day ago" },
  { name: "James Wilson", amount: 75, time: "2 days ago" },
]

// Mock campaign updates
const mockUpdates = [
  {
    id: 1,
    title: "Halfway There! Thank You All!",
    content: "We've reached 50% of our goal! Thank you to everyone who has supported us so far. Your generosity means the world.",
    created_at: "2024-01-14T12:00:00Z"
  },
  {
    id: 2,
    title: "Campaign Launch",
    content: "We're excited to launch this campaign and share our mission with you. Every contribution helps us get closer to our goal.",
    created_at: "2024-01-10T09:00:00Z"
  }
]

export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [likedComments, setLikedComments] = useState(new Set())

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true)
        setError(null)

        /* 
        // Uncomment when backend API is ready
        const response = await fetch(`/api/campaigns/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`Campaign not found`)
        }
        
        const data = await response.json()
        setCampaign(data)
        */

        // Mock data lookup
        const foundCampaign = mockCampaigns.find(c => c.campaign_id === id)
        if (!foundCampaign) {
          throw new Error("Campaign not found")
        }
        setCampaign(foundCampaign)
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

  const handleDonate = () => {
    const amount = parseFloat(donationAmount)
    if (!donationAmount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      })
      return
    }
    console.log(`Donating $${amount} to campaign ${id}`)
    toast({
      title: "Thank you!",
      description: `Your donation of $${amount} is being processed.`,
    })
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write a message before submitting",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingComment(true)

    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: comments.length + 1,
        user_name: "Current User",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        message: newComment,
        created_at: new Date().toISOString(),
        likes: 0
      }

      setComments([newCommentObj, ...comments])
      setNewComment("")
      setIsSubmittingComment(false)

      toast({
        title: "Comment posted!",
        description: "Your message has been added successfully.",
      })
    }, 500)
  }

  const handleLikeComment = (commentId) => {
    const newLikedComments = new Set(likedComments)
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId)
      setComments(comments.map(c =>
        c.id === commentId ? { ...c, likes: c.likes - 1 } : c
      ))
    } else {
      newLikedComments.add(commentId)
      setComments(comments.map(c =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ))
    }
    setLikedComments(newLikedComments)
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
                <p className="text-lg text-muted-foreground mb-6">{campaign.short_description}</p>
                <div className="prose prose-gray max-w-none">
                  <p className="text-foreground">{campaign.long_description}</p>
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
                  <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
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
                        <span>Created by {campaign.creator_id}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates">
                  <CampaignUpdates campaign_id={id}/>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments">
                  <Card className="shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        Leave a Comment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts or words of encouragement..."
                        className="min-h-[100px] mb-4 resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitComment}
                          disabled={isSubmittingComment || !newComment.trim()}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="shadow-md">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                              <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">{comment.user_name}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatTimeAgo(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-3">{comment.message}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeComment(comment.id)}
                                className={`gap-2 ${likedComments.has(comment.id) ? 'text-primary' : ''}`}
                              >
                                <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                                <span>{comment.likes}</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                        
                        <Button variant="outline" className="flex-1 gap-2">
                          <Heart className="h-4 w-4" />
                          Follow
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
