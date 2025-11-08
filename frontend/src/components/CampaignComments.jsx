import React, { useState,useEffect } from "react";
import { MessageCircle, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth.js";
const mockComments = [
    {
        id: 1,
        user_name: "Sarah Johnson",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        message: "This is such an amazing cause! I'm so glad I could contribute.",
        created_at: "2024-01-15T10:30:00Z",
        likes: 12
    },
    {
        id: 2,
        user_name: "Michael Chen",
        user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        message: "Thank you for making a difference in our community.",
        created_at: "2024-01-14T15:45:00Z",
        likes: 8
    },
];

function CampaignComments({ campaign_id }) {
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [likedComments, setLikedComments] = useState(new Set());
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = getUser()
        if (storedUser) {
            try {
                setUser(storedUser)
            } catch (e) {
                console.error("Failed to parse user from localStorage", e)
                setUser(null)
            }
        }
    }, [])

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log(localStorage.getItem("access_token"))
        const response = await fetch(`${backendUrl}/comments/post-comment/${user?.user_id}/${campaign_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({ message: newComment }),
        });



        const newCommentObj = {
            id: comments.length + 1,
            user_name: "Current User",
            user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
            message: newComment,
            created_at: new Date().toISOString(),
            likes: 0
        };

        setComments([newCommentObj, ...comments]);
        setNewComment("");
        setIsSubmittingComment(false);
    };

    const handleLikeComment = (id) => {
        const newLiked = new Set(likedComments);
        const updatedComments = comments.map((c) => {
            if (c.id === id) {
                if (newLiked.has(id)) {
                    newLiked.delete(id);
                    return { ...c, likes: c.likes - 1 };
                } else {
                    newLiked.add(id);
                    return { ...c, likes: c.likes + 1 };
                }
            }
            return c;
        });
        setLikedComments(newLiked);
        setComments(updatedComments);
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);
        if (diffSeconds < 60) return "Just now";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
        return `${Math.floor(diffSeconds / 86400)} days ago`;
    };

    return (
        <>
            <Card className="shadow-md mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        Leave a Comment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts or words of encouragement..."
                        className="min-h-[100px] mb-4 resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmitComment}
                            disabled={isSubmittingComment || !newComment.trim()}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" /> Post Comment
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <Card key={comment.id} className="shadow-md">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                                    <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-foreground">{comment.user_name}</h4>
                                        <span className="text-sm text-muted-foreground">
                                            {formatTimeAgo(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground mb-3">{comment.message}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLikeComment(comment.id)}
                                        className={`gap-2 ${likedComments.has(comment.id) ? "text-primary" : ""}`}
                                    >
                                        <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                        <span>{comment.likes}</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default CampaignComments;
