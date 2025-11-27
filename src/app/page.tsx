"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Layout,
  Code,
  Sparkles,
  Upload,
  Wand2,
  Globe,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import dynamic from "next/dynamic";

const HeroSplineBackground = dynamic(
  () => import("@/components/ui/hero-spline").then((mod) => mod.HeroSplineBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-background" />,
  }
);
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { StyleRouletteTile } from "@/components/ui/style-roulette-tile";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const TerminalEffect = () => {
  const [completedLines, setCompletedLines] = React.useState<string[]>([]);
  const [currentText, setCurrentText] = React.useState("");
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);

  const commands = React.useMemo(() => [
    "analyzing prompt...",
    "generating layout...",
    "applying styles...",
    "optimizing assets...",
    "done."
  ], []);

  React.useEffect(() => {
    if (lineIndex >= commands.length) {
      const timeout = setTimeout(() => {
        setCompletedLines([]);
        setCurrentText("");
        setLineIndex(0);
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const currentCommand = commands[lineIndex];

    if (charIndex < currentCommand.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentCommand.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCompletedLines(prev => [...prev, currentCommand]);
        setCurrentText("");
        setCharIndex(0);
        setLineIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, commands]);

  return (
    <div className="bg-muted p-4 rounded border border-border font-mono text-sm text-muted-foreground opacity-80 group-hover:opacity-100 transition-opacity min-h-[100px]">
      {completedLines.map((line, i) => (
        <div key={i}>
          <span className="text-theme-accent mr-2">{">"}</span>
          {line}
        </div>
      ))}
      {lineIndex < commands.length && (
        <div>
          <span className="text-theme-accent mr-2">{">"}</span>
          {currentText}
          <span className="animate-pulse">_</span>
        </div>
      )}
    </div>
  );
};





const BrandDNATile = () => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [extractedColors, setExtractedColors] = React.useState([
    { color: "bg-black", opacity: 0 },
    { color: "bg-white", opacity: 0 },
    { color: "bg-theme-accent", opacity: 0 },
  ]);

  React.useEffect(() => {
    // Auto-scan on mount
    const timer = setTimeout(() => {
      setIsScanning(true);
      // Reveal colors one by one
      setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 0 ? { ...c, opacity: 1 } : c)), 600);
      setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 1 ? { ...c, opacity: 1 } : c)), 1000);
      setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 2 ? { ...c, opacity: 1 } : c)), 1400);
      setTimeout(() => setIsScanning(false), 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleHover = () => {
    setIsScanning(true);
    setExtractedColors([
      { color: "bg-black", opacity: 0 },
      { color: "bg-white", opacity: 0 },
      { color: "bg-theme-accent", opacity: 0 },
    ]);
    setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 0 ? { ...c, opacity: 1 } : c)), 300);
    setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 1 ? { ...c, opacity: 1 } : c)), 600);
    setTimeout(() => setExtractedColors(prev => prev.map((c, i) => i === 2 ? { ...c, opacity: 1 } : c)), 900);
    setTimeout(() => setIsScanning(false), 1200);
  };

  return (
    <Link href="/brand-match" className="md:col-span-1 row-span-1 block">
      <motion.div
        variants={item}
        className="h-full bg-card border border-border hover:border-theme-accent relative group overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[var(--glow-md)]"
        whileHover={{ y: -4 }}
        onHoverStart={handleHover}
      >
        <div className="p-8 h-full flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <div className="relative w-12 h-12">
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-theme-accent blur-md z-0"
                animate={{ opacity: isScanning ? [0.3, 0.6, 0.3] : 0.3 }}
                transition={{ duration: 0.8, repeat: isScanning ? Infinity : 0 }}
              />

              {/* Logo */}
              <motion.div
                className="w-12 h-12 bg-white flex items-center justify-center shadow-lg relative z-10"
                animate={isScanning ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl font-black text-black">B.</span>
              </motion.div>

              {/* Scanning beam */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-theme-accent shadow-[0_0_10px_var(--theme-accent)] z-20"
                animate={{
                  top: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Scan lines */}
              {isScanning && (
                <>
                  <motion.div
                    className="absolute left-0 w-full h-px bg-theme-accent/50 z-20"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute left-0 w-full h-px bg-theme-accent/30 z-20"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 1.2, delay: 0.1, ease: "linear" }}
                  />
                </>
              )}
            </div>

            {/* Extracted Palette */}
            <div className="flex flex-col gap-1">
              {extractedColors.map((item, i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-6 rounded-full ${item.color} ${item.color === "bg-black" ? "border border-white/20" :
                    item.color === "bg-white" ? "border border-black/10" :
                      "border border-white/20"
                    }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: item.opacity === 1 ? 1 : 0,
                    opacity: item.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-theme-accent transition-colors duration-300">
              Brand DNA
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload a logo. Get colors, fonts, vibes.
            </p>
          </div>
        </div>

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />

        {/* Scan progress indicator */}
        {isScanning && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-theme-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "linear" }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const gridY = useTransform(scrollY, [0, 1000], [0, -500]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-theme-accent selection:text-black overflow-x-hidden font-sans">


      {/* 3D Background */}
      <HeroSplineBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto pointer-events-none">

        {/* Hero Section */}
        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 pointer-events-none"
        >
          <h1 className="w-fit mx-auto md:mx-0 text-[10vw] leading-[0.85] font-black tracking-tighter uppercase text-center md:text-left pointer-events-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">Generate.</span>
            <span className="block text-theme-accent">Remix.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">Deploy.</span>
          </h1>
          <div className="w-full mx-auto md:mx-0 mt-8 flex flex-col gap-6 items-start pointer-events-none">
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light leading-tight text-center md:text-left">
              The AI-powered landing page builder that passes the vibe check.
              Turn text, screenshots, or sketches into production code instantly.
            </p>
            <div className="w-full max-w-2xl pointer-events-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const prompt = formData.get('prompt');
                  if (prompt) {
                    window.location.href = `/projects/new?prompt=${encodeURIComponent(prompt.toString())}`;
                  }
                }}
                className="relative flex items-center group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-theme-accent/30 to-purple-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <input
                  name="prompt"
                  type="text"
                  placeholder="Describe your dream site..."
                  className="w-full h-20 pl-8 pr-48 rounded-2xl border-2 border-white/10 bg-background/60 backdrop-blur-xl text-xl md:text-2xl font-medium focus:outline-none focus:border-theme-accent/50 focus:ring-0 shadow-2xl transition-all duration-300 placeholder:text-muted-foreground/50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 px-8 bg-theme-accent text-black text-lg font-bold uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300"
                >
                  Generate
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground font-mono pl-2">
                <span className="opacity-50">Try:</span>
                <button type="button" className="hover:text-theme-accent transition-colors border-b border-transparent hover:border-theme-accent" onClick={(e) => {
                  const input = document.querySelector('input[name="prompt"]') as HTMLInputElement;
                  if (input) input.value = "A portfolio for a sushi chef";
                }}>"A portfolio for a sushi chef"</button>
                <span className="opacity-50">•</span>
                <button type="button" className="hover:text-theme-accent transition-colors border-b border-transparent hover:border-theme-accent" onClick={(e) => {
                  const input = document.querySelector('input[name="prompt"]') as HTMLInputElement;
                  if (input) input.value = "Cyberpunk crypto exchange";
                }}>"Cyberpunk crypto exchange"</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[350px] pointer-events-auto"
        >

          {/* Feature 1: Text to Site (Large) */}
          <Link href="/projects/new" className="md:col-span-2 lg:col-span-2 row-span-1 block">
            <motion.div
              variants={item}
              className="h-full relative group overflow-hidden bg-card border border-border hover:border-theme-accent transition-all duration-500 cursor-pointer hover:shadow-[var(--glow-md)]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-background to-transparent opacity-50" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div>
                  <div className="w-12 h-12 bg-theme-accent/10 rounded-full flex items-center justify-center mb-4 text-theme-accent group-hover:scale-110 group-hover:shadow-[var(--glow-sm)] transition-all duration-300">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 tracking-tight group-hover:text-theme-accent transition-colors duration-300">Text to Website</h3>
                  <p className="text-muted-foreground">Just describe it. We'll build it. <br />"A brutalist portfolio for a photographer..."</p>
                </div>
                <TerminalEffect />
              </div>
            </motion.div>
          </Link>

          {/* Feature 2: Screenshot to Code */}
          <Link href="/projects/new?tab=screenshot" className="md:col-span-1 row-span-1 block">
            <motion.div
              variants={item}
              className="h-full relative group overflow-hidden bg-card border border-border hover:border-theme-accent transition-all duration-500 cursor-pointer hover:shadow-[var(--glow-md)]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <Upload className="w-8 h-8 text-foreground group-hover:text-theme-accent transition-colors duration-300" />
                  <span className="text-xs font-mono border border-border px-2 py-1 rounded text-muted-foreground">BETA</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-theme-accent transition-colors duration-300">Screenshot Remix</h3>
                  <p className="text-muted-foreground text-sm">See a design you love? Upload it. We'll recreate it.</p>
                </div>
              </div>
              {/* Abstract visual */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-foreground/5 rounded-full blur-3xl group-hover:bg-theme-accent/20 transition-colors duration-500" />
            </motion.div>
          </Link>

          {/* Feature 3: Vibe Score */}
          <Link href="/vibe-check" className="md:col-span-1 lg:col-span-1 row-span-1 block">
            <motion.div
              variants={item}
              className="h-full bg-theme-accent text-black relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <Sparkles className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                <div>
                  <div className="text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-300 inline-block">
                    98<span className="text-2xl align-top opacity-50">%</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest group-hover:tracking-[0.3em] transition-all duration-300">Vibe Score</h3>
                </div>
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply group-hover:opacity-20 transition-opacity duration-300" />
              {/* Animated glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-white/20 group-hover:to-white/10 transition-all duration-500" />
            </motion.div>
          </Link>

          {/* Feature 4: Code Export (Tall) */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-1 md:row-span-2 bg-card border border-border hover:border-theme-accent relative group overflow-hidden transition-all duration-500 hover:shadow-[var(--glow-md)]"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
            <div className="p-8 h-full flex flex-col relative z-20">
              <Code className="w-8 h-8 text-theme-accent mb-auto group-hover:scale-110 group-hover:shadow-[var(--glow-sm)] transition-all duration-300" />
              <div className="mt-auto">
                <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:text-theme-accent transition-colors duration-300">Clean Code</h3>
                <p className="text-muted-foreground text-sm mb-6">React, Next.js, Tailwind. Copy, paste, ship.</p>
                <div className="space-y-2 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-theme-accent" />
                    <span>page.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>components/</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>lib/utils.ts</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 5: Roast My Page */}
          <Link href="/roast" className="md:col-span-2 lg:col-span-2 row-span-1 block">
            <motion.div
              variants={item}
              className="h-full bg-card border border-border hover:border-theme-accent relative overflow-hidden group hover:bg-muted transition-all duration-500 cursor-pointer hover:shadow-[var(--glow-md)]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-8 h-full flex flex-row items-center justify-between relative z-10">
                <div className="max-w-md">
                  <h3 className="text-3xl font-bold mb-2 tracking-tight text-foreground group-hover:text-theme-accent transition-colors duration-300">Roast My Page 🔥</h3>
                  <p className="text-muted-foreground">Brutally honest AI feedback. No sugar-coating.</p>
                </div>
                <div className="hidden md:block">
                  <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
                    Get Roasted
                  </Button>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Feature 6: Styles */}
          <Link href="/projects/new" className="md:col-span-1 row-span-1 block">
            <motion.div
              variants={item}
              className="h-full bg-card border border-border hover:border-theme-accent relative group overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[var(--glow-md)]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <Palette className="w-8 h-8 text-purple-400 group-hover:text-theme-accent group-hover:rotate-12 transition-all duration-300" />
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-theme-accent transition-colors duration-300">Style Presets</h3>
                  <p className="text-muted-foreground text-sm">Brutalism. Swiss. Glass. One click.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] group-hover:bg-theme-accent/30 transition-colors duration-500" />
            </motion.div>
          </Link>

          {/* Feature 7: Style Roulette (Interactive) */}
          <StyleRouletteTile />

          {/* Feature 8: Brand DNA (Visual) */}
          <BrandDNATile />

        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-10 pointer-events-auto"
        >
          {[
            { label: "Websites Generated", value: "10K+" },
            { label: "Active Developers", value: "2.5K+" },
            { label: "Lines of Code", value: "1M+" },
            { label: "Avg. Build Time", value: "< 30s" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black tracking-tighter text-theme-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof / Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pointer-events-auto"
        >
          <TestimonialsSection
            title="Loved by Builders"
            description="Join thousands of developers who are already building the future with our AI platform"
            testimonials={[
              {
                author: {
                  name: "Emma Thompson",
                  handle: "@emmaai",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
                },
                text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
                href: "https://twitter.com/emmaai"
              },
              {
                author: {
                  name: "David Park",
                  handle: "@davidtech",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
                href: "https://twitter.com/davidtech"
              },
              {
                author: {
                  name: "Sofia Rodriguez",
                  handle: "@sofiaml",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                },
                text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive."
              },
              {
                author: {
                  name: "Alex Chen",
                  handle: "@alexc_dev",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                },
                text: "Shipped my portfolio in 15 minutes. This is insane. The code quality is actually better than what I write manually.",
                href: "https://twitter.com/alexc_dev"
              }
            ]}
          />
        </motion.div>

        {/* Mid-page CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-theme-accent/10 to-transparent border border-theme-accent/30 rounded-2xl p-12 md:p-16 text-center pointer-events-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Stop Designing.<br />Start <span className="text-theme-accent">Shipping.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've ditched Figma for AI-powered instant websites.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-16 px-12 text-xl bg-theme-accent text-black hover:bg-foreground hover:text-background transition-all duration-300 font-bold uppercase tracking-widest rounded-none hover:shadow-[var(--glow-lg)] hover:scale-105"
            >
              Try It Free
            </Button>
          </Link>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pointer-events-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center mb-16">
            <span className="text-theme-accent">FAQ</span>
          </h2>
          <FAQAccordion items={[
            {
              q: "Is the code production-ready?",
              a: "Yes! We generate clean, semantic HTML/CSS and React components with Tailwind. No bloat, no dependencies you don't need.",
            },
            {
              q: "Can I customize the generated code?",
              a: "Absolutely. Download the code and modify it however you want. It's yours. No vendor lock-in.",
            },
            {
              q: "What's the difference between text and screenshot input?",
              a: "Text-to-Website builds from your description. Screenshot Remix recreates existing designs. Both produce production-ready code.",
            },
            {
              q: "Do I need to know how to code?",
              a: "Nope! But if you do, you'll love the clean output. Perfect for both designers and developers.",
            },
          ]} />
        </motion.div>

        {/* Footer / CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center border-t border-border pt-20 pointer-events-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Ready to ship?
          </h2>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-16 px-12 text-xl bg-foreground text-background hover:bg-theme-accent hover:text-black transition-all duration-300 font-bold uppercase tracking-widest rounded-none hover:shadow-[var(--glow-lg)] hover:scale-105"
            >
              Get Started Now
            </Button>
          </Link>
          <div className="mt-12 text-muted-foreground text-sm font-mono">
            VIBESTACK © 2025. EMPOWERING BUILDERS TO SHIP THE EXTRAORDINARY.
          </div>
        </motion.div>

      </main>
    </div>
  );
}
