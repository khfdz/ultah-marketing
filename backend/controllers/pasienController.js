const db = require('../config/db');

exports.getPasienAdvanced = (req, res) => {
    const {
        nama,
        tanggal,
        bulan,
        tahun,
        jk,
        telp,
        range_tgl_awal,
        range_tgl_akhir,
        page = 1,
        limit = 100,
    } = req.query;

    const baseQuery = `FROM pasien WHERE 1=1`;
    let filterQuery = '';
    const params = [];
    
    // Tambahkan filter ke filterQuery
    if (nama) {
        filterQuery += ` AND nm_pasien LIKE ?`;
        params.push(`%${nama}%`);
    }
    if (tanggal) {
        filterQuery += ` AND DAY(tgl_lahir) = ?`;
        params.push(tanggal);
    }
    if (bulan) {
        filterQuery += ` AND MONTH(tgl_lahir) = ?`;
        params.push(bulan);
    }
    if (tahun) {
        filterQuery += ` AND YEAR(tgl_lahir) = ?`;
        params.push(tahun);
    }
    if (jk) {
        filterQuery += ` AND jk = ?`;
        params.push(jk);
    }
    if (telp) {
        filterQuery += ` AND no_tlp LIKE ?`;
        params.push(`%${telp}%`);
    }
    if (range_tgl_awal && range_tgl_akhir) {
        filterQuery += ` AND tgl_lahir BETWEEN ? AND ?`;
        params.push(range_tgl_awal, range_tgl_akhir);
    }
    
    // Query untuk ambil data
    const dataQuery = `SELECT no_rkm_medis, nm_pasien, jk, tgl_lahir, no_tlp ${baseQuery}${filterQuery} ORDER BY nm_pasien DESC LIMIT ? OFFSET ?`;
    const offset = (page - 1) * limit;
    const dataParams = [...params, parseInt(limit), parseInt(offset)];
    
    // Query untuk count total
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}${filterQuery}`;
    
    // Eksekusi query
    db.query(dataQuery, dataParams, (err, results) => {
        if (err) return res.status(500).json({ error: err });
    
        db.query(countQuery, params, (err2, countResult) => {
            if (err2) return res.status(500).json({ error: err2 });
    
            res.json({
                data: results,
                total: countResult[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
            });
        });
    });
    
}