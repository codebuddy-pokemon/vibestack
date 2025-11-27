"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useSession } from "next-auth/react";

export default function PricingPage() {
    const { data: session, status } = useSession();
    const [hoveredPlan, setHoveredPlan] = React.useState<string | null>(null);

    const plans = [
        {
            name: "Hobby",
            price: "$0",
            description: "For side projects and experiments.",
            features: [
                "3 AI generations per month",
                "Basic Text-to-Website",
                "Community support",
                "Vibe Score analysis",
            ],
            notIncluded: [
                "Screenshot Remix",
                "Code Export",
                "Roast My Page",
                "Private projects",
            ],
            cta: "Start for Free",
            popular: false,
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            description: "For developers and designers shipping fast.",
            features: [
                "Unlimited AI generations",
                "Advanced Text-to-Website",
                "Screenshot Remix (Image-to-Code)",
                "Code Export (React + Tailwind)",
                "Roast My Page",
                "Priority support",
            ],
            notIncluded: [
                "Team collaboration",
                "API Access",
            ],
            cta: "Get Pro",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For teams and agencies building at scale.",
            features: [
                "Everything in Pro",
                "Team collaboration",
                "API Access",
                "Custom style models",
                "Dedicated success manager",
                "SLA & Uptime guarantee",
            ],
            notIncluded: [],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">
                            Simple Pricing.
                        </span>
                        <br />
                        <span className="text-theme-accent">No Bullshit.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start for free, upgrade when you're ready to ship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const isPro = plan.popular;
                        const isOtherHovered = hoveredPlan && hoveredPlan !== plan.name && hoveredPlan !== null;

                        // Logic: If this is Pro button, and another button is hovered, turn White.
                        // Otherwise keep default behavior.
                        let buttonClass = "w-full h-12 text-lg font-bold uppercase tracking-widest transition-all duration-300 ";

                        if (isPro) {
                            if (isOtherHovered) {
                                buttonClass += "bg-foreground text-background scale-95 opacity-80";
                            } else {
                                buttonClass += "bg-theme-accent text-black hover:bg-foreground hover:text-background hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]";
                            }
                        } else {
                            buttonClass += "bg-foreground text-background hover:bg-theme-accent hover:text-black hover:scale-105";
                        }

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? "border-theme-accent bg-theme-accent/5"
                                    : "border-border bg-card"
                                    } flex flex-col`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-theme-accent text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {plan.price}
                                        </span>
                                        {plan.period && (
                                            <span className="text-muted-foreground">{plan.period}</span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                                </div>

                                <div className="flex-1 mb-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-theme-accent/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-theme-accent" />
                                                </div>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 opacity-50">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                    <X className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href={
                                    plan.name === "Enterprise"
                                        ? "mailto:sales@vibestack.ai"
                                        : (status === "authenticated" && plan.name === "Hobby")
                                            ? "/projects/new"
                                            : `/register?plan=${plan.name.toUpperCase()}`
                                }>
                                    <Button
                                        className={buttonClass}
                                        onMouseEnter={() => setHoveredPlan(plan.name)}
                                        onMouseLeave={() => setHoveredPlan(null)}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-muted-foreground">
                        Trusted by builders at <span className="text-foreground font-bold">Google</span>, <span className="text-foreground font-bold">Meta</span>, and <span className="text-foreground font-bold">Y Combinator</span> startups.
                    </p>
                </div>
            </div>
        </div>
    );
}
