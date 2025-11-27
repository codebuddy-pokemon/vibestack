"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Activity, CheckCircle2, Eye } from "lucide-react"
import { toast } from "sonner"

export default function HeatmapPage() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [hotspots, setHotspots] = useState<any[] | null>(null)

    const handleAnalyze = async () => {
        if (!imageFile) return

        setIsAnalyzing(true)
        try {
            const formData = new FormData()
            formData.append("image", imageFile)

            const response = await fetch("/api/heatmap", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.error("[HEATMAP_API_ERROR]", errorText);
                throw new Error(errorText || "Analysis failed");
            }

            const data = await response.json()
            setHotspots(data)
            toast.success("Heatmap generated! 🔥")

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to generate heatmap. Try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setHotspots(null)

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
                        <Eye className="w-3 h-3" /> AI Attention Prediction
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient flex flex-col md:block items-center justify-center gap-4">
                        AI Heatmap
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Predict where users will look first. <span className="text-foreground font-medium">Optimize conversion</span> before you launch.
                    </p>
                </div>

                <div>
                    <Card className="border-2 border-dashed border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-orange-500/30 hover:bg-white/10 transition-all duration-300 overflow-hidden relative group cursor-pointer">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleImageUpload}
                            />

                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all duration-300 relative z-10">
                                {imageFile ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-orange-500 transition-colors duration-300" />
                                )}
                            </div>

                            <div className="space-y-3 max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                    {imageFile ? imageFile.name : "Drop your screenshot here"}
                                </h3>
                                <p className="text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    {imageFile ? "Ready to analyze!" : "or click to browse files"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-10 flex justify-center">
                        <Button
                            size="lg"
                            className="h-16 px-10 text-xl font-bold rounded-full shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !imageFile}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Generating Heatmap...
                                </>
                            ) : (
                                <>
                                    Predict Attention 🔥
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {hotspots && imagePreview && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Card className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-gradient bg-[length:200%_auto]" />
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Attention Prediction
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative p-0">
                                <div className="relative w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Analyzed UI"
                                        className="w-full h-auto block opacity-80"
                                    />
                                    {/* Heatmap Overlay */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {hotspots.map((spot: any, i: number) => (
                                            <div
                                                key={i}
                                                className="absolute rounded-full blur-3xl mix-blend-screen animate-pulse"
                                                style={{
                                                    left: `${spot.x}%`,
                                                    top: `${spot.y}%`,
                                                    width: '20%',
                                                    height: '20%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : '#eab308', // Red -> Orange -> Yellow
                                                    opacity: 0.7 - (i * 0.15),
                                                    animationDelay: `${i * 0.5}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {hotspots.map((spot: any, i: number) => (
                            <Card key={i} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 text-9xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-500 select-none pointer-events-none">
                                    0{i + 1}
                                </div>
                                <CardContent className="p-8 relative z-10">
                                    <h4 className="font-bold text-xl mb-3 text-white group-hover:text-orange-500 transition-colors">{spot.label}</h4>
                                    <p className="text-base text-muted-foreground leading-relaxed text-left">{spot.reason}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
