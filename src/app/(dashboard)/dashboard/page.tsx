"use client";

import Link from "next/link";
import { Plus, Flame, Sparkles, Layout, ArrowRight, Activity, Palette, Zap, Upload, Settings, FileCode, ShoppingBag, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoGrid, BentoGridItem } from "@/components/dashboard/bento-grid";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { toast } from "sonner";

const templates = [
    { id: "saas", name: "SaaS Landing", icon: Layout, color: "bg-blue-500/10 text-blue-500" },
    { id: "portfolio", name: "Portfolio", icon: User, color: "bg-purple-500/10 text-purple-500" },
    { id: "ecommerce", name: "E-commerce", icon: ShoppingBag, color: "bg-green-500/10 text-green-500" },
    { id: "agency", name: "Agency", icon: Briefcase, color: "bg-orange-500/10 text-orange-500" },
    { id: "docs", name: "Documentation", icon: FileCode, color: "bg-pink-500/10 text-pink-500" },
];

export default function DashboardPage() {
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.vibestack';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                // Simulate import delay
                setTimeout(() => {
                    toast.success(`Successfully imported project: ${file.name}`);
                }, 1000);
            }
        };
        input.click();
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-accent/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 max-w-7xl mx-auto py-12 px-4 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <DashboardHeader />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/10"
                            onClick={handleImport}
                        >
                            <Upload className="w-4 h-4 mr-2" /> Import
                        </Button>
                        <Link href="/settings">
                            <Button variant="outline" size="sm" className="rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/10">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-muted-foreground">Start from a Template</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {templates.map((template, i) => (
                            <Link key={template.id} href={`/projects/new?template=${template.id}`}>
                                <button
                                    className="flex items-center gap-3 p-3 pr-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap group"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${template.color} group-hover:scale-110 transition-transform`}>
                                        <template.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">{template.name}</span>
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    {/* New Project - Hero Card */}
                    <BentoGridItem
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-theme-accent/20 to-transparent border-theme-accent/20"
                        title={<span className="text-2xl">Create New Project</span>}
                        description={
                            <span className="text-base text-muted-foreground">
                                Turn your ideas into production-ready code. Start from a text prompt or remix a screenshot.
                            </span>
                        }
                        header={
                            <Link href="/projects/new" className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-theme-accent/10 to-transparent border border-theme-accent/10 items-center justify-center group/header overflow-hidden relative">
                                <div className="absolute inset-0 bg-theme-accent/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />
                                <div className="w-20 h-20 rounded-full bg-theme-accent/20 flex items-center justify-center group-hover/header:scale-110 transition-transform duration-300 relative z-10">
                                    <Plus className="w-10 h-10 text-theme-accent" />
                                </div>
                            </Link>
                        }
                        icon={<Layout className="h-4 w-4 text-theme-accent" />}
                    />

                    {/* Roast My Page */}
                    <Link href="/roast" className="contents">
                        <BentoGridItem
                            title="Roast My Page"
                            description="Get brutal, honest AI feedback on your UI/UX."
                            header={
                                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/10 items-center justify-center group/header">
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center group-hover/header:scale-110 transition-transform duration-300">
                                        <Flame className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>
                            }
                            icon={<Flame className="h-4 w-4 text-red-500" />}
                        />
                    </Link>

                    {/* Vibe Check */}
                    <Link href="/vibe-check" className="contents">
                        <BentoGridItem
                            title="Vibe Check"
                            description="Analyze the aesthetic and feel of your design."
                            header={
                                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10 items-center justify-center group/header">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover/header:scale-110 transition-transform duration-300">
                                        <Sparkles className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>
                            }
                            icon={<Sparkles className="h-4 w-4 text-purple-500" />}
                        />
                    </Link>

                    {/* Brand Match */}
                    <Link href="/brand-match" className="contents">
                        <BentoGridItem
                            title="Brand Match"
                            description="Extract design tokens from your logo."
                            header={
                                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 items-center justify-center group/header">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover/header:scale-110 transition-transform duration-300">
                                        <Palette className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            }
                            icon={<Palette className="h-4 w-4 text-blue-500" />}
                        />
                    </Link>

                    {/* Heatmap */}
                    <Link href="/heatmap" className="contents">
                        <BentoGridItem
                            title="AI Heatmap"
                            description="Predict user attention hotspots."
                            header={
                                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/10 items-center justify-center group/header">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center group-hover/header:scale-110 transition-transform duration-300">
                                        <Activity className="w-6 h-6 text-orange-500" />
                                    </div>
                                </div>
                            }
                            icon={<Activity className="h-4 w-4 text-orange-500" />}
                        />
                    </Link>
                </BentoGrid>

                {/* Recent Projects Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Layout className="w-6 h-6 text-muted-foreground" />
                            Recent Projects
                        </h2>
                        <Button variant="outline" size="sm" className="rounded-full">View All</Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Empty State Placeholder - Modernized */}
                        <div className="col-span-full p-12 border border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/10 transition-colors duration-300 group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-md">
                                Your dashboard is looking a bit empty. Start your first project to see it appear here.
                            </p>
                            <Link href="/projects/new">
                                <Button className="rounded-full px-8 bg-foreground text-background hover:bg-theme-accent hover:text-black transition-colors">
                                    Create First Project <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
