import { useMemo, useState } from "react"
import { Button } from "../components/ui/button"
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, Users, Zap, Check, Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "../lib/utils.js"

// Inline RoleCard component
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

// Inline PasswordStrength component
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
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("creator")
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const CLOUDINARY_UPLOAD_PRESET = "CrowdFund-Preset"
    const CLOUDINARY_CLOUD_NAME = "sajjadahmed"

    function validate() {
        const next = {}
        if (!username || username.trim().length < 2) next.username = "Please enter a username (min 2 chars)"
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email"
        if (!password) next.password = "Password is required"
        else if (password.length < 8) next.password = "Password must be at least 8 characters"
        if (!["creator", "donor"].includes(role)) next.role = "Please select a valid role"
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function uploadToCloudinary(file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!response.ok) {
                throw new Error("Failed to upload image")
            }

            const data = await response.json()
            return data.secure_url // Returns the Cloudinary URL
        } catch (error) {
            console.error("Cloudinary upload error:", error)
            throw error
        }
    }

    async function handleImageChange(e) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB")
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

        setUploadingImage(true)
        try {
            const imageUrl = await uploadToCloudinary(file)
            setProfileImage(imageUrl)
            console.log("Image uploaded successfully:", imageUrl)
        } catch (error) {
            alert("Failed to upload image. Please try again.")
            setImagePreview(null)
        } finally {
            setUploadingImage(false)
        }
    }

    function handleRemoveImage() {
        setProfileImage(null)
        setImagePreview(null)
        // Reset file input
        const fileInput = document.getElementById("profile-image")
        if (fileInput) fileInput.value = ""
    }

    async function onSubmit(e) {
        e.preventDefault()
        setTouched({ username: true, email: true, password: true, role: true })
        if (!validate()) return

        setLoading(true)
        try {
            const payload = {
                username: username.trim(),
                email: email.toLowerCase().trim(),
                password: password,
                role: role,
                profile_image: profileImage // Cloudinary URL or null
            }
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(`${backendUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok) {
                alert(`Account created successfully! 🎉\nUser ID: ${data.user_id}`)
                handleReset()
            } else {
                // Handle backend errors
                const errorMessage = data.Error || "Registration failed"
                alert(`Error: ${errorMessage}`)
            }
        } catch (err) {
            console.error("Registration error:", err)
            alert("Network error. Please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setUsername("")
        setEmail("")
        setPassword("")
        setRole("creator")
        setProfileImage(null)
        setImagePreview(null)
        setErrors({})
        setTouched({})
        const fileInput = document.getElementById("profile-image")
        if (fileInput) fileInput.value = ""
    }

    const formDisabled = useMemo(() => loading, [loading])

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden text-white">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/80" />
            <div className="absolute top-24 left-6 w-48 h-48 bg-purple-600/12 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-12 right-6 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <main className="relative flex min-h-screen items-center justify-center p-3">
                <div className="w-full max-w-xl animate-slide-up">
                    <div className="bg-gray-800/80 border border-cyan-500 rounded-xl shadow-[0_0_12px_rgba(0,255,255,0.20)] backdrop-blur-sm p-4 lg:p-6">

                        {/* Header */}
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

                        {/* Form */}
                        <form onSubmit={onSubmit} className="space-y-4">
                            

                            {/* Username */}
                            <div className="group">
                                <label htmlFor="username" className="block text-sm font-semibold mb-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyan-400" />
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); if (touched.username) validate() }}
                                        onBlur={() => setTouched({ ...touched, username: true })}
                                        className={cn(
                                            "w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400",
                                            errors.username && touched.username && "border-red-500 focus:ring-red-500"
                                        )}
                                        placeholder="Choose a unique username"
                                    />
                                    {errors.username && touched.username && (
                                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                {errors.username && touched.username && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.username}
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
                                {/* Profile Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Profile Image (Optional)</label>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Image Preview */}
                                    <div className="flex-shrink-0 self-center sm:self-auto">
                                        {imagePreview ? (
                                            <div className="relative group">
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    className="h-24 w-24 rounded-full object-cover border-2 border-cyan-400 shadow-md transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors shadow-md"
                                                    disabled={uploadingImage}
                                                    title="Remove image"
                                                >
                                                    <X className="h-3.5 w-3.5 text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 shadow-inner">
                                                <ImageIcon className="h-8 w-8 text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Controls */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <label
                                            htmlFor="profile-image"
                                            className={cn(
                                                "inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md cursor-pointer transition-all font-medium text-sm",
                                                uploadingImage && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <Upload className="h-4 w-4" />
                                            <span>
                                                {uploadingImage ? "Uploading..." : imagePreview ? "Change Image" : "Upload Image"}
                                            </span>
                                        </label>

                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={uploadingImage || loading}
                                        />

                                        <p className="text-xs text-gray-400 mt-2 leading-snug">
                                            Max size <span className="text-gray-300 font-medium">5MB</span> — JPG, PNG, or GIF only.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {/* Create Account button */}
                                <button
                                    type="submit"
                                    disabled={loading || uploadingImage}
                                    className="flex-1 group bg-gray-900 hover:bg-gray-800 text-cyan-400 font-semibold py-2 px-3 rounded-md shadow-md border border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        "Creating..."
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Create Account</span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    )}
                                </button>

                                {/* Reset button */}
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={loading || uploadingImage}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-cyan-400 font-semibold py-2 px-3 rounded-md shadow-md border border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset
                                </button>
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