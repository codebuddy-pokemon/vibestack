"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Sparkles, CheckCircle2, Zap } from "lucide-react"
import { toast } from "sonner"

export default function VibeCheckPage() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [vibeResult, setVibeResult] = useState<any>(null)

    const handleCheck = async () => {
        if (!imageFile) return

        setIsChecking(true)
        try {
            const formData = new FormData()
            formData.append("image", imageFile)

            const response = await fetch("/api/vibe-score", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Vibe check failed")

            const data = await response.json()
            setVibeResult(data)
            toast.success("Vibe checked! ✨")

        } catch (error) {
            console.error(error)
            toast.error("Failed to check vibe. Try again.")
        } finally {
            setIsChecking(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
            setVibeResult(null)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> AI Aesthetic Analyzer
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient flex flex-col md:block items-center justify-center gap-4">
                        Vibe Check
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Does your design pass the <span className="text-foreground font-medium">vibe check</span>? Get an instant aesthetic score.
                    </p>
                </div>

                <div>
                    <Card className="border-2 border-dashed border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 overflow-hidden relative group cursor-pointer">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleImageUpload}
                            />

                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-300 relative z-10">
                                {imageFile ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-purple-500 transition-colors duration-300" />
                                )}
                            </div>

                            <div className="space-y-3 max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight group-hover:text-purple-500 transition-colors duration-300">
                                    {imageFile ? imageFile.name : "Drop a screenshot here"}
                                </h3>
                                <p className="text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    {imageFile ? "Ready to check!" : "or click to upload"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-10 flex justify-center">
                        <Button
                            size="lg"
                            className="h-16 px-10 text-xl font-bold rounded-full shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0"
                            onClick={handleCheck}
                            disabled={isChecking || !imageFile}
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Checking Vibe...
                                </>
                            ) : (
                                "Check Vibe ✨"
                            )}
                        </Button>
                    </div>
                </div>

                {vibeResult && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                            <CardContent className="p-16 flex flex-col items-center justify-center text-center relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
                                    <Zap className="w-3 h-3" /> Vibe Score
                                </div>
                                <div className="text-[10rem] leading-none font-black tracking-tighter mb-4 drop-shadow-2xl animate-in zoom-in duration-500">
                                    {vibeResult.score}<span className="text-6xl opacity-50">%</span>
                                </div>
                                <div className="text-4xl font-bold tracking-tight opacity-90">{vibeResult.vibe}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-500">AI Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 pb-8 px-6 md:px-10">
                                <div className="space-y-6 max-w-prose mx-auto">
                                    {vibeResult.explanation.split('\n').map((paragraph: string, i: number) => {
                                        if (!paragraph.trim()) return null;
                                        return (
                                            <p key={i} className="text-sm md:text-base font-medium leading-relaxed text-foreground/90">
                                                {paragraph.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j} className="text-foreground font-bold">{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
