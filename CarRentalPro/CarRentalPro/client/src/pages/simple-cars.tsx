import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, MapPin, Clock, Fuel, Users } from "lucide-react";
import type { Car } from "../../../shared/types";

export default function SimpleCars() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
    retry: false,
  });

  const filteredCars = cars.filter((car: Car) =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Cars</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Cars</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredCars.length} cars available
        </p>
      </div>

      {/* Cars Grid */}
      <div className="space-y-4">
        {filteredCars.map((car: any) => (
          <Card key={car.id} className="p-4">
            <div className="flex space-x-4">
              <img
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {car.make} {car.model}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{car.category} • {car.year}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{car.seats} seats</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-3 w-3" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>

                <div className="mb-2 text-xs text-gray-600">
                  <p>🚗 24hrs: 300-400km • 18-23hrs: 250-300km</p>
                  <p>📍 13-17hrs: 180-250km • 8-12hrs: 130-180km</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{car.pricePerHour}
                    </span>
                    <span className="text-sm text-gray-600">/hour</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                    onClick={(e) => {
                      // Add micro-interaction: button press effect
                      e.currentTarget.classList.add('animate-bounce-custom');
                      
                      // Navigate after animation
                      setTimeout(() => {
                        window.location.href = `/payment?vehicle=${car.make} ${car.model}&price=₹${car.pricePerHour}`;
                      }, 300);
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cars found matching your search.</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>📞 Customer Care: 8778634656</p>
        <p>🚨 Emergency: 9790485440</p>
        <p>🌐 www.carzz.in | ✉️ hello@carzz.in</p>
      </div>
    </div>
  );
}