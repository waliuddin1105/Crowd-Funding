"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "../lib/utils"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  async function onSubmit(e) {
  e.preventDefault()
  setLoading(true)

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const res = await fetch(`${backendUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log("[Login Success]", data)
      localStorage.setItem("access_token", data["access token"])
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate('/')
    } else {
      alert(data.Error || "Login failed")
    }
  } catch (err) {
    console.error("Error logging in:", err)
    alert("Something went wrong. Please try again.")
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="min-h-screen bg-gray-900 relative overflow-hidden text-white">
      {/* subtle decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/80" />
      <div className="absolute top-24 left-6 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-12 right-6 w-72 h-72 bg-cyan-500/08 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <div className="bg-gray-800/80 border border-cyan-500 rounded-xl shadow-[0_0_12px_rgba(0,255,255,0.14)] backdrop-blur-sm p-6 lg:p-8">
            {/* Header */}
            <header className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-700/20 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium text-cyan-400">Welcome back</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-800 to-cyan-400 bg-clip-text text-transparent mb-2">
                Sign in to your account
              </h1>
              <p className="text-sm text-gray-300 max-w-lg mx-auto">
                Enter your credentials to continue.
              </p>
            </header>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    )}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold mb-1 text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    )}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="h-4 w-4 rounded bg-transparent border border-gray-600 checked:bg-cyan-500 focus:ring-0" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot" className="text-sm text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full group bg-gray-900 hover:bg-gray-800 text-cyan-400 font-semibold py-2 px-3 rounded-md shadow-md border border-cyan-500 transition-colors"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </div>

            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
