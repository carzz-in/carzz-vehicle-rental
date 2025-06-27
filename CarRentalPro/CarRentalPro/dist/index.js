var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  cars: () => cars,
  insertBookingSchema: () => insertBookingSchema,
  insertCarSchema: () => insertCarSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  driverLicenseNumber: text("driver_license_number"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  color: text("color").notNull(),
  seats: integer("seats").notNull(),
  fuelType: text("fuel_type").notNull(),
  // 'gas', 'electric', 'hybrid'
  transmission: text("transmission").notNull(),
  // 'manual', 'automatic'
  category: text("category").notNull(),
  // 'suv', 'hatchback', 'sedan'
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }).notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.5"),
  imageUrl: text("image_url").notNull(),
  features: text("features").array().default([]).notNull(),
  mileage: text("mileage"),
  walkingDistance: text("walking_distance")
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  carId: integer("car_id").references(() => cars.id).notNull(),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"),
  // 'confirmed', 'active', 'completed', 'cancelled'
  insurance: boolean("insurance").default(false),
  gpsNavigation: boolean("gps_navigation").default(false),
  isUnlocked: boolean("is_unlocked").default(false),
  unlockTime: timestamp("unlock_time"),
  userLatitude: decimal("user_latitude", { precision: 10, scale: 8 }),
  userLongitude: decimal("user_longitude", { precision: 11, scale: 8 }),
  trackingEnabled: boolean("tracking_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCarSchema = createInsertSchema(cars).omit({
  id: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getCars() {
    return await db.select().from(cars);
  }
  async getCar(id) {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car || void 0;
  }
  async getCarsByLocation(location) {
    return await db.select().from(cars).where(eq(cars.location, location));
  }
  async searchCars(query) {
    const allCars = await db.select().from(cars);
    const lowerQuery = query.toLowerCase();
    return allCars.filter(
      (car) => car.make.toLowerCase().includes(lowerQuery) || car.model.toLowerCase().includes(lowerQuery) || car.location.toLowerCase().includes(lowerQuery) || car.fuelType.toLowerCase().includes(lowerQuery)
    );
  }
  async updateCarAvailability(id, isAvailable) {
    await db.update(cars).set({ isAvailable }).where(eq(cars.id, id));
  }
  async getBookings() {
    return await db.select().from(bookings);
  }
  async getBookingsByUser(userId) {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }
  async createBooking(insertBooking) {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    await this.updateCarAvailability(booking.carId, false);
    return booking;
  }
  async updateBookingStatus(id, status) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
    if (booking && (status === "completed" || status === "cancelled")) {
      await this.updateCarAvailability(booking.carId, true);
    }
  }
  // GPS and Unlock methods
  async unlockCar(bookingId) {
    try {
      await db.update(bookings).set({
        isUnlocked: true,
        unlockTime: /* @__PURE__ */ new Date()
      }).where(eq(bookings.id, bookingId));
      return true;
    } catch (error) {
      console.error("Error unlocking car:", error);
      return false;
    }
  }
  async lockCar(bookingId) {
    try {
      await db.update(bookings).set({
        isUnlocked: false,
        unlockTime: null
      }).where(eq(bookings.id, bookingId));
      return true;
    } catch (error) {
      console.error("Error locking car:", error);
      return false;
    }
  }
  async updateUserLocation(bookingId, latitude, longitude) {
    await db.update(bookings).set({
      userLatitude: latitude.toString(),
      userLongitude: longitude.toString()
    }).where(eq(bookings.id, bookingId));
  }
  async enableTracking(bookingId) {
    await db.update(bookings).set({ trackingEnabled: true }).where(eq(bookings.id, bookingId));
  }
  async disableTracking(bookingId) {
    await db.update(bookings).set({ trackingEnabled: false }).where(eq(bookings.id, bookingId));
  }
  async getBookingWithLocation(bookingId) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    return booking || void 0;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/cars", async (req, res) => {
    try {
      const cars2 = await storage.getCars();
      res.json(cars2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });
  app2.get("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });
  app2.get("/api/cars/search", async (req, res) => {
    try {
      const query = req.query.q;
      const location = req.query.location;
      let cars2;
      if (query) {
        cars2 = await storage.searchCars(query);
      } else if (location) {
        cars2 = await storage.getCarsByLocation(location);
      } else {
        cars2 = await storage.getCars();
      }
      res.json(cars2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search cars" });
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    try {
      const userId = 6;
      const bookings2 = await storage.getBookingsByUser(userId);
      const enhancedBookings = await Promise.all(
        bookings2.map(async (booking) => {
          const car = await storage.getCar(booking.carId);
          return { ...booking, car };
        })
      );
      res.json(enhancedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: 6
        // Mock user ID (updated to match seeded data)
      });
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  app2.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!["confirmed", "active", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      await storage.updateBookingStatus(id, status);
      res.json({ message: "Booking status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  app2.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(6);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/bookings/:id/unlock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.unlockCar(id);
      if (success) {
        res.json({ message: "Car unlocked successfully", unlocked: true });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to unlock car" });
    }
  });
  app2.post("/api/bookings/:id/lock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.lockCar(id);
      if (success) {
        res.json({ message: "Car locked successfully", unlocked: false });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to lock car" });
    }
  });
  app2.post("/api/bookings/:id/location", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { latitude, longitude } = req.body;
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      await storage.updateUserLocation(id, parseFloat(latitude), parseFloat(longitude));
      res.json({ message: "Location updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });
  app2.post("/api/bookings/:id/tracking/enable", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.enableTracking(id);
      res.json({ message: "GPS tracking enabled", trackingEnabled: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to enable tracking" });
    }
  });
  app2.post("/api/bookings/:id/tracking/disable", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.disableTracking(id);
      res.json({ message: "GPS tracking disabled", trackingEnabled: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to disable tracking" });
    }
  });
  app2.get("/api/bookings/:id/location", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBookingWithLocation(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({
        bookingId: booking.id,
        isUnlocked: booking.isUnlocked,
        unlockTime: booking.unlockTime,
        trackingEnabled: booking.trackingEnabled,
        userLocation: {
          latitude: booking.userLatitude,
          longitude: booking.userLongitude
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking location" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
