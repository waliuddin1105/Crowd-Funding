import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register'
import CampaignCard from './components/CampaignCard'
import AllCampaigns from './pages/AllCampaigns'
import CampaignDetails from './pages/CampaignDetails'
import CreateCampaign from './pages/CreateCampaign'
import DonorDashboard from './pages/DonorDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { Toaster } from './components/ui/toaster'
const route  = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/all-campaigns',
    element: <AllCampaigns />
  },
  {
    path: '/all-campaigns/:id',
    element: <CampaignDetails />
  },
  {
    path: '/all-campaigns',
    element: <AllCampaigns />
  },
  {
    path: '/create-campaign',
    element: <CreateCampaign />
  },
  {
    path: '/donor-dashboard',
    element: <DonorDashboard />
  },
  {
    path: '/creator-dashboard',
    element: <CreatorDashboard />
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />
  }
])
createRoot(document.getElementById('root')).render(
  <>
  <RouterProvider router={route} />
  <Toaster />
  </>
)
