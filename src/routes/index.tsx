import { createFileRoute } from "@tanstack/react-router";
import { Component, ErrorInfo, lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";

// Safe Lazy Load of the Shard
const ObsidianShard = lazy(() =>
  import("@/components/ObsidianShard").then((m) => ({ default: m.ObsidianShard })),
);

// --- Crash-Proof Error Boundary ---
class SafeComponentBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  public state = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("ObsidianShard failed to render, using fallback CSS Shard:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-96 bg-gradient-to-br from-zinc-800/20 via-zinc-900/40 to-black/80 border border-zinc-700/30 rounded-2xl backdrop-blur-md shadow-2xl animate-float-1 rotate-12 flex items-center justify-center">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">[ CSS_SHARD_ACTIVE ]</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BTN // Data & Business Analyst" },
      {
        name: "description",
        content:
          "Data & Business Analyst. Translating raw complexity into clear business choices. Portfolio of Bhanu Teja.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;950&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap",
      },
    ],
  }),
});

// Smooth scroll helper
const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function Nav({ unlocked }: { unlocked: boolean }) {
  if (!unlocked) return null;
  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in font-sans">
      <nav className="flex items-center gap-1 rounded-full border border-border/80 bg-background/70 px-2 py-2 backdrop-blur-xl">
        <span className="hidden font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground px-3 sm:inline">
          BTN/2026
        </span>
        <span className="hidden h-4 w-px bg-border sm:inline-block" />
        {[
          { label: "WORKS", href: "works" },
          { label: "THE STACK", href: "stack" },
          { label: "INITIATE", href: "initiate" },
        ].map((i) => (
          <a
            key={i.label}
            href={`#${i.href}`}
            onClick={(e) => handleSmoothScroll(e, i.href)}
            className="group relative rounded-full px-4 py-1.5 font-mono-tight text-[11px] uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent"
          >
            {i.label}
            <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        ))}
      </nav>
    </header>
  );
}

function PixelShardCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleLeave = () => setActive(false);
    const handleEnter = () => setActive(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.body.addEventListener("mouseenter", handleEnter);
    document.body.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseenter", handleEnter);
      document.body.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!active) return null;

  return (
    <div 
      className="hidden lg:block pointer-events-none fixed z-[9999] -translate-x-2 -translate-y-2 select-none"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h4v2H4V4zm4 2h4v2H8V6zm4 2h4v2h-4V8zm4 2h4v2h-4v-2zm2 4h4v2h-4v-2zm2 4h4v2h-4v-2zm2 2h2v4h-2v-4z" fill="#18181b"/>
        <path d="M6 6h2v2H6V6zm4 2h2v2h-2V8zm4 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2 4h2v2h-2v-2z" fill="#71717a"/>
        <path d="M8 8h2v2H8V8zm4 2h2v2h-2v-2zm2 2h2v2h-2v-2z" fill="#a1a1aa"/>
        <path d="M10 14h2v2h-2v-2zm4 4h2v2h-2v-2zm2 2h2v4h-2v-4z" fill="#27272a"/>
        <path d="M18 24h4v4h-4v-4z" fill="#09090b"/>
        <path d="M20 26h2v2h-2v-2z" fill="#fff" opacity="0.3"/>
      </svg>
    </div>
  );
}

function InteractiveVectorField({ scrollY }: { scrollY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let id: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const rows = 35;
    const cols = 55;
    let points: Array<{ origX: number; origY: number; angle: number }> = [];

    const initPoints = () => {
      points = [];
      const xSpacing = w / (cols - 1);
      const ySpacing = h / (rows - 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          points.push({
            origX: c * xSpacing,
            origY: r * ySpacing,
            angle: (c * 0.15) + (r * 0.1),
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    initPoints();

    const drawEcosystem = () => {
      ctx.fillStyle = "#020203";
      ctx.fillRect(0, 0, w, h);

      const time = Date.now() * 0.002;
      const verticalParallax = scrollY * 0.3;

      points.forEach((p) => {
        let baseWave = Math.sin(p.angle + time) * Math.cos(p.angle * 0.4 + time * 0.5) * 18;
        let currentX = p.origX;
        let currentY = (p.origY + baseWave - verticalParallax) % h;
        if (currentY < 0) currentY += h;

        const mDist = Math.hypot(mouseRef.current.x - currentX, mouseRef.current.y - currentY);
        if (mDist < 160) {
          const force = (160 - mDist) / 160;
          const pullAngle = Math.atan2(mouseRef.current.y - currentY, mouseRef.current.x - currentX);
          currentX += Math.cos(pullAngle) * force * 25;
          currentY += Math.sin(pullAngle) * force * 25;
        }

        const baseAlpha = Math.max(0.12, (baseWave + 18) / 36 * 0.45);
        ctx.fillStyle = mDist < 160 ? `rgba(74, 222, 128, ${baseAlpha * 2.5})` : `rgba(255, 255, 255, ${baseAlpha})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, mDist < 160 ? 1.8 : 1.0, 0, Math.PI * 2);
        ctx.fill();
      });

      id = requestAnimationFrame(drawEcosystem);
    };

    drawEcosystem();

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initPoints();
    };

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(id);
    };
  }, [scrollY]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

function RetroDinoGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [cactusX, setCactusX] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<number | null>(null);

  const triggerJump = () => {
    if (gameOver) {
      setGameOver(false);
      setPlaying(true);
      setScore(0);
      setCactusX(100);
      return;
    }
    if (!playing) {
      setPlaying(true);
      return;
    }
    if (isJumping) return;
    
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 650);
  };

  useEffect(() => {
    if (!playing || gameOver) return;

    const loop = () => {
      setScore((s) => s + 1);
      setCactusX((x) => {
        if (x <= 0) return 100;
        if (x > 18 && x < 28 && !isJumping) {
          setGameOver(true);
          setPlaying(false);
          return x;
        }
        return x - 1.5;
      });
      gameRef.current = requestAnimationFrame(loop);
    };

    gameRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, [playing, gameOver, isJumping]);

  useEffect(() => {
    const handleGlobalSpace = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener("keydown", handleGlobalSpace);
    return () => window.removeEventListener("keydown", handleGlobalSpace);
  }, [playing, isJumping, gameOver]);

  return (
    <div className="mt-4 border border-border bg-muted/10 p-3 font-mono-tight text-[10px] w-full select-none relative group">
      <div className="flex justify-between border-b border-border/40 pb-1.5 mb-2 text-muted-foreground">
        <span>[ T-REX_BYPASS.EXE ]</span>
        <span className="text-accent font-bold">SCORE: {score}</span>
      </div>

      <div onClick={triggerJump} className="relative h-24 border border-border/30 bg-background/50 overflow-hidden rounded cursor-pointer">
        {!playing && !gameOver && (
          <div className="absolute top-2 right-2 border border-accent/40 bg-accent/10 text-accent text-[7px] px-1 py-0.5 rounded tracking-widest animate-pulse z-30 font-mono">
            PRESS SPACE TO JUMP
          </div>
        )}

        {gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
            <p className="text-destructive font-bold uppercase tracking-wider">CRASHED // IMPACT BLOCKED</p>
            <p className="text-[8px] text-muted-foreground mt-1">CLICK SYSTEM SCREEN OR PRESS SPACE TO RETRY</p>
          </div>
        ) : !playing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 text-center px-4">
            <span>CLICK RUN TERMINAL FRAME KEY</span>
          </div>
        ) : null}

        <div 
          className="absolute font-bold text-accent font-mono text-[12px] transition-all duration-300 ease-out z-10"
          style={{ 
            bottom: isJumping ? "40px" : "6px", 
            left: "25px", 
            transform: "scaleX(-1)",
            display: "inline-block" 
          }}
        >
          🦖
        </div>

        <div 
          className="absolute font-bold text-destructive font-mono text-[11px]"
          style={{ bottom: "6px", left: `${cactusX}%` }}
        >
          🌵
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-accent/30 dashed-line" />
      </div>
    </div>
  );
}

function Hero({ unlocked }: { unlocked: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [loopFrame, setLoopFrame] = useState(0);

  useEffect(() => {
    if (isHovered || !unlocked) return;
    const interval = setInterval(() => {
      setLoopFrame((f) => (f + 1) % 4);
    }, 450);
    return () => clearInterval(interval);
  }, [isHovered, unlocked]);

  const getLoopText = () => {
    if (loopFrame === 0) return "B";
    if (loopFrame === 1) return "B T";
    if (loopFrame === 2) return "B T N";
    return "B T N";
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-32 pb-16 flex flex-col justify-between">
      {/* RESTORED BACKGROUND OBSIDIAN SHARD */}
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        {useMounted() && (
          <SafeComponentBoundary>
            <Suspense fallback={null}>
              <ObsidianShard />
            </Suspense>
          </SafeComponentBoundary>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 grid-lines opacity-30" />
      
      <div className="absolute left-6 top-24 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:left-10">
        [ N° 001 ] — PORTFOLIO / v2026
      </div>
      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10 my-auto z-10">
        <div className="mb-6 flex items-center gap-3 font-mono-tight text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span className="live-dot absolute inset-0 rounded-full bg-accent" />
          </span>
          <span className="text-foreground">Available</span>
          <span>for selective projects</span>
        </div>

        <h1 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`font-display font-extrabold uppercase leading-[0.9] tracking-tighter text-foreground transition-all duration-300 w-max ${
            isHovered ? "text-[5vw] md:text-[3.6vw]" : "text-[6.5vw] md:text-[4.8vw]"
          }`}
        >
          {isHovered ? "BHANU TEJA NIMMAGADDA" : getLoopText()}
          <span className="mx-2 inline-block h-[0.6em] w-[0.4em] translate-y-[0.02em] bg-accent align-middle" />
        </h1>

        <div className="mt-10 grid grid-cols-12 gap-6 border-t border-border pt-8 opacity-100 translate-y-0">
          {/* Left Column: Title & Custom Floating Icons */}
          <div className="col-span-12 md:col-span-3 flex flex-col justify-between min-h-[260px]">
            <div>
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                // PRACTICE
              </p>
              <p className="mt-2 font-display text-lg font-semibold uppercase tracking-tight">
                Data & Business
                <br /> Analyst
              </p>
            </div>
            
            {/* Extended Tech Stack Vector Grid */}
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 mt-8 pb-4 max-w-[280px]">
              {/* Pandas */}
              <div className="animate-float-1 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                    <path d="M12 14c-1.5 0-2 1-2 2h4c0-1-.5-2-2-2z" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">PANDAS</span>
              </div>

              {/* XGBoost */}
              <div className="animate-float-2 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">XGBOOST</span>
              </div>

              {/* PyTorch */}
              <div className="animate-float-3 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">PYTORCH</span>
              </div>

              {/* Google Colab */}
              <div className="animate-float-4 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="8" cy="12" r="3" />
                    <circle cx="16" cy="12" r="3" />
                    <path d="M10 12h4" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">COLAB</span>
              </div>

              {/* Scikit Learn */}
              <div className="animate-float-1 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5V19c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">SCIKIT-L</span>
              </div>

              {/* SQL */}
              <div className="animate-float-2 flex flex-col items-center group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M14.5 9.5H10v2h4v2h-4.5" />
                  </svg>
                </div>
                <span className="font-mono text-[7px] text-muted-foreground mt-1 group-hover:text-accent transition-colors">SQL</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
            <div>
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                // OBJECTIVE
              </p>
              <p className="mt-2 max-w-xl text-lg leading-snug text-foreground/95 md:text-xl font-medium tracking-tight font-sans">
                Translating raw complexity into clean, actionable business decisions to optimize company growth paths.
              </p>
            </div>
            <RetroDinoGame />
          </div>

          <div className="col-span-12 md:col-span-3 flex flex-col items-start md:items-end justify-between gap-4">
            <div className="w-full border border-border/80 bg-muted/20 p-3 font-mono-tight text-[9px] uppercase tracking-wider text-muted-foreground">
              <div className="flex justify-between border-b border-border/40 pb-1 mb-1">
                <span>FOCUS</span>
                <span className="text-foreground">BI//ANALYTICS</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1 mb-1">
                <span>METRICS</span>
                <span className="text-accent">OPTIMIZED</span>
              </div>
              <div className="flex justify-between">
                <span>DASHBOARDS</span>
                <span className="text-foreground">OPERATIONAL</span>
              </div>
            </div>
            <a
              href="#initiate"
              onClick={(e) => handleSmoothScroll(e, "initiate")}
              className="group inline-flex w-full md:w-auto items-center justify-center gap-3 border border-foreground px-5 py-3 font-mono-tight text-[11px] uppercase tracking-widest text-foreground transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Initiate contact
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FamousQuoteStatementField() {
  return (
    <div className="relative w-full border-t border-b border-border/40 bg-background/20 py-20 overflow-hidden backdrop-blur-sm">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
          // FUNDAMENTAL DATA PRINCIPLE // W. EDWARDS DEMING
        </p>
        <h2 className="font-display text-[4vw] font-black uppercase leading-[0.95] tracking-tighter text-foreground max-w-5xl sm:text-[4.5vw] md:text-[3.5vw]">
          "WITHOUT DATA, YOU'RE JUST ANOTHER PERSON WITH AN <span className="text-accent">OPINION</span>."
        </h2>
        <p className="mt-6 font-mono-tight text-[11px] tracking-widest text-muted-foreground uppercase">
          Standard surveys highlight surface points. Granular classification model pipelines reveal actual human needs.
        </p>
      </div>
    </div>
  );
}

// Interactive Floating Hobbies Panel (With relaxed everyday hobbies for Node 03 & 04)
function HobbiesSection() {
  const hobbies = [
    {
      title: "Group Trip Itinerary Design",
      desc: "Architecting detailed, multi-day loop routes, optimizing regional travel paths and schedules.",
      icon: "🗺️",
      accent: "border-accent/40 bg-accent/5 text-accent",
    },
    {
      title: "National Park Trekking",
      desc: "Backpacking wilderness elevation passes, charting backcountry maps, and climbing high-altitude peaks.",
      icon: "🏔️",
      accent: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
    },
    {
      title: "Caffeine Matrix Optimization",
      desc: "Methodically testing coffee roasts to discover exactly how many cups it takes to see code in real time.",
      icon: "☕",
      accent: "border-amber-600/40 bg-amber-600/5 text-amber-500",
    },
    {
      title: "Cinema Timeline Analysis",
      desc: "Binge-watching complex movie universes or thriller plots and complaining about script plot holes.",
      icon: "🎬",
      accent: "border-rose-500/40 bg-rose-500/5 text-rose-400",
    },
  ];

  return (
    <section className="relative w-full border-t border-b border-border/40 bg-black/40 py-16 overflow-hidden backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 relative z-10">
        <p className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          // OFF-DUTY PROTOCOLS // SYSTEM HOBBIES
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hobbies.map((h, idx) => (
            <div 
              key={idx} 
              className={`group border p-5 rounded-none transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-lg ${h.accent}`}
            >
              <div className="flex justify-between items-center border-b border-border/30 pb-3 mb-3">
                <span className="text-xl">{h.icon}</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/60">NODE_0{idx + 1}</span>
              </div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-accent">
                {h.title}
              </h4>
              <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed font-sans">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductionLiveLogStream() {
  const [logs, setLogs] = useState<Array<{ id: string; stamp: string; process: string; message: string; hash: string }>>([]);

  useEffect(() => {
    const processes = ["QUERY", "CLEAN", "VISUALIZE", "FORECAST", "MONITOR"];
    const actions = [
      "Extracted historical client matrices into analytical warehouses.",
      "Identified and adjusted severe survey sampling response biases.",
      "Rendered core executive intelligence metrics on live frames.",
      "Computed future corporate behavior target categories.",
      "Monitored incoming operational performance dashboards."
    ];

    const generateLog = () => {
      const randomIdx = Math.floor(Math.random() * processes.length);
      const newLog = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        stamp: new Date().toISOString().split("T")[1].substring(0, 8),
        process: processes[randomIdx],
        message: actions[randomIdx],
        hash: "0x" + Math.random().toString(16).substring(2, 10).toUpperCase(),
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(generateLog, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-12 md:col-span-5 border border-border/60 bg-black/90 p-4 font-mono-tight text-[9px] tracking-widest text-muted-foreground/80 h-48 flex flex-col justify-between overflow-hidden backdrop-blur-md">
      <div className="border-b border-border/30 pb-2 text-foreground font-bold flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
          // REAL-WORLD DATA MONITORING STREAM
        </span>
        <span className="text-accent bg-accent/10 px-1 rounded">LIVE MONITORING</span>
      </div>
      <div className="flex-1 space-y-2 mt-2 font-mono overflow-hidden">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 text-[8px] animate-fade-in border-b border-border/10 pb-1">
            <span className="text-muted-foreground/60">[{log.stamp}]</span>
            <span className="text-accent font-bold">[{log.process}]</span>
            <span className="text-foreground/90 truncate flex-1">{log.message}</span>
            <span className="text-muted-foreground/50 hidden sm:inline">{log.hash}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Protocol() {
  return (
    <section id="about" className="relative border-t border-border bg-background/20 py-24 md:py-32 backdrop-blur-xs">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-y-12 md:gap-8">
          <div className="col-span-12 select-none border-b border-border/40 pb-4">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // 002 — STRATEGIC DATA protocol
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-4xl block">
              THE PROTOCOL
            </h2>
            <div className="mt-2 h-px w-24 bg-accent" />
          </div>
          
          <div className="col-span-12 md:col-span-7">
            <p className="text-xl leading-[1.3] tracking-tight text-foreground sm:text-2xl">
              Business Analytics Graduate cleaning and evaluating business operations datasets with a solid{" "}
              <span className="text-accent">focus on data clarity and performance reporting</span>. I break confusing corporate trends down into clear, visual business signals.
            </p>
            <p className="mt-6 max-w-xl font-mono-tight text-sm leading-relaxed text-muted-foreground">
              Instead of just building basic spreadsheets, I model behavioral trends and clean complex data variables to give corporate managers reliable, numbers-backed answers.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
                {[
                  ["100%", "Data Cleanliness"],
                  ["4+", "Yrs Analytical Tools"],
                  ["SQL//PY", "Core Logic Specs"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-2xl font-extrabold tracking-tighter text-foreground sm:text-3xl">
                      {n}
                    </div>
                    <div className="mt-1 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {l}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <ProductionLiveLogStream />

          <div className="col-span-12 mt-12 border-t border-border/40 pt-8">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // WORK EXPERIENCE RECORD
            </p>
            <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4 border border-border bg-black/40 p-5 backdrop-blur-md">
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-accent font-sans">
                  Data & Business Analyst
                </h3>
                <p className="font-mono-tight text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  Entity: [ CONFIDENTIAL ] — Full-Time Practice
                </p>
                <ul className="mt-4 space-y-2 font-mono-tight text-xs text-foreground/80 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Cleaned and processed high-volume behavioral matrix data to drop outlier anomalies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Developed custom tracking queries and KPIs on distributed databases to surface operational metrics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Designed analytical dashboards translating chaotic database telemetry frames into structured business choices.</span>
                  </li>
                </ul>
              </div>
              <span className="border border-accent/40 bg-accent/5 px-2 py-1 font-mono-tight text-[9px] uppercase tracking-widest text-accent rounded-none whitespace-nowrap">
                // SYSTEM VERIFIED
              </span>
            </div>
          </div>

          <div className="col-span-12 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border border-border bg-black/40 p-5 backdrop-blur-md">
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-accent font-sans">
                  Graduate Data Analyst Intern
                </h3>
                <p className="font-mono-tight text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  Location: UNT G. Brint Ryan College of Business — Academic Practice
                </p>
                <ul className="mt-4 space-y-2 font-mono-tight text-xs text-foreground/80 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Conconducted comprehensive exploratory data analysis (EDA) across institutional survey records to support modeling stability.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Executed advanced categorical attribute formatting and mode imputation steps to fix incomplete survey datasets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>Built multivariate matrix audits to test statistical dependencies and isolate key predictive characteristics.</span>
                  </li>
                </ul>
              </div>
              <span className="border border-accent/40 bg-accent/5 px-2 py-1 font-mono-tight text-[9px] uppercase tracking-widest text-accent rounded-none whitespace-nowrap">
                // UNT SECURE VERIFIED
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const stack = [
  {
    id: "01",
    label: "DATA ANALYSIS",
    items: ["Exploratory Data Analysis", "Data Cleaning & Prep", "Category Standardization", "Statistical Validation"],
  },
  {
    id: "02",
    label: "ANALYTICS STACK",
    items: ["Python (Pandas/NumPy)", "SQL Queries", "dbt Metrics Pipelines", "Advanced Excel Models"],
  },
  {
    id: "03",
    label: "BUSINESS STRATEGY",
    items: ["Business Intelligence Panels", "Predictive Classifications", "Survey Sampling Audit", "Decision Matrix Building"],
  },
];

function AcademicPublicationNode() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-12 col-span-12 border-t border-border/40 pt-8 animate-fade-in">
      <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        // 004 — ACADEMIC RESEARCH & SCHOLASTIC PIPELINE
      </p>
      
      <div className="mt-4 border-2 border-accent/30 bg-black/80 p-6 md:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-accent shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <div className="absolute top-0 right-0 border-l border-b border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-accent font-bold">
          PEER REVIEWED // INTL JOURNAL
        </div>
        
        <span className="font-mono text-[9px] text-accent tracking-widest font-bold">JOURNAL: IJARESM // GRAPH THEORY & NEURAL HYBRIDS</span>
        
        <h3 className="mt-2 font-display text-xl md:text-2xl font-black uppercase tracking-tight text-foreground leading-[1.1] max-w-4xl">
          Optimizing Minimum Spanning Tree Computation: An Artificial Neural Network Approach for Enhanced Efficiency in Graph Theory
        </h3>
        
        <p className="mt-4 text-xs font-mono-tight text-muted-foreground uppercase tracking-wider">
          Bhanu Teja Nimmagadda — Lead Author
        </p>

        <div className="mt-6 flex flex-wrap gap-4 items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="border border-accent px-4 py-2 font-mono-tight text-[10px] uppercase tracking-widest text-accent bg-accent/5 transition-all hover:bg-accent hover:text-black font-bold"
          >
            {isOpen ? "[ CLOSE SYSTEM ABSTRACT ]" : "[ OPEN SYSTEM ABSTRACT ]"}
          </button>
          
          <a 
            href="https://www.ijaresm.com/optimizing-minimum-spanning-tree-computation-an-artificial-neural-network-approach-for-enhanced-efficiency-in-graph-theory" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-foreground/50 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all font-bold"
          >
            LAUNCH MANUSCRIPT URL →
          </a>
        </div>

        {isOpen && (
          <div className="mt-6 border-t border-border/40 pt-6 animate-fade-in font-sans">
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-2">[ ABSTRACT DECRYPTED ]</span>
            <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium">
              In this research paper, we introduce a novel approach to tackle the Minimum Spanning Tree (MST) problem using Artificial Neural Networks (ANNs). The MST problem is a fundamental challenge within graph theory, holding significant real-world applications. Traditional algorithms for MST problem-solving often demand substantial computational resources and memory usage. Our proposed approach aims to mitigate these limitations by harnessing the capabilities of ANNs, which have demonstrated efficacy in solving a variety of optimization problems. Our ANN-based methodology revolves around training a neural network to predict the edges of the MST for a given input graph. This training involves a dataset of input graphs and their corresponding MSTs. We also introduce a unique loss function that simultaneously considers the accuracy of the predicted MST and the computational efficiency of the neural network. To assess the effectiveness of our approach, we conduct extensive evaluations on diverse benchmark datasets and compare our results with those of state-of-the-art MST algorithms. The experimental outcomes demonstrate that our ANN-based approach yields comparable or superior results to existing algorithms, all the while significantly improving computation time and memory utilization. In summary, our proposed methodology offers a promising solution to the MST problem using ANNs and exhibits potential for extension to other optimization challenges within graph theory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stack() {
  return (
    <section id="stack" className="relative border-t border-border bg-background/10 py-24 md:py-32 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // 003 — SYSTEM STACK SPEC
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-4xl">
              The Stack
            </h2>
          </div>
          <p className="hidden font-mono-tight text-[11px] uppercase tracking-widest text-muted-foreground md:block">
            v.2026 / operational tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {stack.map((s, idx) => (
            <div
              key={s.id}
              className={`group relative py-10 md:px-8 bg-black/40 border border-border/20 transition-all duration-500 overflow-hidden hover:border-accent/40 ${
                idx !== 0 ? "md:border-l border-border" : ""
              } ${idx !== 0 ? "border-t md:border-t-0" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"/>
              <div className="flex items-baseline gap-3 relative z-10">
                <span className="font-mono-tight text-[11px] tracking-widest text-accent">
                  [{s.id} //
                </span>
                <span className="font-mono-tight text-[11px] uppercase tracking-widest text-foreground">
                  {s.label}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors duration-300 relative z-10">
                {s.label === "DATA ANALYSIS" && "Processing the files"}
                {s.label === "ANALYTICS STACK" && "Clean tool matrices"}
                {s.label === "BUSINESS STRATEGY" && "Clear strategic answers"}
              </h3>
              <ul className="mt-6 space-y-3 relative z-10">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="group/item flex items-center justify-between border-b border-border/40 py-2 font-mono-tight text-sm text-foreground/85 transition-all duration-300 hover:translate-x-2 hover:text-accent"
                  >
                    <span>{it}</span>
                    <span className="text-accent text-[10px] font-bold opacity-0 group-hover/item:opacity-100 transition-opacity tracking-widest">
                      // LOADED
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Academic research publication */}
        <AcademicPublicationNode />
      </div>
    </section>
  );
}

const projects = [
  {
    n: "01",
    name: "FORECAST.EXE",
    sub: "CAPSTONE // WORKPLACE RISK & SEEKING-BEHAVIOR PREDICTOR",
    meta: "ROC-AUC: 0.8019 VIA XGBOOST",
    desc: "Analyzed an exhaustive workplace psychological metrics sheet containing 225,058 survey records across 17 distinct fields. Audited missing records, adjusted clear gender imbalances (76.8% male sample skew), and condensed low-frequency categories. Trained predictive classification algorithms to spot behavioral flags, achieving a 0.89 classification recall scale.",
    tags: ["Python", "XGBoost", "Data Preprocessing"],
  },
  {
    n: "02",
    name: "FUNNEL.LOG",
    sub: "REVENUE CONVERSION ANALYTICS & LIFECYCLE OPTIMIZATION",
    meta: "LOAD: 1.2M CUSTOMER TRANSACTIONS",
    desc: "Engineered transactional funnel maps evaluating user milestone friction paths across multi-tier lifecycle stages. Isolated core dropout friction gaps in historical cohorts, surfacing predictive friction parameters to management.",
    tags: ["SQL Queries", "Excel Models", "PostgreSQL"],
  },
  {
    n: "03",
    name: "SENTIMENT.SH",
    sub: "REAL-TIME CLIENT SATISFACTION STREAM MONITOR",
    meta: "KPI MONITOR: 45+ REGIONAL SUITES",
    desc: "Built automated data ingestion pipelines grouping incoming qualitative customer support surveys into cleanly indexable metric frames. Formatted raw survey descriptions to track dynamic customer sentiment index deltas.",
    tags: ["Python", "dbt Tables", "Tableau"],
  },
];

function Works() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setBubblePos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  return (
    <section id="works" className="relative border-t border-border bg-background/20 py-24 md:py-32 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // 005 — SELECTED BUILD EVIDENCE
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-4xl">
              Selected Works
            </h2>
          </div>
          <p className="hidden font-mono-tight text-[11px] uppercase tracking-widest text-muted-foreground md:block">
            {projects.length.toString().padStart(2, "0")} entries
          </p>
        </div>

        {hoveredProject && (
          <div 
            className="fixed z-50 pointer-events-none max-w-sm border-2 border-accent bg-black p-4 font-mono text-[10px] text-accent shadow-[0_0_20px_rgba(74,222,128,0.4)] backdrop-blur-xl rounded-none uppercase transition-all duration-75 ease-out"
            style={{ left: `${bubblePos.x}px`, top: `${bubblePos.y}px` }}
          >
            <div className="border-b border-accent/40 pb-1 mb-2 font-bold flex justify-between">
              <span>[ MATRIX_INDEX_READ ]</span>
              <span className="animate-pulse text-emerald-400">ONLINE</span>
            </div>
            <p className="text-foreground/90 normal-case leading-relaxed font-sans font-medium">
              {projects.find(p => p.n === hoveredProject)?.desc}
            </p>
            <div className="mt-3 border-t border-accent/20 pt-1 text-[8px] text-accent/50 text-right">
              NODE: {projects.find(p => p.n === hoveredProject)?.n} // TELEMETRY FRAME
            </div>
          </div>
        )}

        <ul className="mt-2">
          {projects.map((p) => {
            const isTargeted = hoveredProject === p.n;
            return (
              <li
                key={p.n}
                onMouseEnter={() => setHoveredProject(p.n)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative border-b border-border/80 transition-all duration-300 hover:bg-black/40 px-2"
              >
                <div className="grid grid-cols-12 items-center gap-4 py-8 md:py-10">
                  <span className="col-span-2 md:col-span-1 font-mono-tight text-xs tracking-widest text-muted-foreground group-hover:text-accent">
                    {p.n}
                  </span>
                  <div className="col-span-10 md:col-span-7">
                    <h3
                      className={`font-display text-2xl font-extrabold uppercase tracking-tighter md:text-3xl transition-colors duration-300 ${
                        isTargeted ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {p.name}
                    </h3>
                    <p className="mt-1 font-mono-tight text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {p.sub}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 flex flex-wrap items-center gap-2 md:justify-end">
                    <span className="inline-flex items-center gap-2 border border-accent/70 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-widest text-accent">
                      <span className="h-1.5 w-1.5 bg-accent" />
                      {p.meta}
                    </span>
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="hidden md:inline-flex border border-border px-2 py-1 font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const milestones = [
  "BUSINESS ANALYTICS GRADUATE // VALUE INSIGHT DATA SPECIALIST",
  "RESOLVED GENDER AND SELECTION SAMPLING STUDY BIASES",
  "SHIPPED CLEAN PREDICTIVE SURVEY BEHAVIOR MODELS",
  "CONDUCTED DENSE VARIABLE CORRELATION MULTICOLLINEARITY AUDITS",
  "3+ DATA PREPROCESSING AND EXPLORATORY PROJECTS DELIVERED",
  "BUILT COMPREHENSIVE RE-USABLE ANALYTICAL FRAMEWORKS",
];

function Milestones() {
  const track = [...milestones, ...milestones];
  return (
    <section id="milestones" className="relative border-t border-border bg-background/20 py-24 md:py-32 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // 006
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-4xl">
              Milestones
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden border-y border-accent/30 bg-accent/5 py-6">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-accent animate-marquee-glitch">
          {track.map((m, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 font-display text-lg font-black uppercase tracking-tight md:text-xl font-mono"
            >
              &gt;&gt; {m}
              <span className="inline-block h-2 w-2 bg-accent animate-pulse" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] px-6 md:px-10 perspective-1000">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((m, i) => (
            <li
              key={m}
              className="group flex flex-col justify-between border-2 border-border/40 bg-black/60 p-5 font-mono-tight text-sm text-foreground/85 transition-all duration-500 ease-out transform hover:-rotate-y-12 hover:translate-z-4 hover:border-accent/60 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] rounded-none"
            >
              <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-2">
                <span className="text-accent font-bold text-xs tracking-widest">
                  CORE_BLADE_0{i + 1} //
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                  STATUS: OK
                </span>
              </div>
              <p className="text-foreground/90 font-medium font-sans leading-snug tracking-wide">
                {m}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section id="initiate" className="relative border-t border-border py-24 md:py-32 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // 007 — INITIATE
            </p>
            <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-7xl">
              LET'S
              <br />
              BUILD
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-sm text-foreground/80">
              Have complex data waiting to be solved? Share the parameters. I'll build a clear strategy model.
            </p>
            <div className="mt-8 space-y-2 font-mono-tight text-xs uppercase tracking-widest text-muted-foreground">
              <p>
                <span className="text-foreground">EMAIL —</span>{" "}
                bhanu@analyst.io
              </p>
              <p>
                <span className="text-foreground">LOCATION —</span> Remote / India
              </p>
              <p>
                <span className="text-foreground">RESPONSE —</span> {"<"} 48h
              </p>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => {
                setSent(false);
                formRef.current?.reset();
              }, 3000);
            }}
            className="col-span-12 md:col-span-7"
          >
            <div className="space-y-6 border border-border p-6 md:p-8 bg-black/30 backdrop-blur-md">
              {[
                { name: "name", label: "NAME", type: "text", placeholder: "Your name" },
                { name: "email", label: "EMAIL", type: "email", placeholder: "you@domain.com" },
              ].map((f) => (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    className="mb-2 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  >
                    <span>{f.label}</span>
                    <span className="text-accent">*</span>
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    required
                    placeholder={f.placeholder}
                    className="w-full border-0 border-b border-border bg-transparent px-0 py-3 font-mono-tight text-base text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="vision"
                  className="mb-2 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                >
                  <span>THE DATA ANALYSIS GOAL</span>
                  <span className="text-accent">*</span>
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  required
                  rows={5}
                  placeholder="What variables are we working with?"
                  className="w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 font-mono-tight text-base text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sent}
                className="group relative mt-4 w-full overflow-hidden border border-foreground bg-foreground py-5 font-display text-lg font-bold uppercase tracking-widest text-background transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-70"
              >
                <span className="relative z-10">
                  {sent ? "TRANSMISSION SECURED ✓" : "TRANSMIT TARGET →"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 bg-background/80 backdrop-blur-md relative z-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row md:items-center md:px-10">
        <div>© 2026 — BHANU TEJA / BUSINESS INTEL METRICS ARCHIVED</div>
        <div className="flex gap-6">
          <a 
            href="https://www.linkedin.com/in/bhanu-teja-n" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-accent"
          >
            LINKEDIN
          </a>
          <a href="#" className="hover:text-accent">READ.CV</a>
        </div>
        <div>BUILT IN THE DARK / NO COOKIES</div>
      </div>
    </footer>
  );
}

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollYPosition, setScrollYPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      
      setScrollYPosition(scrolled);
      
      const progress = Math.min((scrolled / (windowHeight * 0.35)) * 100, 100);
      setScrollProgress(progress);

      if (scrolled > windowHeight * 0.35 && !unlocked) {
        setUnlocked(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [unlocked]);

  const normalizedProgress = unlocked ? 1 : scrollProgress / 100;
  const contentScale = unlocked ? 1 : 0.92 + normalizedProgress * 0.08;
  const contentBlur = unlocked ? 0 : Math.max(0, 8 - normalizedProgress * 8);
  const contentTranslateY = unlocked ? 0 : Math.max(0, 30 - normalizedProgress * 30);
  const contentOpacity = unlocked ? 1 : normalizedProgress;

  return (
    <main className="min-h-[200vh] bg-background text-foreground lg:cursor-none select-none relative overflow-x-hidden font-sans antialiased text-base selection:bg-accent selection:text-accent-foreground">
      
      {/* SCOPED INJECTED CSS ANIMATIONS */}
      <style>{`
        @keyframes float-bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes float-bounce-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-4deg); }
        }
        @keyframes float-bounce-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float-1 {
          animation: float-bounce-slow 4s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-bounce-medium 3.2s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-bounce-fast 3.6s ease-in-out infinite;
        }
        .animate-float-4 {
          animation: float-bounce-slow 4.5s ease-in-out infinite;
        }
      `}</style>

      <InteractiveVectorField scrollY={scrollYPosition} />
      <PixelShardCursor />
      
      <Nav unlocked={unlocked} />
      
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div 
          className="flex fixed inset-0 flex-col items-center justify-center min-h-screen w-full font-mono text-[11px] uppercase tracking-[0.45em] text-accent transition-all duration-500 z-20 pointer-events-none"
          style={{ 
            opacity: 1 - normalizedProgress,
            display: unlocked ? "none" : "flex"
          }}
        >
          <span>[ QUANTUM BREAK // SCROLL TO INITIATE CORE PIPELINE ]</span>
          <div className="w-48 h-1 bg-muted/20 rounded-full overflow-hidden mt-3">
            <div style={{ width: `${scrollProgress}%` }} className="h-full bg-accent transition-all duration-150 ease-out" />
          </div>
        </div>

        <div 
          className="transition-all ease-out duration-700 origin-center w-full"
          style={{
            transform: `scale(${contentScale}) translateY(${contentTranslateY}px)`,
            filter: `blur(${contentBlur}px)`,
            opacity: contentOpacity,
            pointerEvents: contentOpacity > 0.5 ? "auto" : "none"
          }}
        >
          <Hero unlocked={unlocked} />
          <Protocol />
          <FamousQuoteStatementField />
          <HobbiesSection />
          <Works />
          <Stack />
          <Milestones />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  );
}