import { useEffect, useMemo, useState } from "react"
import { Button } from "../components/ui/button"
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, Users, Zap, Check } from "lucide-react"
import { cn } from "../lib/utils.js"

// Inline RoleCard component (smaller)
function RoleCard({ role, selected, onSelect }) {
    const isCreator = role === "creator"

    return (
        <div
            onClick={onSelect}
            className={cn(
                "relative cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:scale-[1.01]",
                selected
                    ? "border-cyan-400 bg-gradient-to-r from-blue-800 to-blue-700 shadow-[0_0_10px_rgba(0,255,255,0.25)]"
                    : "border-gray-700 bg-gray-800 hover:border-cyan-400"
            )}
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200",
                        selected
                            ? isCreator
                                ? "bg-purple-600 shadow-sm"
                                : "bg-cyan-500 shadow-sm"
                            : "bg-gray-700"
                    )}
                >
                    {isCreator ? (
                        <Zap className={cn("h-5 w-5", selected ? "text-white" : "text-gray-400")} />
                    ) : (
                        <Users className={cn("h-5 w-5", selected ? "text-white" : "text-gray-400")} />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className={cn("font-medium capitalize text-sm", selected ? "text-white" : "text-gray-300")}>
                        {role}
                    </h3>
                    <p className="text-xs text-gray-400">
                        {isCreator ? "Launch and manage campaigns" : "Support amazing projects"}
                    </p>
                </div>
            </div>

            {selected && (
                <div className="absolute -inset-px rounded-lg bg-cyan-400 opacity-15 blur-sm" />
            )}
        </div>
    )
}

// Inline PasswordStrength component (compact)
function PasswordStrength({ password }) {
    const checks = [
        { label: "≥ 8 chars", valid: password.length >= 8 },
        { label: "Uppercase", valid: /[A-Z]/.test(password) },
        { label: "Lowercase", valid: /[a-z]/.test(password) },
        { label: "Number", valid: /\d/.test(password) },
    ]

    const validChecks = checks.filter(check => check.valid).length
    const strength = validChecks / checks.length

    return (
        <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Strength:</span>
                <div className="flex-1 h-1 rounded-full bg-gray-700 overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-200",
                            strength < 0.5 ? "bg-red-500" : strength < 0.8 ? "bg-yellow-400" : "bg-green-400"
                        )}
                        style={{ width: `${strength * 100}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
                {checks.map((check, index) => (
                    <div key={index} className="flex items-center gap-1 text-[11px]">
                        <Check className={cn("h-3 w-3", check.valid ? "text-green-400" : "text-gray-500")} />
                        <span className={cn(check.valid ? "text-green-400" : "text-gray-500")}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Register() {
    const [usersUserId, setUsersUserId] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("creator")
    const [createdAt, setCreatedAt] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        if (!usersUserId) setUsersUserId(crypto.randomUUID())
        if (!createdAt) setCreatedAt(new Date().toISOString())
    }, [usersUserId, createdAt])

    function validate() {
        const next = {}
        if (!name || name.trim().length < 2) next.name = "Please enter your full name (min 2 chars)"
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email"
        if (!password) next.password = "Password is required"
        else if (password.length < 8) next.password = "Password must be at least 8 characters"
        if (!["creator", "donor"].includes(role)) next.role = "Please select a valid role"
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function sha256Hex(input) {
        const data = new TextEncoder().encode(input)
        const digest = await crypto.subtle.digest("SHA-256", data)
        return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")
    }

    async function onSubmit(e) {
        e.preventDefault()
        setTouched({ name: true, email: true, password: true, role: true })
        if (!validate()) return

        setLoading(true)
        try {
            const password_hash = await sha256Hex(password)
            const payload = {
                user_id: usersUserId,
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password_hash,
                role,
                created_at: createdAt,
            }
            console.log("[Enhanced] Register payload (demo only):", payload)
            setPassword("")
            alert("Account created successfully! 🎉")
        } catch (err) {
            console.error("[Enhanced] Registration error:", err)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setName("")
        setEmail("")
        setPassword("")
        setRole("creator")
        setErrors({})
        setTouched({})
        setUsersUserId(crypto.randomUUID())
        setCreatedAt(new Date().toISOString())
    }

    const formDisabled = useMemo(() => loading, [loading])

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden text-white">
            {/* Background (smaller & subtler) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/80" />
            <div className="absolute top-24 left-6 w-48 h-48 bg-purple-600/12 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-12 right-6 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <main className="relative flex min-h-screen items-center justify-center p-3">
                <div className="w-full max-w-xl animate-slide-up">
                    <div className="bg-gray-800/80 border border-cyan-500 rounded-xl shadow-[0_0_12px_rgba(0,255,255,0.20)] backdrop-blur-sm p-4 lg:p-6">

                        {/* Header (smaller) */}
                        <header className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-700/20 rounded-full mb-4">
                                <Sparkles className="h-4 w-4 text-cyan-400" />
                                <span className="text-xs font-medium text-cyan-400">Join the Platform</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-800 to-cyan-400 bg-clip-text text-transparent mb-2">
                                Create Your Account
                            </h1>
                            <p className="text-sm text-gray-300 max-w-lg mx-auto">
                                Join creators and donors building the future together
                            </p>
                        </header>

                        {/* Form (tighter spacing) */}
                        <form onSubmit={onSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="group">
                                <label htmlFor="name" className="block text-sm font-semibold mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); if (touched.name) validate() }}
                                        onBlur={() => setTouched({ ...touched, name: true })}
                                        className={cn(
                                            "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400",
                                            errors.name && touched.name && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && touched.name && (
                                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                {errors.name && touched.name && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); if (touched.email) validate() }}
                                        onBlur={() => setTouched({ ...touched, email: true })}
                                        className={cn(
                                            "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400",
                                            errors.email && touched.email && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && touched.email && (
                                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (touched.password) validate() }}
                                        onBlur={() => setTouched({ ...touched, password: true })}
                                        className={cn(
                                            "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400",
                                            errors.password && touched.password && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="Create a strong password"
                                    />
                                    {errors.password && touched.password && (
                                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>

                                {password && <PasswordStrength password={password} />}

                                {errors.password && touched.password && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-semibold mb-3">Choose Your Role</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <RoleCard
                                        role="creator"
                                        selected={role === "creator"}
                                        onSelect={() => setRole("creator")}
                                    />
                                    <RoleCard
                                        role="donor"
                                        selected={role === "donor"}
                                        onSelect={() => setRole("donor")}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {/* Create Account button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 group bg-gray-900 hover:bg-gray-800 text-cyan-400 font-semibold py-2 px-3 rounded-md shadow-md border border-cyan-500 transition-colors"
                                >
                                    {loading ? (
                                        "Creating..."
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Create Account</span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    )}
                                </Button>

                                {/* Reset button */}
                                <Button
                                    type="reset"
                                    onClick={handleReset}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-cyan-400 font-semibold py-2 px-3 rounded-md shadow-md border border-cyan-500 transition-colors"
                                >
                                    Reset
                                </Button>
                            </div>

                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                            <p className="text-xs text-gray-400">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
