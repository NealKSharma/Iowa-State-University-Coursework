import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state || JSON.parse(sessionStorage.getItem('bookingDraft'));

    const [passenger, setPassenger] = useState({ firstName: '', lastName: '', email: '' });
    const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiration: '' });
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');

    const handlePassengerChange = (e) => {
        setPassenger({ ...passenger, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!booking) {
            setMessage('No booking found.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    flightId: booking.flightId,
                    passengers: [passenger],
                    seatsBooked: booking.seatsBooked
                })
            });

            const data = await res.json();

            if (data.success) {
                setConfirmation(data.booking.confirmationNumber);
                sessionStorage.removeItem('bookingDraft');
            } else {
                setMessage(data.message);
            }
        } catch {
            setMessage('Unable to connect to server.');
        }
    };

    if (!booking) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
                    <h2 className="text-[#0B1F3A] text-2xl font-semibold mb-4">No Booking Found</h2>
                    <button onClick={() => navigate('/search')} className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded">
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    if (confirmation) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                    <div className="bg-[#0B1F3A] p-6 text-center">
                        <h2 className="text-white text-2xl font-semibold">Booking Confirmed</h2>
                    </div>

                    <div className="p-8 space-y-4 text-center">
                        <p className="text-gray-600">Confirmation Number</p>
                        <p className="text-[#FF9F1C] text-3xl font-bold">{confirmation}</p>

                        <div className="text-left text-sm text-gray-600 border-t pt-4">
                            <p>Passenger: {passenger.firstName} {passenger.lastName}</p>
                            <p>Flight: {booking.flightNumber}</p>
                            <p>Route: {booking.origin} to {booking.destination}</p>
                            <p>Total: ${booking.totalAmount.toFixed(2)}</p>
                        </div>

                        <button onClick={() => navigate('/booking')} className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded">
                            Lookup Booking
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="bg-[#0B1F3A] p-6 text-center">
                    <h2 className="text-white text-2xl font-semibold">Payment & Confirmation</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600">
                        <p className="font-bold text-[#0B1F3A] mb-2">Booking Summary</p>
                        <p>Flight: {booking.flightNumber}</p>
                        <p>Route: {booking.origin} to {booking.destination}</p>
                        <p>Economy Seats: {booking.seatsBooked.economy}</p>
                        <p>Premium Economy Seats: {booking.seatsBooked.premiumEconomy}</p>
                        <p>First Class Seats: {booking.seatsBooked.firstClass}</p>
                        <p className="font-bold text-[#0B1F3A] mt-2">Total: ${booking.totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="flex gap-4">
                        <input name="firstName" placeholder="First Name" value={passenger.firstName} onChange={handlePassengerChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />
                        <input name="lastName" placeholder="Last Name" value={passenger.lastName} onChange={handlePassengerChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />
                    </div>

                    <input name="email" type="email" placeholder="Email Address" value={passenger.email} onChange={handlePassengerChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />
                    <input name="cardName" placeholder="Name on Card" value={payment.cardName} onChange={handlePaymentChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />

                    <div className="flex gap-4">
                        <input name="cardNumber" placeholder="Card Number" value={payment.cardNumber} onChange={handlePaymentChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />
                        <input name="expiration" placeholder="MM/YY" value={payment.expiration} onChange={handlePaymentChange} className="border border-gray-300 p-2 rounded focus:border-[#2EC4B6] outline-none w-full" required />
                    </div>

                    {message && <p className="text-center text-sm text-[#FF9F1C] font-bold">{message}</p>}

                    <button type="submit" className="w-full bg-[#2EC4B6] text-white font-bold py-3 rounded hover:opacity-90 transition shadow-md">
                        COMPLETE BOOKING
                    </button>
                </form>
            </div>
        </div>
    );
}