import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper to sanitize filenames
function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// ==============================================================================
// 1. SITE SETTINGS (PENGATURAN SITUS)
// ==============================================================================

export async function getSiteSettings() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase site_settings fetch error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error fetching site_settings:', err);
    return null;
  }
}

export async function updateSiteSettings(settings) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi.');
  }

  const payload = {
    ...settings,
    updated_at: new Date().toISOString()
  };

  // If ID exists, update
  if (settings.id) {
    const { data, error } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', settings.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if any row exists
  const existing = await getSiteSettings();
  if (existing?.id) {
    const { data, error } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Otherwise insert new
  const { data, error } = await supabase
    .from('site_settings')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Upload Foto Hero ke Bucket 'photos'
export async function uploadHeroPhoto(file) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi. Silakan isi .env terlebih dahulu.');
  }

  const fileExt = file.name.split('.').pop();
  const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''));
  const storagePath = `hero/${Date.now()}_${safeName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(storagePath);

  return {
    publicUrl: data.publicUrl,
    storagePath
  };
}

// Upload Background Musik (MP3) ke Bucket 'audio'
export async function uploadBgMusic(file) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi. Silakan isi .env terlebih dahulu.');
  }

  const fileExt = file.name.split('.').pop() || 'mp3';
  const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''));
  const storagePath = `music/${Date.now()}_${safeName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(storagePath, file, {
      contentType: file.type || 'audio/mpeg',
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('audio')
    .getPublicUrl(storagePath);

  return {
    publicUrl: data.publicUrl,
    storagePath
  };
}

// ==============================================================================
// 2. GALERI FOTO (gallery_photos)
// ==============================================================================

export async function getGalleryPhotos() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase gallery_photos fetch error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error fetching gallery_photos:', err);
    return null;
  }
}

export async function addGalleryPhoto({ title, caption, date_taken, aspect_ratio = 'portrait', file, imageUrl }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi. Silakan isi .env terlebih dahulu.');
  }

  let finalUrl = imageUrl;
  let finalStoragePath = '';

  if (file) {
    const fileExt = file.name.split('.').pop();
    const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''));
    finalStoragePath = `gallery/${Date.now()}_${safeName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(finalStoragePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(finalStoragePath);

    finalUrl = data.publicUrl;
  }

  if (!finalUrl) {
    throw new Error('Foto atau URL foto diperlukan.');
  }

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert([
      {
        title: title || 'Momen Kenangan',
        caption: caption || '',
        date_taken: date_taken || new Date().toLocaleDateString('id-ID'),
        image_url: finalUrl,
        storage_path: finalStoragePath || 'external',
        aspect_ratio: aspect_ratio || 'portrait'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryPhoto(id, updates) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  const { data, error } = await supabase
    .from('gallery_photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryPhoto(id, storagePath) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  // 1. Delete from storage if storagePath exists and not external
  if (storagePath && storagePath !== 'external') {
    try {
      await supabase.storage.from('photos').remove([storagePath]);
    } catch (storageErr) {
      console.warn('Storage delete warning:', storageErr);
    }
  }

  // 2. Delete from database
  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ==============================================================================
// 3. LINIMASA (timeline_events)
// ==============================================================================

export async function getTimelineEvents() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase timeline_events fetch error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error fetching timeline_events:', err);
    return null;
  }
}

export async function addTimelineEvent({ year_or_date, title, description, location = '', display_order = 0 }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  const { data, error } = await supabase
    .from('timeline_events')
    .insert([
      {
        year_or_date,
        title,
        description,
        location,
        display_order: parseInt(display_order, 10) || 0
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimelineEvent(id, updates) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  if (updates.display_order !== undefined) {
    updates.display_order = parseInt(updates.display_order, 10) || 0;
  }

  const { data, error } = await supabase
    .from('timeline_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTimelineEvent(id) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ==============================================================================
// 4. SURAT CINTA (love_notes)
// ==============================================================================

export async function getLoveNote() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('love_notes')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase love_notes fetch error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error fetching love_notes:', err);
    return null;
  }
}

export async function updateLoveNote({ letter_content, signature_names, id }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terkonfigurasi.');
  }

  if (id) {
    const { data, error } = await supabase
      .from('love_notes')
      .update({
        letter_content,
        signature_names
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if exists
  const existing = await getLoveNote();
  if (existing?.id) {
    const { data, error } = await supabase
      .from('love_notes')
      .update({
        letter_content,
        signature_names
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('love_notes')
    .insert([
      {
        letter_content,
        signature_names
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}