import { useState } from 'react';

const seatLabels = {
    economy: 'Economy',
    premiumEconomy: 'Premium Economy',
    firstClass: 'First Class'
};

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

export default function LookupBookingPage() {
    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [lastName, setLastName] = useState('');
    const [booking, setBooking] = useState(null);
    const [flight, setFlight] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLookup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBooking(null);
        setFlight(null);
        setMessage('');

        try {
            const params = new URLSearchParams({ lastName });
            const res = await fetch(`http://localhost:5000/bookings/confirmation/${confirmationNumber}?${params}`);
            const data = await res.json();

            if (data.success) {
                setBooking(data.booking);
                setFlight(data.flight);
            } else {
                setMessage(data.message || 'Booking not found.');
            }
        } catch {
            setMessage('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl mx-auto overflow-hidden">
                <div className="bg-[#0B1F3A] p-6 text-center">
                    <h2 className="text-white text-2xl font-semibold">Lookup Booking</h2>
                    <p className="text-gray-200 text-sm mt-2">Find your reservation using your confirmation number and last name.</p>
                </div>

                <form onSubmit={handleLookup} className="p-8 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">Confirmation Number</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 rounded uppercase focus:border-[#2EC4B6] outline-none"
                                value={confirmationNumber}
                                onChange={(e) => setConfirmationNumber(e.target.value.toUpperCase())}
                                placeholder="ABC123"
                                maxLength="6"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">Last Name</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded hover:opacity-90 transition shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'SEARCHING...' : 'LOOKUP BOOKING'}
                    </button>

                    {message && (
                        <p className="text-center text-sm text-[#FF9F1C] font-bold">{message}</p>
                    )}
                </form>
            </div>

            {booking && (
                <div className="bg-white rounded-lg shadow-xl max-w-3xl mx-auto mt-6 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <p className="text-[#FF9F1C] text-sm font-bold uppercase tracking-wide">Reservation Found</p>
                        <h3 className="text-[#0B1F3A] text-2xl font-bold">{booking.confirmationNumber}</h3>
                    </div>

                    <div className="p-6 grid gap-6 md:grid-cols-2">
                        <section>
                            <h4 className="text-[#0B1F3A] font-bold mb-3">Flight</h4>
                            {flight ? (
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-semibold">Flight:</span> {flight.flightNumber}</p>
                                    <p><span className="font-semibold">Route:</span> {flight.originName} to {flight.destinationName}</p>
                                    <p><span className="font-semibold">Departure:</span> {formatDateTime(flight.departureTime)}</p>
                                    <p><span className="font-semibold">Aircraft:</span> {flight.aircraft}</p>
                                </div>
                            ) : (
                                <p className="text-gray-600">Flight details unavailable.</p>
                            )}
                        </section>

                        <section>
                            <h4 className="text-[#0B1F3A] font-bold mb-3">Passengers</h4>
                            <div className="space-y-2 text-gray-600">
                                {booking.passengers?.map((passenger, index) => (
                                    <p key={`${passenger.firstName}-${passenger.lastName}-${index}`}>
                                        {passenger.firstName} {passenger.lastName}
                                    </p>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[#0B1F3A] font-bold mb-3">Seats Booked</h4>
                            <div className="space-y-2 text-gray-600">
                                {Object.entries(booking.seatsBooked || {}).map(([seatClass, count]) => (
                                    <p key={seatClass}>
                                        <span className="font-semibold">{seatLabels[seatClass] || seatClass}:</span> {count}
                                    </p>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[#0B1F3A] font-bold mb-3">Payment Summary</h4>
                            <div className="space-y-2 text-gray-600">
                                <p><span className="font-semibold">Total:</span> ${Number(booking.totalAmount || 0).toFixed(2)}</p>
                                <p><span className="font-semibold">Created:</span> {formatDateTime(booking.createdAt)}</p>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
