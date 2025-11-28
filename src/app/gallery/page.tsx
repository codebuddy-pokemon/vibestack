"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Share2, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const staticProjects = [
    {
        id: 1,
        title: "SaaS Landing Page",
        author: "vibestack_team",
        image: "/gallery/saas-landing.png",
        tags: ["SaaS", "Conversion", "Clean"],
        likes: 342,
    },
    {
        id: 2,
        title: "Mobile App Showcase",
        author: "vibestack_team",
        image: "/gallery/mobile-app.png",
        tags: ["Mobile", "App", "Modern"],
        likes: 289,
    },
    {
        id: 3,
        title: "Agency Portfolio",
        author: "vibestack_team",
        image: "/gallery/agency-portfolio.png",
        tags: ["Agency", "Portfolio", "Professional"],
        likes: 215,
    },
    {
        id: 4,
        title: "E-book Launch",
        author: "vibestack_team",
        image: "/gallery/ebook-launch.png",
        tags: ["Marketing", "Product", "Bold"],
        likes: 198,
    },
    {
        id: 5,
        title: "Webinar Registration",
        author: "vibestack_team",
        image: "/gallery/webinar-reg.png",
        tags: ["Event", "Registration", "Focus"],
        likes: 176,
    },
    {
        id: 6,
        title: "Neon SaaS Dashboard",
        author: "alex_dev",
        image: "/gallery/neon-dashboard.png",
        tags: ["SaaS", "Dark Mode", "Modern"],
        likes: 124,
    },
    {
        id: 7,
        title: "Brutalist Portfolio",
        author: "sarah_design",
        image: "/gallery/brutalist-portfolio.png",
        tags: ["Portfolio", "Neo-Brutalism", "Bold"],
        likes: 89,
    },
    {
        id: 8,
        title: "Eco E-commerce",
        author: "green_life",
        image: "https://placehold.co/800x600/1a4d2e/fff?text=Eco+Store",
        tags: ["E-commerce", "Minimal", "Clean"],
        likes: 56,
    },
    {
        id: 9,
        title: "AI Startup Landing",
        author: "tech_guru",
        image: "https://placehold.co/800x600/2a0a4d/00ffff?text=AI+Startup",
        tags: ["Startup", "Futuristic", "Gradient"],
        likes: 210,
    },
];

export default function GalleryPage() {
    const [projects, setProjects] = React.useState(staticProjects);

    React.useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem("vibestack_gallery_projects") || "[]");
        if (savedProjects.length > 0) {
            setProjects([...savedProjects, ...staticProjects]);
        }
    }, []);

    const handleDelete = (id: number) => {
        const updatedProjects = projects.filter(p => p.id !== id);
        setProjects(updatedProjects);

        const savedProjects = JSON.parse(localStorage.getItem("vibestack_gallery_projects") || "[]");
        const newSavedProjects = savedProjects.filter((p: any) => p.id !== id);
        localStorage.setItem("vibestack_gallery_projects", JSON.stringify(newSavedProjects));

        toast.success("Project deleted from gallery");
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">
                                Community
                            </span>
                            <br />
                            <span className="text-theme-accent">Showcase.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Discover what others are building with VibeStack.
                        </p>
                    </div>
                    <Link href="/projects/new">
                        <Button className="h-14 px-8 bg-theme-accent text-black font-bold uppercase tracking-widest hover:bg-foreground hover:text-background hover:scale-105 transition-all duration-300">
                            Submit Your Design
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-theme-accent transition-colors duration-300"
                        >
                            {/* Image Container */}
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    <Button size="icon" variant="secondary" className="rounded-full">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="rounded-full">
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </div>
                                {project.author === "You" && (
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(project.id);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                                        <p className="text-sm text-muted-foreground">by @{project.author}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Heart className="w-4 h-4 fill-current text-theme-accent" />
                                        <span>{project.likes}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded border border-border"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
