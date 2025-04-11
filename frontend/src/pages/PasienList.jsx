

import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Cleave from 'cleave.js/react'
import 'react-datepicker/dist/react-datepicker.css'

const PasienList = () => {
  const [pasien, setPasien] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
        if (startDate instanceof Date && !isNaN(startDate) && endDate instanceof Date && !isNaN(endDate)) {
          query.append('tanggal', startDate.getDate())
          query.append('bulan', startDate.getMonth() + 1)
        }
           

      const response = await fetch(`http://localhost:5000/api/pasien/filter?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (response.ok) {
        setPasien(data.data)
        setTotalPages(Math.ceil(data.total / 100) || 1)
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
    const today = new Date()
    const tanggal = today.getDate()
    const bulan = today.getMonth() + 1
    setStartDate({ tanggal, bulan }) // custom object
    setEndDate({ tanggal, bulan })   // sama, biar kompatibel
  }, [])
  

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPasien()
    }, 400)
    return () => clearTimeout(timer)
  }, [page, jk, startDate, endDate, nama])

  const parseDate = (value) => {
    const [day, month, year] = value.split('-')
    if (!day || !month || !year) return null
    return new Date(`${year}-${month}-${day}`)
  }

  const handleDownload = async () => {
    const token = localStorage.getItem('token')
  
    const query = new URLSearchParams()
    if (jk) query.append('jk', jk)
    if (nama) query.append('nama', nama)
    if (startDate && endDate) {
      query.append('range_tgl_awal', startDate.toLocaleDateString('en-CA'))
      query.append('range_tgl_akhir', endDate.toLocaleDateString('en-CA'))
    }
    query.append('download', 'true')
  
    const response = await fetch(`http://localhost:5000/api/pasien/filter?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  
    const data = await response.json()
  
    const csvContent =
      '\uFEFFNo,Nama,Tanggal Lahir,No Telp\n' + // \uFEFF biar Excel bisa baca UTF-8
      data.data
        .map((item, index) => {
          const tgl = new Date(item.tgl_lahir)
          const day = String(tgl.getDate()).padStart(2, '0')
          const month = String(tgl.getMonth() + 1).padStart(2, '0')
          const year = tgl.getFullYear()
          const tglFormatted = `${day}-${month}-${year}`
  
          let namaPasien = item.nm_pasien || '-'
          let noTelp = item.no_tlp ? item.no_tlp.trim() : '-'
  
          // Jika bukan "-" dan tidak mulai dengan 0, tambahkan 0
          if (noTelp !== '-' && !noTelp.startsWith('0')) {
            noTelp = '0' + noTelp
          }
  
          return `${index + 1},"${namaPasien}",${tglFormatted},${noTelp}`
        })
        .join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'Data Ulang Tahun Pasien RSPK KRW.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  
  

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Daftar Pasien</h2>

      <div className="mb-6 flex items-center gap-4 flex-wrap">
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

        <div>
          <label className="block text-sm mb-1">Tanggal Lahir Awal</label>
          <Cleave
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
                if (parsed) {
                  setStartDate({ tanggal: parsed.getDate(), bulan: parsed.getMonth() + 1 })
                }
              }}
            />
            

            }
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tanggal Lahir Akhir</label>
          <Cleave
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

        <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded">
          Download Data
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              {pasien.map((item, idx) => {
                const tgl = new Date(item.tgl_lahir)
                const day = String(tgl.getDate()).padStart(2, '0')
                const month = String(tgl.getMonth() + 1).padStart(2, '0')
                const year = tgl.getFullYear()
                return (
                  <tr key={item.no_rkm_medis}>
                    <td className="px-4 py-2 border">{(page - 1) * 100 + idx + 1}</td>
                    <td className="px-4 py-2 border">{item.no_rkm_medis}</td>
                    <td className="px-4 py-2 border">{item.nm_pasien}</td>
                    <td className="px-4 py-2 border">{item.jk}</td>
                    <td className="px-4 py-2 border">{`${day}-${month}-${year}`}</td>
                    <td className="px-4 py-2 border">{item.no_tlp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
  <button
    disabled={page === 1}
    onClick={() => setPage(1)}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    First
  </button>

  <button
    disabled={page <= 1}
    onClick={() => setPage(page - 1)}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Prev
  </button>

  {[...Array(totalPages).keys()]
    .map((num) => num + 1)
    .filter((num) => Math.abs(num - page) <= 2 || num === 1 || num === totalPages)
    .map((num, i, arr) => {
      const prev = arr[i - 1]
      if (prev && num - prev > 1) {
        return <span key={`ellipsis-${num}`}>...</span>
      }
      return (
        <button
          key={num}
          onClick={() => setPage(num)}
          className={`px-3 py-1 rounded ${
            num === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {num}
        </button>
      )
    })}

  <button
    disabled={page >= totalPages}
    onClick={() => setPage(page + 1)}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(totalPages)}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Last
  </button>
</div>

        </>
      )}
    </div>
  )
}

export default PasienList
