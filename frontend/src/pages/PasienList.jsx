import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Cleave from 'cleave.js/react'

import 'react-datepicker/dist/react-datepicker.css'

const PasienList = () => {
  const [pasien, setPasien] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Filter state
  const [jk, setJk] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [nama, setNama] = useState('')

  const fetchPasien = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')

      const query = new URLSearchParams()
      query.append('page', page)
      query.append('limit', 100)
      if (jk) query.append('jk', jk)
      if (nama) query.append('nama', nama)
      if (startDate && endDate) {
        query.append('range_tgl_awal', startDate.toISOString().split('T')[0])
        query.append('range_tgl_akhir', endDate.toISOString().split('T')[0])
      }

      const response = await fetch(`http://localhost:5000/api/pasien/filter?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (response.ok) {
        setPasien(data.data)
      } else {
        console.error('Gagal mengambil data:', data.message)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPasien()
    }, 400)
    return () => clearTimeout(timer)
  }, [page, jk, startDate, endDate, nama])

  // Helper untuk parsing tanggal dari input manual dd-MM-yyyy
  const parseDate = (value) => {
    const [day, month, year] = value.split('-')
    if (!day || !month || !year) return null
    return new Date(`${year}-${month}-${day}`)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Daftar Pasien</h2>

      <div className="mb-6 flex items-center gap-4 flex-wrap">
        {/* Filter Nama */}
        <div>
          <label className="block text-sm mb-1">Nama Pasien</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Cari nama"
            className="border p-2 rounded w-40"
          />
        </div>

        {/* Filter JK */}
        <div>
          <label className="block text-sm mb-1">Jenis Kelamin</label>
          <select
            value={jk}
            onChange={(e) => setJk(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">Semua</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        {/* Tanggal Awal */}
        <div>
          <label className="block text-sm mb-1">Tanggal Lahir Awal</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            customInput={
              <Cleave
                options={{ date: true, delimiter: '-', datePattern: ['d', 'm', 'Y'] }}
                className="border p-2 rounded w-40"
                placeholder="dd-mm-yyyy"
                onChange={(e) => {
                  const parsed = parseDate(e.target.value)
                  setStartDate(parsed)
                }}
              />
            }
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        {/* Tanggal Akhir */}
        <div>
          <label className="block text-sm mb-1">Tanggal Lahir Akhir</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            customInput={
              <Cleave
                options={{ date: true, delimiter: '-', datePattern: ['d', 'm', 'Y'] }}
                className="border p-2 rounded w-40"
                placeholder="dd-mm-yyyy"
                onChange={(e) => {
                  const parsed = parseDate(e.target.value)
                  setEndDate(parsed)
                }}
              />
            }
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full text-black border text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">No RM</th>
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">JK</th>
              <th className="px-4 py-2 border">Tanggal Lahir</th>
              <th className="px-4 py-2 border">No Telp</th>
            </tr>
          </thead>
          <tbody>
            {pasien.map((item, idx) => (
              <tr key={item.no_rkm_medis}>
                <td className="px-4 py-2 border">{(page - 1) * 100 + idx + 1}</td>
                <td className="px-4 py-2 border">{item.no_rkm_medis}</td>
                <td className="px-4 py-2 border">{item.nm_pasien}</td>
                <td className="px-4 py-2 border">{item.jk}</td>
                <td className="px-4 py-2 border">
  {(() => {
    const tgl = new Date(item.tgl_lahir)
    const day = String(tgl.getDate()).padStart(2, '0')
    const month = String(tgl.getMonth() + 1).padStart(2, '0')
    const year = tgl.getFullYear()
    return `${day}-${month}-${year}`
  })()}
</td>

                <td className="px-4 py-2 border">{item.no_tlp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PasienList
