import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bike, Search, Plus, Minus, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LocationSelector from "@/components/location-selector";
import { cn } from "@/lib/utils";
import type { Car as BikeType } from "@shared/schema"; // Using Car type temporarily for bikes

export default function Bikes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, Delhi");

  // Fetch bikes from the bikes API endpoint
  const { data: bikes = [], isLoading } = useQuery<BikeType[]>({
    queryKey: ["/api/bikes"],
  });

  // Filter bikes (using car data temporarily)
  const filteredBikes = bikes.filter((bike: BikeType) => {
    const matchesSearch = searchQuery === "" || 
      bike.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "scooter" && bike.category === "hatchback") || // Map categories temporarily
      (selectedFilter === "motorcycle" && bike.category === "sedan") ||
      (selectedFilter === "electric" && bike.category === "suv");
    
    const selectedState = selectedLocation.split(", ")[1] || selectedLocation.split(", ")[0];
    const matchesLocation = bike.location.toLowerCase().includes(selectedState.toLowerCase());
    
    return matchesSearch && matchesFilter && matchesLocation;
  });

  const availableBikesCount = filteredBikes.filter((bike: BikeType) => bike.isAvailable).length;

  const filters = [
    { id: "all", label: "All Bikes" },
    { id: "scooter", label: "Scooter" },
    { id: "motorcycle", label: "Motorcycle" },
    { id: "electric", label: "Electric" },
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bike className="h-6 w-6" />
            <h1 className="text-xl font-bold">Carzz Bikes</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-primary-dark">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Location & Search */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bikes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                "whitespace-nowrap",
                selectedFilter === filter.id && "bg-primary text-white"
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <p className="text-sm text-gray-600">
          {availableBikesCount} bikes available in {selectedLocation}
        </p>
      </div>

      {/* Bike List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-500">Loading bikes...</p>
            </div>
          </div>
        ) : filteredBikes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Bike className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bikes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {filteredBikes.map((bike: BikeType) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BikeCardProps {
  bike: BikeType;
}

function BikeCard({ bike }: BikeCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="aspect-video bg-gray-100 relative">
        <img 
          src={bike.imageUrl} 
          alt={`${bike.make} ${bike.model}`}
          className="w-full h-full object-cover"
        />
        {!bike.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Not Available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{bike.make} {bike.model}</h3>
            <p className="text-gray-600 text-sm">{bike.location}</p>
          </div>
          <Badge variant={bike.isAvailable ? "default" : "secondary"}>
            {bike.isAvailable ? "Available" : "Booked"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{bike.year}</span>
            <span>{bike.fuelType}</span>
            <span>{bike.mileage || "45 kmpl"}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="text-lg font-bold text-primary">₹{bike.pricePerHour}/hour</p>
          </div>
          <Button 
            disabled={!bike.isAvailable}
            className="bg-primary hover:bg-primary-dark"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}