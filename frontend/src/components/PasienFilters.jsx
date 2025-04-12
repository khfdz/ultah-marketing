import React from "react";
import Cleave from "cleave.js/react";

const PasienFilters = ({ filters, setFilters, handleDownload }) => {
  const handleTanggalBulanChange = (value) => {
    const [tanggal, bulan] = value.split("-");
    setFilters((prev) => ({
      ...prev,
      tanggal: tanggal || "",
      bulan: bulan || "",
    }));
  };

  return (
    <div className="flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-2xl shadow-md">
      <div className="flex flex-col w-40">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Bulan Awal
        </label>
        <select
          className="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filters.bulanAwal}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bulanAwal: e.target.value }))
          }
        >
          <option value="">Semua</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col w-40">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Bulan Akhir
        </label>
        <select
          className="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filters.bulanAkhir}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bulanAkhir: e.target.value }))
          }
        >
          <option value="">Semua</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col w-40">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Tanggal-Bulan (dd-mm)
        </label>
        <Cleave
          options={{ date: true, delimiter: "-", datePattern: ["d", "m"] }}
          className="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="dd-mm"
          onChange={(e) => handleTanggalBulanChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-40">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Jenis Kelamin
        </label>
        <select
          value={filters.jenisKelamin}
          onChange={(e) =>
            setFilters({ ...filters, jenisKelamin: e.target.value })
          }
          className="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Semua</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div className="flex flex-col w-60">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Cari Nama
        </label>
        <input
          type="text"
          placeholder="Nama pasien..."
          value={filters.nama}
          onChange={(e) => setFilters({ ...filters, nama: e.target.value })}
          className="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col w-40">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Ambil Data
        </label>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 text-white shadow hover:bg-blue-600"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default PasienFilters;
