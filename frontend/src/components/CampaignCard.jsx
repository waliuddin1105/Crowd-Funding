import { Calendar, Users, Target, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CampaignCard({ campaign }) {
  const navigate = useNavigate()

  // Navigate to campaign details on card click
  const handleCardClick = () => {
    navigate(`/all-campaigns/${campaign.campaign_id}`)
  }

  // Navigate only when donate button clicked (stop event bubbling)
  const handleDonateClick = (e) => {
    e.stopPropagation()
    navigate(`/all-campaigns/${campaign.campaign_id}`)
  }

  // Progress
  const progressPercentage = Math.min(
    (campaign.raised_amount / campaign.goal_amount) * 100,
    100
  )

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate days remaining
  const getDaysRemaining = () => {
    const today = new Date()
    const endDate = new Date(campaign.end_date)
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = getDaysRemaining()

  // Category styling
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

  // Progress bar color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-green-500"
    if (progressPercentage >= 75) return "bg-blue-500"
    if (progressPercentage >= 50) return "bg-yellow-500"
    return "bg-red-400"
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl max-w-sm cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-md transition-all duration-300 ${getCategoryStyle(
              campaign.category
            )}`}
          >
            {campaign.category}
          </span>
        </div>

        {/* Days Remaining */}
        {daysRemaining > 0 && (
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {daysRemaining} days left
            </div>
          </div>
        )}

        {/* Funded Badge */}
        {progressPercentage >= 100 && (
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              <Target className="h-3 w-3" />
              Funded
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold leading-tight text-card-foreground line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {campaign.short_description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="mb-3">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <div className="font-semibold text-card-foreground">
                {formatCurrency(campaign.raised_amount)}
              </div>
              <div className="text-muted-foreground">
                raised of {formatCurrency(campaign.goal_amount)}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="font-semibold text-blue-600">
                {progressPercentage.toFixed(0)}%
              </div>
              <div className="text-muted-foreground">funded</div>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Started {new Date(campaign.created_at + "Z").toLocaleDateString()
}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Creator: {campaign.creator_name || 'creator_name'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDonateClick}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {progressPercentage >= 100 ? "View Campaign" : "Donate Now"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/all-campaigns/${campaign.campaign_id}`)
            }}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            More Info
          </button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-px rounded-xl bg-primary opacity-0 blur-sm transition-opacity duration-300 " />
    </div>
  )
}
