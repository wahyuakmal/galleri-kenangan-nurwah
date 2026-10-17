import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

export const HeroSection = () => {
  const { data, coupleConfig } = useLanguage();
  const { isAdmin, openDashboardModal, siteSettings } = useAdmin();

  const coupleNames = siteSettings?.couple_names || coupleConfig?.coupleNames || `${coupleConfig?.partner1} & ${coupleConfig?.partner2}`;
  const anniversaryDate = siteSettings?.relationship_start_date || coupleConfig?.anniversaryDate || '2023-10-24';
  const heroTitle = siteSettings?.hero_title || data?.hero?.title;
  const heroSubtitle = siteSettings?.hero_subtitle || data?.hero?.subtitle;
  const heroQuote = data?.hero?.quoteOverlay;
  const heroImage = siteSettings?.hero_image_url || data?.hero?.mainImage;

  // Perhitungan otomatis jumlah hari bersama (Day Counter)
  const daysTogether = useMemo(() => {
    try {
      if (!anniversaryDate) return 0;
      const start = new Date(anniversaryDate);
      const now = new Date();
      start.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const diffTime = Math.max(0, now - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 0 : diffDays;
    } catch {
      return 0;
    }
  }, [anniversaryDate]);

  const scrollToStory = () => {
    const el = document.getElementById('story');
    if (el) {
      const yOffset = -60;
      const currentScroll = window.scrollY || window.pageYOffset;
      const y = el.getBoundingClientRect().top + currentScroll + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Top Header & Headline */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-warm-200/15 bg-white/[0.02] backdrop-blur-sm mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-champagne-300 animate-pulse" />
          <span className="text-[10px] md:text-[11px] tracking-mega-wide uppercase font-sans text-warm-300/80">
            {data?.hero?.badge}
          </span>
        </motion.div>

        {/* Large Cinematic Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.18] tracking-tight text-warm-50 font-normal mb-2 whitespace-pre-line text-glow-subtle"
        >
          {heroTitle}
        </motion.h1>
      </div>

      {/* Main Couple Photo Card (Bersih & Bebas dari Teks yang Menutupi) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-8 md:my-12 w-full max-w-5xl mx-auto group"
      >
        {/* Bingkai Foto - 100% Foto Terlihat Penuh Tanpa Gradient Gelap yang Menutupi */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden cinematic-shadow bg-[#121212] border border-white/[0.08] aspect-[16/10] md:aspect-[16/9]">
          <motion.img
            src={heroImage}
            alt={coupleNames}
            className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-[1.02] filter contrast-[1.02] brightness-[0.96]"
            loading="eager"
          />

          {/* Tekstur Film Grain Halus */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Admin Quick Edit Button */}
          {isAdmin && (
            <button
              onClick={() => openDashboardModal('settings')}
              className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full glass-panel border border-champagne-400/50 text-champagne-300 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-lg hover:bg-champagne-400/20 transition-all opacity-80 hover:opacity-100"
              title="Edit Hero & Pengaturan Situs"
            >
              <span>✏️ Edit Pengaturan Situs</span>
            </button>
          )}
        </div>

        {/* ============================================================== */}
        {/* DESKRIPSI & KETERANGAN DI BAWAH FOTO (TIDAK MENUTUPI FOTO)    */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-6 px-3 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-t border-white/[0.08] pt-6"
        >
          {/* Kolom Kiri: Deskripsi & Kutipan Romantis */}
          <div className="space-y-2 max-w-2xl">
            {heroSubtitle && (
              <p className="font-sans text-xs sm:text-sm md:text-base text-warm-200/90 font-light tracking-wide leading-relaxed">
                {heroSubtitle}
              </p>
            )}

            {heroQuote && (
              <p className="font-serif italic text-sm sm:text-base md:text-lg text-champagne-300/85 font-light">
                {heroQuote}
              </p>
            )}

            {data?.hero?.imageCaption && (
              <p className="text-[10px] sm:text-[11px] tracking-widest uppercase font-sans text-warm-400/50 font-mono pt-0.5">
                {data?.hero?.imageCaption}
              </p>
            )}
          </div>

          {/* Kolom Kanan: Day Counter Badge / Pill */}
          <div className="glass-pill px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 flex-shrink-0 self-start md:self-center shadow-md">
            <span className="w-2 h-2 rounded-full bg-champagne-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] tracking-mega-wide uppercase text-warm-300 font-sans font-medium">
              {data?.hero?.daysPrefix} {daysTogether} {data?.hero?.daysSuffix}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
        className="flex flex-col items-center justify-center pt-2"
      >
        <button
          onClick={scrollToStory}
          className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
        >
          <span className="text-[10px] tracking-mega-wide uppercase font-sans text-warm-300/50 group-hover:text-warm-200 transition-colors">
            {data?.hero?.scrollText}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-warm-300/60 group-hover:border-warm-200/50 group-hover:text-warm-100 transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;