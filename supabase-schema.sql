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
 bg_music_url TEXT,
 admin_pin TEXT NOT NULL DEFAULT 'semesta123',
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

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
 display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS love_notes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 letter_content TEXT NOT NULL,
 signature_names TEXT DEFAULT 'Wahyu & Nur'
);

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
-- SEED DATA AWAL (Opsional / Default jika tabel masih kosong)
-- ==============================================================================

-- Baris pertama site_settings
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

-- Baris pertama love_notes
INSERT INTO love_notes (letter_content, signature_names)
SELECT 
  'Dulu aku berpikir bahwa cinta adalah sesuatu yang bising dan riuh—seperti kembang api yang meledak di langit kota yang ramai. Namun bersamamu, aku menyadari bahwa cinta sejati justru bersemayam dalam keheningan yang tenang. Cinta hadir dalam denting cangkir kopi di pagi hari, dalam caramu memandang dunia dengan kelembutan, dan dalam keyakinan bahwa apa pun yang terjadi esok, kita akan menghadapinya berdua.

Terima kasih telah menjadi dermaga yang teduh, teman percakapan tengah malam favoritku, dan rumah di setiap langkah hidupku. Jika hidup kita adalah ribuan buku di perpustakaan semesta, aku akan menghabiskan setiap waktu hanya untuk mencari rak di mana kisah kita berada.', 
  'Wahyu & Nur'
WHERE NOT EXISTS (SELECT 1 FROM love_notes);
