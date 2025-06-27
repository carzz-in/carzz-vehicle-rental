// Simple types for the CARZZ.IN demo app
export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerHour: string;
  imageUrl: string;
  location: string;
  isAvailable: boolean;
  fuelType: string;
  transmission: string;
  seats: number;
}

export interface Bike {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerHour: string;
  imageUrl: string;
  location: string;
  isAvailable: boolean;
  fuelType: string;
  engineCapacity: string;
}

export interface Booking {
  id: number;
  vehicleId: number;
  vehicleType: 'car' | 'bike';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalCost: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}