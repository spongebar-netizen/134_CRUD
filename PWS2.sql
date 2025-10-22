-- 1. Buat database baru (jika belum ada)
CREATE DATABASE IF NOT EXISTS mahasiswa;

-- 2. Gunakan database tersebut
USE mahasiswa;

-- 3. Buat tabel biodata
CREATE TABLE IF NOT EXISTS biodata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    kelas VARCHAR(10)
);

-- 4. Masukkan beberapa data contoh
INSERT INTO biodata (nama, nim, kelas) VALUES
('Budi Santoso', '202201001', 'IF-01'),
('Ani Lestari', '202201002', 'IF-01'),
('Candra Wijaya', '202202003', 'IF-02');