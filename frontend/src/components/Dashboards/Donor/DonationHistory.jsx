import { useState, useEffect } from "react"
import { 
  Calendar,
  CheckCircle,
  Clock,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function DonationHistory({ donorId }) {
  const [donationHistory, setDonationHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch donation history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        
        const res = await fetch(`${backendUrl}/donations/history/${donorId}`)
        const data = await res.json()
        if (data.donation_history) {
          setDonationHistory(data.donation_history)
        } else {
          setDonationHistory([])
        }
      } catch (error) {
        console.error("Error fetching donation history:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [donorId])

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`
  }

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "education":
        return "bg-blue-100 text-blue-800"
      case "health":
        return "bg-green-100 text-green-800"
      case "environment":
        return "bg-teal-100 text-teal-800"
      case "disaster relief":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const downloadReceipt = (id) => {
    alert(`Downloading receipt for donation #${id} (not implemented yet)`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>View all your past donations</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : donationHistory.length === 0 ? (
          <p className="text-muted-foreground">No donations found.</p>
        ) : (
          <div className="space-y-4">
            {donationHistory.map((donation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={donation.image}
                    alt={donation.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{donation.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(donation.category)}`}>
                        {donation.category}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(donation.donation_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary">{formatCurrency(donation.amount)}</div>
                    <Badge
                      variant={donation.status === "completed" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {donation.status === "completed" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {donation.status}
                    </Badge>
                  </div>

                  {donation.status === "completed" && (
                    <Button
                      onClick={() => downloadReceipt(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DonationHistory
