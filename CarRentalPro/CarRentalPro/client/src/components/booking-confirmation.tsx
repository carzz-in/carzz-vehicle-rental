import { useState, useEffect } from 'react';
import { Check, Clock, MapPin, Car, Calendar, CreditCard, Phone, Mail } from 'lucide-react';

interface BookingConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  vehicleDetails: {
    vehicle: string;
    price: string;
    duration: string;
    kmAllowance: string;
  };
}

export default function BookingConfirmation({ isVisible, onClose, vehicleDetails }: BookingConfirmationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { icon: CreditCard, title: 'Processing Payment', description: 'Verifying payment details...' },
    { icon: Car, title: 'Reserving Vehicle', description: 'Securing your vehicle...' },
    { icon: Calendar, title: 'Confirming Booking', description: 'Finalizing your reservation...' },
    { icon: Check, title: 'Booking Confirmed', description: 'Your vehicle is ready!' }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsCompleted(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setIsCompleted(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-blue-600 text-white scale-110' 
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'animate-pulse' : ''}`}
                  >
                    <StepIcon size={20} />
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`w-16 h-1 mt-2 transition-colors duration-500 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Current Step Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {steps[currentStep]?.title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep]?.description}
            </p>
          </div>
        </div>

        {/* Booking Details */}
        {isCompleted && (
          <div className="animate-fadeIn">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <Check size={16} className="text-white" />
                </div>
                <h4 className="font-semibold text-green-800">Booking Confirmed!</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <Car size={14} className="mr-2" />
                  <span>{vehicleDetails.vehicle}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock size={14} className="mr-2" />
                  <span>{vehicleDetails.duration}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin size={14} className="mr-2" />
                  <span>{vehicleDetails.kmAllowance}</span>
                </div>
                <div className="flex items-center font-semibold text-blue-600">
                  <CreditCard size={14} className="mr-2" />
                  <span>Total: {vehicleDetails.price}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-800 mb-3">Next Steps</h5>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Vehicle pickup instructions will be sent via SMS</p>
                <p>• Carry valid KYC and Requested Original documents</p>
                <p>• After booking /advance is made please share screen shot in Whatsapp or Email</p>
                <p>• Vehicle will be ready at your selected time</p>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              <h6 className="font-medium text-gray-800">Need Help?</h6>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => window.open('tel:8778634656')}
                  className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone size={16} className="mr-2" />
                  Call Support
                </button>
                <button 
                  onClick={() => window.open('mailto:hello@carzz.in')}
                  className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail size={16} className="mr-2" />
                  Email Us
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                onClose();
                window.location.href = '/';
              }}
              className="w-full mt-6 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Continue to Home
            </button>
          </div>
        )}

        {/* Loading Animation */}
        {!isCompleted && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}