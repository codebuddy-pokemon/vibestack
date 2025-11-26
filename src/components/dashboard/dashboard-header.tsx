"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function DashboardHeader() {
    const [greeting, setGreeting] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");

        setDate(new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        }));
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            >
                {date}
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight"
            >
                {greeting}, Builder <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
            </motion.h1>
        </div>
    );
}
