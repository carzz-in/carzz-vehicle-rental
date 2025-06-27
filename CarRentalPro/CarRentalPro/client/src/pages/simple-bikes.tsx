import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, MapPin, Fuel, Zap } from "lucide-react";
import type { Bike } from "../../../shared/types";

export default function SimpleBikes() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: bikes = [], isLoading } = useQuery<Bike[]>({
    queryKey: ["/api/bikes"],
    retry: false,
  });

  const filteredBikes = bikes.filter((bike: Bike) =>
    bike.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Bikes</h1>
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
        <h1 className="text-2xl font-bold">Bikes</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search bikes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredBikes.length} bikes available
        </p>
      </div>

      {/* Bikes Grid */}
      <div className="space-y-4">
        {filteredBikes.map((bike: any) => (
          <Card key={bike.id} className="p-4">
            <div className="flex space-x-4">
              <img
                src={bike.imageUrl}
                alt={`${bike.make} ${bike.model}`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {bike.make} {bike.model}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{bike.category} • {bike.year}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{bike.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3" />
                    <span>{bike.engineCapacity}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-3 w-3" />
                    <span>{bike.fuelType}</span>
                  </div>
                </div>

                <div className="mb-2 text-xs text-gray-600">
                  <p>🏍️ 24hrs: 300-400km • 18-23hrs: 250-300km</p>
                  <p>📍 13-17hrs: 180-250km • 8-12hrs: 130-180km</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      ₹{bike.pricePerHour}
                    </span>
                    <span className="text-sm text-gray-600">/hour</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                    onClick={(e) => {
                      // Add micro-interaction: button press effect
                      e.currentTarget.classList.add('animate-bounce-custom');
                      
                      // Navigate after animation
                      setTimeout(() => {
                        window.location.href = `/payment?vehicle=${bike.make} ${bike.model}&price=₹${bike.pricePerHour}`;
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

      {filteredBikes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No bikes found matching your search.</p>
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