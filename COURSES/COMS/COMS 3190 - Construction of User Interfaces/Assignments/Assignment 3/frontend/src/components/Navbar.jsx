import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-[#0B1F3A] text-white p-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-xl font-bold uppercase">Aethera Airways</Link>
            <div className="flex gap-6 text-sm items-center">
                <Link to="/search" className="hover:text-[#2EC4B6]">Search</Link>
                <Link to="/booking" className="hover:text-[#2EC4B6]">My Booking</Link>
                <Link to="/signup" className="hover:text-[#2EC4B6]">Signup</Link>
                <Link to="/login" className="bg-[#2EC4B6] px-4 py-2 rounded font-semibold">Login</Link>
            </div>
        </nav>
    );
}
