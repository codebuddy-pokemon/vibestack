"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Minus, Square, X } from "lucide-react";

const styles = [
    {
        id: "cyberpunk",
        name: "CYBERPUNK",
        bg: "bg-black",
        border: "border-2 border-yellow-400",
        header: "bg-yellow-400 text-black",
        font: "font-mono",
        content: (
            <div className="h-full flex flex-col justify-between p-4 text-yellow-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                <div className="flex justify-between items-start z-10">
                    <div className="text-xs font-bold tracking-widest animate-pulse">SYSTEM_READY</div>
                    <div className="text-xs">V.2077</div>
                </div>
                <div className="z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 glitch-text">WAKE UP_</h3>
                    <button className="px-4 py-2 bg-cyan-500 text-black font-bold uppercase hover:bg-white transition-colors skew-x-[-10deg]">
                        Jack In
                    </button>
                </div>
            </div>
        ),
    },
    {
        id: "90s",
        name: "Windows 95",
        bg: "bg-[#c0c0c0]",
        border: "border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 shadow-[2px_2px_0px_#000]",
        header: "bg-[#000080] text-white px-2 py-1 flex items-center justify-between",
        font: "font-sans",
        content: (
            <div className="h-full p-4 flex flex-col justify-center items-center text-black font-serif">
                <div className="bg-white border-2 border-gray-500 border-t-black border-l-black border-b-white border-r-white p-4 w-full text-center shadow-[inset_2px_2px_0px_#000]">
                    <h3 className="text-xl font-bold mb-2">Welcome to the Web</h3>
                    <p className="text-sm mb-4">Under Construction</p>
                    <button className="px-4 py-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black bg-[#c0c0c0] active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
                        Click Me
                    </button>
                </div>
            </div>
        ),
    },
    {
        id: "swiss",
        name: "Swiss Style",
        bg: "bg-[#f0f0f0] dark:bg-zinc-900",
        border: "border-4 border-black dark:border-theme-accent",
        header: "hidden",
        font: "font-sans",
        content: (
            <div className="h-full p-6 flex flex-col justify-between relative overflow-hidden" style={{ color: 'var(--theme-accent)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20" />
                <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="border-r-2 pr-4 flex flex-col justify-between" style={{ borderColor: 'var(--theme-accent)' }}>
                        <h3 className="text-4xl font-black tracking-tighter leading-none">LESS<br />IS<br />MORE</h3>
                        <div className="w-8 h-8 bg-red-600 rounded-full" />
                    </div>
                    <div className="flex flex-col justify-end">
                        <p className="text-sm font-bold uppercase tracking-widest mb-2">Helvetica</p>
                        <p className="text-xs leading-relaxed">Form follows function. The grid is the master.</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "clay",
        name: "Claymorphism",
        bg: "bg-blue-50 dark:bg-slate-900",
        border: "border-none shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] dark:shadow-[20px_20px_60px_#0f172a,-20px_-20px_60px_#1e293b] rounded-3xl",
        header: "hidden",
        font: "font-sans",
        content: (
            <div className="h-full p-6 flex flex-col justify-center items-center text-slate-600 dark:text-slate-200">
                <div className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0f172a,-8px_-8px_16px_#1e293b]">
                    <h3 className="text-2xl font-bold mb-2 text-slate-700 dark:text-slate-100">Float On</h3>
                    <p className="text-sm mb-4">Soft, airy, and light.</p>
                    <button className="w-full py-3 rounded-xl bg-blue-400 text-white font-bold shadow-[4px_4px_8px_#b8c5d6,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#1e293b] hover:scale-95 transition-transform">
                        Soft Touch
                    </button>
                </div>
            </div>
        ),
    },
];

export const StyleRouletteTile = () => {
    const [index, setIndex] = React.useState(0);
    const [isSpinning, setIsSpinning] = React.useState(false);
    const currentStyle = styles[index];

    const spin = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSpinning(true);
        setIndex((prev) => (prev + 1) % styles.length);
        setTimeout(() => setIsSpinning(false), 500);
    };

    return (
        <motion.div
            className="md:col-span-2 row-span-1 block h-full relative group cursor-pointer overflow-hidden transition-all duration-500 bg-card border border-border hover:border-theme-accent hover:shadow-[var(--glow-md)]"
            onClick={spin}
            whileHover={{ y: -4 }}
            layout
        >
            {/* Inner content with style-specific backgrounds */}
            <div className={`w-full h-full relative overflow-hidden ${currentStyle.bg} ${currentStyle.border} border`}>
                {/* Browser Header (Conditional) */}
                {currentStyle.id !== "swiss" && currentStyle.id !== "clay" && (
                    <div className={`w-full h-8 ${currentStyle.header} flex items-center px-2 gap-2`}>
                        {currentStyle.id === "90s" ? (
                            <>
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 bg-white border border-gray-500 flex items-center justify-center"><Minus className="w-3 h-3 text-black" /></div>
                                    <div className="w-4 h-4 bg-white border border-gray-500 flex items-center justify-center"><Square className="w-2 h-2 text-black" /></div>
                                    <div className="w-4 h-4 bg-white border border-gray-500 flex items-center justify-center"><X className="w-3 h-3 text-black" /></div>
                                </div>
                                <span className="text-xs font-bold">Netscape Navigator</span>
                            </>
                        ) : (
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                        )}
                    </div>
                )}

                {/* Content Area */}
                <div className="h-[calc(100%-2rem)] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStyle.id}
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${currentStyle.font}`}
                        >
                            {currentStyle.content}
                        </motion.div>
                    </AnimatePresence>

                    {/* Spin Button (Floating) */}
                    <button
                        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-20 border ${currentStyle.id === 'cyberpunk' ? 'bg-zinc-900 border-yellow-400' :
                                currentStyle.id === '90s' ? 'bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2' :
                                    currentStyle.id === 'swiss' ? 'bg-white border-black' :
                                        'bg-white border-white/20'
                            }`}
                        onClick={spin}
                    >
                        <RefreshCw className={`w-5 h-5 ${currentStyle.id === 'cyberpunk' ? 'text-yellow-400' :
                                currentStyle.id === '90s' ? 'text-black' :
                                    currentStyle.id === 'swiss' ? 'text-black' :
                                        'text-slate-600'
                            } ${isSpinning ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
