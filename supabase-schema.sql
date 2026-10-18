-- ==============================================================================
-- OUR LITTLE UNIVERSE — SUPABASE DATABASE & STORAGE SCHEMA
-- Jalankan seluruh perintah SQL ini di Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. TABEL PENGATURAN SITUS (site_settings)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_names TEXT NOT NULL DEFAULT 'Wahyu & Nur',
  relationship_start_date DATE NOT NULL DEFAULT '2023-10-24',
  hero_title TEXT DEFAULT 'Di antara dua orang asing, kita menjadi kita.',
  hero_subtitle TEXT DEFAULT 'Ruang digital dokumentasi perjalanan cinta berdua.',
  hero_image_url TEXT,
  hero_badge TEXT DEFAULT 'SEMESTA KECIL KITA',
  hero_quote TEXT DEFAULT '“Di semesta yang seluas ini, hatiku memilih ketenangan di sampingmu.”',
  hero_caption TEXT DEFAULT 'Koordinat petang yang teduh / 18:42 WIB',
  
  -- Story Section (Section 01)
  story_section_title TEXT DEFAULT 'AWAL KISAH KITA',
  story_subheading TEXT DEFAULT 'Setiap kisah memiliki awal.
Kisah kita bersemi di antara kebetulan dan takdir.',
  story_chapter_tag TEXT DEFAULT 'Babak I',
  story_title TEXT DEFAULT 'Pertemuan Awal di Ranggon Jaya Mart',
  story_date TEXT DEFAULT '25.07.2025',
  story_location TEXT DEFAULT 'Jalan D.I. Panjaitan, Bangkinang, Riau',
  story_coordinates TEXT DEFAULT '40°42''46.1"N 74°00''21.8"W',
  story_description TEXT,
  story_quote TEXT DEFAULT '“Dunia di luar begitu bising, namun duduk di hadapanmu terasa seperti menemukan ruang paling tenang di seluruh semesta.”',
  story_image1_url TEXT,
  story_image1_caption TEXT DEFAULT 'Sudut kedai kopi tempat waktu terasa berhenti',
  story_image2_url TEXT,
  story_image2_caption TEXT DEFAULT 'Tatap mata pertama di tengah gerimis',

  -- Timeline Section Header
  timeline_section_title TEXT DEFAULT 'LINIMASA KITA',
  timeline_subheading TEXT DEFAULT 'Momen-momen kecil yang perlahan merangkai kisah kita.',

  -- Final Section / Footer
  final_quote TEXT DEFAULT '“Dan ini hanyalah sebuah permulaan.”',
  final_subtext TEXT DEFAULT 'Masih ada begitu banyak detik, tawa, dan cerita
yang belum kita jalani bersama.',
  final_button_text TEXT DEFAULT 'KISAH KITA BERLANJUT',
  final_footer_text TEXT DEFAULT 'Dibuat dengan segenap cinta.',
  final_copyright TEXT DEFAULT 'Our Little Universe • Terukir selamanya di dalam hati kita',

  -- Musik & Keamanan
  bg_music_url TEXT,
  admin_pin TEXT NOT NULL DEFAULT 'semesta123',
  extra_data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migrasi aman untuk tabel site_settings yang sudah ada (ADD COLUMN IF NOT EXISTS)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_badge TEXT DEFAULT 'SEMESTA KECIL KITA';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_quote TEXT DEFAULT '“Di semesta yang seluas ini, hatiku memilih ketenangan di sampingmu.”';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_caption TEXT DEFAULT 'Koordinat petang yang teduh / 18:42 WIB';

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_section_title TEXT DEFAULT 'AWAL KISAH KITA';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_subheading TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_chapter_tag TEXT DEFAULT 'Babak I';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_title TEXT DEFAULT 'Pertemuan Awal di Ranggon Jaya Mart';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_date TEXT DEFAULT '25.07.2025';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_location TEXT DEFAULT 'Jalan D.I. Panjaitan, Bangkinang, Riau';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_coordinates TEXT DEFAULT '40°42''46.1"N 74°00''21.8"W';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_quote TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_image1_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_image1_caption TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_image2_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS story_image2_caption TEXT;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS timeline_section_title TEXT DEFAULT 'LINIMASA KITA';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS timeline_subheading TEXT DEFAULT 'Momen-momen kecil yang perlahan merangkai kisah kita.';

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS final_quote TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS final_subtext TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS final_button_text TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS final_footer_text TEXT DEFAULT 'Dibuat dengan segenap cinta.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS final_copyright TEXT DEFAULT 'Our Little Universe • Terukir selamanya di dalam hati kita';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS extra_data JSONB DEFAULT '{}'::jsonb;

-- 2. TABEL GALERI FOTO (gallery_photos)
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  caption TEXT,
  date_taken TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'portrait',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL LINIMASA & SURAT CINTA (timeline_events & love_notes)
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_or_date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0
);
ALTER TABLE timeline_events ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS love_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT DEFAULT 'SECARIK CATATAN DI BAWAH LANGIT BINTANG',
  date TEXT DEFAULT 'Bisikan tulus di keheningan tengah malam',
  letter_content TEXT NOT NULL,
  signature_names TEXT DEFAULT 'Wahyu & Nur'
);
ALTER TABLE love_notes ADD COLUMN IF NOT EXISTS heading TEXT DEFAULT 'SECARIK CATATAN DI BAWAH LANGIT BINTANG';
ALTER TABLE love_notes ADD COLUMN IF NOT EXISTS date TEXT DEFAULT 'Bisikan tulus di keheningan tengah malam';

-- ==============================================================================
-- KEAMANAN & POLICIES (Row Level Security / RLS)
-- Memberikan akses penuh untuk anon/public key agar Admin Panel dapat beroperasi
-- ==============================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;

-- Policies untuk site_settings
DROP POLICY IF EXISTS "Allow public all site_settings" ON site_settings;
CREATE POLICY "Allow public all site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Policies untuk gallery_photos
DROP POLICY IF EXISTS "Allow public all gallery_photos" ON gallery_photos;
CREATE POLICY "Allow public all gallery_photos" ON gallery_photos FOR ALL USING (true) WITH CHECK (true);

-- Policies untuk timeline_events
DROP POLICY IF EXISTS "Allow public all timeline_events" ON timeline_events;
CREATE POLICY "Allow public all timeline_events" ON timeline_events FOR ALL USING (true) WITH CHECK (true);

-- Policies untuk love_notes
DROP POLICY IF EXISTS "Allow public all love_notes" ON love_notes;
CREATE POLICY "Allow public all love_notes" ON love_notes FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS (photos & audio)
-- ==============================================================================

-- Buat bucket photos dan audio jika belum ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies untuk storage bucket photos
DROP POLICY IF EXISTS "Public Access Storage photos" ON storage.objects;
CREATE POLICY "Public Access Storage photos" ON storage.objects 
FOR ALL USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');

-- Policies untuk storage bucket audio
DROP POLICY IF EXISTS "Public Access Storage audio" ON storage.objects;
CREATE POLICY "Public Access Storage audio" ON storage.objects 
FOR ALL USING (bucket_id = 'audio') WITH CHECK (bucket_id = 'audio');

-- ==============================================================================
-- SEED DATA AWAL
-- ==============================================================================

INSERT INTO site_settings (
  couple_names, 
  relationship_start_date, 
  hero_title, 
  hero_subtitle, 
  hero_image_url,
  bg_music_url,
  admin_pin
)
SELECT 
  'Wahyu & Nur', 
  '2023-10-24', 
  'Di antara dua orang asing, kita menjadi kita.', 
  'Ruang digital dokumentasi perjalanan cinta berdua.',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop',
  '/audio/music.mp3',
  'semesta123'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
