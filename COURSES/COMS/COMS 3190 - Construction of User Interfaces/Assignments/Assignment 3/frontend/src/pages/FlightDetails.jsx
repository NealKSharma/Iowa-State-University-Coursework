import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const seatClasses = [
    { key: 'economy', label: 'Economy' },
    { key: 'premiumEconomy', label: 'Premium Economy' },
    { key: 'firstClass', label: 'First Class' }
];

const formatDateTime = (value) => {
    if (!value) return 'Not available';

    return new Date(value).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
};

export default function FlightDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [seatsBooked, setSeatsBooked] = useState({
        economy: 0,
        premiumEconomy: 0,
        firstClass: 0
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const res = await fetch(`http://localhost:5000/flights/${id}`);
                const data = await res.json();

                if (data.success) {
                    setFlight(data.flight);
                    setMessage('');
                } else {
                    setMessage(data.message || 'Flight not found.');
                }
            } catch {
                setMessage('Unable to connect to server.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    const totalAmount = useMemo(() => {
        if (!flight) return 0;

        return seatClasses.reduce((total, seatClass) => {
            const count = Number(seatsBooked[seatClass.key]) || 0;
            const price = flight.seats?.[seatClass.key]?.price || 0;
            return total + count * price;
        }, 0);
    }, [flight, seatsBooked]);

    const totalSeats = useMemo(() => {
        return Object.values(seatsBooked).reduce((total, count) => total + (Number(count) || 0), 0);
    }, [seatsBooked]);

    const handleSeatChange = (seatClass, value) => {
        const nextValue = Math.max(0, Number(value) || 0);
        setSeatsBooked((current) => ({ ...current, [seatClass]: nextValue }));
    };

    const handleContinue = () => {
        if (!flight) return;

        if (totalSeats === 0) {
            setMessage('Select at least one seat before continuing.');
            return;
        }

        const overbookedClass = seatClasses.find((seatClass) => {
            return seatsBooked[seatClass.key] > flight.seats[seatClass.key].available;
        });

        if (overbookedClass) {
            setMessage(`${overbookedClass.label} seats exceed current availability.`);
            return;
        }

        const bookingDraft = {
            flightId: flight.id,
            flightNumber: flight.flightNumber,
            origin: flight.origin,
            destination: flight.destination,
            seatsBooked,
            totalAmount
        };

        sessionStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
        navigate('/payment', { state: bookingDraft });
    };

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 p-6">
                <p className="text-[#0B1F3A] font-semibold">Loading flight details...</p>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white rounded-lg shadow-xl max-w-md p-8 text-center">
                    <h2 className="text-[#0B1F3A] text-2xl font-bold mb-3">Flight Unavailable</h2>
                    <p className="text-gray-600 mb-5">{message}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/search')}
                        className="bg-[#2EC4B6] text-white font-bold px-5 py-2 rounded hover:opacity-90"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl mx-auto overflow-hidden">
                <div className="bg-[#0B1F3A] p-6">
                    <p className="text-[#FF9F1C] text-sm font-bold uppercase tracking-wide">Flight Details</p>
                    <h2 className="text-white text-3xl font-bold">{flight.flightNumber}</h2>
                    <p className="text-gray-200 mt-2">
                        {flight.originName} to {flight.destinationName}
                    </p>
                </div>

                <div className="p-8 grid gap-6 lg:grid-cols-3">
                    <section className="lg:col-span-2 space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase">Departure</p>
                                <p className="text-[#0B1F3A] font-semibold">{formatDateTime(flight.departureTime)}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase">Arrival</p>
                                <p className="text-[#0B1F3A] font-semibold">{formatDateTime(flight.arrivalTime)}</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase">Duration</p>
                                <p className="text-[#0B1F3A] font-semibold">{flight.duration} minutes</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase">Aircraft</p>
                                <p className="text-[#0B1F3A] font-semibold">{flight.aircraft}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[#0B1F3A] text-xl font-bold mb-4">Select Seat Class</h3>
                            <div className="space-y-4">
                                {seatClasses.map((seatClass) => {
                                    const seatInfo = flight.seats[seatClass.key];

                                    return (
                                        <div key={seatClass.key} className="border border-gray-200 rounded-lg p-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                                            <div>
                                                <h4 className="text-[#0B1F3A] font-bold">{seatClass.label}</h4>
                                                <p className="text-gray-600 text-sm">
                                                    ${seatInfo.price.toFixed(2)} per seat | {seatInfo.available} available
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="text-sm font-semibold text-gray-600">Seats</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={seatInfo.available}
                                                    value={seatsBooked[seatClass.key]}
                                                    onChange={(e) => handleSeatChange(seatClass.key, e.target.value)}
                                                    className="w-24 border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <aside className="bg-gray-50 border border-gray-200 rounded-lg p-5 h-fit">
                        <h3 className="text-[#0B1F3A] text-xl font-bold mb-4">Booking Summary</h3>

                        <div className="space-y-3 text-sm">
                            {seatClasses.map((seatClass) => (
                                <div key={seatClass.key} className="flex justify-between">
                                    <span className="text-gray-600">{seatClass.label}</span>
                                    <span className="font-semibold">{seatsBooked[seatClass.key]}</span>
                                </div>
                            ))}

                            <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                                <span className="text-[#0B1F3A] font-bold">Total</span>
                                <span className="text-[#0B1F3A] font-bold">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {message && (
                            <p className="mt-4 text-sm text-[#FF9F1C] font-bold">{message}</p>
                        )}

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="mt-5 w-full bg-[#2EC4B6] text-white font-bold py-3 rounded hover:opacity-90 transition shadow-md"
                        >
                            CONTINUE TO BOOKING
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/search')}
                            className="mt-3 w-full border border-[#0B1F3A] text-[#0B1F3A] font-bold py-3 rounded hover:bg-gray-100 transition"
                        >
                            Back to Search
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
