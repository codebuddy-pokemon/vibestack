"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}

const FAQItem = ({ question, answer, isOpen, onClick, index }: FAQItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "border border-border rounded-lg overflow-hidden transition-all duration-300",
                isOpen ? "bg-card/50 border-theme-accent" : "bg-card hover:border-theme-accent/50"
            )}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-center justify-between text-left group"
            >
                <span className={cn(
                    "font-bold text-lg transition-colors duration-300",
                    isOpen ? "text-theme-accent" : "text-foreground group-hover:text-theme-accent"
                )}>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "text-muted-foreground transition-colors duration-300",
                        isOpen ? "text-theme-accent" : "group-hover:text-theme-accent"
                    )}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-4 text-muted-foreground">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface FAQAccordionProps {
    items: {
        q: string;
        a: string;
    }[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div ref={containerRef} className="max-w-3xl mx-auto space-y-4">
            {items.map((item, index) => (
                <FAQItem
                    key={index}
                    index={index}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
}
