import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Upload, Settings2, X, Check, FileAudio, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

export const MusicPlayer = ({ isPlaying, onTogglePlay }) => {
  const { data, coupleConfig } = useLanguage();
  const { siteSettings, uploadAudio, saveSiteSettings, isSupabaseConfigured } = useAdmin();

  const [isMuted, setIsMuted] = useState(false);
  const [customAudioSrc, setCustomAudioSrc] = useState(null);
  const [currentSongTitle, setCurrentSongTitle] = useState("Lagu Semesta Kita");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const fileInputRef = useRef(null);

  // Active audio URL: prioritaskan customAudioSrc > siteSettings.bg_music_url > coupleConfig.music.audioSrc
  const activeAudioUrl = customAudioSrc || siteSettings?.bg_music_url || coupleConfig?.music?.audioSrc || '/audio/music.mp3';

  // Web Audio API ambient chord fallback synthesizer for 100% reliability
  const startSynthesizerFallback = () => {
    try {
      if (synthRef.current) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const chords = [
        [293.66, 369.99, 440.00, 554.37], // Dmaj7
        [246.94, 293.66, 369.99, 440.00], // Bm7
        [196.00, 246.94, 293.66, 369.99], // Gmaj7
        [220.00, 277.18, 329.63, 440.00], // A
      ];

      let chordIndex = 0;
      let isRunning = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const playChord = () => {
        if (!isRunning) return;
        const currentNotes = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        currentNotes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const now = ctx.currentTime;
          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.exponentialRampToValueAtTime(0.02, now + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 5.0);
        });
      };

      playChord();
      const interval = setInterval(playChord, 5200);

      synthRef.current = {
        ctx,
        masterGain,
        stop: () => {
          isRunning = false;
          clearInterval(interval);
          try {
            masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            setTimeout(() => ctx.close(), 600);
          } catch {}
          synthRef.current = null;
        },
        setMute: (mute) => {
          masterGain.gain.setValueAtTime(mute ? 0 : 0.08, ctx.currentTime);
        }
      };
    } catch (e) {
      console.warn("Audio synthesis unavailable", e);
    }
  };

  const stopSynthesizerFallback = () => {
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
    }
  };

  // Playback effect
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      if (audio) {
        audio.volume = isMuted ? 0 : 0.4;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            startSynthesizerFallback();
          });
        }
      } else {
        startSynthesizerFallback();
      }
    } else {
      if (audio) {
        audio.pause();
      }
      stopSynthesizerFallback();
    }
  }, [isPlaying, activeAudioUrl]);

  // Mute effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (synthRef.current) {
      synthRef.current.setMute(isMuted);
    }
  }, [isMuted]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Handle upload MP3 file ke Supabase Storage Bucket 'audio'
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedbackMsg('');

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setCurrentSongTitle(cleanName);

      if (isSupabaseConfigured) {
        const uploadResult = await uploadAudio(file);
        if (uploadResult?.publicUrl) {
          setCustomAudioSrc(uploadResult.publicUrl);
          setFeedbackMsg('Lagu MP3 berhasil diunggah ke Supabase Storage (Bucket: audio)!');
        }
      } else {
        // Fallback local blob URL
        const blobUrl = URL.createObjectURL(file);
        setCustomAudioSrc(blobUrl);
        setFeedbackMsg('Lagu dimuat secara lokal (hubungkan Supabase untuk simpan permanen).');
      }

      if (!isPlaying) onTogglePlay();
    } catch (err) {
      setFeedbackMsg('Gagal upload audio: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle URL change
  const handleApplyUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUploading(true);
    try {
      setCustomAudioSrc(urlInput.trim());
      setCurrentSongTitle("Lagu Kustom");
      if (isSupabaseConfigured) {
        await saveSiteSettings({ bg_music_url: urlInput.trim() });
      }
      setFeedbackMsg('URL Lagu berhasil diperbarui!');
      if (!isPlaying) onTogglePlay();
      setTimeout(() => setShowSettingsModal(false), 1200);
    } catch (err) {
      setFeedbackMsg('Gagal menyimpan URL: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={activeAudioUrl}
        loop
        preload="auto"
        onError={() => {
          if (isPlaying) startSynthesizerFallback();
        }}
      />

      {/* Hidden file input for uploading MP3 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,.mp3,.m4a,.wav,.ogg"
        className="hidden"
      />

      {/* Floating Bottom-Right Music Bar */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-panel border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] group hover:border-warm-200/40 transition-all duration-300"
        >
          {/* Main Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2.5 text-left focus:outline-none"
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          >
            {/* Animated Soundwave bars */}
            <div className="flex items-center gap-[2px] h-3.5 w-3.5 justify-center">
              {isPlaying && !isMuted ? (
                <>
                  <span className="w-[2px] h-3 bg-champagne-300 rounded-full animate-pulse" />
                  <span className="w-[2px] h-2 bg-champagne-300/80 rounded-full animate-bounce delay-75" />
                  <span className="w-[2px] h-3.5 bg-champagne-300 rounded-full animate-pulse delay-150" />
                </>
              ) : (
                <Music className="w-3.5 h-3.5 text-warm-300/60" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest uppercase font-sans font-medium text-warm-100 flex items-center gap-1.5">
                <span>{data.musicPlayer?.label || "♫ LAGU KITA"}</span>
              </span>
              <span className="text-[9px] tracking-wide text-warm-400/60 max-w-[130px] truncate" title={currentSongTitle}>
                {isPlaying ? currentSongTitle : (data.musicPlayer?.paused || "Klik untuk memutar")}
              </span>
            </div>
          </button>

          {/* Quick Upload / Settings button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Ganti / Upload Lagu MP3"
            className="p-1.5 ml-1 rounded-full text-warm-300/60 hover:text-champagne-300 hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Pengaturan Lagu"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full text-warm-300/60 hover:text-warm-100 hover:bg-white/5 transition-colors focus:outline-none"
            aria-label={isMuted ? "Bunyikan" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-warm-400/50" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-warm-300" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Modal Penggantian & Upload Lagu MP3 */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg glass-panel border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl text-warm-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-champagne-400/10 text-champagne-300">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-warm-50 font-normal">
                      Musik Latar Pasangan (MP3)
                    </h3>
                    <p className="text-[11px] font-sans text-warm-300/60 tracking-wider">
                      Terhubung langsung ke Supabase Storage (Bucket: <code className="text-champagne-300">audio</code>)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 text-warm-300/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {feedbackMsg && (
                <div className="mb-4 p-3 rounded-lg bg-champagne-400/10 border border-champagne-400/20 text-xs text-champagne-200">
                  {feedbackMsg}
                </div>
              )}

              {/* Upload Langsung ke Supabase Storage */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-champagne-400/[0.05] border border-champagne-400/20">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-medium text-champagne-200 uppercase tracking-wider font-sans">
                      Upload File MP3 Langsung
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne-400/20 text-champagne-300 font-mono">
                      Supabase Storage
                    </span>
                  </div>
                  <p className="text-xs text-warm-300/80 mb-4 leading-relaxed font-light">
                    Unggah file lagu romantis (.mp3) Anda. File otomatis disimpan di cloud Supabase dan diputar setiap pengunjung membuka website.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-2.5 px-4 rounded-lg bg-champagne-300 hover:bg-champagne-200 text-[#080808] font-medium text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengunggah ke Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Pilih & Unggah File Lagu (.mp3)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Input Link / URL MP3 Online */}
                <form onSubmit={handleApplyUrl} className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="block text-xs font-medium text-warm-200 uppercase tracking-wider font-sans mb-1.5">
                    Atau Masukkan Tautan / URL MP3
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://contoh.com/lagu-kita.mp3"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-warm-100 placeholder:text-warm-400/30 focus:outline-none focus:border-champagne-300"
                    />
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-warm-100 transition-colors disabled:opacity-50"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>

              {/* Status Lagu Saat Ini */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-warm-400/60 font-sans">
                <span>Lagu aktif: <strong className="text-champagne-300 font-medium">{currentSongTitle}</strong></span>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-xs text-warm-300 hover:text-white underline"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
