import React, { useState } from 'react'
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            console.log('Sending:', { email, password })
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                
            })
            
    

            const data = await response.json()

            if (response.ok) {
                Swal.fire('Login berhasil!', 'Selamat datang!', 'Sukses')
                console.log('TOKEN:', data.token)

                localStorage.setItem('token', data.token)
            } else {
                Swal.fire('Login gagal!', data.message, 'Gagal')
            }
        } catch (error) {
            console.error('Login Error:', error)
            Swal.fire(
                'Login gagal!',
                'Terjadi kesalahan saat login. Silakan coba lagi.',
                'Gagal'
            )
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-6">
            <h2 className="text-2xl font-bold text-center">Login</h2>
    
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
    
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
    
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      )
    }

    export default Login