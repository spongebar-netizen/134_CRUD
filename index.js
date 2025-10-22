// 1. Import library yang dibutuhkan
const express = require('express');
const mysql = require('mysql');

// 2. Konfigurasi koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mahasiswa',
    port: 3309 // <--- Sesuaikan dengan port-mu (dari praktikum 2)
});

// 3. Lakukan koneksi ke database
db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database as id ' + db.threadId);
});

// 4. Inisialisasi Express app
const app = express();
const port = 3000;

// 5. [PENTING] Middleware untuk parsing body JSON
// Ini agar kita bisa membaca req.body saat POST dan PUT
app.use(express.json());

// 6. Jalankan server
app.listen(port, () => {
    console.log(`Server is running and listening on http://localhost:${port}`);
});

// ===============================================
// === RUTE-RUTE UNTUK OPERASI CRUD ===
// ===============================================

// CREATE: Menambahkan data biodata baru
app.post('/biodata', (req, res) => {
    // Ambil data dari body request
    const dataBaru = req.body;

    // Validasi sederhana (pastikan nama dan nim ada)
    if (!dataBaru.nama || !dataBaru.nim) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan NIM wajib diisi!'
        });
    }

    // Query SQL untuk INSERT data
    // Tanda tanya (?) akan diisi otomatis oleh dataBaru secara aman
    const sqlQuery = "INSERT INTO biodata SET ?";

    db.query(sqlQuery, dataBaru, (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        // Kirim response sukses
        res.status(201).json({
            success: true,
            message: 'Data biodata berhasil ditambahkan',
            data: { id: result.insertId, ...dataBaru }
        });
    });
});

// READ: Mengambil semua data biodata (Ini dari Praktikum 2)
app.get('/biodata', (req, res) => {
    const sqlQuery = "SELECT * FROM biodata";

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        res.status(200).json({
            success: true,
            message: 'Data biodata berhasil diambil',
            data: results
        });
    });
});

// READ: Mengambil satu data biodata berdasarkan ID
app.get('/biodata/:id', (req, res) => {
    // Ambil ID dari parameter URL
    const id = req.params.id;

    // Query SQL untuk mengambil data by ID
    const sqlQuery = "SELECT * FROM biodata WHERE id = ?";

    db.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        // Cek apakah data ditemukan
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data biodata tidak ditemukan'
            });
        }

        // Kirim data yang ditemukan
        res.status(200).json({
            success: true,
            message: 'Data biodata berhasil diambil',
            data: results[0] // Kirim objek pertama dari array
        });
    });
});

// UPDATE: Mengubah data biodata berdasarkan ID
app.put('/biodata/:id', (req, res) => {
    // Ambil ID dari parameter URL
    const id = req.params.id;
    // Ambil data baru dari body request
    const dataUpdate = req.body;

    // Validasi sederhana
    if (!dataUpdate.nama || !dataUpdate.nim) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan NIM wajib diisi!'
        });
    }

    // Query SQL untuk UPDATE data
    const sqlQuery = "UPDATE biodata SET ? WHERE id = ?";

    db.query(sqlQuery, [dataUpdate, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        // Cek apakah ada baris yang ter-update
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data biodata tidak ditemukan atau tidak ada perubahan'
            });
        }

        // Kirim response sukses
        res.status(200).json({
            success: true,
            message: 'Data biodata berhasil diupdate',
            data: { id: id, ...dataUpdate }
        });
    });
});

// DELETE: Menghapus data biodata berdasarkan ID
app.delete('/biodata/:id', (req, res) => {
    // Ambil ID dari parameter URL
    const id = req.params.id;``

    // Query SQL untuk DELETE data
    const sqlQuery = "DELETE FROM biodata WHERE id = ?";

    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        // Cek apakah ada baris yang terhapus
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data biodata tidak ditemukan'
            });
        }

        // Kirim response sukses
        res.status(200).json({
            success: true,
            message: 'Data biodata berhasil dihapus'
        });
    });
});

//Example Point