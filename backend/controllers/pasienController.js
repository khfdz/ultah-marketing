const db = require('../config/db');
const ExcelJS = require("exceljs");

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
        bulan_awal,
        bulan_akhir,
        page = 1,
        limit = 100,
        sort_by,
        order,
    } = req.query;

    const baseQuery = `FROM pasien WHERE 1=1`;
    let filterQuery = '';
    const params = [];

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
    if (bulan_awal && bulan_akhir) {
        filterQuery += ` AND MONTH(tgl_lahir) BETWEEN ? AND ?`;
        params.push(bulan_awal, bulan_akhir);
    }

    const isDownload = req.query.download === 'true';
    const offset = (page - 1) * limit;

    const allowedSortColumns = ['nm_pasien', 'tgl_lahir', 'jk'];
    const safeSortBy = allowedSortColumns.includes(sort_by) ? sort_by : 'nm_pasien';
    const safeOrder = order === 'desc' ? 'DESC' : 'ASC';

    const dataQuery = `
        SELECT no_rkm_medis, nm_pasien, jk, tgl_lahir, no_tlp
        ${baseQuery}
        ${filterQuery}
        ORDER BY ${safeSortBy} ${safeOrder}
        ${isDownload ? '' : 'LIMIT ? OFFSET ?'}
    `;

    const dataParams = isDownload
        ? params
        : [...params, parseInt(limit), parseInt(offset)];

    const countQuery = `SELECT COUNT(*) as total ${baseQuery} ${filterQuery}`;

    db.query(dataQuery, dataParams, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        db.query(countQuery, params, (err2, countResult) => {
            if (err2) return res.status(500).json({ error: err2 });

            if (isDownload) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Pasien");
              
                worksheet.columns = [
                  { header: "Nama", key: "nm_pasien", width: 25 },
                  { header: "Tanggal Lahir", key: "tgl_lahir", width: 20 },
                  { header: "No Telp", key: "no_tlp", width: 20 },
                ];
              
                results.forEach((item) => {
                  worksheet.addRow(item);
                });
              
                res.setHeader(
                  "Content-Type",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                  "Content-Disposition",
                  `attachment; filename="pasien_${Date.now()}.xlsx"`
                );
              
                return workbook.xlsx.write(res).then(() => res.end());
            } else {
                res.json({
                    data: results,
                    total: countResult[0].total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                });
            }
        });
    });
};


