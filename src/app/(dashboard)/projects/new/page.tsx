"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, X, Image as ImageIcon, Type, Upload, Palette, Share2, Sparkles, Wand2, Terminal, Monitor, Layers, Box, Zap, Undo2, Shuffle, Edit2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Suspense } from "react"
import { DownloadButton } from "@/components/DownloadButton"
import html2canvas from "html2canvas"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Layout } from "lucide-react"

const styles = [
    { id: "Modern Clean", name: "Modern Clean", icon: Monitor, color: "bg-blue-500", description: "Minimalist, whitespace, crisp typography." },
    { id: "Neo-Brutalism", name: "Neo-Brutalism", icon: Box, color: "bg-yellow-400", description: "Bold borders, high contrast, raw aesthetic." },
    { id: "Cyberpunk", name: "Cyberpunk", icon: Zap, color: "bg-pink-500", description: "Neon glows, dark mode, futuristic vibes." },
    { id: "Minimalist", name: "Minimalist", icon: Layers, color: "bg-stone-200", description: "Essential elements only. Pure and simple." },
    { id: "Corporate", name: "Corporate", icon: Layout, color: "bg-slate-600", description: "Professional, trustworthy, structured." },
    { id: "Playful", name: "Playful", icon: Sparkles, color: "bg-purple-400", description: "Fun colors, rounded shapes, friendly." },
]

export default function NewProjectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewProjectContent />
        </Suspense>
    )
}

function NewProjectContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [prompt, setPrompt] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [style, setStyle] = useState("Modern Clean")
    const [isGenerating, setIsGenerating] = useState(false)
    const [activeVariant, setActiveVariant] = useState<"A" | "B">("A")
    const [variants, setVariants] = useState<{
        A: { html: string, css: string, history: string[], redoHistory: string[], style: string },
        B: { html: string, css: string, history: string[], redoHistory: string[], style: string } | null
    }>({
        A: { html: "", css: "", history: [], redoHistory: [], style: "Modern Clean" },
        B: null
    })

    const [showPreview, setShowPreview] = useState(false)
    const [activeTab, setActiveTab] = useState("text")
    const [selectedComponent, setSelectedComponent] = useState("")
    const [componentPrompt, setComponentPrompt] = useState("")
    const [isPublished, setIsPublished] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)

    // Check for tab parameter in URL
    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'screenshot') {
            setActiveTab('screenshot')
        }
    }, [searchParams])

    // Derived state for backward compatibility
    const generatedHtml = variants[activeVariant]?.html || ""
    const generatedCss = variants[activeVariant]?.css || ""
    const history = variants[activeVariant]?.history || []
    const redoHistory = variants[activeVariant]?.redoHistory || []
    // style is now derived from active variant, but we also need a setter for the input
    // Let's keep 'style' as the *selected* style for generation, and store *applied* style in variants.

    // Helper setters
    const setGeneratedHtml = (html: string) => {
        setVariants(prev => ({
            ...prev,
            [activeVariant]: { ...prev[activeVariant]!, html }
        }))
    }
    const setGeneratedCss = (css: string) => {
        setVariants(prev => ({
            ...prev,
            [activeVariant]: { ...prev[activeVariant]!, css }
        }))
    }
    const setHistory = (fn: (prev: string[]) => string[]) => {
        setVariants(prev => ({
            ...prev,
            [activeVariant]: { ...prev[activeVariant]!, history: fn(prev[activeVariant]!.history) }
        }))
    }
    const setRedoHistory = (fn: (prev: string[]) => string[]) => {
        setVariants(prev => ({
            ...prev,
            [activeVariant]: { ...prev[activeVariant]!, redoHistory: fn(prev[activeVariant]!.redoHistory) }
        }))
    }


    // Template definitions
    const templates: Record<string, { prompt: string, style: string }> = {
        "saas": { prompt: "A modern, high-converting SaaS landing page with a clean hero section, feature grid, pricing table, and testimonials. Use a trustworthy blue color scheme.", style: "Modern Clean" },
        "portfolio": { prompt: "A minimalist creative portfolio for a designer. Large typography, plenty of whitespace, and a masonry grid for project thumbnails.", style: "Minimalist" },
        "ecommerce": { prompt: "A vibrant e-commerce storefront for a lifestyle brand. Featured products carousel, category grid, and a promotional banner.", style: "Modern Clean" },
        "agency": { prompt: "A bold digital agency website. Dark mode, neon accents, and a dynamic service showcase.", style: "Cyberpunk" },
        "docs": { prompt: "A clean, structured documentation site with a sidebar navigation and code block styling.", style: "Corporate" }
    }

    useEffect(() => {
        const templateId = searchParams.get("template")
        if (templateId && templates[templateId]) {
            setPrompt(templates[templateId].prompt)
            setStyle(templates[templateId].style)
            toast.info(`Loaded ${templateId} template`)
        }
    }, [searchParams])

    // Loading animation steps
    const loadingSteps = [
        "Analyzing prompt intent...",
        "Extracting design tokens...",
        "Generating layout structure...",
        "Applying style system...",
        "Writing component code...",
        "Finalizing build..."
    ]

    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingSteps.length)
            }, 800)
            return () => clearInterval(interval)
        } else {
            setLoadingStep(0)
        }
    }, [isGenerating])

    const handleGenerate = async (overrideStyle?: string, targetVariant?: "A" | "B") => {
        const styleToUse = overrideStyle || style
        const variantToUse = targetVariant || activeVariant

        if (activeTab === "text" && !prompt) return
        if (activeTab === "image" && !imageFile) return

        setIsGenerating(true)
        try {
            let response;

            if (activeTab === "text") {
                response = await fetch("/api/generate/from-text", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt, style: styleToUse }),
                })
            } else {
                const formData = new FormData()
                if (imageFile) formData.append("image", imageFile)
                formData.append("prompt", prompt || "Recreate this website design exactly.")
                formData.append("style", styleToUse)

                response = await fetch("/api/generate/from-image", {
                    method: "POST",
                    body: formData,
                })
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Generation failed: ${errorText}`);
            }

            const data = await response.json()

            setVariants(prev => ({
                ...prev,
                [variantToUse]: {
                    html: data.html,
                    css: data.css,
                    history: [],
                    redoHistory: [],
                    style: styleToUse
                }
            }))

            if (targetVariant) setActiveVariant(targetVariant)
            if (overrideStyle) setStyle(overrideStyle)

            setShowPreview(true)
            toast.success("Project generated successfully!")

            // Save to Database
            try {
                await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: prompt ? (prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt) : "Untitled Project",
                        description: prompt,
                        inputType: activeTab === "text" ? "TEXT" : "SCREENSHOT",
                        inputData: activeTab === "text" ? prompt : "image-url-placeholder", // TODO: Handle image upload URL
                        html: data.html,
                        css: data.css,
                        metadata: { style: styleToUse },
                        vibeScore: 85, // Placeholder
                        styleType: styleToUse
                    })
                });
                console.log("Project saved to database");
            } catch (saveError) {
                console.error("Failed to save project:", saveError);
                toast.error("Project generated but failed to save.");
            }

        } catch (error) {
            console.error(error)
            toast.error("Failed to generate project. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRemix = async (html: string, index: number) => {
        // Save current state to history before modifying
        setHistory(prev => [...prev, generatedHtml]);

        const toastId = toast.loading("Remixing section...");
        try {
            const response = await fetch("/api/remix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    html,
                    instruction: "Change the layout and style of this component to be completely different but keep the content."
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Remix failed: ${errorText}`);
            }

            const data = await response.json();

            const parser = new DOMParser();
            const doc = parser.parseFromString(generatedHtml, 'text/html');
            // Filter out scripts and styles to match the iframe logic
            const children = Array.from(doc.body.children).filter(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE');

            if (children[index]) {
                children[index].outerHTML = data.html;
                setGeneratedHtml("<!DOCTYPE html>" + doc.documentElement.outerHTML);
                setRedoHistory(() => []); // Clear redo history on new change
                toast.success("Remix applied!", { id: toastId });
            } else {
                throw new Error("Could not find element to replace");
            }

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to remix section", { id: toastId });
        }
    };

    const handleVibeShift = () => {
        // Pick a random style different from current
        const currentStyleId = style;
        const otherStyles = styles.filter(s => s.id !== currentStyleId);
        const randomStyle = otherStyles[Math.floor(Math.random() * otherStyles.length)];

        const nextVariant = activeVariant === "A" ? "B" : "A";

        toast.info(`Shifting vibe to ${randomStyle.name}...`);
        handleGenerate(randomStyle.id, nextVariant);
    };

    const handleCopyImprovement = async (text: string, index: number, tagName: string) => {
        // Save history first
        setHistory(prev => [...prev, generatedHtml]);
        setRedoHistory(() => []); // Clear redo history on new change

        const toastId = toast.loading("Polishing copy...");
        try {
            const response = await fetch("/api/copy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    instruction: "Make it more persuasive, punchy, and conversion-focused."
                }),
            });

            if (!response.ok) throw new Error("Copy improvement failed");

            const data = await response.json();

            const parser = new DOMParser();
            const doc = parser.parseFromString(generatedHtml, 'text/html');
            // Use a more robust selection strategy for text elements
            // We need to match the logic in the injected script
            const textElements = Array.from(doc.body.querySelectorAll('h1, h2, h3, p, li, button, a, span, div'))
                .filter(el => {
                    // Filter out empty or structural elements, similar to the script
                    return el.children.length === 0 && el.textContent?.trim().length! > 0;
                });

            if (textElements[index]) {
                const targetEl = textElements[index];
                if (targetEl.tagName.toLowerCase() !== tagName) {
                    console.warn(`Tag mismatch: Expected ${tagName}, found ${targetEl.tagName.toLowerCase()}`);
                    // Try to find a nearby match or abort
                    // For now, let's abort to be safe and avoid "font size change" issues
                    throw new Error("Element mismatch detected. Please try again.");
                }

                targetEl.textContent = data.text;
                setGeneratedHtml("<!DOCTYPE html>" + doc.documentElement.outerHTML);
                toast.success("Copy polished!", { id: toastId });
            } else {
                throw new Error("Could not find text element to replace");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to improve copy", { id: toastId });
        }
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        const previousHtml = history[history.length - 1];
        // Save current state to redo history before undoing
        setRedoHistory(prev => [...prev, generatedHtml]);

        setGeneratedHtml(previousHtml);
        setHistory(prev => prev.slice(0, -1));
        toast.info("Undid last change");
    };

    const handleRedo = () => {
        if (redoHistory.length === 0) return;

        const nextHtml = redoHistory[redoHistory.length - 1];
        // Save current state to history before redoing
        setHistory(prev => [...prev, generatedHtml]);

        setGeneratedHtml(nextHtml);
        setRedoHistory(prev => prev.slice(0, -1));
        toast.info("Redid last change");
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "REMIX_REQUEST") {
                handleRemix(event.data.html, event.data.index);
            }
            if (event.data.type === "COPY_REQUEST") {
                handleCopyImprovement(event.data.text, event.data.index, event.data.tagName);
            }
            if (event.data.type === "UNDO_REQUEST") {
                handleUndo();
            }
            if (event.data.type === "REDO_REQUEST") {
                handleRedo();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [generatedHtml]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handlePublish = async () => {
        if (isPublished) return
        const toastId = toast.loading("Publishing to gallery...")

        try {
            let imageUrl = "https://placehold.co/800x600/222/ccff00?text=User+Project"
            const iframe = document.getElementById("preview-frame") as HTMLIFrameElement

            if (iframe && iframe.contentDocument) {
                try {
                    const canvas = await html2canvas(iframe.contentDocument.body, {
                        useCORS: true,
                        logging: false,
                        height: iframe.contentDocument.body.scrollHeight,
                        width: iframe.contentDocument.body.scrollWidth
                    })
                    imageUrl = canvas.toDataURL("image/jpeg", 0.7)
                } catch (err) {
                    console.error("Screenshot capture failed:", err)
                }
            }

            const newProject = {
                id: Date.now(),
                title: prompt ? (prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt) : "Untitled Project",
                author: "You",
                image: imageUrl,
                tags: [style, "Community"],
                likes: 0,
            }

            const existingProjects = JSON.parse(localStorage.getItem("vibestack_gallery_projects") || "[]")
            localStorage.setItem("vibestack_gallery_projects", JSON.stringify([newProject, ...existingProjects]))

            setIsPublished(true)
            toast.success("Project published to gallery!", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Failed to publish", { id: toastId })
        }
    }

    if (showPreview) {
        return (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-theme-accent/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-theme-accent" />
                        </div>
                        <h2 className="text-lg font-bold">Generated Result</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {variants.B && (
                            <div className="flex bg-muted/20 p-1 rounded-full border border-white/10 mr-2">
                                <button
                                    onClick={() => setActiveVariant("A")}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                        activeVariant === "A" ? "bg-theme-accent text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Variant A
                                </button>
                                <button
                                    onClick={() => setActiveVariant("B")}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                        activeVariant === "B" ? "bg-theme-accent text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Variant B
                                </button>
                            </div>
                        )}
                        <Button
                            onClick={handleVibeShift}
                            variant="outline"
                            size="sm"
                            disabled={isGenerating}
                            className="rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50"
                        >
                            <Shuffle className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} />
                            Vibe Shift
                        </Button>
                        <Button
                            onClick={handlePublish}
                            variant="outline"
                            size="sm"
                            disabled={isPublished}
                            className="rounded-full"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            {isPublished ? "Published" : "Publish"}
                        </Button>
                        <Button
                            onClick={handleUndo}
                            variant="outline"
                            size="sm"
                            disabled={history.length === 0}
                            className="rounded-full"
                        >
                            <Undo2 className="mr-2 h-4 w-4" />
                            Undo
                        </Button>
                        <DownloadButton html={generatedHtml} css={generatedCss} projectName="vibestack-project" />
                        <Button onClick={() => setShowPreview(false)} variant="ghost" size="sm" className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Close
                        </Button>
                    </div>
                </div>
                <div className="flex-1 relative w-full flex flex-col">
                    {isGenerating && (
                        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4 animate-in fade-in">
                            <Loader2 className="w-10 h-10 animate-spin text-theme-accent" />
                            <p className="text-lg font-medium animate-pulse">Generating new vibe...</p>
                        </div>
                    )}
                    <iframe
                        id="preview-frame"
                        srcDoc={(() => {
                            if (!generatedHtml) return "";

                            let html = generatedHtml;

                            // Inject CSS and Tailwind
                            if (generatedCss) {
                                html = html.replace('</head>', `<script src="https://cdn.tailwindcss.com"></script><style>${generatedCss}</style></head>`);
                            } else if (!html.includes("cdn.tailwindcss.com")) {
                                html = html.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script></head>');
                            }

                            // Inject Remix/Copy Styles
                            const remixStyles = `
                            <style>
                                .vibestack-remix-btn {
                                    position: absolute;
                                    top: 10px;
                                    right: 10px;
                                    z-index: 9999;
                                    background: #6366f1;
                                    color: white;
                                    border: none;
                                    padding: 8px 16px;
                                    border-radius: 20px;
                                    font-family: sans-serif;
                                    font-size: 12px;
                                    font-weight: bold;
                                    cursor: pointer;
                                    opacity: 0;
                                    transition: opacity 0.2s;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                                }
                                .vibestack-copy-btn-group {
                                    position: absolute;
                                    top: -25px;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    z-index: 10000;
                                    display: flex;
                                    gap: 4px;
                                    opacity: 0;
                                    transition: opacity 0.2s;
                                    pointer-events: none;
                                }
                                body > *:not(script):not(style):hover > .vibestack-remix-btn {
                                    opacity: 1;
                                }
                                body > *:not(script):not(style) {
                                    position: relative;
                                    border: 2px solid transparent;
                                    transition: border-color 0.2s;
                                }
                                body > *:not(script):not(style):hover {
                                    border-color: rgba(99, 102, 241, 0.3);
                                }
                                body > *:not(script):not(style) *:hover > .vibestack-copy-btn-group {
                                    opacity: 1;
                                    pointer-events: auto;
                                }
                                .vibestack-editable-text {
                                    position: relative;
                                    border: 1px dashed transparent;
                                    transition: border-color 0.2s;
                                }
                                .vibestack-editable-text:hover {
                                    border-color: rgba(16, 185, 129, 0.3);
                                }
                            </style>
                        `;
                            html = html.replace('</head>', `${remixStyles}</head>`);

                            // Inject Remix Script
                            const remixScript = `
                            <script>
                                document.addEventListener('DOMContentLoaded', () => {
                                    // Restore scroll position if it exists
                                    const savedScroll = sessionStorage.getItem('vibestack_preview_scroll');
                                    if (savedScroll) {
                                        window.scrollTo(0, parseInt(savedScroll));
                                        sessionStorage.removeItem('vibestack_preview_scroll');
                                    }

                                    // Helper to save scroll position
                                    const saveScroll = () => {
                                        sessionStorage.setItem('vibestack_preview_scroll', window.scrollY.toString());
                                    };

                                    // Remix Logic
                                    const children = Array.from(document.body.children).filter(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE');
                                    children.forEach((container, index) => {
                                        if (container.classList.contains('vibestack-remix-btn')) return;

                                        const btn = document.createElement('button');
                                        btn.className = 'vibestack-remix-btn';
                                        btn.innerText = '✨ Remix';
                                        btn.onclick = (e) => {
                                            e.stopPropagation();
                                            saveScroll(); // Save scroll before action
                                            window.parent.postMessage({
                                                type: 'REMIX_REQUEST',
                                                html: container.outerHTML,
                                                index: index
                                            }, '*');
                                        };
                                        
                                        const style = window.getComputedStyle(container);
                                        if (style.position === 'static') {
                                            container.style.position = 'relative';
                                        }
                                        
                                        container.appendChild(btn);
                                    });

                                    // Copy Doctor Logic
                                    const textElements = Array.from(document.body.querySelectorAll('h1, h2, h3, p, li, button, a, span, div'))
                                        .filter(el => {
                                            // Exclude our own UI buttons
                                            if (el.classList.contains('vibestack-remix-btn') || el.classList.contains('vibestack-copy-btn-group')) return false;
                                            
                                            // Only select leaf nodes or nodes with only text
                                            return el.children.length === 0 && el.textContent.trim().length > 0;
                                        });

                                    textElements.forEach((el, index) => {
                                        el.classList.add('vibestack-editable-text');
                                        
                                        const btnGroup = document.createElement('div');
                                        btnGroup.className = 'vibestack-copy-btn-group';
                                        
                                        const createBtn = (text, onClick, color) => {
                                            const btn = document.createElement('button');
                                            btn.innerText = text;
                                            btn.style.cssText = 'background: ' + color + '; color: white; border: none; padding: 4px 8px; border-radius: 12px; font-family: sans-serif; font-size: 10px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); pointer-events: auto;';
                                            btn.onclick = (e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                saveScroll(); // Save scroll before action
                                                onClick();
                                            };
                                            return btn;
                                        };

                                        const undoBtn = createBtn('↩', () => {
                                            window.parent.postMessage({ type: 'UNDO_REQUEST' }, '*');
                                        }, '#6366f1');

                                        const polishBtn = createBtn('✎ Polish', () => {
                                            window.parent.postMessage({
                                                type: 'COPY_REQUEST',
                                                text: el.innerText,
                                                index: index,
                                                tagName: el.tagName.toLowerCase()
                                            }, '*');
                                        }, '#10b981');

                                        const redoBtn = createBtn('↪', () => {
                                            window.parent.postMessage({ type: 'REDO_REQUEST' }, '*');
                                        }, '#8b5cf6');

                                        btnGroup.appendChild(undoBtn);
                                        btnGroup.appendChild(polishBtn);
                                        btnGroup.appendChild(redoBtn);
                                        
                                        const style = window.getComputedStyle(el);
                                        if (style.position === 'static') {
                                            el.style.position = 'relative';
                                        }
                                        
                                        el.appendChild(btnGroup);
                                    });
                                });
                            </script>
                        `;
                            html = html.replace('</body>', `${remixScript}</body>`);

                            return html;
                        })()}
                        className="flex-1 w-full border-0 shadow-2xl"
                        title="Generated Preview"
                    />
                </div >
            </div >
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-theme-accent/5 via-background to-background">
            <div className="w-full max-w-5xl space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        What are we building today?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Describe your dream site or upload a screenshot. We'll handle the code.
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                    <CardContent className="p-0">
                        <div className="w-full">
                            {/* Custom Tab Navigation */}
                            <div className="border-b border-white/10 bg-black/5 px-6 py-4 flex items-center justify-between">
                                <div className="flex bg-black/20 p-1 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setActiveTab("text")}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                            activeTab === "text"
                                                ? "bg-theme-accent text-black shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <Type className="w-4 h-4" />
                                        Text to Website
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("image")}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                            activeTab === "image"
                                                ? "bg-theme-accent text-black shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Screenshot Remix
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 md:p-10 space-y-10">
                                {/* Input Section */}
                                <div className="space-y-4">
                                    {activeTab === "text" ? (
                                        <div className="relative group animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-accent/50 to-purple-500/50 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                                            <Textarea
                                                placeholder="Describe your website... e.g. 'A brutalist portfolio for a photographer with large typography and a dark theme'"
                                                className="relative w-full min-h-[200px] p-6 text-lg md:text-xl bg-background/50 border-white/10 rounded-xl resize-none focus-visible:ring-theme-accent/50 placeholder:text-muted-foreground/50"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono">
                                                {prompt.length} chars
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:bg-white/5 transition-all duration-300 relative group cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={handleImageUpload}
                                                />
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        {imageFile ? (
                                                            <ImageIcon className="w-10 h-10 text-theme-accent" />
                                                        ) : (
                                                            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-theme-accent transition-colors" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-medium">
                                                            {imageFile ? imageFile.name : "Drop your screenshot here"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Supports JPG, PNG, WEBP
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <label className="text-sm font-medium mb-2 block">Additional Instructions</label>
                                                <Input
                                                    placeholder="e.g. Make it dark mode, use Inter font..."
                                                    value={prompt}
                                                    onChange={(e) => setPrompt(e.target.value)}
                                                    className="bg-background/50 border-white/10"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Style Selector */}
                                <div className="space-y-4">
                                    <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                        <Palette className="w-4 h-4" /> Choose a Vibe
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {styles.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setStyle(s.id)}
                                                className={cn(
                                                    "relative p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105",
                                                    style === s.id
                                                        ? "border-theme-accent bg-theme-accent/10 ring-1 ring-theme-accent"
                                                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                )}
                                            >
                                                <div className={cn("w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-black", s.color)}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-sm mb-1">{s.name}</div>
                                                <div className="text-[10px] text-muted-foreground leading-tight">{s.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <Button
                                    className="w-full h-16 text-xl font-bold rounded-xl bg-gradient-to-r from-theme-accent to-purple-500 text-white hover:opacity-90 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)]"
                                    onClick={() => handleGenerate()}
                                    disabled={isGenerating || (activeTab === "text" && !prompt) || (activeTab === "image" && !imageFile)}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="font-mono text-base font-normal min-w-[200px] text-left">
                                                {loadingSteps[loadingStep]}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Wand2 className="w-6 h-6" />
                                            Generate Website
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
