import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Instagram, MapPin, Sparkles, Edit3, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

export const ProfileSection = () => {
  const { data, coupleConfig } = useLanguage();
  const { isAdmin, openDashboardModal } = useAdmin();
  const profile = data?.profile || {};
  const partner1 = profile?.partner1 || {};
  const partner2 = profile?.partner2 || {};

  return (
    <section id="profile" className="relative py-28 md:py-40 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.05]">
      {/* Anchor for backwards compatibility */}
      <div id="timeline" className="absolute -top-24 pointer-events-none" />

      {/* Section Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-3 mb-4 justify-center"
        >
          <div className="h-[1px] w-8 bg-champagne-400/30" />
          <span className="text-xs md:text-sm font-sans tracking-mega-wide uppercase text-champagne-400">
            {profile.sectionNumber || "02"} — {profile.sectionTitle || "PROFIL PASANGAN"}
          </span>
          <div className="h-[1px] w-8 bg-champagne-400/30" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.15 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-warm-50 font-normal leading-snug whitespace-pre-line"
        >
          {profile.subheading || "Dua insan berbeda dengan cerita masing-masing,\nyang dipertemukan untuk saling melengkapi."}
        </motion.h2>

        {/* Admin Quick Edit Button */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={() => openDashboardModal('profile')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-lg transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>✏️ Edit Foto & Data Diri Pasangan</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 max-w-6xl mx-auto items-stretch">
        
        {/* ============================================================== */}
        {/* CARD 1: PARTNER 1 (WAHYU / SANG PRIA)                          */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative rounded-2xl md:rounded-3xl p-6 sm:p-9 glass-panel border border-white/[0.08] hover:border-champagne-400/40 transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-champagne-400/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-champagne-400/[0.08] transition-all duration-700" />

          <div>
            {/* Foto Partner 1 */}
            <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-[#121212] border border-white/10 shadow-xl mb-6">
              <img
                src={partner1.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                alt={partner1.name || "Wahyu"}
                className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.04] transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />

              {/* Admin Quick Edit Button on Photo */}
              {isAdmin && (
                <button
                  onClick={() => openDashboardModal('profile')}
                  className="absolute top-3.5 right-3.5 z-20 px-3 py-1.5 rounded-full glass-panel border border-champagne-400/50 text-champagne-300 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-lg hover:bg-champagne-400/20 transition-all opacity-85 hover:opacity-100"
                  title="Ganti Foto Profil"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ganti Foto</span>
                </button>
              )}

              {/* Subtle Gradient & Role Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="glass-pill px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-sans text-champagne-300 border border-champagne-400/30">
                  {partner1.role || "Mempelai Pria"}
                </span>
                {partner1.instagram && (
                  <span className="text-[11px] font-mono text-warm-300/80 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Instagram className="w-3 h-3 text-champagne-400" />
                    <span>{partner1.instagram}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Nama & Identitas */}
            <div className="mb-4">
              <h3 className="font-editorial text-3xl sm:text-4xl text-warm-50 font-normal tracking-wide mb-1 text-glow-subtle">
                {partner1.fullname || partner1.name || "Wahyu"}
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-mono text-champagne-300/80 tracking-wider">
                <User className="w-3.5 h-3.5 text-champagne-400" />
                <span>{partner1.role || "Mempelai Pria"}</span>
                {partner1.birthdate && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1 text-warm-300/70">
                      <MapPin className="w-3 h-3" />
                      <span>{partner1.birthdate}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-12 h-[1px] bg-champagne-400/30 my-4" />

            {/* Bio / Deskripsi Diri */}
            <p className="font-sans text-xs sm:text-sm text-warm-200/85 leading-relaxed font-light text-justify whitespace-pre-line mb-5">
              {partner1.bio || "Pribadi yang tenang, penuh dedikasi, dan selalu berusaha memberikan yang terbaik. Baginya, kebahagiaan terbesar adalah melihat senyum tulus terbit di wajah orang yang paling dicintainya."}
            </p>
          </div>

          {/* Quote Callout */}
          {partner1.quote && (
            <div className="pt-4 border-t border-white/[0.08] mt-2">
              <blockquote className="font-serif italic text-xs sm:text-sm text-champagne-200/90 border-l-2 border-champagne-400/50 pl-3 leading-relaxed">
                {partner1.quote}
              </blockquote>
            </div>
          )}
        </motion.div>

        {/* ============================================================== */}
        {/* CARD 2: PARTNER 2 (NUR / SANG WANITA)                          */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative rounded-2xl md:rounded-3xl p-6 sm:p-9 glass-panel border border-white/[0.08] hover:border-mutedrose-400/40 transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-mutedrose-400/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-mutedrose-400/[0.08] transition-all duration-700" />

          <div>
            {/* Foto Partner 2 */}
            <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-[#121212] border border-white/10 shadow-xl mb-6">
              <img
                src={partner2.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"}
                alt={partner2.name || "Nur"}
                className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.04] transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />

              {/* Admin Quick Edit Button on Photo */}
              {isAdmin && (
                <button
                  onClick={() => openDashboardModal('profile')}
                  className="absolute top-3.5 right-3.5 z-20 px-3 py-1.5 rounded-full glass-panel border border-champagne-400/50 text-champagne-300 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-lg hover:bg-champagne-400/20 transition-all opacity-85 hover:opacity-100"
                  title="Ganti Foto Profil"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ganti Foto</span>
                </button>
              )}

              {/* Subtle Gradient & Role Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="glass-pill px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-sans text-rose-300 border border-rose-400/30">
                  {partner2.role || "Mempelai Wanita"}
                </span>
                {partner2.instagram && (
                  <span className="text-[11px] font-mono text-warm-300/80 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Instagram className="w-3 h-3 text-rose-400" />
                    <span>{partner2.instagram}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Nama & Identitas */}
            <div className="mb-4">
              <h3 className="font-editorial text-3xl sm:text-4xl text-warm-50 font-normal tracking-wide mb-1 text-glow-subtle">
                {partner2.fullname || partner2.name || "Nur"}
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-mono text-rose-300/80 tracking-wider">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>{partner2.role || "Mempelai Wanita"}</span>
                {partner2.birthdate && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1 text-warm-300/70">
                      <MapPin className="w-3 h-3" />
                      <span>{partner2.birthdate}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-12 h-[1px] bg-rose-400/30 my-4" />

            {/* Bio / Deskripsi Diri */}
            <p className="font-sans text-xs sm:text-sm text-warm-200/85 leading-relaxed font-light text-justify whitespace-pre-line mb-5">
              {partner2.bio || "Sosok yang hangat, berhati lembut, dan senantiasa membawa keteduhan di setiap langkah. Kehadirannya adalah alasan mengapa rumah terasa begitu nyaman dan penuh tawa."}
            </p>
          </div>

          {/* Quote Callout */}
          {partner2.quote && (
            <div className="pt-4 border-t border-white/[0.08] mt-2">
              <blockquote className="font-serif italic text-xs sm:text-sm text-rose-200/90 border-l-2 border-rose-400/50 pl-3 leading-relaxed">
                {partner2.quote}
              </blockquote>
            </div>
          )}
        </motion.div>

      </div>

      {/* Decorative Center Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mt-16 flex flex-col items-center justify-center text-center"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 glass-panel">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-pulse" />
          <span className="font-serif text-sm text-warm-200 tracking-wider">
            {partner1.name || "Wahyu"} & {partner2.name || "Nur"}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[10px] uppercase font-sans tracking-widest text-warm-400/60">
            Dua Jiwa Satu Semesta
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default ProfileSection;
