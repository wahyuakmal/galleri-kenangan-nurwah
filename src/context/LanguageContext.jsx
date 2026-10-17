import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { coupleConfig as defaultCoupleConfig, coupleDataByLang } from '../data/coupleData';
import { useAdmin } from './AdminContext';

const LanguageContext = createContext();

export function mergeCoupleData(baseData, siteSettings, galleryPhotos, timelineEvents, loveNote) {
  let merged = { ...baseData };

  // 1. Site Settings Overrides (Hero, Titles, Music, Names)
  if (siteSettings) {
    merged.hero = {
      ...merged.hero,
      title: siteSettings.hero_title || merged.hero.title,
      subtitle: siteSettings.hero_subtitle || merged.hero.subtitle,
      mainImage: siteSettings.hero_image_url || merged.hero.mainImage,
    };
  }

  // 2. Moments Gallery from Supabase gallery_photos
  if (galleryPhotos && galleryPhotos.length > 0) {
    const dbGallery = galleryPhotos.map(item => ({
      id: item.id,
      date: item.date_taken || '',
      image: item.image_url,
      caption: item.caption || item.title || '',
      location: item.title || '',
      aspect: item.aspect_ratio || 'portrait',
      storage_path: item.storage_path
    }));

    merged.moments = {
      ...merged.moments,
      gallery: dbGallery
    };
  }

  // 3. Timeline Events from Supabase timeline_events
  if (timelineEvents && timelineEvents.length > 0) {
    const dbMilestones = timelineEvents.map((item, index) => ({
      id: item.id,
      date: item.year_or_date || '',
      title: item.title || '',
      subtitle: item.location || '',
      description: item.description || '',
      location: item.location || '',
      tag: item.location ? item.location : `Babak ${index + 1}`,
      // Fallback image from default list if needed
      image: baseData.timeline?.milestones?.[index % (baseData.timeline?.milestones?.length || 1)]?.image || 
             'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop'
    }));

    merged.timeline = {
      ...merged.timeline,
      milestones: dbMilestones
    };
  }

  // 4. Love Note from Supabase love_notes
  if (loveNote && loveNote.letter_content) {
    const paragraphs = loveNote.letter_content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);

    merged.loveLetter = {
      ...merged.loveLetter,
      paragraphs: paragraphs.length > 0 ? paragraphs : merged.loveLetter.paragraphs,
      signature: loveNote.signature_names || merged.loveLetter.signature
    };
  }

  return merged;
}

export const LanguageProvider = ({ children }) => {
  const { siteSettings, galleryPhotos, timelineEvents, loveNote } = useAdmin();

  // Default language is 'id' (Bahasa Indonesia)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('olu_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('olu_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const rawData = coupleDataByLang[lang] || coupleDataByLang.id;

  // Merge default text with Supabase data
  const data = useMemo(() => {
    return mergeCoupleData(rawData, siteSettings, galleryPhotos, timelineEvents, loveNote);
  }, [rawData, siteSettings, galleryPhotos, timelineEvents, loveNote]);

  // Compute dynamic coupleConfig
  const coupleConfig = useMemo(() => {
    const names = (siteSettings?.couple_names || `${defaultCoupleConfig.partner1} & ${defaultCoupleConfig.partner2}`)
      .split(/&|dan|\+/i)
      .map(s => s.trim());

    return {
      partner1: names[0] || 'Wahyu',
      partner2: names[1] || 'Nur',
      coupleNames: siteSettings?.couple_names || `${defaultCoupleConfig.partner1} & ${defaultCoupleConfig.partner2}`,
      anniversaryDate: siteSettings?.relationship_start_date || '2023-10-24',
      music: {
        audioSrc: siteSettings?.bg_music_url || defaultCoupleConfig.music.audioSrc,
        title: "Lagu Semesta Kita",
        artist: siteSettings?.couple_names || "Wahyu & Nur"
      }
    };
  }, [siteSettings]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, data, coupleConfig }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
