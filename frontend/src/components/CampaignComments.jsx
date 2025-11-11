import React, { useState, useEffect } from "react";
import { MessageCircle, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth.js";

function CampaignComments({ campaign_id }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [likedComments, setLikedComments] = useState(new Set());
    const [user, setUser] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ✅ Fetch comments from backend
    const fetchComments = async () => {
        try {
            const res = await fetch(`${backendUrl}/comments/get-comments/${campaign_id}`);
            const data = await res.json();

            // Normalize backend data
            const normalized = (data.comments || []).map((c) => ({
                comment_id: c.comment_id || c.id,
                username: c.username || c.user_name,
                profile_image: c.profile_image || c.user_avatar,
                content: c.content || c.message,
                likes: c.likes ?? 0,
                created_at: c.created_at,
            }));

            setComments(normalized);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // ✅ Get user from localStorage
    useEffect(() => {
        const storedUser = getUser();
        if (storedUser) {
            try {
                setUser(storedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                setUser(null);
            }
        }
    }, []);

    // ✅ Fetch comments when campaign_id changes
    useEffect(() => {
        if (campaign_id) fetchComments();
    }, [campaign_id]);

    // ✅ Post new comment
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmittingComment(true);

        try {
            await fetch(`${backendUrl}/comments/post-comment/${user?.user_id}/${campaign_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ message: newComment }),
            });

            await fetchComments(); // Refresh comments after posting
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // ✅ Handle likes locally
    const handleLikeComment = async (id) => {
        if (!user) return; 

        try {
            const res = await fetch(`${backendUrl}/comments/toggle-like/${user.user_id}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            console.log("Updated likes:", data.likes);

            await fetchComments();

        } catch (err) {
            console.error("Error liking comment:", err);
        }
    };


    // ✅ Time formatting
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
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.comment_id} className="shadow-md">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={comment.profile_image} alt={comment.username} />
                                        <AvatarFallback>
                                            {(comment.username || "?").charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-foreground">{comment.username}</h4>
                                            <span className="text-sm text-muted-foreground">
                                                {formatTimeAgo(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground mb-3">{comment.content}</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => user && handleLikeComment(comment.comment_id)}
                                            className={`gap-2 ${user && likedComments.has(comment.comment_id) ? "text-primary" : ""}`}
                                            disabled={!user}
                                        >
                                            <ThumbsUp
                                                className={`h-4 w-4 ${user && likedComments.has(comment.comment_id) ? "fill-current" : ""}`}
                                            />
                                            <span>{comment.likes}</span>
                                        </Button>


                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}

export default CampaignComments;
