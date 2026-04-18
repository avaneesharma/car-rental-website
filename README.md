# Car Rental System

A dynamic, interactive car rental website built with Node.js, Express, and jQuery. This application provides a streamlined online renting experience with real-time search, filtering, and booking capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-4.18.2-lightgrey.svg)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- **Homepage with Grid Layout**: Browse all available cars in a responsive grid layout
- **Real-time Search**: Search cars by type, brand, model, and description with live suggestions
- **Smart Filters**: Filter cars by type (Sedan, SUV, Coupe, etc.) and brand
- **Reservation System**: Complete booking process with form validation
- **Form Persistence**: Auto-save form data using localStorage
- **Live Validation**: Real-time feedback on form inputs
- **Price Calculation**: Automatic total price calculation based on rental period
- **Availability Management**: Automatic car availability updates after booking

### User Experience
- Clean, modern UI with white, grey, and black color scheme
- Responsive design for mobile and desktop
- Intuitive navigation with logo and reservation icons
- Disabled rent buttons for unavailable cars
- Clear error messages and user feedback

## Demo

**Live Demo**: (http://car-rental-system-env.eba-jsu2v9mp.us-east-1.elasticbeanstalk.com/) - expired now

### Screenshots

![Homepage](screenshots/homepage.png)
*Homepage with car grid layout and search/filter options*

![Reservation](public/images/reservation-img.png)
*Reservation page with form validation*

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Body-Parser** - Request body parsing middleware

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **jQuery 3.6.0** - DOM manipulation and AJAX

### Data Storage
- **JSON Files** - Persistent data storage for cars and orders
- **localStorage** - Client-side form data persistence

### Development Tools
- **Nodemon** - Auto-restart server on file changes

## Project Structure

car_rental_system/
├── data/
│   ├── cars.json
│   └── orders.json
├── node_modules/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   ├── js/
│   │   ├── main.js
│   │   ├── reservation.js
│   │   └── search.js
│   ├── index.html
│   └── reservation.html
├── package-lock.json
├── package.json
├── server.js
└── README.md

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/car-rental-system.git
   cd car-rental-system
```

2. **Install dependencies**
```bash
   npm install
```

3. **Verify data files exist**
   
   Ensure the `data/` directory contains:
   - `cars.json` (16 cars with various types and brands)
   - `orders.json` (sample orders)

4. **Start the server**
   
   For development (with auto-restart):
```bash
   npm run dev
```
   
   For production:
```bash
   npm start
```

5. **Open in browser**

## Usage

### Browsing Cars

1. Navigate to the homepage
2. View all available cars in a grid layout
3. Each car card displays:
   - Car image
   - Brand and model
   - Type, year, mileage, and fuel type
   - Price per day
   - Availability status

### Searching and Filtering

**Search**:
1. Type keywords in the search box
2. Get real-time suggestions as you type
3. Click a suggestion or press Enter to search
4. Results update dynamically

**Filters**:
1. Select a car type from the dropdown (Sedan, SUV, Coupe, etc.)
2. Select a brand from the dropdown (Toyota, Honda, Ford, etc.)
3. Filters can be combined with search
4. Click "Search" button to apply

### Making a Reservation

1. Click "Rent Now" on an available car
2. Review car details on the reservation page
3. Fill out the reservation form:
   - Full Name
   - Phone Number (format: +1234567890)
   - Email Address
   - Driver's License Number
   - Start Date (today or future)
   - Rental Period (days)
4. Watch the total price calculate automatically
5. Submit button enables when all fields are valid
6. Click "Submit" to complete the reservation
7. Click "Cancel" to clear form and return to homepage

### Form Data Persistence

- If you leave the reservation page without submitting or canceling
- Your form data is automatically saved to localStorage
- Data is restored when you return to the reservation page
- Data is cleared after successful submission or cancellation

## API Endpoints

### Cars

#### Get All Cars

Returns an array of all cars in the inventory.

**Response:**
```json
[
  {
    "carType": "Sedan",
    "brand": "Toyota",
    "carModel": "Corolla",
    "image": "url",
    "yearOfManufacture": 2014,
    "mileage": "30,000 km",
    "fuelType": "Gasoline",
    "available": true,
    "pricePerDay": 50,
    "description": "Description text",
    "vin": "1HGBH41JXMN109186"
  }
]
```

#### Get Car by VIN

Returns details of a specific car.

**Parameters:**
- `vin` - Vehicle Identification Number (17 characters)

**Response:**
```json
{
  "carType": "Sedan",
  "brand": "Toyota",
  "carModel": "Corolla",
  ...
}
```

### Orders

#### Create Order

Creates a new rental order and updates car availability.

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "email": "john@example.com",
    "driversLicenseNumber": "D123456789"
  },
  "car": {
    "vin": "1HGBH41JXMN109186"
  },
  "rental": {
    "startDate": "2025-04-01",
    "rentalPeriod": 7,
    "totalPrice": 350,
    "orderDate": "2025-03-28"
  }
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": { ... }
}
```

#### Get All Orders

Returns an array of all rental orders.

## Deployment

### AWS Elastic Beanstalk

1. Install the EB CLI:
```bash
   pip install awsebcli
```

2. Initialize Elastic Beanstalk:
```bash
   eb init
```

3. Create environment:
```bash
   eb create car-rental-env
```

4. Deploy:
```bash
   eb deploy
```

### Heroku

1. Create a Heroku app:
```bash
   heroku create your-app-name
```

2. Deploy:
```bash
   git push heroku main
```

3. Open the app:
```bash
   heroku open
```

### Manual Deployment

1. Copy all files to your web server
2. Install Node.js on the server
3. Run `npm install` in the project directory
4. Start the server with `npm start`
5. Configure your web server (Nginx/Apache) to proxy to port 3000

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test all features before submitting PR
- Update README if adding new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Your Name**
- GitHub: [@avaneeshsharma](https://github.com/avaneeshsharma)
- Email: avaneeshsharmab@gmail.com

## Acknowledgments

- Assignment provided by [University/Course Name]
- jQuery library for DOM manipulation
- Express.js for server framework

## Support

For support, email your.email@example.com or create an issue in the GitHub repository.

---

**Note**: This project was created as part of a web development assignment to demonstrate skills in:
- Full-stack web development
- AJAX and asynchronous programming
- Form validation and user experience
- Data persistence with JSON
- Responsive web design
- RESTful API design

Star this repository if you found it helpful!
