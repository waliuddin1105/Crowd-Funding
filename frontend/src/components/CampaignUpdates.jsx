import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Users, Target, Clock, ArrowLeft, Share2, Heart, MessageCircle, ThumbsUp, Send, TrendingUp } from "lucide-react"
import mockCampaigns from "../lib/campaigns.js"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar.jsx"

const mockUpdates = [
    {
        id: 1,
        title: "Halfway There! Thank You All!",
        content: "We've reached 50% of our goal! Thank you to everyone who has supported us so far. Your generosity means the world.",
        created_at: "2024-01-14T12:00:00Z"
    },
    {
        id: 2,
        title: "Campaign Launch",
        content: "We're excited to launch this campaign and share our mission with you. Every contribution helps us get closer to our goal.",
        created_at: "2024-01-10T09:00:00Z"
    }
]
import React from 'react'
const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }
function CampaignUpdates({ campaign_id }) {
    //will setup API key to fetch all updates related to this campaign
    return (
        <>
            <div className="space-y-4">
                {mockUpdates.map((update) => (
                    <Card key={update.id} className="shadow-md">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{update.title}</CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    {formatTimeAgo(update.created_at)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{update.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default CampaignUpdates
