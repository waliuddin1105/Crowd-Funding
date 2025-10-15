import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const defaultUser = { isLoggedIn: 1, role: 'Donor', name: "John Doe" }

function getDashboardLink(role) {
  switch (role) {
    case "Admin":
      return { href: "/admin", label: "Admin Dashboard" }
    case "Donor":
      return { href: "/donor", label: "Donor Dashboard" }
    case "Creator":
      return { href: "/creator", label: "Creator Dashboard" }
    default:
      return { href: "/", label: "Home" }
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function Navbar() {
  const [user, setUser] = useState(defaultUser)

  // Fetch user from localStorage on mount
  useEffect(() => {
    // const storedUser = localStorage.getItem("user")
    // if (storedUser) {
    //   try {
    setUser(defaultUser)
    //   } catch (e) {
    //     console.error("Failed to parse user from localStorage", e)
    //     setUser(defaultUser)
    //   }
  }
    , [])

  const dashboard = useMemo(() => getDashboardLink(user?.role), [user?.role])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 
      bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
      text-white backdrop-blur shadow-lg">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6">

        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="secondary" size="sm" aria-label="Open menu">
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="mt-4 flex flex-col gap-3">
                <a href="/" className="text-sm font-medium hover:text-primary">Home</a>
                <Link to={'/all-campaigns'} className="text-sm font-medium hover:text-primary" />Explore Campaigns
                <a href="/contact" className="text-sm font-medium hover:text-primary">Contact</a>

                <div className="mt-4">
                  <Input placeholder="Search..." className="w-full text-black" />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <a href="/create-campaign">Start a Campaign</a>
                  </Button>

                  {user?.isLoggedIn ? (
                    <>
                      {/* <Button variant="secondary" asChild className="w-full">
                        <a href={dashboard.href}>{dashboard.label}</a>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <a href="/settings">Profile & Settings</a>
                      </Button>
                      <Button variant="ghost" asChild className="w-full">
                        <a href="/logout">Logout</a>
                      </Button> */}
                      <p>{user.name}</p>
                    </>
                  ) : (
                    <Button variant="secondary" asChild className="w-full">
                      <Link to={'/login'}>Login</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <a href="/" className="inline-flex items-center gap-2 font-semibold text-white">
            <div className="h-6 w-6 rounded bg-primary" aria-hidden="true" />
            <span className="text-base tracking-tight">Crowdfund</span>
          </a>
        </div>

        {/* Center: Desktop navigation */}
        <nav className="hidden md:flex items-center gap-20">
          <a href="/" className="text-sm font-medium hover:text-primary">Home</a>
          <Link to={"/all-campaigns"} className="text-sm font-medium hover:text-primary" >All Campaigns</Link>

          <a href="/contact" className="text-sm font-medium hover:text-primary">Contact</a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">


          <Button asChild className="hidden md:inline-flex">
            <a href="/create-campaign">Start a Campaign</a>

          </Button>

          {user?.isLoggedIn ? (
            <>
              <a href={dashboard.href} className="hidden md:inline-block text-sm font-medium hover:text-white">
                {dashboard.label}
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0 text-black">
                    <Avatar className="h-9 w-9">
                      {user?.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={`${user.name} avatar`} />
                      ) : (
                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-white">
                  <DropdownMenuLabel className="truncate">
                    Signed in as <div className="font-medium">{user?.name || "User"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><a href={dashboard.href}>{dashboard.label}</a></DropdownMenuItem>
                  <DropdownMenuItem asChild><a href="/settings">Settings</a></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><a href="/logout">Logout</a></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (<>
            <Button variant="secondary" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/register">Sign Up</a>
            </Button>
          </>
          )}
        </div>
      </div>
    </header>
  )
}
