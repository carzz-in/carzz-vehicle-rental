import type { Express } from "express";
import { createServer, type Server } from "http";
import type { Car, Bike } from "../shared/types";

// Helper function for offline chatbot responses
function getHelpfulResponse(message: string): string {
  if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
    return 'Our daily rates are: Cars ₹200/day and Bikes ₹80/day. Distance limits included: 24hrs (300-400km), 18-23hrs (250-300km), 13-17hrs (180-250km), 8-12hrs (130-180km). Call 8778634656 for details!';
  }
  
  if (message.includes('distance') || message.includes('km') || message.includes('kilometer') || message.includes('limit')) {
    return 'Distance allowances: 24 hours (300-400km), 18-23 hours (250-300km), 13-17 hours (180-250km), 8-12 hours (130-180km). Longer rentals get more kilometers!';
  }
  
  if (message.includes('book') || message.includes('reserve')) {
    return 'To book a vehicle: 1) Choose car/bike type 2) Select dates and duration 3) Pick your location 4) Complete payment. Each rental includes generous kilometer allowances!';
  }
  
  if (message.includes('location') || message.includes('city') || message.includes('where')) {
    return 'We operate across all major Indian cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, and Ahmedabad. More locations available!';
  }
  
  if (message.includes('contact') || message.includes('support') || message.includes('help')) {
    return 'Contact us: Customer Care 8778634656 | Emergency Support 9790485440 | Email hello@carzz.in | Website www.carzz.in';
  }
  
  if (message.includes('payment') || message.includes('pay')) {
    return 'We accept UPI (GPay, PhonePe), Credit/Debit Cards, Digital Wallets (PayTM, Amazon Pay), and Net Banking. All payments are secure!';
  }
  
  if (message.includes('hour') || message.includes('time') || message.includes('duration')) {
    return 'Rental durations: 8-12hrs (130-180km), 13-17hrs (180-250km), 18-23hrs (250-300km), 24hrs+ (300-400km). Longer rentals include more distance!';
  }
  
  return 'Hi! I can help with vehicle rentals, pricing, locations, and bookings. Cars ₹200/day, Bikes ₹80/day with generous kilometer allowances. Call 8778634656 or visit www.carzz.in';
}

// Simple mock data for working demo
const cars: Car[] = [
  {
    id: 1,
    make: "Maruti Suzuki",
    model: "Swift",
    year: 2023,
    category: "Hatchback",
    pricePerHour: "150",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
    location: "Delhi",
    isAvailable: true,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5
  },
  {
    id: 2,
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    category: "SUV",
    pricePerHour: "250",
    imageUrl: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400",
    location: "Mumbai",
    isAvailable: true,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5
  },
  {
    id: 3,
    make: "Honda",
    model: "City",
    year: 2023,
    category: "Sedan",
    pricePerHour: "180",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    location: "Bangalore",
    isAvailable: true,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5
  }
];

const bikes: Bike[] = [
  {
    id: 1,
    make: "Honda",
    model: "Activa 6G",
    year: 2023,
    category: "Scooter",
    pricePerHour: "50",
    imageUrl: "https://images.unsplash.com/photo-1558618966-fcd25c85cd64?w=400",
    location: "Delhi",
    isAvailable: true,
    fuelType: "Petrol",
    engineCapacity: "110cc"
  },
  {
    id: 2,
    make: "TVS",
    model: "Apache RTR 160",
    year: 2023,
    category: "Sports",
    pricePerHour: "80",
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
    location: "Mumbai",
    isAvailable: true,
    fuelType: "Petrol",
    engineCapacity: "160cc"
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Cars endpoints
  app.get("/api/cars", async (req, res) => {
    const { location, search } = req.query;
    let filteredCars = cars;
    
    if (location && location !== 'all') {
      filteredCars = cars.filter(car => car.location === location);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredCars = filteredCars.filter(car => 
        car.make.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.category.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(filteredCars);
  });

  app.get("/api/cars/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const car = cars.find(c => c.id === id);
    
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    
    res.json(car);
  });

  // Bikes endpoints
  app.get("/api/bikes", async (req, res) => {
    const { location, search } = req.query;
    let filteredBikes = bikes;
    
    if (location && location !== 'all') {
      filteredBikes = bikes.filter(bike => bike.location === location);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredBikes = filteredBikes.filter(bike => 
        bike.make.toLowerCase().includes(searchTerm) ||
        bike.model.toLowerCase().includes(searchTerm) ||
        bike.category.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(filteredBikes);
  });

  app.get("/api/bikes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const bike = bikes.find(b => b.id === id);
    
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    
    res.json(bike);
  });

  // Simple bookings endpoint
  app.get("/api/bookings", async (req, res) => {
    res.json([]);
  });

  app.post("/api/bookings", async (req, res) => {
    // Mock booking creation
    const booking = {
      id: Math.floor(Math.random() * 1000),
      ...req.body,
      status: "confirmed",
      createdAt: new Date()
    };
    res.json(booking);
  });

  // AI Chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if Perplexity API key is available
      if (!process.env.PERPLEXITY_API_KEY) {
        // Provide helpful responses for common questions without API
        const helpfulResponse = getHelpfulResponse(message.toLowerCase());
        return res.json({ reply: helpfulResponse });
      }

      // Call Perplexity API for intelligent responses
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful customer service assistant for CARZZ.IN, a vehicle rental platform in India. Help customers with car and bike rentals, pricing (cars ₹200/day, bikes ₹80/day), locations across India, and booking assistance. Keep responses concise and friendly. For immediate help, direct them to call 8778634656 or email hello@carzz.in.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.2,
          stream: false
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'I apologize, but I\'m having trouble right now. Please contact our support team at 8778634656.';

      res.json({ reply });
    } catch (error) {
      console.error('Chat API error:', error);
      res.json({ 
        reply: 'I\'m currently offline. For immediate help, please call our customer care at 8778634656 or email hello@carzz.in' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}