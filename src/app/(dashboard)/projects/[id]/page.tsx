import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Preview } from "@/components/editor/preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Share2, Download, Code, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DownloadButton } from "@/components/DownloadButton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Project {
    id: string
    name: string
    html: string
    css: string
}

export default function EditorPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${params.id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch project")
                }
                const data = await response.json()
                setProject(data)
            } catch (error) {
                console.error(error)
                toast.error("Failed to load project")
                router.push("/dashboard")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProject()
        }
    }, [params.id, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="animate-pulse text-theme-accent">Loading Vibe...</div>
            </div>
        )
    }

    if (!project) return null

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-white">
            {/* Editor Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold uppercase tracking-wider">{project.name}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => setViewMode(viewMode === "preview" ? "code" : "preview")}
                    >
                        {viewMode === "preview" ? <Code className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {viewMode === "preview" ? "View Code" : "View Preview"}
                    </Button>

                    <DownloadButton html={project.html} css={project.css} projectName={project.name} />

                    <Button className="bg-theme-accent text-black hover:bg-[#b3e600] font-bold">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-6 bg-[#0a0a0a]">
                <div className="w-full h-full max-w-[1600px] mx-auto">
                    {viewMode === "preview" ? (
                        <Preview html={project.html} css={project.css} />
                    ) : (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="h-full flex flex-col">
                                <div className="bg-white/5 px-4 py-2 text-xs font-mono text-muted-foreground border-b border-white/10">HTML</div>
                                <textarea
                                    className="flex-1 bg-[#111] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                                    readOnly
                                    value={project.html}
                                />
                            </div>
                            <div className="h-full flex flex-col">
                                <div className="bg-white/5 px-4 py-2 text-xs font-mono text-muted-foreground border-b border-white/10">CSS</div>
                                <textarea
                                    className="flex-1 bg-[#111] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                                    readOnly
                                    value={project.css}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
