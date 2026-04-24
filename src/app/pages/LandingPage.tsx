import { useRef, useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, animate } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  TrendingUp, TrendingDown, Zap, BarChart2, Trophy, Shield,
  ArrowRight, Star, ChevronDown, Activity, Globe
} from 'lucide-react';

// ── Lazy-load 3D (performance) ─────────────────────────────────────
const HeroCanvas = lazy(() => import('../components/landing/HeroCanvas'));
const MarketBars3D = lazy(() => import('../components/landing/MarketBars3D'));

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ── Constants ─────────────────────────────────────────────────────
const GREEN = '#10B981';
const DEMO_STOCKS = [
  { ticker: 'NVDA', name: 'NVIDIA', price: 79325, change: +3.42, up: true },
  { ticker: 'AAPL', name: 'Apple', price: 19247, change: +1.18, up: true },
  { ticker: 'TSLA', name: 'Tesla', price: 28808, change: -2.31, up: false },
  { ticker: 'MSFT', name: 'Microsoft', price: 39673, change: +0.87, up: true },
  { ticker: 'META', name: 'Meta', price: 51770, change: +2.05, up: true },
  { ticker: 'GOOGL', name: 'Alphabet', price: 15448, change: -0.44, up: false },
  { ticker: 'AMZN', name: 'Amazon', price: 18788, change: +1.62, up: true },
  { ticker: 'NFLX', name: 'Netflix', price: 87675, change: -0.91, up: false },
];

// ── Animated count-up ─────────────────────────────────────────────
function CountUp({ to, prefix = '', suffix = '', decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(val, to, { duration: 2.2, ease: 'easeOut' });
    const unsub = val.on('change', v => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      }
    });
    return () => { controls.stop(); unsub(); };
  }, [inView]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ── Glassmorphism card ────────────────────────────────────────────
function GlassCard({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderColor: glow ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
        boxShadow: glow ? '0 0 30px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </div>
  );
}

// ── Glowing button ─────────────────────────────────────────────────
function GlowButton({ children, onClick, size = 'md', variant = 'primary' }: {
  children: React.ReactNode; onClick?: () => void;
  size?: 'sm' | 'md' | 'lg'; variant?: 'primary' | 'ghost';
}) {
  const [hovered, setHovered] = useState(false);
  const sizes = { sm: 'px-5 py-2.5 text-sm', md: 'px-7 py-3.5 text-sm', lg: 'px-10 py-5 text-base whitespace-nowrap' };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden ${sizes[size]} font-bold rounded-xl cursor-pointer transition-all inline-flex items-center gap-2`}
      style={variant === 'primary' ? {
        background: hovered ? '#34d399' : GREEN,
        color: '#000',
        boxShadow: hovered
          ? `0 0 40px rgba(16,185,129,0.6), 0 0 80px rgba(16,185,129,0.3), 0 4px 20px rgba(0,0,0,0.4)`
          : `0 0 20px rgba(16,185,129,0.3), 0 4px 15px rgba(0,0,0,0.3)`,
      } : {
        background: 'transparent',
        color: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: hovered ? '0 0 20px rgba(16,185,129,0.15)' : 'none',
      }}
    >
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ── Scroll progress bar ────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
      style={{ scaleX, background: `linear-gradient(90deg, ${GREEN}, #34d399)` }}
    />
  );
}

// ── Custom cursor glow ────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isMobile()) return;
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); };
  }, []);

  if (!visible) return null;
  return (
    <div
      className="fixed pointer-events-none z-[200] rounded-full transition-transform"
      style={{
        left: pos.x - 8, top: pos.y - 8,
        width: 16, height: 16,
        background: `radial-gradient(circle, ${GREEN}80, transparent)`,
        boxShadow: `0 0 20px ${GREEN}60`,
      }}
    />
  );
}

// ── Scan line effect ──────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="fixed left-0 right-0 h-px pointer-events-none z-50"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' }}
      animate={{ top: ['-5%', '105%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
    />
  );
}

// ── Live ticker bar ───────────────────────────────────────────────
function TickerBar() {
  const items = [...DEMO_STOCKS, ...DEMO_STOCKS, ...DEMO_STOCKS];
  return (
    <div className="overflow-hidden border-y py-2.5" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.ticker}</span>
            <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ₹{s.price.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.up ? '+' : ''}{s.change}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Noise overlay ─────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
    }}
  />
);

// ── Main Landing Page ─────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [mobile] = useState(isMobile);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX((e.clientX - rect.left - rect.width / 2) / rect.width * 2);
    setMouseY(-(e.clientY - rect.top - rect.height / 2) / rect.height * 2);
  }, []);

  // Gradient animation for body
  const { scrollY } = useScroll();
  const bgHue = useTransform(scrollY, [0, 3000], [160, 180]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a0a', color: '#fff' }}>
      <NoiseOverlay />
      <CursorGlow />
      <ScanLine />
      <ScrollProgress />

      {/* ── NAV ───────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-4 right-4 z-50 rounded-2xl px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: GREEN, boxShadow: `0 0 20px ${GREEN}50` }}>
            <TrendingUp className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-lg tracking-tight">Actually</span>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(16,185,129,0.1)', color: GREEN, border: '1px solid rgba(16,185,129,0.2)' }}>
            BETA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:block px-4 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            Sign In
          </button>
          <GlowButton onClick={() => navigate('/login')} size="sm">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </GlowButton>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Radial gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            mask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }} />
        </div>

        {/* 3D Canvas - full background */}
        {!mobile && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Suspense fallback={null}>
              <HeroCanvas mouseX={mouseX} mouseY={mouseY} />
            </Suspense>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: GREEN,
              boxShadow: '0 0 20px rgba(16,185,129,0.1)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
            Live Market Simulation · 50+ Stocks · ₹1,00,000 Cash
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Master the Market.
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight"
              style={{
                color: GREEN,
                textShadow: `0 0 40px rgba(16,185,129,0.5), 0 0 80px rgba(16,185,129,0.2)`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Risk&#8209;Free.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Practice buying and selling real stocks with{' '}
            <span className="text-emerald-400 font-semibold">₹1,00,000 virtual cash</span>.
            Real prices. Real emotions. Zero real risk.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <GlowButton onClick={() => navigate('/login')} size="lg">
              Start Trading Free <ArrowRight className="w-5 h-5" />
            </GlowButton>
            <GlowButton variant="ghost" size="lg">
              <a href="#features" className="flex items-center gap-2 no-underline text-inherit">
                How It Works <ChevronDown className="w-4 h-4" />
              </a>
            </GlowButton>
          </motion.div>

          {/* Mini portfolio preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="inline-block"
          >
            <GlassCard glow className="px-6 py-4 flex items-center gap-6">
              <div className="text-left">
                <p className="text-xs text-white/35 uppercase tracking-widest mb-1">Your Portfolio</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}60` }}>
                  ₹54,320.50
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-4 h-4 mb-1" style={{ color: GREEN }} />
                  <span className="text-xs text-white/35">+8.6%</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-left">
                <p className="text-xs text-white/35 uppercase tracking-widest mb-1">Holdings</p>
                <p className="text-lg font-bold">5 Stocks</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-white/25 tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-9 border rounded-full flex items-start justify-center pt-1.5"
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <motion.div
              className="w-1 h-2.5 rounded-full"
              style={{ background: GREEN }}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────── */}
      <TickerBar />

      {/* ── PROBLEM → SOLUTION STORY ──────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 100%)' }} />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: GREEN }}>The Problem</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
              Stock trading is terrifying{' '}
              <span className="line-through text-white/25">when it's real money.</span>
            </h2>
            <p className="text-xl text-white/40 leading-relaxed max-w-2xl mx-auto mb-16">
              You want to learn. You want to invest. But one wrong move and your savings take a hit.
              Most people give up before they even start.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3))' }} />
              <div className="px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: GREEN }}>
                The Solution
              </div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.3), transparent)' }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: GREEN }}>
              Practice first. Profit later.
            </h2>
            <p className="text-xl text-white/50 mt-6 max-w-xl mx-auto">
              Actually gives you ₹1,00,000 virtual cash and a live market to practice in.
              Make every mistake here. Win real confidence out there.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 3D MARKET VISUALIZATION ───────────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'rgba(5,5,5,0.8)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: GREEN }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
              Simulated Live Prices
            </div>
            <h2 className="text-4xl font-black tracking-tight">Real-Time Market Simulation</h2>
            <p className="text-white/40 mt-3 text-lg">Prices update every 2 seconds. Just like a real exchange.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 3D Bars */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-64 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(16,185,129,0.1)', background: 'rgba(0,0,0,0.5)' }}
            >
              {!mobile && (
                <Suspense fallback={
                  <div className="h-full flex items-center justify-center text-white/20 text-sm">Loading...</div>
                }>
                  <MarketBars3D />
                </Suspense>
              )}
              {mobile && (
                <div className="h-full flex items-center justify-center">
                  <BarChart2 className="w-16 h-16 text-emerald-400 opacity-30" />
                </div>
              )}
            </motion.div>

            {/* Stock grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-2 gap-3"
            >
              {DEMO_STOCKS.slice(0, 6).map((s, i) => (
                <motion.div
                  key={s.ticker}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3, boxShadow: s.up ? '0 8px 25px rgba(16,185,129,0.15)' : '0 8px 25px rgba(239,68,68,0.1)' }}
                  className="p-4 rounded-xl cursor-default"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black tracking-wider">{s.ticker}</span>
                    <span className={`text-xs font-semibold ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {s.up ? '+' : ''}{s.change}%
                    </span>
                  </div>
                  <p className="text-base font-bold tabular-nums">
                    ₹{s.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.name}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: GREEN }}>Everything Included</p>
            <h2 className="text-5xl font-black tracking-tight mb-4">Professional tools. Zero cost.</h2>
            <p className="text-white/40 text-xl max-w-xl mx-auto">
              Everything a real trader needs. Minus the terrifying financial risk.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: 'Live Market Engine',
                desc: 'WebSocket-powered prices updating every 2 seconds across 50+ stocks in 8 sectors. Feels completely real.',
                tag: 'Real-Time',
                glow: true,
              },
              {
                icon: <BarChart2 className="w-6 h-6" />,
                title: 'Virtual Portfolio',
                desc: 'Start with ₹1,00,000. Buy, sell, track P&L, monitor holdings — exactly like a real brokerage account.',
                tag: '₹1,00,000',
                glow: false,
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'AI News Feed',
                desc: 'Live news with bullish/bearish sentiment that actually impacts stock prices. Feel the market psychology.',
                tag: 'AI-Powered',
                glow: false,
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Global Leaderboard',
                desc: 'Compete with other traders. Climb the rankings. Prove your strategy works under pressure.',
                tag: 'Competitive',
                glow: false,
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Zero Risk',
                desc: 'Virtual money only. Make every mistake here. Learn every lesson free. Graduate to real trading confident.',
                tag: '100% Safe',
                glow: false,
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Achievements',
                desc: 'Unlock badges for milestones. First trade, profit streaks, portfolio growth. Gamified learning that sticks.',
                tag: 'Gamified',
                glow: false,
              },
            ].map(({ icon, title, desc, tag, glow }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <GlassCard glow={glow} className="p-6 h-full group cursor-default transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: GREEN }}>
                    {icon}
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-3"
                    style={{ background: 'rgba(16,185,129,0.08)', color: GREEN }}>
                    {tag}
                  </span>
                  <h3 className="text-base font-black mb-2 tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-32 px-6 relative" style={{ background: 'rgba(5,5,5,0.6)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: GREEN }}>The Journey</p>
            <h2 className="text-5xl font-black tracking-tight">From zero to trader in 60 seconds.</h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.7%] right-[16.7%] h-px overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
                style={{ background: `linear-gradient(90deg, ${GREEN}, #34d399)`, transformOrigin: 'left', boxShadow: `0 0 10px ${GREEN}50` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: 1,
                  icon: <Shield className="w-7 h-7" />,
                  title: 'Create Account',
                  desc: 'Sign up in 10 seconds. No email, no credit card, no KYC. Just a username and you\'re in.',
                  detail: '₹1,00,000 cash added instantly',
                },
                {
                  step: 2,
                  icon: <BarChart2 className="w-7 h-7" />,
                  title: 'Browse & Trade',
                  desc: 'Explore 50+ stocks in real-time. Read live news. Place your first buy order in seconds.',
                  detail: 'Live prices every 2s',
                },
                {
                  step: 3,
                  icon: <Trophy className="w-7 h-7" />,
                  title: 'Grow & Compete',
                  desc: 'Track your portfolio. Unlock achievements. Climb the leaderboard. Learn what works.',
                  detail: 'Global rankings',
                },
              ].map(({ step, icon, title, desc, detail }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  className="text-center"
                >
                  <div className="relative inline-flex mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, boxShadow: `0 0 40px ${GREEN}50` }}
                      className="w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: 'rgba(16,185,129,0.05)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        color: GREEN,
                      }}
                    >
                      {icon}
                    </motion.div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: GREEN, color: '#000', boxShadow: `0 0 15px ${GREEN}60` }}>
                      {step}
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.08)', color: GREEN, border: '1px solid rgba(16,185,129,0.15)' }}>
                    {detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 100%)' }} />
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Stocks Available', to: 50, suffix: '+', prefix: '' },
              { label: 'Starting Cash', to: 100000, suffix: '', prefix: '₹', decimals: 0 },
              { label: 'Price Updates / Min', to: 720, suffix: '+', prefix: '' },
              { label: 'Cost. Forever.', to: 0, suffix: '', prefix: '₹' },
            ].map(({ label, to, suffix, prefix, decimals }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6" glow>
                  <p className="text-4xl font-black mb-2 tabular-nums"
                    style={{ color: GREEN, textShadow: `0 0 30px ${GREEN}50` }}>
                    <CountUp to={to} prefix={prefix} suffix={suffix} decimals={decimals ?? 0} />
                  </p>
                  <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        {/* Animated gradient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
          />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            mask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }} />
          {/* Corner glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'rgba(16,185,129,0.06)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'rgba(16,185,129,0.04)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            className="inline-flex mb-10"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: GREEN, boxShadow: `0 0 60px ${GREEN}50, 0 0 120px ${GREEN}20` }}>
                <TrendingUp className="w-12 h-12 text-black" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ border: `2px solid ${GREEN}`, boxShadow: `0 0 30px ${GREEN}30` }}
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-none"
          >
            Ready to start your{' '}
            <br />
            <span style={{ color: GREEN, textShadow: `0 0 40px ${GREEN}50` }}>
              trading journey?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-12"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Join thousands learning to invest intelligently — risk-free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <GlowButton onClick={() => navigate('/login')} size="lg">
              Create Free Account — Start Now <ArrowRight className="w-5 h-5" />
            </GlowButton>

            <div className="flex items-center gap-6 mt-2">
              {['No credit card', '₹1,00,000 virtual cash', '100% free'].map((t, i) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: GREEN }}>
              <TrendingUp className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-black">Actually</span>
            <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Stock Market Simulator</span>
          </div>
          <div className="flex gap-6">
            {['About', 'Features', 'Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" className="text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2026 Actually — Virtual trading only. Not real money.
          </p>
        </div>
      </footer>
    </div>
  );
}
