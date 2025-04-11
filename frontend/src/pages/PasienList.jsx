import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import PasienFilters from "../components/PasienFilters";

const PasienList = () => {
  const [pasien, setPasien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // atau 'desc'

  const [filters, setFilters] = useState({
    bulanAwal: "",
    bulanAkhir: "",
    tanggal: "",
    bulan: "",
    jenisKelamin: "",
    nama: "",
    sort: "",
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const fetchPasien = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams();
        query.append("page", page);
        query.append("limit", 50);

        const { bulanAwal, bulanAkhir, tanggal, bulan, jenisKelamin, nama } =
          filters;

        if (bulanAwal) query.append("bulan_awal", bulanAwal);
        if (bulanAkhir) query.append("bulan_akhir", bulanAkhir);
        if (tanggal) query.append("tanggal", tanggal);
        if (bulan) query.append("bulan", bulan);
        if (jenisKelamin) query.append("jk", jenisKelamin);
        if (nama) query.append("nama", nama);
        if (sortBy) query.append("sort_by", sortBy);
        if (sortOrder) query.append("order", sortOrder);

        const response = await fetch(
          `http://localhost:5000/api/pasien/filter?${query.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setPasien(data.data);
          setTotalPages(Math.ceil(data.total / 50) || 1);
        } else {
          console.error("Gagal mengambil data:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPasien();
    }, 400);
    return () => clearTimeout(timer);
  }, [page, filters, sortBy, sortOrder]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Daftar Pasien</h2>

      <PasienFilters filters={filters} setFilters={setFilters} />

      {loading ? (
  <div className="flex items-center justify-center h-48">
    <span className="text-blue-600 font-semibold animate-pulse">
      Memuat data pasien...
    </span>
  </div>
) : (
  <>
    <div className="overflow-x-auto rounded-xl shadow-md bg-white">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-blue-100 text-gray-800 text-left">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">No RM</th>
            <th
              onClick={() => handleSort("nama")}
              className="px-4 py-3 cursor-pointer hover:text-blue-600"
            >
              Nama {sortBy === "nama" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("jk")}
              className="px-4 py-3 cursor-pointer hover:text-blue-600"
            >
              JK {sortBy === "jk" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("tgl_lahir")}
              className="px-4 py-3 cursor-pointer hover:text-blue-600"
            >
              Tanggal Lahir {sortBy === "tgl_lahir" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-3">No Telp</th>
          </tr>
        </thead>
        <tbody>
          {pasien.map((item, idx) => {
            const tgl = new Date(item.tgl_lahir);
            const day = String(tgl.getDate()).padStart(2, "0");
            const month = String(tgl.getMonth() + 1).padStart(2, "0");
            const year = tgl.getFullYear();
            return (
              <tr
                key={item.no_rkm_medis}
                className="hover:bg-blue-50 transition duration-150"
              >
                <td className="px-4 py-3">{(page - 1) * 50 + idx + 1}</td>
                <td className="px-4 py-3">{item.no_rkm_medis}</td>
                <td className="px-4 py-3">{item.nm_pasien}</td>
                <td className="px-4 py-3">{item.jk}</td>
                <td className="px-4 py-3">{`${day}-${month}-${year}`}</td>
                <td className="px-4 py-3">{item.no_tlp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default PasienList;
