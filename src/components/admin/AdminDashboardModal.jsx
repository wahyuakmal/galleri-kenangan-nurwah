import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Image as ImageIcon, Plus, Trash2, Edit3, Upload, Check, AlertCircle, 
  RotateCcw, Sparkles, Calendar, MapPin, KeyRound, ShieldAlert,
  Layers, Bookmark, FileText, ArrowRight, Music, Heart, Loader2, Save
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

  // Tab 2: Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    couple_names: '',
    relationship_start_date: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    bg_music_url: '',
  });
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [musicFileName, setMusicFileName] = useState('');

  // Tab 3: Timeline Form State
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    year_or_date: '',
    title: '',
    description: '',
    location: '',
    display_order: 0
  });

  // Tab 4: Love Note Form State
  const [noteForm, setNoteForm] = useState({
    letter_content: '',
    signature_names: ''
  });

  // Tab 5: Security / PIN Form State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState({ type: '', text: '' });

  // Delete Confirmation Dialog State
  const [deleteDialog, setDeleteDialog] = useState(null); // { type: 'photo' | 'timeline', id, storagePath, title }

  // File Input References
  const photoFileInputRef = useRef(null);
  const heroFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  // Synchronize initial values when modal opens or settings load
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        couple_names: siteSettings.couple_names || '',
        relationship_start_date: siteSettings.relationship_start_date || '',
        hero_title: siteSettings.hero_title || '',
        hero_subtitle: siteSettings.hero_subtitle || '',
        hero_image_url: siteSettings.hero_image_url || '',
        bg_music_url: siteSettings.bg_music_url || '',
      });
      setHeroPreview(siteSettings.hero_image_url || '');
    }
    if (loveNote) {
      setNoteForm({
        letter_content: loveNote.letter_content || '',
        signature_names: loveNote.signature_names || ''
      });
    }
  }, [siteSettings, loveNote, isDashboardModalOpen]);

  if (!isDashboardModalOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
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
        // Edit photo metadata
        await updatePhoto(editingPhotoId, {
          title: photoTitle,
          caption: photoCaption,
          date_taken: photoDate,
          aspect_ratio: photoAspect,
          image_url: photoPreview
        });
        showToast('Foto momen berhasil diperbarui!');
      } else {
        // Direct upload to Supabase Storage Bucket 'photos'
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

      // Reset form
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
  // TAB 2: SITE SETTINGS HANDLERS
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

      // 1. Upload Hero Image if selected
      if (heroFile) {
        const heroRes = await uploadHero(heroFile);
        if (heroRes?.publicUrl) {
          finalHeroUrl = heroRes.publicUrl;
        }
      }

      // 2. Upload Audio MP3 if selected
      if (musicFile) {
        const audioRes = await uploadAudio(musicFile);
        if (audioRes?.publicUrl) {
          finalAudioUrl = audioRes.publicUrl;
        }
      }

      // 3. Save Site Settings to Supabase
      const payload = {
        ...settingsForm,
        hero_image_url: finalHeroUrl,
        bg_music_url: finalAudioUrl
      };

      const result = await saveSiteSettings(payload);
      if (!result.success) throw new Error(result.error);

      setHeroFile(null);
      setMusicFile(null);
      showToast('Pengaturan situs berhasil disimpan ke Supabase!');
    } catch (err) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 3: LINIMASA (TIMELINE) HANDLERS
  // ==============================================================
  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTimelineId) {
        await updateTimeline(editingTimelineId, timelineForm);
        showToast('Babak linimasa berhasil diperbarui!');
      } else {
        await addTimeline(timelineForm);
        showToast('Babak baru berhasil ditambahkan ke linimasa!');
      }

      setIsAddingTimeline(false);
      setEditingTimelineId(null);
      setTimelineForm({
        year_or_date: '',
        title: '',
        description: '',
        location: '',
        display_order: 0
      });
    } catch (err) {
      alert('Gagal menyimpan linimasa: ' + err.message);
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
      location: item.location || '',
      display_order: item.display_order || 0
    });
    setIsAddingTimeline(true);
  };

  // ==============================================================
  // TAB 4: SURAT CINTA HANDLERS
  // ==============================================================
  const handleSaveNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveLoveNote(noteForm);
      if (!result.success) throw new Error(result.error);
      showToast('Surat cinta digital berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan surat cinta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================================================
  // TAB 5: PIN & SECURITY
  // ==============================================================
  const handleChangePin = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setPinFeedback({ type: 'error', text: 'Konfirmasi PIN tidak cocok.' });
      return;
    }
    const res = await changePin(newPin);
    if (res.success) {
      setPinFeedback({ type: 'success', text: 'PIN Admin berhasil diubah!' });
      setNewPin('');
      setConfirmPin('');
      showToast('PIN Admin berhasil diperbarui!');
    } else {
      setPinFeedback({ type: 'error', text: res.error });
    }
  };

  // Execute Delete
  const executeDelete = async () => {
    if (!deleteDialog) return;
    setIsSubmitting(true);
    try {
      if (deleteDialog.type === 'photo') {
        await deletePhoto(deleteDialog.id, deleteDialog.storagePath);
        showToast('Foto berhasil dihapus dari Supabase Storage & Database.');
      } else if (deleteDialog.type === 'timeline') {
        await deleteTimeline(deleteDialog.id);
        showToast('Babak linimasa berhasil dihapus dari database.');
      }
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setIsSubmitting(false);
      setDeleteDialog(null);
    }
  };

  // Day counter calculation preview
  const previewDaysCount = () => {
    try {
      if (!settingsForm.relationship_start_date) return 0;
      const start = new Date(settingsForm.relationship_start_date);
      const now = new Date();
      start.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const diff = Math.max(0, now - start);
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={closeDashboardModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] glass-panel border border-white/15 rounded-2xl shadow-2xl text-warm-100 flex flex-col overflow-hidden"
      >
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={photoFileInputRef} 
          onChange={handlePhotoFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={heroFileInputRef} 
          onChange={handleHeroFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={audioFileInputRef} 
          onChange={handleAudioFileSelect} 
          accept="audio/*,.mp3,.m4a,.wav" 
          className="hidden" 
        />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-champagne-400/15 text-champagne-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl text-warm-50 font-normal">
                  Panel Admin — Full Control
                </h2>
                {isSupabaseConfigured ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono border border-emerald-500/30">
                    Supabase Connected
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono border border-amber-500/30">
                    Isi .env untuk Terhubung
                  </span>
                )}
              </div>
              <p className="text-[11px] text-warm-400/70 font-sans">
                Kelola foto galeri, linimasa, surat cinta, dan pengaturan situs langsung ke Supabase
              </p>
            </div>
          </div>
          <button
            onClick={closeDashboardModal}
            className="p-2 text-warm-300/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
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
        <div className="flex items-center px-6 border-b border-white/10 overflow-x-auto gap-2 bg-black/40">
          <button
            onClick={() => setActiveDashboardTab('gallery')}
            className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardTab === 'gallery'
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>01. Galeri Foto ({galleryPhotos.length > 0 ? galleryPhotos.length : data.moments.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('settings')}
            className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardTab === 'settings'
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>02. Site Settings & Musik</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('timeline')}
            className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardTab === 'timeline'
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>03. Linimasa ({timelineEvents.length > 0 ? timelineEvents.length : data.timeline.milestones.length})</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('letter')}
            className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardTab === 'letter'
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400/80" />
            <span>04. Surat Cinta</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('security')}
            className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDashboardTab === 'security'
                ? 'border-champagne-400 text-champagne-300 font-medium'
                : 'border-transparent text-warm-400/60 hover:text-warm-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>05. PIN & Keamanan</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: GALERI FOTO (SUPABASE CRUD & BUCKET 'photos') */}
          {/* ============================================================== */}
          {activeDashboardTab === 'gallery' && (
            <div className="space-y-6">
              {/* Header Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <h3 className="font-serif text-lg text-warm-50 font-normal">
                    Kelola Galeri Foto (Supabase Bucket: 'photos')
                  </h3>
                  <p className="text-xs text-warm-400/70 font-light">
                    Direct upload ke storage bucket 'photos', auto-fetch public URL, dan simpan metadata ke database.
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
                      {/* Image Preview & Upload Input */}
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

                        <div className="w-full mt-3">
                          <button
                            type="button"
                            onClick={() => photoFileInputRef.current?.click()}
                            className="w-full py-2.5 px-3 rounded-lg bg-champagne-400/15 hover:bg-champagne-400/25 border border-champagne-400/40 text-xs text-champagne-200 flex items-center justify-center gap-2 transition-colors font-medium"
                          >
                            <Upload className="w-4 h-4 text-champagne-300" />
                            <span>{photoFile ? photoFile.name : 'Pilih File Foto dari Perangkat'}</span>
                          </button>
                        </div>

                        <div className="w-full mt-2">
                          <input
                            type="text"
                            placeholder="Atau masukkan tautan / URL foto..."
                            value={photoPreview}
                            onChange={(e) => setPhotoPreview(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-200 placeholder:text-warm-400/30 focus:outline-none focus:border-champagne-400"
                          />
                        </div>
                      </div>

                      {/* Detail Fields */}
                      <div className="md:col-span-7 space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Judul / Label Momen
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: Senja di Tepi Pantai / Kedai Kopi Tua"
                            value={photoTitle}
                            onChange={(e) => setPhotoTitle(e.target.value)}
                            required
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Tanggal Kenangan
                          </label>
                          <input
                            type="text"
                            placeholder="contoh: 12.08.2024 atau 14 Februari 2025"
                            value={photoDate}
                            onChange={(e) => setPhotoDate(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Caption Romantis
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Tuliskan cerita singkat atau kutipan romantis tentang foto ini..."
                            value={photoCaption}
                            onChange={(e) => setPhotoCaption(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                            Format Tampilan (Rasio Foto)
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'portrait', label: 'Tegak (Portrait)' },
                              { id: 'landscape', label: 'Lebar (Landscape)' },
                              { id: 'square', label: 'Persegi (Square)' },
                            ].map((asp) => (
                              <button
                                key={asp.id}
                                type="button"
                                onClick={() => setPhotoAspect(asp.id)}
                                className={`py-2 px-2 rounded-lg text-xs border text-center transition-all ${
                                  photoAspect === asp.id
                                    ? 'bg-champagne-400/20 border-champagne-400 text-champagne-200 font-medium'
                                    : 'bg-black/30 border-white/10 text-warm-400 hover:text-warm-200'
                                }`}
                              >
                                {asp.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingPhoto(false);
                              setEditingPhotoId(null);
                            }}
                            className="px-4 py-2 rounded-lg text-xs text-warm-400 hover:text-white"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-lg bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Menyimpan ke Supabase...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>{editingPhotoId ? 'Simpan Perubahan' : 'Upload ke Supabase'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Grid Daftar Foto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(galleryPhotos.length > 0 ? galleryPhotos : data.moments.gallery).map((item, idx) => {
                  const imgUrl = item.image_url || item.image;
                  const dateStr = item.date_taken || item.date;
                  const captionStr = item.caption || item.title;

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
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
          {/* TAB 2: SITE SETTINGS & HERO & MUSIK MP3 */}
          {/* ============================================================== */}
          {activeDashboardTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl mx-auto">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <h3 className="font-serif text-lg text-warm-50 font-normal">
                  Pengaturan Situs (Tabel: 'site_settings')
                </h3>
                <p className="text-xs text-warm-400/70 font-light mt-0.5">
                  Ubah nama pasangan, tanggal jadian (Day Counter), foto Hero (Bucket: 'photos'), dan musik latar (Bucket: 'audio').
                </p>
              </div>

              {/* Identitas Pasangan & Tanggal Jadian */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Nama Pasangan (couple_names)
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Wahyu & Elena"
                      value={settingsForm.couple_names}
                      onChange={(e) => setSettingsForm({ ...settingsForm, couple_names: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                    />
                    <p className="text-[10px] text-warm-400/50 mt-1">
                      Ditampilkan di Navbar, Hero, Love Letter, dan Footer.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Tanggal Jadian (relationship_start_date)
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Judul Utama Hero (hero_title)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.hero_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                      Subtitle Hero (hero_subtitle)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.hero_subtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none"
                    />
                  </div>
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
                      URL Gambar Hero (hero_image_url)
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
                      <span>Simpan Pengaturan Situs</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: LINIMASA (timeline_events) */}
          {/* ============================================================== */}
          {activeDashboardTab === 'timeline' && (
            <div className="space-y-6">
              {/* Header Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <h3 className="font-serif text-lg text-warm-50 font-normal">
                    Linimasa Kisah Perjalanan (Tabel: 'timeline_events')
                  </h3>
                  <p className="text-xs text-warm-400/70 font-light">
                    Tambah, edit, dan hapus milestone linimasa perjalanan cinta.
                  </p>
                </div>
                {!isAddingTimeline && (
                  <button
                    onClick={() => {
                      setIsAddingTimeline(true);
                      setEditingTimelineId(null);
                      setTimelineForm({
                        year_or_date: '',
                        title: '',
                        description: '',
                        location: '',
                        display_order: timelineEvents.length + 1
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Milestone Baru</span>
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
                        {editingTimelineId ? 'Edit Milestone Linimasa' : 'Tambah Milestone Linimasa Baru'}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                          Tanggal / Tahun (year_or_date)
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: 25 JULI 2025 atau Musim Gugur 2024"
                          value={timelineForm.year_or_date}
                          onChange={(e) => setTimelineForm({ ...timelineForm, year_or_date: e.target.value })}
                          required
                          className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                          Judul Milestone (title)
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: Sapaan Pertama / Kencan Pertama"
                          value={timelineForm.title}
                          onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                          required
                          className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                          Lokasi / Tag (location)
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: Kedai Kopi Sudut Jalan"
                          value={timelineForm.location}
                          onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                          Urutan Tampilan (display_order)
                        </label>
                        <input
                          type="number"
                          value={timelineForm.display_order}
                          onChange={(e) => setTimelineForm({ ...timelineForm, display_order: parseInt(e.target.value, 10) || 0 })}
                          className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                        Cerita Peristiwa (description)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan kisah momen indah yang terjadi pada babak ini..."
                        value={timelineForm.description}
                        onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTimeline(false);
                          setEditingTimelineId(null);
                        }}
                        className="px-4 py-2 rounded-lg text-xs text-warm-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider uppercase shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>{editingTimelineId ? 'Simpan Perubahan' : 'Tambahkan Babak'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* List Timeline Items */}
              <div className="space-y-3">
                {(timelineEvents.length > 0 ? timelineEvents : data.timeline.milestones).map((item, idx) => {
                  const dateStr = item.year_or_date || item.date;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-champagne-300/80 mb-1">
                          <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10">#{item.display_order ?? idx + 1}</span>
                          <span>{dateStr}</span>
                          {item.location && (
                            <>
                              <span className="text-white/20">•</span>
                              <span className="text-warm-300/70">{item.location}</span>
                            </>
                          )}
                        </div>
                        <h4 className="font-serif text-base text-warm-50 font-medium">{item.title}</h4>
                        <p className="text-xs text-warm-400/80 line-clamp-2 mt-1 leading-relaxed font-light">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => startEditTimeline(item)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-warm-200 flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-champagne-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteDialog({
                            type: 'timeline',
                            id: item.id,
                            title: item.title
                          })}
                          className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus babak ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: SURAT CINTA DIGITAL (love_notes) */}
          {/* ============================================================== */}
          {activeDashboardTab === 'letter' && (
            <form onSubmit={handleSaveNote} className="space-y-6 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2 text-rose-300 font-medium text-sm mb-1">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
                  <span>Surat Cinta Digital (Tabel: 'love_notes')</span>
                </div>
                <p className="text-xs text-warm-400/70 font-light">
                  Surat cinta yang tertulis di bawah langit bintang pada Section Love Letter.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1.5">
                    Isi Surat Cinta (letter_content)
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
                    Tanda Tangan / Nama Pasangan (signature_names)
                  </label>
                  <input
                    type="text"
                    value={noteForm.signature_names}
                    onChange={(e) => setNoteForm({ ...noteForm, signature_names: e.target.value })}
                    placeholder="contoh: Wahyu & Elena"
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-editorial text-base"
                  />
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
                      <span>Simpan Surat Cinta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PIN & KEAMANAN */}
          {/* ============================================================== */}
          {activeDashboardTab === 'security' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <form onSubmit={handleChangePin} className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <KeyRound className="w-4 h-4 text-champagne-400" />
                  <h3 className="font-serif text-base text-warm-50 font-normal">
                    Ganti PIN Masuk Admin (admin_pin)
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
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    required
                    placeholder="Minimal 4 karakter..."
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans tracking-wider uppercase text-warm-300/70 mb-1">
                    Konfirmasi PIN Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    required
                    placeholder="Ulangi PIN baru..."
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 focus:outline-none focus:border-champagne-400 font-mono"
                  />
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
