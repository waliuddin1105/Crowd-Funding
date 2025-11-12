import { useState } from "react"
import { 
  Heart
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
function FollowingCampaigns() {
  return (
    <>
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
    </>
  )
}

export default FollowingCampaigns
