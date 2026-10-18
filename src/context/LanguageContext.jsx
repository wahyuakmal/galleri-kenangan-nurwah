import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { coupleConfig as defaultCoupleConfig, coupleDataByLang } from '../data/coupleData';
import { useAdmin } from './AdminContext';

const LanguageContext = createContext();

export function mergeCoupleData(baseData, siteSettings, galleryPhotos, timelineEvents, loveNote) {
  let merged = JSON.parse(JSON.stringify(baseData));

  // 1. Site Settings Overrides (Hero, Story, Final, Titles, Music, Names)
  if (siteSettings) {
    // Hero Section Overrides
    merged.hero = {
      ...merged.hero,
      badge: siteSettings.hero_badge || merged.hero.badge,
      title: siteSettings.hero_title || merged.hero.title,
      subtitle: siteSettings.hero_subtitle || merged.hero.subtitle,
      mainImage: siteSettings.hero_image_url || merged.hero.mainImage,
      quoteOverlay: siteSettings.hero_quote || merged.hero.quoteOverlay,
      imageCaption: siteSettings.hero_caption || merged.hero.imageCaption,
    };

    // Story Section (Section 01) Overrides
    merged.story = {
      ...merged.story,
      sectionTitle: siteSettings.story_section_title || merged.story.sectionTitle,
      subheading: siteSettings.story_subheading || merged.story.subheading,
      chapterTag: siteSettings.story_chapter_tag || merged.story.chapterTag,
      title: siteSettings.story_title || merged.story.title,
      date: siteSettings.story_date || merged.story.date,
      location: siteSettings.story_location || merged.story.location,
      coordinates: siteSettings.story_coordinates || merged.story.coordinates,
      description: siteSettings.story_description || merged.story.description,
      quote: siteSettings.story_quote || merged.story.quote,
      image1: siteSettings.story_image1_url || merged.story.image1,
      image1Caption: siteSettings.story_image1_caption || merged.story.image1Caption,
      image2: siteSettings.story_image2_url || merged.story.image2,
      image2Caption: siteSettings.story_image2_caption || merged.story.image2Caption,
    };

    // Profile Section (Section 02 - Profil Pasangan) Overrides
    merged.profile = {
      sectionNumber: "02",
      sectionTitle: siteSettings.profile_section_title || merged.profile?.sectionTitle || "PROFIL PASANGAN",
      subheading: siteSettings.profile_subheading || merged.profile?.subheading || "Dua insan berbeda dengan cerita masing-masing,\nyang dipertemukan untuk saling melengkapi.",
      partner1: {
        name: siteSettings.partner1_name || merged.profile?.partner1?.name || "Wahyu",
        fullname: siteSettings.partner1_fullname || merged.profile?.partner1?.fullname || "Wahyu",
        role: siteSettings.partner1_role || merged.profile?.partner1?.role || "Mempelai Pria",
        bio: siteSettings.partner1_bio || merged.profile?.partner1?.bio || "Pribadi yang tenang, penuh dedikasi, dan selalu berusaha memberikan yang terbaik. Baginya, kebahagiaan terbesar adalah melihat senyum tulus terbit di wajah orang yang paling dicintainya.",
        quote: siteSettings.partner1_quote || merged.profile?.partner1?.quote || "“Menemukanmu adalah takdir terindah yang selalu aku syukuri di setiap hembusan nafas.”",
        birthdate: siteSettings.partner1_birthdate || merged.profile?.partner1?.birthdate || "Kampar, Riau",
        instagram: siteSettings.partner1_instagram || merged.profile?.partner1?.instagram || "@wahyu",
        photo: siteSettings.partner1_photo_url || merged.profile?.partner1?.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
      },
      partner2: {
        name: siteSettings.partner2_name || merged.profile?.partner2?.name || "Nur",
        fullname: siteSettings.partner2_fullname || merged.profile?.partner2?.fullname || "Nur",
        role: siteSettings.partner2_role || merged.profile?.partner2?.role || "Mempelai Wanita",
        bio: siteSettings.partner2_bio || merged.profile?.partner2?.bio || "Sosok yang hangat, berhati lembut, dan senantiasa membawa keteduhan di setiap langkah. Kehadirannya adalah alasan mengapa rumah terasa begitu nyaman dan penuh tawa.",
        quote: siteSettings.partner2_quote || merged.profile?.partner2?.quote || "“Di antara ramainya dunia, hatiku selalu tahu bahwa kamu adalah tempat paling aman untuk pulang.”",
        birthdate: siteSettings.partner2_birthdate || merged.profile?.partner2?.birthdate || "Bangkinang, Riau",
        instagram: siteSettings.partner2_instagram || merged.profile?.partner2?.instagram || "@nur",
        photo: siteSettings.partner2_photo_url || merged.profile?.partner2?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
      }
    };

    // Nav label for Section 02
    merged.nav = {
      ...merged.nav,
      timeline: siteSettings.profile_section_title ? `02 ${siteSettings.profile_section_title}` : "02 PROFIL PASANGAN",
      profile: siteSettings.profile_section_title ? `02 ${siteSettings.profile_section_title}` : "02 PROFIL PASANGAN"
    };

    // Timeline Section Header Overrides (Fallback)
    if (siteSettings.timeline_section_title) {
      merged.timeline.sectionTitle = siteSettings.timeline_section_title;
    }
    if (siteSettings.timeline_subheading) {
      merged.timeline.subheading = siteSettings.timeline_subheading;
    }

    // Final Section & Footer Overrides
    merged.final = {
      ...merged.final,
      quote: siteSettings.final_quote || merged.final.quote,
      subtext: siteSettings.final_subtext || merged.final.subtext,
      buttonText: siteSettings.final_button_text || merged.final.buttonText,
      footerText: siteSettings.final_footer_text || merged.final.footerText,
      copyright: siteSettings.final_copyright || merged.final.copyright,
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
      image: item.image_url || 
             baseData.timeline?.milestones?.[index % (baseData.timeline?.milestones?.length || 1)]?.image || 
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
      heading: loveNote.heading || merged.loveLetter.heading,
      date: loveNote.date || merged.loveLetter.date,
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

    const p1 = siteSettings?.partner1_name || names[0] || 'Wahyu';
    const p2 = siteSettings?.partner2_name || names[1] || 'Nur';
    const coupleNames = siteSettings?.couple_names || `${p1} & ${p2}`;

    return {
      partner1: p1,
      partner2: p2,
      coupleNames: coupleNames,
      anniversaryDate: siteSettings?.relationship_start_date || '2023-10-24',
      music: {
        audioSrc: siteSettings?.bg_music_url || defaultCoupleConfig.music.audioSrc,
        title: "Lagu Semesta Kita",
        artist: coupleNames
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
