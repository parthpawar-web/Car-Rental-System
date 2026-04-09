# Car Rental System

A full-stack MERN car rental application with user authentication, car management, and booking system.

![Car Rental System](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 🚗 **Car Management** - Add, view, and delete cars with images
- 📅 **Booking System** - Date validation and booking management
- 👥 **Role-based Access** - USER, OWNER, ADMIN roles
- 🖼️ **Image Upload** - Multer integration for car images
- 📱 **Responsive Design** - Modern gradient UI

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive Design
- Modern UI with Gradients

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/parthpawar-web/car-rental-system.git
cd car-rental-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

Then edit `.env` with your values:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

4. **Seed the database (optional)**
```bash
node seed.js
```

5. **Start the server**
```bash
npm start
# or for development
npm run dev
```

6. **Open frontend**
- Open `frontend/index.html` in your browser
- Or use Live Server extension in VS Code

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |

### Cars
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/cars` | Get all cars | No | - |
| POST | `/api/cars` | Add new car | Yes | OWNER/ADMIN |
| DELETE | `/api/cars/:id` | Delete car | Yes | OWNER/ADMIN |

### Bookings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings/my-bookings` | Get user bookings | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| DELETE | `/api/bookings/:id` | Cancel booking | Yes |

## User Roles

- **USER** - Can view and book cars
- **OWNER** - Can add/delete cars + USER permissions
- **ADMIN** - Full access to all features

## Project Structure

```
car-rental-system/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── index.html
│   ├── cars.html
│   ├── booking.html
│   └── bookings.html
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── upload.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── car.controller.js
│   │   └── booking.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roles.js
│   │   └── optionalAuth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   └── routes/
│       ├── authRoutes.js
│       ├── car.routes.js
│       └── booking.routes.js
├── uploads/cars/
├── .env.example
├── .gitignore
├── package.json
├── seed.js
└── server.js
```



## License

MIT

## Author

**Parth Pawar**
- GitHub: [@parthpawar-web](https://github.com/parthpawar-web)

---

Made with ❤️ using MERN Stack

Project created by Parth Pawar
