# PetPal - Complete Pet Care & Ecommerce Platform

A comprehensive pet care platform built with React, Node.js, Express, and MongoDB. Features pet adoption, ecommerce store, health information, and real-time chat support.

## 🚀 Features

### Frontend Features
- **Pet Adoption System**: Browse and adopt pets with detailed profiles and filtering
- **Ecommerce Store**: Complete shopping experience with cart, wishlist, and checkout
- **Pet Health Guide**: Comprehensive disease database with symptom checker
- **Real-time Chat**: AI-powered chatbot with admin support
- **User Management**: Registration, authentication, and profile management
- **Admin Dashboard**: Complete management interface for pets, products, and users
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Backend Features
- **RESTful API**: Complete API with authentication and authorization
- **Real-time Communication**: Socket.IO for live chat functionality
- **Database Management**: MongoDB with Mongoose ODM
- **File Upload**: Image handling with Cloudinary integration
- **Payment Processing**: Stripe integration for secure payments
- **Email Notifications**: Automated email system
- **Admin Analytics**: Dashboard with statistics and insights

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- Socket.IO client for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for emails

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd petpal-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/petpal
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud database

5. **Seed the database** (optional)
   ```bash
   node server/scripts/seedDatabase.js
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 5173) and backend (port 5000) concurrently.

## 🗄️ Database Schema

### Collections
- **users**: User accounts and profiles
- **pets**: Pet listings for adoption
- **products**: Store inventory and product details
- **orders**: Purchase orders and adoption requests
- **diseases**: Health information and symptom database
- **chats**: Chat sessions and message history

### Key Features
- Indexed collections for fast search
- Referential integrity with population
- Aggregation pipelines for analytics
- Text search capabilities

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- Session management with token refresh

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Pets
- `GET /api/pets` - Get all pets with filtering
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Create pet (Admin)
- `PUT /api/pets/:id` - Update pet (Admin)
- `DELETE /api/pets/:id` - Delete pet (Admin)

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Chat
- `GET /api/chat/sessions` - Get chat sessions
- `GET /api/chat/session/:id` - Get chat messages
- `POST /api/chat/session/:id/message` - Send message

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Font Family: System fonts (Inter, SF Pro)
- Headings: 600-700 weight
- Body: 400-500 weight
- Line Height: 1.5 for body, 1.2 for headings

### Components
- Consistent spacing (8px grid)
- Rounded corners (8px, 12px, 16px)
- Subtle shadows and hover effects
- Responsive breakpoints (sm, md, lg, xl)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development servers
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Code Structure
```
├── server/
│   ├── config/         # Database and app configuration
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route handlers
│   ├── middleware/     # Custom middleware
│   ├── socket/         #Socket.IO handlers
│   └── scripts/        # Utility scripts
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   └── utils/          # Utility functions
└── public/             # Static assets
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Configure MongoDB connection
3. Deploy with: `git push heroku main`

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Configure network access
3. Update connection string in environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@petpal.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 🙏 Acknowledgments

- Pexels for stock photos
- Lucide for beautiful icons
- Tailwind CSS for styling system
- MongoDB for database solution
- Socket.IO for real-time features