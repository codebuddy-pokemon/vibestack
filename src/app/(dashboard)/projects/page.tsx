"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout, Zap, ArrowRight, Loader2 } from "lucide-react";
import { ProjectThumbnail } from "@/components/dashboard/project-thumbnail";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto py-12 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and view all your generated websites.
                    </p>
                </div>
                <Link href="/projects/new">
                    <Button className="bg-theme-accent text-black hover:bg-theme-accent/90">
                        <Zap className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                    projects.map((project: any) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                            <div className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-theme-accent/50 transition-all duration-300">
                                {project.html ? (
                                    <ProjectThumbnail html={project.html} css={project.css} title={project.name} />
                                ) : (
                                    project.inputData && !project.inputData.startsWith("http") ? (
                                        <div className="absolute inset-0 bg-gradient-to-br from-theme-accent/5 to-purple-500/5" />
                                    ) : (
                                        <img
                                            src={project.inputData || "https://placehold.co/600x400/1a1a1a/666?text=Project"}
                                            alt={project.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                                        />
                                    )
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-lg font-bold text-white group-hover:text-theme-accent transition-colors truncate">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-300 line-clamp-1">
                                        {project.description || "No description"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/5">
                                            {project.styleType || "Modern"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full p-12 border border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center bg-muted/5">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Zap className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                            Start your first project to see it appear here.
                        </p>
                        <Link href="/projects/new">
                            <Button className="rounded-full px-8 bg-foreground text-background hover:bg-theme-accent hover:text-black transition-colors">
                                Create First Project <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
