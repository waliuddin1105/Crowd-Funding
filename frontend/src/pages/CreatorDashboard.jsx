import { useNavigate } from "react-router-dom"
import { Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/Navbar"
import CreatorKeyStats from "@/components/Dashboards/Creator/CreatorKeyStats"
import CreatorCampaigns from "@/components/Dashboards/Creator/CreatorCampaigns"
import RecentCampaignDonations from "@/components/Dashboards/Creator/RecentCampaignDonations"
import ProfileSettings from "@/components/Dashboards/Creator/ProfileSettings"

export default function CreatorDashboard() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-600/30 rounded-full animate-float-slow"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            
            <h1 className="text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Creator Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Manage your campaigns and track your impact</p>
          </div>

          {/* Key Stats */}
          <CreatorKeyStats />

          {/* Main Content Tabs */}
          <Tabs defaultValue="campaigns" className="space-y-8 mt-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800 p-1 rounded-xl backdrop-blur-sm">
              <TabsTrigger 
                value="campaigns"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="donations"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                Donations
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Your Campaigns</h2>
                  <p className="text-gray-400">Create and manage your fundraising campaigns</p>
                </div>
                <Button 
                  onClick={() => navigate("/create-campaign")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Campaign
                </Button>
              </div>
              <CreatorCampaigns />
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="space-y-6">
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-1">Recent Donations</h2>
                <p className="text-gray-400">Track donations across all your campaigns</p>
              </div>
              <RecentCampaignDonations />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-1">Account Settings</h2>
                <p className="text-gray-400">Manage your profile and preferences</p>
              </div>

              {/* Profile Settings */}
              <ProfileSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}