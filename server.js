// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data file paths
const CARS_FILE = path.join(__dirname, 'data', 'cars.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Helper function to read JSON file
function readJSONFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return filePath.includes('cars') ? { cars: [] } : { orders: [] };
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write JSON file
function writeJSONFile(filePath, data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf8');
}

// Migration function to handle existing orders without id/status fields
function migrateExistingOrders() {
  const ordersData = readJSONFile(ORDERS_FILE);
  let needsMigration = false;
  
  ordersData.orders.forEach((order, index) => {
    if (!order.id) {
      order.id = Date.now() + index;
      needsMigration = true;
    }
    if (!order.status) {
      order.status = "confirmed"; // Existing orders are already confirmed
      needsMigration = true;
    }
  });
  
  if (needsMigration) {
    writeJSONFile(ORDERS_FILE, ordersData);
    console.log('Orders migrated successfully');
  }
}

// Run migration on server start
migrateExistingOrders();

// API Routes
// Get all cars
app.get('/api/cars', (req, res) => {
  try {
    const carsData = readJSONFile(CARS_FILE);
    res.json(carsData.cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Error fetching cars' });
  }
});

// Get car by VIN
app.get('/api/cars/:vin', (req, res) => {
  try {
    const vin = req.params.vin;
    const carsData = readJSONFile(CARS_FILE);
    
    const car = carsData.cars.find(car => car.vin === vin);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Error fetching car' });
  }
});

// Create new rental order (with pending status)
app.post('/api/orders', (req, res) => {
  try {
    const { customer, car, rental } = req.body;
    
    if (!customer || !car || !rental) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Read current data
    const carsData = readJSONFile(CARS_FILE);
    const ordersData = readJSONFile(ORDERS_FILE);
    
    // Find the car
    const carIndex = carsData.cars.findIndex(c => c.vin === car.vin);
    
    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Check if car is available
    if (!carsData.cars[carIndex].available) {
      return res.status(400).json({ error: 'Car is not available for rental' });
    }
    
    // Create new order with pending status
    const newOrder = {
      id: Date.now(),
      status: "pending",
      customer: {
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        driversLicenseNumber: customer.driversLicenseNumber
      },
      car: {
        vin: car.vin
      },
      rental: {
        startDate: rental.startDate,
        rentalPeriod: rental.rentalPeriod,
        totalPrice: rental.totalPrice,
        orderDate: new Date().toISOString().split('T')[0]
      }
    };
    
    // Add order to orders with pending status
    ordersData.orders.push(newOrder);
    
    // DON'T update car availability yet - only after confirmation
    // Car remains available until order is confirmed
    
    // Write only orders data
    writeJSONFile(ORDERS_FILE, ordersData);
    
    res.status(201).json({
      message: 'Order placed successfully. Please confirm your order.',
      order: newOrder,
      confirmationRequired: true
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Confirm order endpoint
app.post('/api/orders/:id/confirm', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    // Read current data
    const carsData = readJSONFile(CARS_FILE);
    const ordersData = readJSONFile(ORDERS_FILE);
    
    // Find the order
    const orderIndex = ordersData.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order is already confirmed
    if (ordersData.orders[orderIndex].status === 'confirmed') {
      return res.status(400).json({ error: 'Order already confirmed' });
    }
    
    // Check if car is still available
    const carVin = ordersData.orders[orderIndex].car.vin;
    const carIndex = carsData.cars.findIndex(car => car.vin === carVin);
    
    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (!carsData.cars[carIndex].available) {
      return res.status(400).json({ error: 'Car is no longer available' });
    }
    
    // Update order status
    ordersData.orders[orderIndex].status = "confirmed";
    
    // Update car availability
    carsData.cars[carIndex].available = false;
    
    // Write updated data
    writeJSONFile(ORDERS_FILE, ordersData);
    writeJSONFile(CARS_FILE, carsData);
    
    res.json({ 
      message: 'Order confirmed successfully',
      order: ordersData.orders[orderIndex]
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Error confirming order' });
  }
});

// Get all orders
app.get('/api/orders', (req, res) => {
  try {
    const ordersData = readJSONFile(ORDERS_FILE);
    res.json(ordersData.orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for reservation page
app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reservation.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
