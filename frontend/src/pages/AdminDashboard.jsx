import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast.js';
import Navbar from '@/components/Navbar';

import AdminKeyStats from '@/components/Dashboards/Admin/AdminKeyStats';
import PendingCampaigns from '@/components/Dashboards/Admin/PendingCampaigns';
import ApprovedCampaigns from '@/components/Dashboards/Admin/ApprovedCampaigns';
import RejectedCampaigns from '@/components/Dashboards/Admin/RejectedCampaigns';
import UsersTab from '@/components/Dashboards/Admin/UsersTab';
import TransactionHistory from '@/components/Dashboards/Admin/TransactionHistory';
import AnalyticsTab from '@/components/Dashboards/Admin/AnalyticsTab';
import AdminControls from '@/components/Dashboards/Admin/AdminControls';

const AdminDashboard = () => {
  const { toast } = useToast();

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen relative overflow-hidden text-white bg-gray-900"
        style={{
          backgroundImage: 'url("/your-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/90" />

        {/* Accent Glows */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/15 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/12 rounded-full blur-2xl animate-pulse delay-700" />

        <div className="relative container mx-auto py-10 px-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1">
              Manage campaigns, users, and platform operations
            </p>
          </div>

          {/* Key Stats (Glass Card) */}
          <div className="bg-gray-800/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,255,255,0.12)]">
            <AdminKeyStats />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="campaigns" className="space-y-6">

            {/* Tab Buttons */}
            <TabsList className="grid grid-cols-5 bg-gray-800/60 border border-cyan-500/20 backdrop-blur-md rounded-xl p-1">
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg"
              >
                Campaigns
              </TabsTrigger>

              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg"
              >
                Users
              </TabsTrigger>

              <TabsTrigger
                value="financials"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg"
              >
                Financials
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg"
              >
                Analytics
              </TabsTrigger>

              <TabsTrigger
                value="controls"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg"
              >
                Controls
              </TabsTrigger>
            </TabsList>

            {/* Campaigns */}
            <TabsContent value="campaigns">
              <div className="space-y-6">
                <PendingCampaigns />
                <ApprovedCampaigns />
                <RejectedCampaigns />
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users" className="space-y-6">
              <UsersTab />
            </TabsContent>

            {/* Financials */}
            <TabsContent value="financials" className="space-y-6">
              <TransactionHistory />
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTab />
            </TabsContent>

            {/* Controls */}
            <TabsContent value="controls" className="space-y-6">
              <AdminControls />
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
