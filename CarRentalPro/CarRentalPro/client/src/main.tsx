import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "./index.css";
import Chatbot from "./components/chatbot";
import BookingConfirmation from "./components/booking-confirmation";

function Landing() {
  const calculateDays = () => {
    const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value;
    const daysDisplay = document.getElementById('daysDisplay');
    const vehicleType = (document.querySelector('select') as HTMLSelectElement)?.value;
    
    if (startDate && endDate && daysDisplay) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        let estimatedCost = '';
        if (vehicleType === 'car') {
          const carRate = 200; // Average car rate ₹200/day
          estimatedCost = ` • Estimated: ₹${carRate * diffDays}`;
        } else if (vehicleType === 'bike') {
          const bikeRate = 80; // Average bike rate ₹80/day
          estimatedCost = ` • Estimated: ₹${bikeRate * diffDays}`;
        }
        
        daysDisplay.innerHTML = `Duration: ${diffDays} day${diffDays > 1 ? 's' : ''}${estimatedCost}`;
        daysDisplay.className = 'text-sm text-green-600 font-medium mt-2';
      } else {
        daysDisplay.innerHTML = 'End date must be after start date';
        daysDisplay.className = 'text-sm text-red-500 font-medium mt-2';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Nature Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 bg-opacity-20 rounded-full blur-lg"></div>
      
      <div className="relative z-10 max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">CARZZ.IN</h1>
          <p className="text-white text-lg opacity-90 drop-shadow-md">Journey Begins Here</p>
        </div>

        {/* Simple Booking Form */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Quick Booking</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={calculateDays}
              >
                <option value="">Select Vehicle</option>
                <option value="car">🚗 Car Rental</option>
                <option value="bike">🏍️ Bike Rental</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choose City</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  id="startDate"
                  type="date" 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  onChange={calculateDays}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  id="endDate"
                  type="date" 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                  onChange={calculateDays}
                />
              </div>
            </div>

            <div id="daysDisplay" className="text-sm text-green-600 font-medium">Duration: 1 day</div>
            <div className="text-xs text-gray-600 mt-1">
              📍 Distance Limits: 24hrs (300-400km) • 18-23hrs (250-300km) • 13-17hrs (180-250km) • 8-12hrs (130-180km)
            </div>

            <button 
              onClick={(e) => {
                const selectElement = document.querySelector('select') as HTMLSelectElement;
                const vehicleType = selectElement?.value || '';
                
                if (vehicleType === 'car' || vehicleType === 'bike') {
                  // Add micro-interaction: button press effect
                  const button = e.currentTarget;
                  if (button) {
                    button.classList.add('animate-pulse-custom');
                    button.innerHTML = 'Searching...';
                    button.disabled = true;
                  }
                  
                  setTimeout(() => {
                    window.location.href = vehicleType === 'car' ? '/cars' : '/bikes';
                  }, 800);
                } else {
                  // Simple error handling without style manipulation
                  alert('Please select a vehicle type');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Vehicles
            </button>
          </div>
        </div>

        {/* Quick Browse Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a 
            href="/cars" 
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30"
          >
            🚗 Browse Cars
          </a>
          <a 
            href="/bikes" 
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30"
          >
            🏍️ Browse Bikes
          </a>
        </div>

        {/* Contact Info */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center border border-white border-opacity-30">
          <div className="text-white text-sm space-y-1">
            <p className="font-medium">24/7 Support</p>
            <p>📞 8778634656 • 🚨 9790485440</p>
            <p>hello@carzz.in • www.carzz.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cars() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-6">
      <div className="flex items-center space-x-4 mb-6">
        <a href="/" className="text-blue-600 hover:text-blue-800">← Back</a>
        <h1 className="text-2xl font-bold">CARZZ.IN</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Maruti Swift</h3>
          <p className="text-sm text-gray-600 mb-2">Hatchback • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Delhi • 5 seats • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">₹150/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Maruti Swift&price=₹150'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Hyundai Creta</h3>
          <p className="text-sm text-gray-600 mb-2">SUV • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Mumbai • 5 seats • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">₹250/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Hyundai Creta&price=₹250'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Honda City</h3>
          <p className="text-sm text-gray-600 mb-2">Sedan • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Bangalore • 5 seats • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">₹200/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Honda City&price=₹200'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>📞 Customer Care: 8778634656</p>
        <p>🚨 Emergency: 9790485440</p>
        <p>🌐 www.carzz.in | ✉️ hello@carzz.in</p>
      </div>
    </div>
  );
}

function Bikes() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-6">
      <div className="flex items-center space-x-4 mb-6">
        <a href="/" className="text-green-600 hover:text-green-800">← Back</a>
        <h1 className="text-2xl font-bold">CARZZ.IN</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Honda Activa</h3>
          <p className="text-sm text-gray-600 mb-2">Scooter • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Delhi • 110cc • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₹50/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Honda Activa&price=₹50'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Bajaj Pulsar</h3>
          <p className="text-sm text-gray-600 mb-2">Sports • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Mumbai • 150cc • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₹80/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Bajaj Pulsar&price=₹80'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-lg">Royal Enfield</h3>
          <p className="text-sm text-gray-600 mb-2">Cruiser • 2023</p>
          <p className="text-sm text-gray-500 mb-3">Bangalore • 350cc • Petrol</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₹120/hour</span>
            <button 
              onClick={() => window.location.href = '/payment?vehicle=Royal Enfield&price=₹120'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>📞 Customer Care: 8778634656</p>
        <p>🚨 Emergency: 9790485440</p>
        <p>🌐 www.carzz.in | ✉️ hello@carzz.in</p>
      </div>
    </div>
  );
}

function Payment() {
  const urlParams = new URLSearchParams(window.location.search);
  const vehicle = urlParams.get('vehicle') || 'Vehicle';
  const price = urlParams.get('price') || '₹100';
  const dailyRate = parseInt(price.replace('₹', ''));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    vehicle: '',
    price: '',
    duration: '',
    kmAllowance: ''
  });

  const calculatePayment = () => {
    const startDate = (document.getElementById('paymentStartDate') as HTMLInputElement)?.value;
    const endDate = (document.getElementById('paymentEndDate') as HTMLInputElement)?.value;
    const startTime = (document.querySelector('select[name="startTime"]') as HTMLSelectElement)?.value || '09:00';
    const endTime = (document.querySelector('select[name="endTime"]') as HTMLSelectElement)?.value || '10:00';
    const durationDisplay = document.getElementById('paymentDuration');
    const totalDisplay = document.getElementById('paymentTotal');
    const kmDisplay = document.getElementById('kmAllowance');
    
    if (startDate && endDate && durationDisplay && totalDisplay && kmDisplay) {
      const start = new Date(startDate + 'T' + startTime);
      const end = new Date(endDate + 'T' + endTime);
      const diffTime = end.getTime() - start.getTime();
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Allow same time if it's next day or later, or if end time is after start time on same day
      const isSameDay = startDate === endDate;
      const isValidTime = !isSameDay || diffHours > 0;
      
      if (diffHours > 0 || !isSameDay) {
        let totalCost = 0;
        let rateType = '';
        
        // Calculate cost based on duration rules
        if (diffHours <= 24) {
          // Same day or exactly 24 hours = 1 day rent
          totalCost = dailyRate;
          rateType = 'Full Day Rate';
        } else {
          // Multi-day booking - apply sophisticated pricing for second day onwards
          const firstDayRent = dailyRate;
          const extraHours = diffHours - 24;
          
          if (extraHours <= 2) {
            // Up to 2 extra hours = hourly charge
            const hourlyRate = Math.round(dailyRate / 8);
            totalCost = firstDayRent + (extraHours * hourlyRate);
            rateType = 'Daily + Hourly Rate';
          } else if (extraHours > 2 && extraHours <= 6) {
            // More than 2 hours up to 6 hours = half day rent
            const halfDayRate = Math.round(dailyRate * 0.6);
            totalCost = firstDayRent + halfDayRate;
            rateType = 'Daily + Half Day Rate';
          } else {
            // More than 6 hours = full day rent for additional days
            const totalDays = Math.ceil(diffHours / 24);
            totalCost = dailyRate * totalDays;
            rateType = 'Multi-Day Rate';
          }
        }
        
        // Determine km allowance based on duration
        let kmAllowance = '';
        if (diffHours >= 24) {
          kmAllowance = '300-400km';
        } else if (diffHours >= 18) {
          kmAllowance = '250-300km';
        } else if (diffHours >= 13) {
          kmAllowance = '180-250km';
        } else if (diffHours >= 8) {
          kmAllowance = '130-180km';
        } else {
          kmAllowance = `${diffHours * 15}-${diffHours * 20}km`;
        }
        
        durationDisplay.innerHTML = `📅 Duration: ${diffHours} hour${diffHours > 1 ? 's' : ''} (${diffDays} day${diffDays > 1 ? 's' : ''})`;
        totalDisplay.innerHTML = `Total Cost: ₹${totalCost} <span class="text-sm text-gray-600">(${rateType})</span>`;
        totalDisplay.className = 'text-lg font-bold text-blue-600 mt-1';
        kmDisplay.innerHTML = `🚗 Allowed Distance: ${kmAllowance}`;
        kmDisplay.className = 'text-sm text-blue-600 mt-1';
        
        // Update booking details for confirmation
        setBookingDetails({
          vehicle,
          price: `₹${totalCost}`,
          duration: `${diffHours} hour${diffHours > 1 ? 's' : ''}`,
          kmAllowance
        });
      } else {
        durationDisplay.innerHTML = '⚠️ End time must be after start time';
        totalDisplay.innerHTML = 'Please select valid dates and times';
        totalDisplay.className = 'text-lg font-bold text-red-500 mt-1';
        kmDisplay.innerHTML = '';
      }
    }
  };

  const handlePayment = (method: string) => {
    setIsProcessing(true);
    
    // Add micro-interaction: button press effect
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.add('animate-pulse-custom'));
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      
      // Remove pulse effect
      buttons.forEach(btn => btn.classList.remove('animate-pulse-custom'));
    }, 2000);
  };

  // Initialize calculation on component mount
  useEffect(() => {
    setTimeout(calculatePayment, 100);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => window.history.back()} className="text-blue-600 hover:text-blue-800">← Back</button>
        <h1 className="text-2xl font-bold">CARZZ.IN</h1>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-lg mb-2">Booking Summary</h2>
        <p className="text-gray-700">Vehicle: {vehicle}</p>
        <p className="text-gray-700">Daily Rate: {price}/day</p>
      </div>

      <div className="mb-6 space-y-4">
        <h3 className="font-semibold text-lg">Booking Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input 
              id="paymentStartDate"
              type="date" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={new Date().toISOString().split('T')[0]}
              onChange={calculatePayment}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input 
              id="paymentEndDate"
              type="date" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
              onChange={calculatePayment}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <select 
              name="startTime" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={calculatePayment}
            >
              <option value="00:00">12:00 AM</option>
              <option value="01:00">1:00 AM</option>
              <option value="02:00">2:00 AM</option>
              <option value="03:00">3:00 AM</option>
              <option value="04:00">4:00 AM</option>
              <option value="05:00">5:00 AM</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <select 
              name="endTime" 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={calculatePayment}
            >
              <option value="00:00">12:00 AM</option>
              <option value="01:00">1:00 AM</option>
              <option value="02:00">2:00 AM</option>
              <option value="03:00">3:00 AM</option>
              <option value="04:00">4:00 AM</option>
              <option value="05:00">5:00 AM</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <p id="paymentDuration" className="text-sm text-green-700">📅 Duration: 1 day</p>
          <p id="paymentTotal" className="text-lg font-bold text-blue-600 mt-1">Total Cost: {price}</p>
          <p id="kmAllowance" className="text-sm text-blue-600 mt-1">🚗 Allowed Distance: 300-400km</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-lg">Select Payment Method</h3>
          
          <button 
            onClick={() => handlePayment('UPI')}
            disabled={isProcessing}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded text-white flex items-center justify-center text-sm font-bold">₹</div>
              <div>
                <p className="font-medium">UPI Payment</p>
                <p className="text-sm text-gray-500">GPay, PhonePe, PayTM</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handlePayment('Card')}
            disabled={isProcessing}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">💳</div>
              <div>
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handlePayment('Wallet')}
            disabled={isProcessing}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded text-white flex items-center justify-center text-sm font-bold">📱</div>
              <div>
                <p className="font-medium">Digital Wallets</p>
                <p className="text-sm text-gray-500">Amazon Pay, JioMoney</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handlePayment('NetBanking')}
            disabled={isProcessing}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded text-white flex items-center justify-center text-sm font-bold">🏦</div>
              <div>
                <p className="font-medium">Net Banking</p>
                <p className="text-sm text-gray-500">All major banks supported</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">📞 Need help with payment?</p>
          <p className="text-sm text-gray-600">Customer Care: 8778634656</p>
          <p className="text-sm text-gray-600">Emergency: 9790485440</p>
          <p className="text-sm text-gray-600">Email: hello@carzz.in</p>
        </div>

        <BookingConfirmation 
          isVisible={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            window.location.href = '/';
          }}
          vehicleDetails={bookingDetails}
        />
      </div>
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  
  if (path === '/cars') {
    return (
      <>
        <Cars />
        <Chatbot />
      </>
    );
  }
  
  if (path === '/bikes') {
    return (
      <>
        <Bikes />
        <Chatbot />
      </>
    );
  }
  
  if (path === '/payment') {
    return (
      <>
        <Payment />
        <Chatbot />
      </>
    );
  }
  
  return (
    <>
      <Landing />
      <Chatbot />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);