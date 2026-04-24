import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useNavigate } from 'react-router';
import { TrendingUp, TrendingDown, Zap, BarChart2, Trophy, Shield, ArrowRight, Star } from 'lucide-react';

// ── Animated number counter ───────────────────────────────────────
function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, { duration: 2, ease: 'easeOut' });
    const unsub = motionVal.on('change', v => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString('en-IN')}${suffix}`;
    });
    return () => { controls.stop(); unsub(); };
  }, [inView]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ── Animated SVG stock chart ───────────────────────────────────────
function StockChart() {
  const points = [40, 65, 45, 80, 60, 90, 70, 95, 75, 100, 80, 110, 88, 120, 100, 115, 105, 130];
  const w = 400, h = 180;
  const maxV = Math.max(...points), minV = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(v => h - ((v - minV) / (maxV - minV)) * (h * 0.8) - h * 0.1);
  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path
        d={areaD}
        fill="url(#chartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
        filter="url(#glow)"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
      />
      {/* Glowing dot at end */}
      <motion.circle
        cx={xs[xs.length - 1]}
        cy={ys[ys.length - 1]}
        r="5"
        fill="#10B981"
        filter="url(#glow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
      />
    </svg>
  );
}

// ── Mini stock card ───────────────────────────────────────────────
const DEMO_STOCKS = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: 79325, change: +3.42, up: true },
  { ticker: 'AAPL', name: 'Apple Inc', price: 19247, change: +1.18, up: true },
  { ticker: 'TSLA', name: 'Tesla Inc', price: 28808, change: -2.31, up: false },
  { ticker: 'MSFT', name: 'Microsoft', price: 39673, change: +0.87, up: true },
  { ticker: 'META', name: 'Meta', price: 51770, change: +2.05, up: true },
  { ticker: 'GOOGL', name: 'Alphabet', price: 15448, change: -0.44, up: false },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Main Component ────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Actually</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />
          {/* Grid lines */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Floating particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-emerald-500/30"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Live market simulation · 50+ stocks
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              >
                Master the Market.{' '}
                <span className="text-emerald-400">Risk-Free.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
              >
                Practice stock trading with <span className="text-emerald-400 font-semibold">₹50,000 virtual cash</span>.
                Real market data, real emotions — zero real risk.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition text-sm"
                >
                  Start Trading Free <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium rounded-xl transition text-sm"
                >
                  See How It Works
                </motion.a>
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 mt-8"
              >
                <div className="flex -space-x-2">
                  {['AS', 'PP', 'RV', 'SK'].map(initials => (
                    <div key={initials} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span className="text-xs text-white/50">Loved by 1,000+ traders</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Animated chart card */}
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main chart card */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Portfolio Value</p>
                      <p className="text-3xl font-bold text-white mt-0.5">₹54,320</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-semibold">+8.64%</span>
                    </div>
                  </div>
                  <div className="h-40">
                    <StockChart />
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-white/30">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                  </div>
                </div>

                {/* Floating mini cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-6 bg-[#111] border border-emerald-500/20 rounded-xl p-3 shadow-xl flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-400">NV</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">NVDA</p>
                    <p className="text-xs text-emerald-400">+3.42%</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -left-6 bg-[#111] border border-red-500/20 rounded-xl p-3 shadow-xl flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">TS</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">TSLA</p>
                    <p className="text-xs text-red-400">-2.31%</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <motion.div className="w-1 h-2 bg-white/40 rounded-full"
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── LIVE MARKETS TICKER ──────────────────────────────────── */}
      <div className="border-y border-white/5 bg-[#0d0d0d] py-3 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...DEMO_STOCKS, ...DEMO_STOCKS].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-4">
              <span className="text-xs font-bold text-white/70">{s.ticker}</span>
              <span className="text-xs text-white/40">₹{s.price.toLocaleString('en-IN')}</span>
              <span className={`text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.up ? '▲' : '▼'} {Math.abs(s.change)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Why Actually</p>
            <h2 className="text-4xl font-bold tracking-tight">Everything you need to learn trading</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto">Professional-grade tools, real market data, zero risk. The best way to become a confident trader.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Zap className="w-6 h-6 text-emerald-400" />,
                title: 'Live Market Data',
                desc: 'Real-time prices for 50+ stocks across 8 sectors. WebSocket-powered updates every 2 seconds.',
                tag: '50+ Stocks',
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-emerald-400" />,
                title: 'Virtual Portfolio',
                desc: 'Start with ₹50,000 virtual cash. Buy, sell, track your P&L — exactly like a real brokerage.',
                tag: '₹50,000 Cash',
              },
              {
                icon: <Trophy className="w-6 h-6 text-emerald-400" />,
                title: 'Compete & Grow',
                desc: 'Global leaderboard, achievements, levels. See how your strategy stacks up against other traders.',
                tag: 'Leaderboard',
              },
              {
                icon: <Shield className="w-6 h-6 text-emerald-400" />,
                title: 'Zero Risk',
                desc: "It's virtual money. Make mistakes, learn from them, refine your strategy — all without losing a rupee.",
                tag: '100% Safe',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
                title: 'Market News',
                desc: 'AI-powered news feed with bullish/bearish sentiment indicators that actually affect stock prices.',
                tag: 'Live News',
              },
              {
                icon: <Star className="w-6 h-6 text-emerald-400" />,
                title: 'Achievements',
                desc: 'Unlock badges for your first trade, profit streaks, and portfolio milestones. Level up your trader rank.',
                tag: 'Gamified',
              },
            ].map(({ icon, title, desc, tag }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(16,185,129,0.1)' }}
                className="bg-[#111] border border-white/8 rounded-2xl p-6 group cursor-default transition-all"
              >
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition">
                  {icon}
                </div>
                <div className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded uppercase tracking-wider mb-3">
                  {tag}
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIVE MARKET PREVIEW ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Simulated Live Data
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Real-Time Market Simulation</h2>
            <p className="text-white/50 mt-3">Prices update every 2 seconds, just like a real exchange.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {DEMO_STOCKS.map((stock) => (
              <motion.div
                key={stock.ticker}
                variants={itemVariants}
                whileHover={{ scale: 1.03, borderColor: stock.up ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}
                className="bg-[#111] border border-white/8 rounded-xl p-4 transition-all cursor-default"
              >
                <div className={`w-8 h-8 rounded-lg ${stock.up ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center justify-center mb-3`}>
                  <span className={`text-xs font-bold ${stock.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.ticker.substring(0, 2)}
                  </span>
                </div>
                <p className="text-xs font-bold mb-0.5">{stock.ticker}</p>
                <p className="text-xs text-white/40 mb-2 truncate">{stock.name}</p>
                <p className="text-sm font-semibold tabular-nums">₹{stock.price.toLocaleString('en-IN')}</p>
                <div className={`flex items-center gap-1 mt-1 ${stock.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-xs font-medium">{stock.up ? '+' : ''}{stock.change}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 border border-white/15 hover:border-emerald-500/40 text-white/70 hover:text-white rounded-xl transition text-sm font-medium"
            >
              Trade All 50+ Stocks →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Get Started</p>
            <h2 className="text-4xl font-bold tracking-tight">Up and trading in 60 seconds</h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: '01',
                  icon: <Shield className="w-6 h-6 text-emerald-400" />,
                  title: 'Create Account',
                  desc: 'Sign up in 30 seconds. No email, no credit card, no KYC. Just pick a username and go.',
                },
                {
                  step: '02',
                  icon: <BarChart2 className="w-6 h-6 text-emerald-400" />,
                  title: 'Start Trading',
                  desc: 'You get ₹50,000 virtual cash instantly. Browse 50+ stocks and place your first trade.',
                },
                {
                  step: '03',
                  icon: <Trophy className="w-6 h-6 text-emerald-400" />,
                  title: 'Track & Win',
                  desc: 'Monitor your portfolio, read live market news, and climb the leaderboard rankings.',
                },
              ].map(({ step, icon, title, desc }) => (
                <motion.div key={step} variants={itemVariants} className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 bg-[#111] border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                      {icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">{step.replace('0', '')}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: 'Stocks Available', value: 50, suffix: '+', prefix: '' },
              { label: 'Starting Virtual Cash', value: 50000, suffix: '', prefix: '₹' },
              { label: 'Price Updates / Day', value: 43200, suffix: '+', prefix: '' },
              { label: 'Cost Forever', value: 0, suffix: '', prefix: '₹' },
            ].map(({ label, value, suffix, prefix }) => (
              <motion.div key={label} variants={itemVariants}>
                <div className="text-4xl font-black text-emerald-400 tabular-nums mb-2">
                  <CountUp to={value} suffix={suffix} prefix={prefix} />
                </div>
                <p className="text-sm text-white/50">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold tracking-tight">Traders love Actually</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { quote: "Best way to learn trading without losing real money. I went from zero to understanding options in 3 weeks!", name: 'Arjun S.', role: 'College Student' },
              { quote: "The live data makes it feel so real. Price movements, news impact — it's genuinely educational.", name: 'Priya P.', role: 'Software Engineer' },
              { quote: "I practice my strategies here before executing them with real money. Saved me from a lot of bad trades.", name: 'Rahul V.', role: 'Day Trader' },
            ].map(({ quote, name, role }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(16,185,129,0.25)' }}
                className="bg-[#111] border border-white/8 rounded-2xl p-6 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-white/40">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Glowing orb */}
            <div className="relative inline-flex mb-8">
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl -z-10 scale-125" />
            </div>

            <h2 className="text-5xl font-black tracking-tight mb-4">
              Ready to start your{' '}
              <span className="text-emerald-400">trading journey?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10">
              Join thousands of traders learning to invest risk-free. No credit card required.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-lg transition"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </motion.button>

            <p className="text-white/30 text-xs mt-4">
              Start with ₹50,000 virtual cash · No credit card · 100% free forever
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">Actually</span>
              <span className="text-white/20 text-xs ml-2">Stock Market Simulator</span>
            </div>
            <div className="flex gap-6 text-sm text-white/40">
              {['About', 'Features', 'Privacy', 'Terms', 'Contact'].map(link => (
                <a key={link} href="#" className="hover:text-white/70 transition">{link}</a>
              ))}
            </div>
            <p className="text-white/25 text-xs text-center md:text-right">
              © 2026 Actually. Virtual trading only — not real money.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
