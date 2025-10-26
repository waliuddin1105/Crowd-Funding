"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/Navbar"
import { Link } from "react-router-dom"
import axios from "axios"
// const categories = ["Technology", "Art", "Education", "Health", "Social Causes", "Environment", "Music", "Film"]
const campaigns = [
  {
    id: 1,
    title: "Portable Solar Charger",
    category: "Technology",
    raised: 52000,
    goal: 50000,
    image: "/portable-solar-charger.jpg",
  },
  {
    id: 2,
    title: "Community Mural Art",
    category: "Art",
    raised: 16000,
    goal: 15000,
    image: "/community-mural-art.jpg",
  },
  {
    id: 3,
    title: "Smart Kettle",
    category: "Design",
    raised: 34000,
    goal: 30000,
    image: "/smart-kettle-product.jpg",
  },
  {
    id: 4,
    title: "Short Film Festival",
    category: "Film",
    raised: 21000,
    goal: 20000,
    image: "/short-film-festival.jpg",
  },
]

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `$${Number(n || 0).toLocaleString()}`
  }
}

export default function Home() {
  const [campaigns,setCampaigns] = useState([])
  const [pledge, setPledge] = useState(50)
  const [stats,setStats] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        const res = await axios.get(`${backendUrl}/campaigns/stats`);
        setStats(res.data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);
  
  useEffect(() => {
  const fetchFullyFundedCampaigns = async () => {
    try {
      const response = await fetch(`${backendUrl}/campaigns/fully-funded`)
      const data = await response.json()
      
      if (data.success) {
        setCampaigns(data.campaigns)
        
        // Optional: You can also use data.count if needed
        console.log(`Loaded ${data.count} fully-funded campaigns`)
      } else {
        console.error('Failed to fetch campaigns:', data.error)
      }
    } catch (error) {
      console.error('Error fetching fully-funded campaigns:', error)
    }
  }

  fetchFullyFundedCampaigns()
}, [])
  const exampleGoal = 10000
  const pledgeImpactPct = Math.min(100, Math.max(0, Math.round((Number(pledge || 0) / exampleGoal) * 100)))

  return (
    <>
      <Navbar />
      <main className="font-sans bg-gray-950 text-gray-100 min-h-screen">
        {/* Hero */}
        <section className="relative border-b border-gray-800 min-h-[55vh] md:min-h-[60vh] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/hero-img.jpg" // replace with your own background image path
              alt="Crowdfunding hero background"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" /> {/* Dark overlay for readability */}
          </div>

          {/* Hero content */}
          <div className="relative mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-3xl">
              <p className="mb-2 text-xl uppercase tracking-widest text-gray-400">
                Crowdfunding for everyone
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Fund ideas worth building.
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Discover projects across technology, art, and social good.
                Back the work you believe in—or launch your own.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <Button asChild>
                  <Link to={"/all-campaigns"}>Explore campaigns</Link>
                </Button>
                <Button variant="outline" asChild>
                <Link to={'/create-campaign'} className="text-black">Start a campaign</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Platform KPIs */}
        <section className="border-b border-gray-800">
          <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="rounded-lg border border-gray-800 p-4">
              <div className="text-sm text-gray-400">Total raised</div>
              <div className="mt-1 text-2xl font-semibold">{formatCurrency(stats.total_raised)}</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-4">
              <div className="text-sm text-gray-400">Donors</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total_donors}</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-4">
              <div className="text-sm text-gray-400">Success rate</div>
              <div className="mt-1 text-2xl font-semibold">{Math.round(stats.success_rate)}%</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-4">
              <div className="text-sm text-gray-400">Active campaigns</div>
              <div className="mt-1 text-2xl font-semibold">{stats.active_campaigns}</div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-gray-800">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-xl md:text-2xl font-semibold">How it works</h2>
            <Tabs defaultValue="backers" className="mt-6">
              <TabsList className="grid grid-cols-2 w-full max-w-xs">
                <TabsTrigger value="backers">For Backers</TabsTrigger>
                <TabsTrigger value="creators">For Creators</TabsTrigger>
              </TabsList>
              <TabsContent value="backers" className="mt-6">
                <ol className="grid gap-4 md:grid-cols-3">
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">1. Explore</h3>
                    <p className="text-sm text-gray-400 mt-1">Find ideas by category, search, or staff picks.</p>
                  </li>
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">2. Pledge</h3>
                    <p className="text-sm text-gray-400 mt-1">Choose a reward tier and back securely.</p>
                  </li>
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">3. Track</h3>
                    <p className="text-sm text-gray-400 mt-1">Get updates and follow progress to completion.</p>
                  </li>
                </ol>
              </TabsContent>
              <TabsContent value="creators" className="mt-6">
                <ol className="grid gap-4 md:grid-cols-3">
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">1. Create</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Tell your story with goals, rewards, and a timeline.
                    </p>
                  </li>
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">2. Launch</h3>
                    <p className="text-sm text-gray-400 mt-1">Share your page and rally your community.</p>
                  </li>
                  <li className="rounded-lg border border-gray-800 p-4">
                    <h3 className="font-medium">3. Deliver</h3>
                    <p className="text-sm text-gray-400 mt-1">Update backers and fulfill rewards on time.</p>
                  </li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Pledge impact calculator */}
        <section className="border-b border-gray-800">
          <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-800 p-5">
              <h3 className="font-medium">Estimate your impact</h3>
              <p className="text-sm text-gray-400 mt-1">
                See how your pledge contributes toward a typical goal of {formatCurrency(exampleGoal)}.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Input
                  type="number"
                  min={0}
                  value={pledge}
                  onChange={(e) => setPledge(e.target.value)}
                  aria-label="Pledge amount"
                />
                <Button variant="secondary" onClick={() => setPledge(50)}>
                  Reset
                </Button>
              </div>
              <div className="mt-4">
                <Progress value={pledgeImpactPct} className="bg-gray-700 [&>div]:bg-green-400"/>
                
                <div className="mt-2 text-sm text-gray-400">
                  Your pledge of <span className="font-medium text-white">{formatCurrency(pledge)}</span> covers
                  approximately <span className="font-medium text-white">{pledgeImpactPct}%</span> of a{" "}
                  {formatCurrency(exampleGoal)} goal.
                </div>
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="rounded-lg border border-gray-800 p-5">
              <h3 className="font-medium">Trust & Safety</h3>
              <ul className="mt-3 grid gap-3">
                <li className="rounded-md border border-gray-800 p-3">
                  <span className="font-medium">All-or-Nothing Funding</span>
                  <p className="text-sm text-gray-400 mt-1">Creators only receive funds if the goal is met.</p>
                </li>
                <li className="rounded-md border border-gray-800 p-3">
                  <span className="font-medium">Creator Verification</span>
                  <p className="text-sm text-gray-400 mt-1">Identity checks and transparent project details.</p>
                </li>
                <li className="rounded-md border border-gray-800 p-3">
                  <span className="font-medium">Secure Payments</span>
                  <p className="text-sm text-gray-400 mt-1">
                    Protected transactions and PCI-compliant processing.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Success highlights */}
        <section className="border-b border-gray-800">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold">Fully funded on Crowdfund</h2>
              <Link to={"/all-campaigns"} className="text-sm text-gray-400 hover:text-gray-200">
                See more
              </Link>
            </div>
            <div className="mt-6 flex gap-4 overflow-x-auto">
              {campaigns.map((p) => {
                const pct = Math.min(100, Math.round((p.raised_amount / p.goal_amount) * 100))
                return (
                  <figure key={p.campaign_id} className="shrink-0 w-72 rounded-lg border border-gray-800 bg-gray-900">
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg bg-gray-800">
                      <img
                        src={p.image || "/placeholder.svg"}
                        alt={`${p.title} cover`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{p.category}</Badge>
                        <Badge className="bg-green-600 text-white">100% funded</Badge>
                      </div>
                      <div className="mt-2 font-medium">{p.title}</div>
                      <div className="mt-3">
                        <Progress
                          value={pct}
                          className="bg-gray-700 [&>div]:bg-green-400"
                        />
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                          <span className="font-medium text-white">{formatCurrency(p.raised_amount)}</span>
                          <span>of {formatCurrency(p.goal_amount)}</span>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        </section>
        {/* Success Stories */}
        <section className="border-t border-gray-800 bg-gray-950 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
              Success Stories from Our Creators
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Story 1 */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:shadow-xl">
                <p className="text-gray-300 mb-4">
                  “Thanks to this platform, I was able to bring my sustainable fashion line to life.
                  The community support was overwhelming and made my dream possible.”
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="/creator1.jpg"
                    alt="Creator 1"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">Amira Khan</p>
                    <p className="text-sm text-gray-400">Fashion Entrepreneur</p>
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:shadow-xl">
                <p className="text-gray-300 mb-4">
                  “I never thought my idea for a clean water filter would reach so many people.
                  The backers’ belief in my vision changed everything for me.”
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="/creator2.jpg"
                    alt="Creator 2"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">David Chen</p>
                    <p className="text-sm text-gray-400">Social Innovator</p>
                  </div>
                </div>
              </div>

              {/* Story 3 */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:shadow-xl">
                <p className="text-gray-300 mb-4">
                  “This platform gave my indie game the spotlight it needed.
                  The support allowed me to hire a small team and complete development.”
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="/creator3.jpg"
                    alt="Creator 3"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">Lena Torres</p>
                    <p className="text-sm text-gray-400">Game Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="start">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-xl md:text-2xl font-semibold">Ready to launch your campaign?</h2>
            <p className="mt-2 text-sm text-gray-400">Join thousands of creators bringing new ideas to life.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild>
                <Link to={"/all-campaigns"}>Find inspiration</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={'/create-campaign'} className="text-black">Start a campaign</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
