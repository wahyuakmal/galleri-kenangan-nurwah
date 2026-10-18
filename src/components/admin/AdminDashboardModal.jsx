import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Image as ImageIcon, Plus, Trash2, Edit3, Upload, Check, AlertCircle, 
  RotateCcw, Sparkles, Calendar, MapPin, KeyRound, ShieldAlert,
  Layers, Bookmark, FileText, ArrowRight, Music, Heart, Loader2, Save,
  Eye, EyeOff, BookOpen, Compass, Quote, MessageSquare
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminDashboardModal = () => {
  const { 
    isDashboardModalOpen, 
    closeDashboardModal, 
    activeDashboardTab, 
    setActiveDashboardTab,
    siteSettings,
    saveSiteSettings,
    uploadHero,
    uploadStory,
    uploadTimeline,
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
    changePin,
    logout,
    editTargetData,
    isSupabaseConfigured
  } = useAdmin();

  const { data } = useLanguage();

  // Toast alert
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab 1: Galeri Foto Form State
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [photoAspect, setPhotoAspect] = useState('portrait');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoStoragePath, setPhotoStoragePath] = useState('');

  // Tab 2: Site Settings & Hero Form State
  const [settingsForm, setSettingsForm] = useState({
    couple_names: '',
    relationship_start_date: '',
    hero_badge: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    hero_quote: '',
    hero_caption: '',
    bg_music_url: '',

    // Story Section (Section 01)
    story_section_title: '',
    story_subheading: '',
    story_chapter_tag: '',
    story_title: '',
    story_date: '',
    story_location: '',
    story_coordinates: '',
    story_description: '',
    story_quote: '',
    story_image1_url: '',
    story_image1_caption: '',
    story_image2_url: '',
    story_image2_caption: '',

    // Timeline Header
    timeline_section_title: '',
    timeline_subheading: '',

    // Final Section & Footer
    final_quote: '',
    final_subtext: '',
    final_button_text: '',
    final_footer_text: '',
    final_copyright: '',
  });

  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [musicFileName, setMusicFileName] = useState('');

  // Story Files Form State
  const [story1File, setStory1File] = useState(null);
  const [story1Preview, setStory1Preview] = useState('');
  const [story2File, setStory2File] = useState(null);
  const [story2Preview, setStory2Preview] = useState('');

  // Tab 4: Timeline Form State
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    year_or_date: '',
    title: '',
    description: '',
    location: '',
    image_url: '',
    display_order: 0
  });
  const [timelineFile, setTimelineFile] = useState(null);
  const [timelinePreview, setTimelinePreview] = useState('');

  // Tab 5: Love Note & Final Form State
  const [noteForm, setNoteForm] = useState({
    heading: '',
    date: '',
    letter_content: '',
    signature_names: '',
    final_quote: '',
    final_subtext: '',
    final_button_text: '',
    final_footer_text: '',
    final_copyright: ''
  });

  // Tab 6: Security / PIN Form State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinFeedback, setPinFeedback] = useState({ type: '', text: '' });

  // Delete Confirmation Dialog State
  const [deleteDialog, setDeleteDialog] = useState(null); // { type: 'photo' | 'timeline', id, storagePath, title }

  // File Input References
  const photoFileInputRef = useRef(null);
  const heroFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);
  const story1FileInputRef = useRef(null);
  const story2FileInputRef = useRef(null);
  const timelineFileInputRef = useRef(null);

  // Synchronize initial values when modal opens or settings load
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        couple_names: siteSettings.couple_names || '',
        relationship_start_date: siteSettings.relationship_start_date || '',
        hero_badge: siteSettings.hero_badge || data?.hero?.badge || 'SEMESTA KECIL KITA',
        hero_title: siteSettings.hero_title || data?.hero?.title || '',
        hero_subtitle: siteSettings.hero_subtitle || data?.hero?.subtitle || '',
        hero_image_url: siteSettings.hero_image_url || data?.hero?.mainImage || '',
        hero_quote: siteSettings.hero_quote || data?.hero?.quoteOverlay || '',
        hero_caption: siteSettings.hero_caption || data?.hero?.imageCaption || '',
        bg_music_url: siteSettings.bg_music_url || '',

        // Story Section
        story_section_title: siteSettings.story_section_title || data?.story?.sectionTitle || 'AWAL KISAH KITA',
        story_subheading: siteSettings.story_subheading || data?.story?.subheading || '',
        story_chapter_tag: siteSettings.story_chapter_tag || data?.story?.chapterTag || 'Babak I',
        story_title: siteSettings.story_title || data?.story?.title || '',
        story_date: siteSettings.story_date || data?.story?.date || '',
        story_location: siteSettings.story_location || data?.story?.location || '',
        story_coordinates: siteSettings.story_coordinates || data?.story?.coordinates || '',
        story_description: siteSettings.story_description || data?.story?.description || '',
        story_quote: siteSettings.story_quote || data?.story?.quote || '',
        story_image1_url: siteSettings.story_image1_url || data?.story?.image1 || '',
        story_image1_caption: siteSettings.story_image1_caption || data?.story?.image1Caption || '',
        story_image2_url: siteSettings.story_image2_url || data?.story?.image2 || '',
        story_image2_caption: siteSettings.story_image2_caption || data?.story?.image2Caption || '',

        // Timeline Header
        timeline_section_title: siteSettings.timeline_section_title || data?.timeline?.sectionTitle || 'LINIMASA KITA',
        timeline_subheading: siteSettings.timeline_subheading || data?.timeline?.subheading || '',

        // Final Section
        final_quote: siteSettings.final_quote || data?.final?.quote || '“Dan ini hanyalah sebuah permulaan.”',
        final_subtext: siteSettings.final_subtext || data?.final?.subtext || '',
        final_button_text: siteSettings.final_button_text || data?.final?.buttonText || 'KISAH KITA BERLANJUT',
        final_footer_text: siteSettings.final_footer_text || data?.final?.footerText || 'Dibuat dengan segenap cinta.',
        final_copyright: siteSettings.final_copyright || data?.final?.copyright || 'Our Little Universe • Terukir selamanya di dalam hati kita',
      });
      setHeroPreview(siteSettings.hero_image_url || data?.hero?.mainImage || '');
      setStory1Preview(siteSettings.story_image1_url || data?.story?.image1 || '');
      setStory2Preview(siteSettings.story_image2_url || data?.story?.image2 || '');
    }

    if (loveNote) {
      setNoteForm({
        heading: loveNote.heading || data?.loveLetter?.heading || 'SECARIK CATATAN DI BAWAH LANGIT BINTANG',
        date: loveNote.date || data?.loveLetter?.date || 'Bisikan tulus di keheningan tengah malam',
        letter_content: loveNote.letter_content || data?.loveLetter?.paragraphs?.join('\n\n') || '',
        signature_names: loveNote.signature_names || siteSettings?.couple_names || 'Wahyu & Nur',
        final_quote: siteSettings?.final_quote || data?.final?.quote || '“Dan ini hanyalah sebuah permulaan.”',
        final_subtext: siteSettings?.final_subtext || data?.final?.subtext || '',
        final_button_text: siteSettings?.final_button_text || data?.final?.buttonText || 'KISAH KITA BERLANJUT',
        final_footer_text: siteSettings?.final_footer_text || data?.final?.footerText || 'Dibuat dengan segenap cinta.',
        final_copyright: siteSettings?.final_copyright || data?.final?.copyright || 'Our Little Universe • Terukir selamanya di dalam hati kita',
      });
    }

    if (editTargetData) {
      if (editTargetData.year_or_date !== undefined) {
        // Target is timeline item
        startEditTimeline(editTargetData);
      } else if (editTargetData.aspect_ratio !== undefined || editTargetData.image_url) {
        // Target is photo
        startEditPhoto(editTargetData);
      }
    }
  }, [siteSettings, loveNote, data, editTargetData, isDashboardModalOpen]);

  if (!isDashboardModalOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Preview Day Counter Calculation
  const previewDaysCount = () => {
    try {
      if (!settingsForm.relationship_start_date) return 0;
      const start = new Date(settingsForm.relationship_start_date);
      const now = new Date();
      start.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const diffTime = Math.max(0, now - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 0 : diffDays;
    } catch {
      return 0;
    }
  };

  // ==============================================================
  // TAB 1: GALERI FOTO HANDLERS
  // ==============================================================
  const handlePhotoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!photoPreview && !photoFile) {
      alert('Pilih file foto atau masukkan tautan foto.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPhotoId) {
        await updatePhoto(editingPhotoId, {
          title: photoTitle,
          caption: photoCaption,
          date_taken: photoDate,
          aspect_ratio: photoAspect,
          image_url: photoPreview
        });
        showToast('Foto momen berhasil diperbarui!');
      } else {
        const result = await addPhoto({
          title: photoTitle,
          caption: photoCaption,
          date_taken: photoDate || new Date().toLocaleDateString('id-ID'),
          aspect_ratio: photoAspect,
          file: photoFile,
          imageUrl: photoPreview
        });
        if (!result.success) throw new Error(result.error);
        showToast('Foto baru berhasil diunggah ke Supabase!');
      }

      setIsAddingPhoto(false);
      setEditingPhotoId(null);
      setPhotoTitle('');
      setPhotoCaption('');
      setPhotoDate('');
      setPhotoFile(null);
      setPhotoPreview('');
      setPhotoAspect('portrait');
    } catch (err) {
      alert('Gagal menyimpan foto: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditPhoto = (item) => {
    setEditingPhotoId(item.id);
    setPhotoTitle(item.title || '');
    setPhotoCaption(item.caption || '');
    setPhotoDate(item.date_taken || item.date || '');
    setPhotoAspect(item.aspect_ratio || item.aspect || 'portrait');
    setPhotoPreview(item.image_url || item.image || '');
    setPhotoStoragePath(item.storage_path || '');
    setIsAddingPhoto(true);
  };

  // ==============================================================
  // TAB 2: SITE SETTINGS & HERO HANDLERS
  // ==============================================================
  const handleHeroFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleAudioFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicFile(file);
    setMusicFileName(file.name);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalHeroUrl = settingsForm.hero_image_url;
      let finalAudioUrl = settingsForm.bg_music_url;

      if (heroFile) {
        const heroRes = await uploadHero(heroFile);
        if (heroRes?.publicUrl) {
          finalHeroUrl = heroRes.publicUrl;
        }
      }

      if (musicFile) {
        const audioRes = await uploadAudio(musicFile);
        if (audioRes?.publicUrl) {
          finalAudioUrl = audioRes.publicUrl;
        }
      }

      const payload = {
        ...settingsForm,
        hero_image_url: finalHeroUrl,
        bg_music_url: finalAudioUrl
      };

      const result = await saveSiteSettings(payload);
      if (!result.success) throw new Error(result.error);

      setHeroFile(null);
      setMusicFile(null);
      showToast('Pengaturan situs & Hero berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 3: KISAH PERTEMUAN (STORY SECTION 01) HANDLERS
  // ==============================================================
  const handleStory1FileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStory1File(file);
    setStory1Preview(URL.createObjectURL(file));
  };

  const handleStory2FileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStory2File(file);
    setStory2Preview(URL.createObjectURL(file));
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImg1 = settingsForm.story_image1_url;
      let finalImg2 = settingsForm.story_image2_url;

      if (story1File) {
        const res1 = await uploadStory(story1File, '1');
        if (res1?.publicUrl) finalImg1 = res1.publicUrl;
      }

      if (story2File) {
        const res2 = await uploadStory(story2File, '2');
        if (res2?.publicUrl) finalImg2 = res2.publicUrl;
      }

      const payload = {
        ...settingsForm,
        story_image1_url: finalImg1,
        story_image2_url: finalImg2
      };

      const result = await saveSiteSettings(payload);
      if (!result.success) throw new Error(result.error);

      setStory1File(null);
      setStory2File(null);
      showToast('Kisah Pertemuan dan Foto berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan kisah: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 4: LINIMASA KISAH (TIMELINE) HANDLERS
  // ==============================================================
  const handleTimelineFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTimelineFile(file);
    setTimelinePreview(URL.createObjectURL(file));
  };

  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImg = timelineForm.image_url;

      if (timelineFile) {
        const res = await uploadTimeline(timelineFile);
        if (res?.publicUrl) finalImg = res.publicUrl;
      }

      const payload = {
        ...timelineForm,
        image_url: finalImg
      };

      if (editingTimelineId) {
        await updateTimeline(editingTimelineId, payload);
        showToast('Milestone linimasa berhasil diperbarui!');
      } else {
        await addTimeline(payload);
        showToast('Milestone linimasa baru berhasil ditambahkan!');
      }

      setIsAddingTimeline(false);
      setEditingTimelineId(null);
      setTimelineFile(null);
      setTimelinePreview('');
      setTimelineForm({
        year_or_date: '',
        title: '',
        description: '',
        location: '',
        image_url: '',
        display_order: timelineEvents.length + 1
      });
    } catch (err) {
      alert('Gagal menyimpan milestone: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditTimeline = (item) => {
    setEditingTimelineId(item.id);
    setTimelineForm({
      year_or_date: item.year_or_date || item.date || '',
      title: item.title || '',
      description: item.description || '',
      location: item.location || item.subtitle || '',
      image_url: item.image_url || item.image || '',
      display_order: item.display_order || 0
    });
    setTimelinePreview(item.image_url || item.image || '');
    setIsAddingTimeline(true);
  };

  // Save Timeline Header
  const handleSaveTimelineHeader = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveSiteSettings({
        timeline_section_title: settingsForm.timeline_section_title,
        timeline_subheading: settingsForm.timeline_subheading
      });
      if (!result.success) throw new Error(result.error);
      showToast('Header Linimasa berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan header linimasa: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 5: SURAT CINTA & FOOTER HANDLERS
  // ==============================================================
  const handleSaveNoteAndFooter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save Love Note
      const resNote = await saveLoveNote({
        heading: noteForm.heading,
        date: noteForm.date,
        letter_content: noteForm.letter_content,
        signature_names: noteForm.signature_names
      });
      if (!resNote.success) throw new Error(resNote.error);

      // 2. Save Footer & Closing Texts to site_settings
      const resSettings = await saveSiteSettings({
        final_quote: noteForm.final_quote,
        final_subtext: noteForm.final_subtext,
        final_button_text: noteForm.final_button_text,
        final_footer_text: noteForm.final_footer_text,
        final_copyright: noteForm.final_copyright
      });
      if (!resSettings.success) throw new Error(resSettings.error);

      showToast('Surat cinta & kata-kata penutup footer berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 6: PIN & KEAMANAN HANDLERS
  // ==============================================================
  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinFeedback({ type: '', text: '' });

    if (newPin.length < 4) {
      setPinFeedback({ type: 'error', text: 'PIN minimal 4 karakter.' });
      return;
    }

    if (newPin !== confirmPin) {
      setPinFeedback({ type: 'error', text: 'Konfirmasi PIN tidak cocok.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changePin(newPin);
      if (result.success) {
        setPinFeedback({ type: 'success', text: 'PIN Admin berhasil diubah!' });
        setNewPin('');
        setConfirmPin('');
        showToast('PIN Admin berhasil diperbarui!');
      } else {
        setPinFeedback({ type: 'error', text: result.error || 'Gagal mengubah PIN.' });
      }
    } catch (err) {
      setPinFeedback({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action Dispatcher
  const executeDelete = async () => {
    if (!deleteDialog) return;
    setIsSubmitting(true);
    try {
      if (deleteDialog.type === 'photo') {
        await deletePhoto(deleteDialog.id, deleteDialog.storagePath);
        showToast('Foto berhasil dihapus.');
      } else if (deleteDialog.type === 'timeline') {
        await deleteTimeline(deleteDialog.id);
        showToast('Milestone linimasa berhasil dihapus.');
      }
      setDeleteDialog(null);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTabActive = (tabKey) => {
    if (tabKey === 'hero' && (activeDashboardTab === 'hero' || activeDashboardTab === 'settings')) return true;
    return activeDashboardTab === tabKey;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      {/* Hidden File Inputs */}
      <input 
        ref={photoFileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handlePhotoFileSelect} 
      />
      <input 
        ref={heroFileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleHeroFileSelect} 
      />
      <input 
        ref={story1FileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleStory1FileSelect} 
      />
      <input 
        ref={story2FileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleStory2FileSelect} 
      />
      <input 
        ref={timelineFileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleTimelineFileSelect} 
      />
      <input 
        ref={audioFileInputRef} 
        type="file" 
        accept="audio/mp3,audio/mpeg,audio/*" 
        className="hidden" 
        onChange={handleAudioFileSelect} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl md:rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="font-serif text-lg md:text-xl text-warm-50 font-normal">
                Panel Kontrol & Manajemen Konten Lengkap
              </h2>
              <p className="text-[11px] text-warm-400/60 font-sans tracking-wide">
                Kelola seluruh foto, teks, kutipan, dan musik semesta kita
              </p>
            </div>
          </div>
          <button
            onClick={closeDashboardModal}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-warm-400 hover:text-white hover:border-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Message Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 md:px-6 border-b border-white/10 overflow-x-auto gap-2 bg-black/40 scrollbar-none">
          <button
            onClick={() => setActiveDashboardTab('gallery')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('gallery')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>01. Galeri Foto ({galleryPhotos.length > 0 ? galleryPhotos.length : data?.moments?.gallery?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('hero')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('hero')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>02. Hero & Beranda</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('story')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('story')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>03. Kisah Pertemuan</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('timeline')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('timeline')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>04. Linimasa Kisah ({timelineEvents.length > 0 ? timelineEvents.length : data?.timeline?.milestones?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('letter')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('letter')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400/80" />
            <span>05. Surat Cinta & Footer</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('security')}
            className={`py-3.5 px-3.5 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              isTabActive('security')
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>06. PIN & Keamanan</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: GALERI FOTO (MOMENTS) */}
          {/* ============================================================== */}
          {activeDashboardTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <h3 className="font-serif text-lg text-warm-50 font-normal">
                    Kelola Galeri Foto (Supabase Bucket: 'photos')
                  </h3>
                  <p className="text-xs text-warm-400/70 font-light">
                    Direct upload ke storage bucket 'photos', auto-fetch public URL, dan simpan keterangan momen.
                  </p>
                </div>
                {!isAddingPhoto && (
                  <button
                    onClick={() => {
                      setIsAddingPhoto(true);
                      setEditingPhotoId(null);
                      setPhotoTitle('');
                      setPhotoCaption('');
                      setPhotoDate(new Date().toLocaleDateString('id-ID'));
                      setPhotoFile(null);
                      setPhotoPreview('');
                      setPhotoAspect('portrait');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Foto Baru</span>
                  </button>
                )}
              </div>

              {/* Form Tambah / Edit Foto */}
              <AnimatePresence>
                {isAddingPhoto && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSavePhoto}
                    className="p-5 rounded-xl border border-champagne-400/30 bg-champagne-400/[0.03] space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h4 className="font-serif text-base text-champagne-300 font-medium">
                        {editingPhotoId ? 'Edit Metadata Foto' : 'Unggah Foto Baru ke Supabase'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPhoto(false);
                          setEditingPhotoId(null);
                        }}
                        className="text-xs text-warm-400 hover:text-white"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5 flex flex-col items-center">
                        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/15 bg-black/60 relative flex items-center justify-center">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4 text-warm-400/40">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <span className="text-xs">Belum ada foto dipilih</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          className="mt-3 w-full py-2.5 rounded-lg border border-dashed border-white/20 hover:border-champagne-300/60 bg-white/[0.02] hover:bg-white/[0.05] text-xs text-warm-200 flex items-center justify-center gap-2 transition-all"
                        >
                          <Upload className="w-4 h-4 text-champagne-300" />
                          <span>{photoFile ? 'Ganti File Gambar' : 'Pilih File Gambar'}</span>
                        </button>
                      </div>

                      <div className="md:col-span-7 space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            URL Gambar Langsung (Opsional jika upload file)
                          </label>
                          <input
                            type="text"
                            placeholder="https://... atau biarkan kosong jika upload file"
                            value={photoPreview.startsWith('blob:') ? '' : photoPreview}
                            onChange={(e) => {
                              setPhotoPreview(e.target.value);
                              setPhotoFile(null);
                            }}
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Judul / Lokasi Momen
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Teras Sore / Toko Buku Tua"
                            value={photoTitle}
                            onChange={(e) => setPhotoTitle(e.target.value)}
                            required
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Tanggal Pengambilan Foto
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: 12.08.2024 atau 12 Agustus 2024"
                            value={photoDate}
                            onChange={(e) => setPhotoDate(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Aspek Rasio Tampilan
                          </label>
                          <select
                            value={photoAspect}
                            onChange={(e) => setPhotoAspect(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-[#141414] border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                          >
                            <option value="portrait">Tegak (Portrait 4:5)</option>
                            <option value="landscape">Mendatar (Landscape 16:10)</option>
                            <option value="square">Persegi (Square 1:1)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Kata-Kata / Caption Momen
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tuliskan cerita singkat atau kutipan romantis di balik foto ini..."
                            value={photoCaption}
                            onChange={(e) => setPhotoCaption(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none font-serif italic"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Menyimpan ke Supabase...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>{editingPhotoId ? 'Perbarui Foto' : 'Simpan Foto ke Cloud'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Grid List Foto Galeri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(galleryPhotos.length > 0 ? galleryPhotos : data?.moments?.gallery || []).map((item, idx) => {
                  const imgUrl = item.image_url || item.image;
                  const dateStr = item.date_taken || item.date || '-';
                  const captionStr = item.caption || item.title || 'Momen Kenangan';

                  return (
                    <div
                      key={item.id || idx}
                      className="group rounded-xl p-3 bg-white/[0.02] border border-white/10 hover:border-champagne-400/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2.5 bg-black/60">
                          <img
                            src={imgUrl}
                            alt={captionStr}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-warm-200">
                            #{idx + 1} • {item.aspect_ratio || item.aspect || 'portrait'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-champagne-300/80 mb-1">
                          <Calendar className="w-3 h-3 text-champagne-400" />
                          <span>{dateStr}</span>
                          {item.title && (
                            <>
                              <span className="text-white/20">•</span>
                              <span className="truncate max-w-[130px] font-sans font-medium text-warm-200">{item.title}</span>
                            </>
                          )}
                        </div>

                        <p className="font-serif italic text-xs text-warm-100 line-clamp-2 leading-relaxed">
                          {captionStr}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => startEditPhoto(item)}
                          className="text-[11px] text-warm-300/80 hover:text-champagne-300 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteDialog({
                            type: 'photo',
                            id: item.id,
                            storagePath: item.storage_path,
                            title: item.title || `Foto tanggal ${dateStr}`
                          })}
                          className="text-[11px] text-rose-400/80 hover:text-rose-400 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: HERO & BERANDA UTAMA & MUSIK MP3 */}
          {/* ============================================================== */}
          {isTabActive('hero') && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <h3 className="font-serif text-lg text-warm-50 font-normal">
                  Pengaturan Beranda & Hero Section
                </h3>
                <p className="text-xs text-warm-400/70 font-light mt-0.5">
                  Atur nama pasangan, tanggal jadian otomatis (Day Counter), badge, judul, kutipan bawah foto, dan lagu latar semesta kita.
                </p>
              </div>

              {/* Identitas Pasangan & Tanggal Jadian */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <h4 className="font-serif text-sm text-champagne-300 font-medium pb-2 border-b border-white/10">
                  Identitas Pasangan & Penghitung Hari (Day Counter)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Nama Pasangan
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Wahyu & Nur"
                      value={settingsForm.couple_names}
                      onChange={(e) => setSettingsForm({ ...settingsForm, couple_names: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-editorial text-base"
                    />
                    <p className="text-[10px] text-warm-400/50 mt-1">
                      Ditampilkan di Navbar, Hero, Love Letter, dan Footer.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Tanggal Jadian / Hari Jadian Dimulai
                    </label>
                    <input
                      type="date"
                      value={settingsForm.relationship_start_date}
                      onChange={(e) => setSettingsForm({ ...settingsForm, relationship_start_date: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                    <p className="text-[10px] text-champagne-300/80 mt-1 font-mono">
                      Preview Day Counter: <strong>Hari ke-{previewDaysCount()}</strong> di semesta kita
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Badge Atas Hero
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hero_badge}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Keterangan Foto / Koordinat Waktu Hero
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hero_caption}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_caption: e.target.value })}
                      placeholder="contoh: Koordinat petang yang teduh / 18:42 WIB"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Judul Utama Hero
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.hero_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      placeholder="Di antara dua orang asing, kita menjadi kita."
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Deskripsi / Subtitle Hero (di bawah foto)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.hero_subtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                      placeholder="Ruang digital dokumentasi perjalanan cinta berdua..."
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Kutipan Romantis di Bawah Foto Hero
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hero_quote}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_quote: e.target.value })}
                    placeholder="“Di semesta yang seluas ini, hatiku memilih ketenangan di sampingmu.”"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-serif italic"
                  />
                </div>
              </div>

              {/* Foto Hero (Bucket: photos) */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base text-warm-50 font-normal">
                    Foto Hero Utama (Bucket: 'photos')
                  </h4>
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-warm-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-champagne-300" />
                    <span>Upload Foto Hero</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 rounded-xl overflow-hidden aspect-[16/10] border border-white/10 bg-black/50">
                    {heroPreview ? (
                      <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-warm-400/40">Belum ada foto</div>
                    )}
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70">
                      URL Gambar Hero
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hero_image_url}
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, hero_image_url: e.target.value });
                        setHeroPreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                    {heroFile && (
                      <p className="text-[11px] text-champagne-300">
                        File baru terpilih: <strong>{heroFile.name}</strong> (Akan diunggah saat tombol Simpan ditekan)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Musik Latar MP3 (Bucket: audio) */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-champagne-300" />
                    <h4 className="font-serif text-base text-warm-50 font-normal">
                      Musik Latar Pasangan (Bucket: 'audio')
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-warm-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-champagne-300" />
                    <span>Upload Lagu MP3</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70">
                    URL Audio / MP3 (bg_music_url)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.bg_music_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bg_music_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                  />
                  {musicFileName && (
                    <p className="text-[11px] text-champagne-300">
                      File audio terpilih: <strong>{musicFileName}</strong> (Akan diunggah ke bucket 'audio' saat tombol Simpan ditekan)
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Hero & Beranda</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: KISAH PERTEMUAN (SECTION 01: STORY SECTION) */}
          {/* ============================================================== */}
          {activeDashboardTab === 'story' && (
            <form onSubmit={handleSaveStory} className="space-y-6 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <h3 className="font-serif text-lg text-warm-50 font-normal">
                  Kisah Pertemuan & Dokumentasi Awal (Section 01)
                </h3>
                <p className="text-xs text-warm-400/70 font-light mt-0.5">
                  Ubah judul babak, tanggal pertemuan, nama lokasi, koordinat GPS, narasi cerita lengkap, kutipan, dan kedua foto kenangan.
                </p>
              </div>

              {/* Header & Judul Cerita */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <h4 className="font-serif text-sm text-champagne-300 font-medium pb-2 border-b border-white/10">
                  Header & Judul Babak Cerita
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Nomor & Judul Section
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_section_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_section_title: e.target.value })}
                      placeholder="AWAL KISAH KITA"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Tag Babak
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_chapter_tag}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_chapter_tag: e.target.value })}
                      placeholder="Babak I"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Tanggal Pertemuan
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_date}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_date: e.target.value })}
                      placeholder="25.07.2025"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Judul Kisah Pertemuan
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_title: e.target.value })}
                      placeholder="Pertemuan Awal di Ranggon Jaya Mart"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-serif text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Subheading / Tagline Atas
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_subheading}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_subheading: e.target.value })}
                      placeholder="Setiap kisah memiliki awal. Kisah kita bersemi..."
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Nama Lokasi Pertemuan
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_location: e.target.value })}
                      placeholder="Jalan D.I. Panjaitan, Bangkinang, Riau"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Koordinat Lokasi (GPS)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_coordinates}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_coordinates: e.target.value })}
                      placeholder="40°42'46.1&quot;N 74°00'21.8&quot;W"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                    />
                  </div>
                </div>

                {/* Teks Cerita Pertemuan Lengkap */}
                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Teks Deskripsi / Cerita Pertemuan Lengkap
                  </label>
                  <textarea
                    rows={8}
                    value={settingsForm.story_description}
                    onChange={(e) => setSettingsForm({ ...settingsForm, story_description: e.target.value })}
                    placeholder="Tuliskan cerita lengkap awal mula pertemuan kalian berdua..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-warm-100 focus:outline-none focus:border-champagne-400 leading-relaxed font-sans"
                  />
                  <p className="text-[10px] text-warm-400/50 mt-1">
                    Gunakan Enter dua kali untuk memisahkan antar paragraf. Teks akan tampil rapi dengan tata letak editorial.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Kutipan Khusus Kisah (Quote Callout)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.story_quote}
                    onChange={(e) => setSettingsForm({ ...settingsForm, story_quote: e.target.value })}
                    placeholder="“Dunia di luar begitu bising, namun duduk di hadapanmu...”"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-serif italic"
                  />
                </div>
              </div>

              {/* Foto 1 & Foto 2 Story Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foto 1: Visual Utama Kisah */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm text-champagne-300 font-medium">
                      Foto Utama Kisah (Image 1)
                    </h4>
                    <button
                      type="button"
                      onClick={() => story1FileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-warm-200"
                    >
                      <Upload className="w-3 h-3 text-champagne-300" />
                      <span>Upload Foto 1</span>
                    </button>
                  </div>

                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black/60 relative">
                    {story1Preview ? (
                      <img src={story1Preview} alt="Story 1" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-warm-400/40">Belum ada foto</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      URL Foto 1
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_image1_url}
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, story_image1_url: e.target.value });
                        setStory1Preview(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Keterangan / Caption Foto 1
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_image1_caption}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_image1_caption: e.target.value })}
                      placeholder="Sudut kedai kopi tempat waktu terasa berhenti"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>
                </div>

                {/* Foto 2: Cuplikan Koordinat */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm text-champagne-300 font-medium">
                      Foto Cuplikan Koordinat (Image 2)
                    </h4>
                    <button
                      type="button"
                      onClick={() => story2FileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-warm-200"
                    >
                      <Upload className="w-3 h-3 text-champagne-300" />
                      <span>Upload Foto 2</span>
                    </button>
                  </div>

                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black/60 relative">
                    {story2Preview ? (
                      <img src={story2Preview} alt="Story 2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-warm-400/40">Belum ada foto</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      URL Foto 2
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_image2_url}
                      onChange={(e) => {
                        setSettingsForm({ ...settingsForm, story_image2_url: e.target.value });
                        setStory2Preview(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Keterangan / Caption Foto 2
                    </label>
                    <input
                      type="text"
                      value={settingsForm.story_image2_caption}
                      onChange={(e) => setSettingsForm({ ...settingsForm, story_image2_caption: e.target.value })}
                      placeholder="Tatap mata pertama di tengah gerimis"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Kisah & Foto Section 01</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 4: LINIMASA KISAH (TIMELINE EVENTS) */}
          {/* ============================================================== */}
          {activeDashboardTab === 'timeline' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Header Setting Box */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-serif text-base text-warm-50 font-normal">
                    Header Judul Linimasa (Section 02)
                  </h4>
                  <button
                    type="button"
                    onClick={handleSaveTimelineHeader}
                    className="text-xs text-champagne-300 hover:text-champagne-200 flex items-center gap-1 font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Header</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Judul Section Linimasa
                    </label>
                    <input
                      type="text"
                      value={settingsForm.timeline_section_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, timeline_section_title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Subheading Linimasa
                    </label>
                    <input
                      type="text"
                      value={settingsForm.timeline_subheading}
                      onChange={(e) => setSettingsForm({ ...settingsForm, timeline_subheading: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 font-serif"
                    />
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <h3 className="font-serif text-lg text-warm-50 font-normal">
                    Daftar Babak Linimasa Perjalanan
                  </h3>
                  <p className="text-xs text-warm-400/70 font-light">
                    Tambah, perbarui urutan, atau ubah foto & narasi setiap babak perjalanan.
                  </p>
                </div>
                {!isAddingTimeline && (
                  <button
                    onClick={() => {
                      setIsAddingTimeline(true);
                      setEditingTimelineId(null);
                      setTimelineFile(null);
                      setTimelinePreview('');
                      setTimelineForm({
                        year_or_date: '',
                        title: '',
                        description: '',
                        location: '',
                        image_url: '',
                        display_order: timelineEvents.length + 1
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Babak Baru</span>
                  </button>
                )}
              </div>

              {/* Form Tambah / Edit Milestone */}
              <AnimatePresence>
                {isAddingTimeline && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveTimeline}
                    className="p-5 rounded-xl border border-champagne-400/30 bg-champagne-400/[0.03] space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h4 className="font-serif text-base text-champagne-300 font-medium">
                        {editingTimelineId ? 'Edit Babak Linimasa' : 'Tambah Babak Linimasa Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTimeline(false);
                          setEditingTimelineId(null);
                        }}
                        className="text-xs text-warm-400 hover:text-white"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 flex flex-col items-center">
                        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/15 bg-black/60 relative flex items-center justify-center">
                          {timelinePreview ? (
                            <img src={timelinePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3 text-warm-400/40">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <span className="text-[11px]">Belum ada foto</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => timelineFileInputRef.current?.click()}
                          className="mt-2.5 w-full py-2 rounded-lg border border-dashed border-white/20 hover:border-champagne-300/60 bg-white/[0.02] text-xs text-warm-200 flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-champagne-300" />
                          <span>Pilih Foto Babak</span>
                        </button>
                      </div>

                      <div className="md:col-span-8 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                              Tanggal / Tahun
                            </label>
                            <input
                              type="text"
                              placeholder="contoh: 25 JULI 2025"
                              value={timelineForm.year_or_date}
                              onChange={(e) => setTimelineForm({ ...timelineForm, year_or_date: e.target.value })}
                              required
                              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                              Tag / Lokasi / Babak
                            </label>
                            <input
                              type="text"
                              placeholder="contoh: Babak I atau Jakarta"
                              value={timelineForm.location}
                              onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Judul Babak / Momen
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Sapaan Pertama"
                            value={timelineForm.title}
                            onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                            required
                            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 font-serif text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Deskripsi Kisah Babak Ini
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tuliskan cerita yang terjadi pada babak ini..."
                            value={timelineForm.description}
                            onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                            required
                            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 resize-none font-sans"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>{editingTimelineId ? 'Perbarui Babak' : 'Simpan Babak'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* List Milestones */}
              <div className="space-y-3">
                {(timelineEvents.length > 0 ? timelineEvents : data?.timeline?.milestones || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-champagne-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-champagne-300/80 mb-0.5">
                          <span>{item.year_or_date || item.date}</span>
                          <span className="text-white/20">•</span>
                          <span>{item.location || item.subtitle || item.tag}</span>
                        </div>
                        <h4 className="font-serif text-sm text-warm-50 font-normal">
                          {item.title}
                        </h4>
                        <p className="text-xs text-warm-300/70 font-light line-clamp-1 max-w-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => startEditTimeline(item)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-warm-200 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteDialog({
                          type: 'timeline',
                          id: item.id,
                          title: item.title || `Babak ${idx + 1}`
                        })}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: SURAT CINTA & KATA-KATA PENUTUP FOOTER */}
          {/* ============================================================== */}
          {activeDashboardTab === 'letter' && (
            <form onSubmit={handleSaveNoteAndFooter} className="space-y-6 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 text-rose-300 font-medium text-sm mb-1">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
                  <span>Surat Cinta & Kata-Kata Penutup Footer</span>
                </div>
                <p className="text-xs text-warm-400/70 font-light">
                  Edit surat cinta digital di bawah langit bintang dan seluruh kata-kata penutup footer di akhir website.
                </p>
              </div>

              {/* Surat Cinta Box */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <h4 className="font-serif text-sm text-champagne-300 font-medium pb-2 border-b border-white/10">
                  Secarik Surat Cinta (Section 04)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Judul Surat Cinta
                    </label>
                    <input
                      type="text"
                      value={noteForm.heading}
                      onChange={(e) => setNoteForm({ ...noteForm, heading: e.target.value })}
                      placeholder="SECARIK CATATAN DI BAWAH LANGIT BINTANG"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Subheading / Waktu Surat
                    </label>
                    <input
                      type="text"
                      value={noteForm.date}
                      onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
                      placeholder="Bisikan tulus di keheningan tengah malam"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1.5">
                    Isi Paragraf Surat Cinta (letter_content)
                  </label>
                  <textarea
                    rows={8}
                    value={noteForm.letter_content}
                    onChange={(e) => setNoteForm({ ...noteForm, letter_content: e.target.value })}
                    required
                    placeholder="Tuliskan ungkapan perasaan terdalam untuk pasanganmu... (Pisahkan paragraf dengan baris kosong)"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-warm-100 focus:outline-none focus:border-champagne-400 leading-relaxed font-serif"
                  />
                  <p className="text-[10px] text-warm-400/50 mt-1">
                    Tip: Buat jarak dua baris (Enter dua kali) untuk memisahkan antar paragraf.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1.5">
                    Tanda Tangan Surat Cinta
                  </label>
                  <input
                    type="text"
                    value={noteForm.signature_names}
                    onChange={(e) => setNoteForm({ ...noteForm, signature_names: e.target.value })}
                    placeholder="contoh: Selamanya milikmu, dengan segenap cinta"
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-serif italic text-sm"
                  />
                </div>
              </div>

              {/* Kata-Kata Penutup & Footer */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <h4 className="font-serif text-sm text-champagne-300 font-medium pb-2 border-b border-white/10">
                  Teks Penutup & Footer (Final Section)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Kutipan Akhir Penutup
                    </label>
                    <input
                      type="text"
                      value={noteForm.final_quote}
                      onChange={(e) => setNoteForm({ ...noteForm, final_quote: e.target.value })}
                      placeholder="“Dan ini hanyalah sebuah permulaan.”"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 font-serif text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Teks Tombol Kembali Ke Atas
                    </label>
                    <input
                      type="text"
                      value={noteForm.final_button_text}
                      onChange={(e) => setNoteForm({ ...noteForm, final_button_text: e.target.value })}
                      placeholder="KISAH KITA BERLANJUT"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 uppercase tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Subtext Narasi Penutup
                  </label>
                  <textarea
                    rows={2}
                    value={noteForm.final_subtext}
                    onChange={(e) => setNoteForm({ ...noteForm, final_subtext: e.target.value })}
                    placeholder="Masih ada begitu banyak detik, tawa, dan cerita yang belum kita jalani bersama."
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 resize-none font-sans"
                  />
                </div>

                {/* Baris Footer: Dibuat dengan segenap cinta & Copyright */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Teks Cinta Footer (Baris 1)
                    </label>
                    <input
                      type="text"
                      value={noteForm.final_footer_text}
                      onChange={(e) => setNoteForm({ ...noteForm, final_footer_text: e.target.value })}
                      placeholder="Dibuat dengan segenap cinta."
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                    <p className="text-[10px] text-warm-400/50 mt-1">
                      Nama <strong>{settingsForm.couple_names || 'Wahyu & Nur'}</strong> akan otomatis diletakkan tepat di tengah di bawah kalimat ini.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Tagline / Hak Cipta Footer (Baris 3)
                    </label>
                    <input
                      type="text"
                      value={noteForm.final_copyright}
                      onChange={(e) => setNoteForm({ ...noteForm, final_copyright: e.target.value })}
                      placeholder="Our Little Universe • Terukir selamanya di dalam hati kita"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Surat Cinta & Footer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 6: PIN & KEAMANAN */}
          {/* ============================================================== */}
          {activeDashboardTab === 'security' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <form onSubmit={handleChangePin} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <KeyRound className="w-4 h-4 text-champagne-400" />
                  <h3 className="font-serif text-base text-warm-50 font-normal">
                    Ganti PIN Masuk Admin
                  </h3>
                </div>

                {pinFeedback.text && (
                  <div className={`p-3 rounded-lg text-xs ${
                    pinFeedback.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {pinFeedback.text}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    PIN Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPin ? 'text' : 'password'}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      required
                      placeholder="Minimal 4 karakter..."
                      className="w-full px-3.5 py-2 pr-10 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400/50 hover:text-warm-200 transition-colors"
                    >
                      {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Konfirmasi PIN Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      required
                      placeholder="Ulangi PIN baru..."
                      className="w-full px-3.5 py-2 pr-10 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400/50 hover:text-warm-200 transition-colors"
                    >
                      {showConfirmPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-md transition-colors"
                >
                  Perbarui PIN Admin di Supabase
                </button>
              </form>

              {/* Status Sesi & Logout */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-warm-200 font-medium text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-champagne-300" />
                  <span>Sesi Admin & Logout</span>
                </div>
                <p className="text-xs text-warm-300/70 leading-relaxed font-light">
                  Sesi login Anda tersimpan di <code className="text-champagne-300">sessionStorage</code> dan akan otomatis berakhir saat tab/jendela browser ditutup.
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs tracking-wider transition-colors border border-rose-500/30"
                >
                  Keluar dari Mode Admin Sekarang
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#0d0d0d]/90 flex items-center justify-between text-xs text-warm-400/60">
          <span>Perubahan disimpan secara instan ke cloud Supabase.</span>
          <button
            onClick={closeDashboardModal}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-warm-200 transition-colors text-xs font-medium"
          >
            Selesai & Tutup
          </button>
        </div>
      </motion.div>

      {/* Confirmation Delete Dialog */}
      <AnimatePresence>
        {deleteDialog && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full text-warm-100 shadow-2xl space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h4 className="font-serif text-lg text-warm-50 font-normal">Konfirmasi Hapus</h4>
                <p className="text-xs text-warm-300/70 mt-1 font-light leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong className="text-warm-100">{deleteDialog.title}</strong>? Data akan dihapus permanen dari Supabase.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteDialog(null)}
                  className="px-4 py-2 rounded-xl text-xs text-warm-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors"
                >
                  {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardModal;
