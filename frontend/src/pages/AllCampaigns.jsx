import { useState, useMemo, useEffect } from "react"
import { Search, Filter, SortAsc } from "lucide-react"
import CampaignCard from "../components/CampaignCard"
// import mockCampaigns from "../lib/campaigns.js"
import Navbar from "@/components/Navbar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { configDotenv } from "dotenv"
export default function AllCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // API call to fetch campaigns from database
useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/campaigns/`);
      
      // Check response status BEFORE parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Set campaigns from the response
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message);
    } finally {
      // Always set loading to false, whether success or error
      setLoading(false);
    }
  };

  fetchCampaigns();
}, []);

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    if (!campaigns.length) return []

    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.short_description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.start_date) - new Date(a.start_date)
        case "oldest":
          return new Date(a.start_date) - new Date(b.start_date)
        case "goal_high":
          return b.goal_amount - a.goal_amount
        case "goal_low":
          return a.goal_amount - b.goal_amount
        case "progress_high":
          return (b.raised_amount / b.goal_amount) - (a.raised_amount / a.goal_amount)
        case "progress_low":
          return (a.raised_amount / a.goal_amount) - (b.raised_amount / b.goal_amount)
        default:
          return 0
      }
    })

    return filtered
  }, [campaigns, searchTerm, categoryFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setSortBy("newest")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/30 border-t-primary mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow"></div>
            </div>
            <p className="text-muted-foreground font-medium">Loading campaigns...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Campaigns</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-neon"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-neon opacity-10 blur-3xl"></div>
            <h1 className="mb-4 text-4xl font-bold text-foreground relative">
              All Campaigns
              <span className="absolute -inset-1 bg-gradient-neon opacity-20 blur-lg"></span>
            </h1>
            <p className="text-lg text-muted-foreground relative">
              Discover and support meaningful causes from our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search campaigns by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-border hover:border-primary/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-neon opacity-0 group-focus-within:opacity-10 rounded-md blur transition-opacity duration-300"></div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-card/50 border-border hover:border-primary/50 focus:border-primary">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="charity">Charity</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-card/50 border-border hover:border-primary/50 focus:border-primary">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="goal_high">Highest Goal</SelectItem>
                    <SelectItem value="goal_low">Lowest Goal</SelectItem>
                    <SelectItem value="progress_high">Most Funded</SelectItem>
                    <SelectItem value="progress_low">Least Funded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="ml-auto border-border hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-primary font-medium">{filteredAndSortedCampaigns.length}</span> of <span className="text-primary font-medium">{campaigns.length}</span> campaigns
            </p>
          </div>

          {/* Campaigns Grid */}
          {filteredAndSortedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedCampaigns.map(campaign => (
                <div key={campaign.campaign_id} className="animate-float">
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 relative">
              <div className="absolute inset-0 bg-gradient-neon opacity-5 blur-3xl"></div>
              <div className="mb-4 relative">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing the filters
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-border hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-glow transition-all duration-300"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}