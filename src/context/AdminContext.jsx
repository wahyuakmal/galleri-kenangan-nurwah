import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  uploadHeroPhoto,
  uploadBgMusic,
  getGalleryPhotos, 
  addGalleryPhoto, 
  updateGalleryPhoto, 
  deleteGalleryPhoto,
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  getLoveNote,
  updateLoveNote
} from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { coupleConfig, coupleDataByLang } from '../data/coupleData';

const AdminContext = createContext();

const DEFAULT_ADMIN_PIN = 'semesta123';
const SESSION_KEY = 'olu_admin_session';

export const AdminProvider = ({ children }) => {
  // 1. Session Storage Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Modal display states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState('gallery'); // 'gallery' | 'settings' | 'timeline' | 'letter' | 'security'
  const [editTargetData, setEditTargetData] = useState(null);

  // 2. Supabase Dynamic Data States
  const [siteSettings, setSiteSettings] = useState({
    couple_names: `${coupleConfig.partner1} & ${coupleConfig.partner2}`,
    relationship_start_date: coupleConfig.anniversaryDate === '0000-00-00' ? '2023-10-24' : coupleConfig.anniversaryDate,
    hero_title: coupleDataByLang.id.hero.title,
    hero_subtitle: coupleDataByLang.id.hero.subtitle,
    hero_image_url: coupleDataByLang.id.hero.mainImage,
    bg_music_url: coupleConfig.music.audioSrc,
    admin_pin: DEFAULT_ADMIN_PIN,
  });

  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loveNote, setLoveNote] = useState({
    letter_content: coupleDataByLang.id.loveLetter.paragraphs.join('\n\n'),
    signature_names: `${coupleConfig.partner1} & ${coupleConfig.partner2}`
  });

  const [isLoading, setIsLoading] = useState(true);

  // 3. Load all data from Supabase
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const [settings, photos, timeline, note] = await Promise.all([
          getSiteSettings(),
          getGalleryPhotos(),
          getTimelineEvents(),
          getLoveNote()
        ]);

        if (settings) {
          setSiteSettings(prev => ({
            ...prev,
            ...settings,
            admin_pin: settings.admin_pin || DEFAULT_ADMIN_PIN
          }));
        }

        if (photos && Array.isArray(photos)) {
          setGalleryPhotos(photos);
        }

        if (timeline && Array.isArray(timeline)) {
          setTimelineEvents(timeline);
        }

        if (note) {
          setLoveNote(note);
        }
      }
    } catch (err) {
      console.warn('Error loading Supabase data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // 4. Login with PIN (Protected by sessionStorage)
  const login = (inputPin) => {
    const currentPin = siteSettings.admin_pin || DEFAULT_ADMIN_PIN;
    if (inputPin === currentPin) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {}
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'PIN Admin salah. Silakan coba lagi.' };
  };

  // 5. Logout
  const logout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setIsDashboardModalOpen(false);
  };

  // 6. Ganti PIN Admin
  const changePin = async (newPin) => {
    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'PIN minimal 4 karakter.' };
    }
    try {
      if (isSupabaseConfigured) {
        await updateSiteSettings({ admin_pin: newPin });
      }
      setSiteSettings(prev => ({ ...prev, admin_pin: newPin }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Gagal mengubah PIN.' };
    }
  };

  // 7. Site Settings Updates
  const saveSiteSettings = async (newSettings) => {
    try {
      if (isSupabaseConfigured) {
        const updated = await updateSiteSettings(newSettings);
        setSiteSettings(prev => ({ ...prev, ...updated }));
        return { success: true, data: updated };
      } else {
        setSiteSettings(prev => ({ ...prev, ...newSettings }));
        return { success: true, data: newSettings };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const uploadHero = async (file) => {
    const res = await uploadHeroPhoto(file);
    if (res?.publicUrl) {
      await saveSiteSettings({ hero_image_url: res.publicUrl });
    }
    return res;
  };

  const uploadAudio = async (file) => {
    const res = await uploadBgMusic(file);
    if (res?.publicUrl) {
      await saveSiteSettings({ bg_music_url: res.publicUrl });
    }
    return res;
  };

  // 8. Gallery Photos CRUD
  const addPhoto = async ({ title, caption, date_taken, aspect_ratio, file, imageUrl }) => {
    try {
      const newPhoto = await addGalleryPhoto({
        title,
        caption,
        date_taken,
        aspect_ratio,
        file,
        imageUrl
      });
      setGalleryPhotos(prev => [newPhoto, ...prev]);
      return { success: true, data: newPhoto };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePhoto = async (id, updates) => {
    try {
      const updated = await updateGalleryPhoto(id, updates);
      setGalleryPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePhoto = async (id, storagePath) => {
    try {
      await deleteGalleryPhoto(id, storagePath);
      setGalleryPhotos(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 9. Timeline Events CRUD
  const addTimeline = async (timelineData) => {
    try {
      const newEvent = await addTimelineEvent(timelineData);
      setTimelineEvents(prev => [...prev, newEvent].sort((a, b) => a.display_order - b.display_order));
      return { success: true, data: newEvent };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTimeline = async (id, updates) => {
    try {
      const updated = await updateTimelineEvent(id, updates);
      setTimelineEvents(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t).sort((a, b) => a.display_order - b.display_order));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTimeline = async (id) => {
    try {
      await deleteTimelineEvent(id);
      setTimelineEvents(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 10. Love Note Update
  const saveLoveNote = async ({ letter_content, signature_names }) => {
    try {
      const updated = await updateLoveNote({
        letter_content,
        signature_names,
        id: loveNote?.id
      });
      setLoveNote(prev => ({ ...prev, ...updated }));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Modal helpers
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openDashboardModal = (tab = 'gallery', targetData = null) => {
    setActiveDashboardTab(tab);
    setEditTargetData(targetData);
    setIsDashboardModalOpen(true);
  };

  const closeDashboardModal = () => {
    setIsDashboardModalOpen(false);
    setEditTargetData(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        changePin,
        siteSettings,
        saveSiteSettings,
        uploadHero,
        uploadAudio,
        galleryPhotos,
        addPhoto,
        updatePhoto,
        deletePhoto,
        timelineEvents,
        addTimeline,
        updateTimeline,
        deleteTimeline,
        loveNote,
        saveLoveNote,
        isLoading,
        refreshAllData,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isDashboardModalOpen,
        openDashboardModal,
        closeDashboardModal,
        activeDashboardTab,
        setActiveDashboardTab,
        editTargetData,
        isSupabaseConfigured
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
