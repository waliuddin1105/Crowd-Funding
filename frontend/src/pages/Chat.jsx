import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, MessageSquare, Loader2 } from "lucide-react";
import axios from "axios";
import { getUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import UnauthorizedBox from "@/components/UnauthorizedBox";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    let storedUser = getUser()
    setUser(storedUser)
  }, []);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      try {
        const res = await axios.get(`${API_BASE}/chat/history/${user.user_id}?limit=20`);
        if (res.data.status === "success") {
          const formatted = res.data.history.map((h) => ({
            role: h.role,
            message: h.message,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    loadHistory();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = {
      role: "User",
      message: input,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        user_id: user.user_id,
        message: newUserMsg.message,
      });

      const botReply = {
        role: "Assistant",
        message: res.data.reply,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "Assistant", message: "Error contacting chatbot." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Navbar />
      {user ? (<><div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-600/30 rounded-full animate-float-slow"></div>
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          {/* Compact Header */}
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              Chat Assistant
            </h1>
          </div>

          {/* Chat Card */}
          <Card className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col rounded-2xl shadow-2xl bg-gray-900/50 border-gray-800/50 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Compact Chat Header */}
              <div className="p-4 border-b border-gray-800/50 bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Bot className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">AI Assistant</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      {isTyping ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Responding...</span>
                        </>
                      ) : (
                        "Always here to help"
                      )}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-xs text-green-400 font-semibold">Online</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea
                className="flex-1 p-6 bg-gray-950/30"
                ref={scrollRef}
              >
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <MessageSquare className="h-10 w-10 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Start a Conversation</h3>
                      <p className="text-gray-400 text-sm">Ask me anything about campaigns, donations, or how to get started!</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "User" ? "justify-end" : "justify-start"
                        } animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] flex items-start gap-3
                            ${msg.role === "User" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                            msg.role === "User" 
                              ? "bg-blue-500/20 border border-blue-500/30" 
                              : "bg-purple-500/20 border border-purple-500/30"
                          }`}>
                            {msg.role === "User" ? (
                              <User className="h-5 w-5 text-blue-400" />
                            ) : (
                              <Bot className="h-5 w-5 text-purple-400" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-lg ${
                              msg.role === "User"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                : "bg-gray-800/50 text-gray-200 border border-gray-700/50"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20 border border-purple-500/30">
                          <Bot className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-gray-800/50 border border-gray-700/50">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                            <span className="text-sm text-gray-300">Responding...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
                <div className="flex gap-3">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 h-12 rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <Button 
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • AI responses may vary
                </p>
              </div>
            </CardContent>
          </Card>
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style></>) : <UnauthorizedBox message={'You need to Login to visit this page'}/>}
    </>
  );
}