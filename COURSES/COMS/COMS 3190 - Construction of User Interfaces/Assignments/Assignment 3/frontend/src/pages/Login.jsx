import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.name);
                navigate('/search');
            } else {
                alert(data.message);
            }
        } catch {
            alert('Unable to connect to server');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                <div className="bg-[#0B1F3A] p-6 text-center">
                    <h2 className="text-white text-2xl font-semibold">Member Login</h2>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Email Address</label>
                        <input
                            type="email"
                            className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Password</label>
                        <input
                            type="password"
                            className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded hover:opacity-90 transition shadow-md"
                    >
                        SIGN IN
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Need an account? <Link to="/signup" className="text-[#FF9F1C] font-bold underline">Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}