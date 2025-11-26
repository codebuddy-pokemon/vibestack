"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Need to add avatar component
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
    const { data: session } = useSession()
    const { setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 pointer-events-none">
            <div className="container flex h-16 items-center px-4 md:px-8 max-w-[1600px]">
                <div className="mr-4 hidden md:flex pointer-events-auto">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-black tracking-tighter uppercase text-xl text-foreground">
                            VibeStack
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                        <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end pointer-events-auto">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other controls */}
                    </div>
                    <nav className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground hover:bg-accent">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-white/20">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                            <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <button className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-wider hover:bg-theme-accent hover:text-black transition-colors duration-300 text-sm">
                                    Enter App
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
