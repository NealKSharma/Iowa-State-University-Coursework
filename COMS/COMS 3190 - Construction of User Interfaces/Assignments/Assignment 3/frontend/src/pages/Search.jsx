import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (origin.toUpperCase() !== 'ORD' && destination.toUpperCase() !== 'ORD') {
            setFlights([]);
            setMessage('Flights must include ORD.');
            return;
        }

        const res = await fetch(`http://localhost:5000/flights?origin=${origin}&destination=${destination}&date=${date}`);
        const data = await res.json();

        if (data.success && data.flights.length > 0) {
            setFlights(data.flights);
            setMessage('');
        } else {
            setFlights([]);
            setMessage('No flights found.');
        }
    };

    return (
        <div className="flex-grow bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto overflow-hidden">
                <div className="bg-[#0B1F3A] p-6 text-center">
                    <h2 className="text-white text-2xl font-semibold">Search Flights</h2>
                </div>

                <form onSubmit={handleSearch} className="p-8 space-y-5">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-semibold text-gray-600">Origin</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-semibold text-gray-600">Destination</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm font-semibold text-gray-600">Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded hover:opacity-90 transition shadow-md"
                    >
                        SEARCH
                    </button>

                    {message && (
                        <p className="text-center text-sm text-[#FF9F1C] font-bold">{message}</p>
                    )}
                </form>
            </div>

            <div className="max-w-4xl mx-auto mt-6 space-y-4">
                {flights.map((flight) => (
                    <div key={flight.id} className="bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-[#0B1F3A] text-xl font-bold">{flight.flightNumber}</h3>

                        <p className="text-gray-600">
                            {flight.originName} to {flight.destinationName}
                        </p>

                        <p className="text-gray-600">
                            Duration: {flight.duration} minutes
                        </p>

                        <p className="text-gray-600">
                            Economy Price: ${flight.seats.economy.price}
                        </p>

                        <p className="text-gray-600">
                            Available Seats: {flight.seats.economy.available}
                        </p>

                        <button
                            onClick={() => navigate(`/flights/${flight.id}`)}
                            className="mt-4 bg-[#FF9F1C] text-white font-bold px-4 py-2 rounded hover:opacity-90"
                        >
                            Select Flight
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}