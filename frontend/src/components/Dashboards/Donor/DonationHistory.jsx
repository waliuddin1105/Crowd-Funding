import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"

function DonationHistory() {
  return (
    <>
      <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>View all your past donations and download receipts</CardDescription>
                </div>
                <Button onClick={downloadTaxSummary} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Tax Summary
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDonationHistory.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={donation.image}
                          alt={donation.campaign}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{donation.campaign}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(donation.category)}`}>
                              {donation.category}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(donation.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg text-primary">{formatCurrency(donation.amount)}</div>
                          <Badge variant={donation.status === "completed" ? "default" : "secondary"} className="mt-1">
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
                            onClick={() => downloadReceipt(donation.id)}
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
              </CardContent>
            </Card>
    </>
  )
}

export default DonationHistory
