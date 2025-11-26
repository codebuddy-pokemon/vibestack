"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Palette, CheckCircle2, Copy, Type } from "lucide-react"
import { toast } from "sonner"

export default function BrandMatchPage() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = async () => {
        if (!imageFile) return

        setIsAnalyzing(true)
        try {
            const formData = new FormData()
            formData.append("image", imageFile)

            const response = await fetch("/api/brand-match", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Analysis failed")

            const data = await response.json()
            setResult(data)
            toast.success("Brand extracted! 🎨")

        } catch (error) {
            console.error(error)
            toast.error("Failed to analyze brand. Try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
            setResult(null)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
                        <Palette className="w-3 h-3" /> AI Design System Extractor
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient flex flex-col md:block items-center justify-center gap-4">
                        Brand Match
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Upload your logo or product to <span className="text-foreground font-medium">extract your unique design system</span> instantly.
                    </p>
                </div>

                <div>
                    <Card className="border-2 border-dashed border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 overflow-hidden relative group cursor-pointer">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleImageUpload}
                            />

                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300 relative z-10">
                                {imageFile ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in duration-300" />
                                ) : (
                                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-blue-500 transition-colors duration-300" />
                                )}
                            </div>

                            <div className="space-y-3 max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight group-hover:text-blue-500 transition-colors duration-300">
                                    {imageFile ? imageFile.name : "Drop your logo here"}
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
                            className="h-16 px-10 text-xl font-bold rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !imageFile}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Extracting Brand...
                                </>
                            ) : (
                                <>
                                    Match Brand 🎨
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Vibe Description */}
                        <Card className="border-none bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-gradient bg-[length:200%_auto]" />
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-500">Brand Vibe</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl md:text-4xl leading-tight font-medium italic text-white/90 font-heading">
                                    "{result.vibe}"
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Color Palette */}
                            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Palette className="w-4 h-4" /> Color Palette
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        {result.colors?.map((color: any, i: number) => (
                                            <div
                                                key={i}
                                                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
                                                onClick={() => copyToClipboard(color.hex)}
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Copy className="text-white w-8 h-8 drop-shadow-md" />
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-sm text-white text-xs font-mono">
                                                    <div className="font-bold">{color.hex}</div>
                                                    <div className="opacity-80 truncate">{color.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Typography */}
                            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Type className="w-4 h-4" /> Typography
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Primary Font</p>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                <p className="text-4xl font-black mb-2 tracking-tight">{result.fonts?.primary}</p>
                                                <p className="text-lg opacity-60 font-light">The quick brown fox jumps over the lazy dog.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Secondary Font</p>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                <p className="text-3xl font-bold mb-2">{result.fonts?.secondary}</p>
                                                <p className="text-lg opacity-60 font-light">The quick brown fox jumps over the lazy dog.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
