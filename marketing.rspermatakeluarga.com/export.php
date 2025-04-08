<?php
// Memanggil atau membutuhkan file function.php
$koneksi = mysqli_connect("101.255.121.26", "permata", "rspkrw2024", "sikkrw");

// membuat fungsi query dalam bentuk array
function query($query)
{
    // Koneksi database
    global $koneksi;

    $result = mysqli_query($koneksi, $query);

    // membuat varibale array
    $rows = [];

    // mengambil semua data dalam bentuk array
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    return $rows;
}

// Menampilkan semua data dari table Mahasiswa berdasarkan nim secara Descending
$siswa = query("
    SELECT * FROM pasien 
    WHERE DAY(tgl_lahir) = DAY(CURDATE()) 
    AND MONTH(tgl_lahir) = MONTH(CURDATE()) 
    ORDER BY nm_pasien DESC
");

// Membuat nama file
$filename = "data_pasien_ulang_tahun" . date('Ymd') . ".xls";

// export ke excel
header("Content-type: application/vnd-ms-excel");
header("Content-Disposition: attachment; filename=data_pasien_ulang_tahun.xls");

?>
<table class="text-center" border="1">
    <thead class="text-center">
        <tr>
            <th>Nama Pasien</th>
            <th>Tanggal Lahir</th>
            <th>Nomor Handphone</th>
        </tr>
    </thead>
    <tbody class="text-center">
        <?php $no = 1; ?>
        <?php foreach ($siswa as $row): ?>
            <tr>
                <td><?= $row['nm_pasien']; ?></td>
                <td><?= $row['tgl_lahir']; ?></td>
                <td>
                    <?php
                    // Menghapus karakter non-digit dari nomor telepon
                    $no_tlp = preg_replace('/[^0-9]/', '', $row['no_tlp']);

                    // Cek apakah nomor dimulai dengan '0'
                    if (substr($no_tlp, 0, 1) == '0') {
                        // Ganti '0' dengan '62'
                        $no_tlp = '62' . substr($no_tlp, 1);
                    }

                    // Tampilkan nomor dengan '62' di depannya
                    echo $no_tlp;
                    ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>