"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Layout, Palette, Activity, Zap, Code, Globe, Wand2, Upload } from "lucide-react"

export default function LandingPageV2() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-theme-accent selection:text-black font-sans">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-accent/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] animate-pulse delay-500" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 container max-w-7xl mx-auto py-6 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="w-8 h-8 rounded-full bg-theme-accent flex items-center justify-center text-black">
                        <Sparkles className="w-4 h-4 fill-black" />
                    </div>
                    VibeStack
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Log in
                    </Link>
                    <Link href="/dashboard">
                        <Button size="sm" className="rounded-full bg-white/10 border border-white/10 hover:bg-white/20 backdrop-blur-sm transition-all">
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 container max-w-7xl mx-auto px-4 pb-20">

                {/* Hero Section */}
                <div className="py-20 md:py-32 flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Sparkles className="w-3 h-3" /> The AI Web Builder
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">Generate.</span>
                        <span className="text-theme-accent">Remix. Deploy.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Turn text prompts and screenshots into production-ready code.
                        <br className="hidden md:block" />
                        The only AI builder that passes the <span className="text-foreground font-medium">vibe check</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-theme-accent text-black hover:bg-theme-accent/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_-5px_var(--theme-accent)]">
                                Start Building <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/roast">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                                Roast My Page 🔥
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">

                    {/* Feature 1: Text to Site */}
                    <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-theme-accent/30 transition-all duration-500 group overflow-hidden">
                        <CardContent className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 h-full">
                            <div className="space-y-4 max-w-md relative z-10">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                                    <Wand2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Text to Website</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Describe your dream site in plain English. We'll generate the layout, copy, and styling in seconds.
                                </p>
                            </div>
                            {/* Visual Placeholder */}
                            <div className="w-full md:w-1/2 h-48 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                                <div className="absolute inset-4 space-y-3">
                                    <div className="w-3/4 h-4 rounded-full bg-white/10 animate-pulse" />
                                    <div className="w-1/2 h-4 rounded-full bg-white/10 animate-pulse delay-75" />
                                    <div className="w-full h-24 rounded-lg bg-blue-500/10 mt-4 border border-blue-500/20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature 2: Screenshot Remix */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-theme-accent/30 transition-all duration-500 group overflow-hidden">
                        <CardContent className="p-10 flex flex-col justify-between h-full gap-8">
                            <div className="space-y-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-500">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Screenshot Remix</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Steal the look. Upload any screenshot and make it yours.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature 3: Vibe Check */}
                    <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 group overflow-hidden">
                        <CardContent className="p-10 flex flex-col justify-between h-full gap-8">
                            <div className="space-y-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white">Vibe Check</h3>
                                <p className="text-white/70 text-lg leading-relaxed">
                                    Get an instant AI aesthetic score for your designs.
                                </p>
                            </div>
                            <div className="text-6xl font-black text-white/10 absolute bottom-4 right-4 group-hover:text-white/20 transition-colors">
                                98%
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature 4: Clean Code */}
                    <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-theme-accent/30 transition-all duration-500 group overflow-hidden">
                        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                            <div className="w-full md:w-1/2 h-48 rounded-xl bg-black/80 border border-white/10 relative overflow-hidden font-mono text-xs p-4 text-green-400">
                                <div className="opacity-50 select-none">
                                    1  import React from 'react';<br />
                                    2  import &#123; Button &#125; from '@/ui';<br />
                                    3<br />
                                    4  export default function Hero() &#123;<br />
                                    5    return (<br />
                                    6      &lt;div className="p-20"&gt;<br />
                                    7        &lt;h1&gt;Hello World&lt;/h1&gt;<br />
                                    8      &lt;/div&gt;<br />
                                    9    );<br />
                                    10 &#125;
                                </div>
                            </div>
                            <div className="space-y-4 max-w-md relative z-10">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-500">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Clean Code</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Export to React, Next.js, and Tailwind. No bloat, just clean, production-ready code.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Stats Section */}
                <div className="py-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 mt-24">
                    {[
                        { label: "Websites Generated", value: "10K+" },
                        { label: "Active Developers", value: "2.5K+" },
                        { label: "Lines of Code", value: "1M+" },
                        { label: "Avg. Build Time", value: "< 30s" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                            <div className="text-4xl md:text-5xl font-black tracking-tighter text-theme-accent">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Ready to ship?
                    </h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-foreground text-background hover:bg-theme-accent hover:text-black hover:scale-105 transition-all duration-300 font-bold">
                            Get Started Now
                        </Button>
                    </Link>
                    <p className="text-muted-foreground text-sm font-mono">
                        VIBESTACK © 2024 — DESIGNED BY AI, BUILT FOR HUMANS.
                    </p>
                </div>

            </main>
        </div>
    )
}
