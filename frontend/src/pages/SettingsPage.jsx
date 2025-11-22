import React from 'react'
import Navbar from '@/components/Navbar'
import ProfileSettings from '@/components/Dashboards/Creator/ProfileSettings'

function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h1>

        {/* Card / Panel for profile settings */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          <ProfileSettings />
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
