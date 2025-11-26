"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Flame, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

// Animated Score Counter Component
function AnimatedScore({ score }: { score: number }) {
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        let start = 0
        const end = score
        const duration = 1500 // 1.5 seconds
        const increment = end / (duration / 16) // 60fps

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setDisplayScore(end)
                clearInterval(timer)
            } else {
                setDisplayScore(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [score])

    return <>{displayScore}</>
}

export default function RoastPage() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isRoasting, setIsRoasting] = useState(false)
    const [roastResult, setRoastResult] = useState<any>(null)

    const handleRoast = async () => {
        if (!imageFile) return

        setIsRoasting(true)
        try {
            const formData = new FormData()
            formData.append("image", imageFile)

            const response = await fetch("/api/roast", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Roast failed")

            const data = await response.json()
            setRoastResult(data)
            toast.success("Roast served! 🔥")

        } catch (error) {
            console.error(error)
            toast.error("Failed to roast. Try again.")
        } finally {
            setIsRoasting(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
            setRoastResult(null)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
                        <Flame className="w-3 h-3" /> AI Design Critic
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient flex flex-col md:block items-center justify-center gap-4">
                        Roast My Page
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Get <span className="text-foreground font-medium">brutally honest</span> AI feedback on your design choices.
                        <br className="hidden md:block" /> Warning: Not for the faint of heart.
                    </p>
                </div>

                <div>
                    <Card className="border-2 border-dashed border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-red-500/30 hover:bg-white/10 transition-all duration-300 overflow-hidden relative group cursor-pointer">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleImageUpload}
                            />

                            {/* Animated Icon Container */}
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all duration-300 relative z-10">
                                {imageFile ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-red-500 transition-colors duration-300" />
                                )}
                            </div>

                            <div className="space-y-3 max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight group-hover:text-red-500 transition-colors duration-300">
                                    {imageFile ? imageFile.name : "Drop your screenshot here"}
                                </h3>
                                <p className="text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    {imageFile ? "Ready to roast!" : "or click to browse files"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-10 flex justify-center">
                        <Button
                            size="lg"
                            className="h-16 px-10 text-xl font-bold rounded-full shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white border-0"
                            onClick={handleRoast}
                            disabled={isRoasting || !imageFile}
                        >
                            {isRoasting ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Roasting...
                                </>
                            ) : (
                                <>
                                    Roast Me 🔥
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {roastResult && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* The Verdict */}
                        <Card className="border border-red-500/20 bg-card backdrop-blur-xl overflow-hidden relative shadow-xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

                            <CardHeader className="border-b border-border/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <Flame className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-foreground">The Roast</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-0.5">AI-Generated Feedback</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 pb-6">
                                <blockquote className="border-l-4 border-red-500 pl-6 pr-4 py-2 space-y-4">
                                    {roastResult.roast.split(/\.\s+/).filter((sentence: string) => sentence.trim()).map((sentence: string, i: number) => (
                                        <p key={i} className="text-base md:text-lg leading-relaxed text-foreground/90">
                                            {sentence.trim()}{sentence.trim().endsWith('.') ? '' : '.'}
                                        </p>
                                    ))}
                                </blockquote>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Score Card */}
                            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Design Score</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="relative group cursor-default">
                                        <div className="text-9xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent animate-in zoom-in duration-700">
                                            <AnimatedScore score={roastResult.score} />
                                        </div>
                                        <div className="absolute -top-6 -right-10 text-3xl font-bold text-muted-foreground rotate-12 animate-in fade-in slide-in-from-right duration-500 delay-700">
                                            /100
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Improvements Card */}
                            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Fixes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {roastResult.improvements?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                                                <div className="mt-0.5 min-w-6 min-h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                                                    <span className="text-xs font-bold text-red-500 group-hover:text-white">{i + 1}</span>
                                                </div>
                                                <span className="text-sm md:text-base leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
