"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Shield, User, Monitor, Moon, Sun, Laptop, Key, CreditCard, Zap } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("sk_live_****************************")
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [usageData, setUsageData] = useState<{ plan: string, usage: number, limit: number } | null>(null)

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const res = await fetch("/api/user/usage")
                if (res.ok) {
                    const data = await res.json()
                    setUsageData(data)
                }
            } catch (error) {
                console.error("Failed to fetch usage", error)
            }
        }
        fetchUsage()
    }, [])

    const handleSave = () => {
        toast.success("Settings saved successfully")
    }

    const handlePortal = async () => {
        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to open portal");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg">Appearance</TabsTrigger>
                    <TabsTrigger value="subscription" className="rounded-lg">Subscription</TabsTrigger>
                    <TabsTrigger value="api" className="rounded-lg">API & Security</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" /> Profile Information
                            </CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input id="name" defaultValue="Bilal Hamza" className="bg-background/50 border-white/10" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="bilal@example.com" className="bg-background/50 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" /> Notifications
                            </CardTitle>
                            <CardDescription>Configure how you receive alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about your project activity.</p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive news and updates from VibeStack.</p>
                                </div>
                                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="w-5 h-5" /> Theme Preferences
                            </CardTitle>
                            <CardDescription>Customize the look and feel of the dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-background/50 hover:bg-theme-accent/10 hover:border-theme-accent transition-all">
                                <Sun className="w-8 h-8" />
                                <span className="font-medium">Light</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-theme-accent bg-theme-accent/10 ring-1 ring-theme-accent transition-all">
                                <Moon className="w-8 h-8" />
                                <span className="font-medium">Dark</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-background/50 hover:bg-theme-accent/10 hover:border-theme-accent transition-all">
                                <Laptop className="w-8 h-8" />
                                <span className="font-medium">System</span>
                            </button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Current Plan
                            </CardTitle>
                            <CardDescription>Manage your subscription and usage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-background/50">
                                <div>
                                    <p className="font-medium">Current Plan</p>
                                    <p className="text-2xl font-bold text-theme-accent">{usageData?.plan || "Loading..."}</p>
                                </div>
                                {usageData?.plan === "FREE" ? (
                                    <Link href="/pricing">
                                        <Button className="bg-theme-accent text-black hover:bg-theme-accent/90">
                                            Upgrade to Pro <Zap className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button onClick={handlePortal} variant="outline" className="border-white/20">
                                        Manage Subscription
                                    </Button>
                                )}
                            </div>

                            {usageData && usageData.plan === "FREE" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Monthly Usage</span>
                                        <span className="text-muted-foreground">{usageData.usage} / {usageData.limit} Projects</span>
                                    </div>
                                    <Progress value={(usageData.usage / usageData.limit) * 100} className="h-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Free plan includes {usageData.limit} AI generations per month.
                                    </p>
                                </div>
                            )}

                            {usageData && usageData.plan !== "FREE" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Monthly Usage</span>
                                        <span className="text-muted-foreground">{usageData.usage} Projects</span>
                                    </div>
                                    <Progress value={100} className="h-2 bg-theme-accent/20" />
                                    <p className="text-xs text-muted-foreground">
                                        You have unlimited access! 🚀
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5" /> API Keys
                            </CardTitle>
                            <CardDescription>Manage your API keys for external access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="api-key">Live Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="api-key"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="bg-background/50 border-white/10 font-mono"
                                        type="password"
                                    />
                                    <Button variant="outline" onClick={() => toast.success("Key copied to clipboard")}>Copy</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Never share your API key with anyone.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-theme-accent text-black hover:bg-theme-accent/90">
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
