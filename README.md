# E-Commerce Platform

A full-stack e-commerce application built with **NestJS** (backend) and **React** (frontend), featuring user authentication, product management, shopping cart, order processing, and role-based access control.

## 🚀 Features

### User Features
- **User Registration & Authentication**: Secure JWT-based authentication
- **Product Browsing**: Browse products with search and category filtering
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Process**: Complete purchase flow with shipping information
- **Order History**: View past orders and order details
- **User Profile**: Edit personal information and change password

### Admin Features
- **Product Management**: Create, edit, and delete products
- **Order Management**: View and update order status
- **User Management**: View user information (read-only for regular admins)

### Super Admin Features
- **Full User Management**: Create, edit, and delete users and admins
- **Role Management**: Assign roles (USER, ADMIN, SUPER_ADMIN)
- **Complete System Access**: All admin features plus user management

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Database ORM
- **SQLite** - Database (can be easily changed to PostgreSQL/MySQL)
- **JWT** - Authentication
- **Passport.js** - Authentication strategy
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
E-commerce/
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── products/  # Product management
│   │   │   ├── orders/    # Order processing
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── users/     # User management
│   │   │   └── categories/# Category management
│   │   └── main.ts        # Application entry point
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── web/                   # Frontend (React)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── components/    # Reusable components
│   └── package.json
└── package.json           # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-commerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../web && npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the web directory, create .env file
   cd web
   echo "VITE_API_URL=http://localhost:4000" > .env
   ```

4. **Set up the database**
   ```bash
   cd ../server
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

This will start both the backend (port 4000) and frontend (port 5173) servers.

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:server` - Start only the backend
- `npm run dev:web` - Start only the frontend

### Backend (server/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

### Frontend (web/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🗄️ Database Schema

The application uses Prisma with SQLite. Key entities include:

- **User**: Authentication and user management
- **Product**: Product catalog with categories
- **Order**: Order processing and management
- **CartItem**: Shopping cart functionality
- **Category**: Product categorization

## 🔐 Authentication & Authorization

### User Roles
- **USER**: Can browse products, manage cart, place orders
- **ADMIN**: Can manage products and orders, view users
- **SUPER_ADMIN**: Full system access including user management

### JWT Authentication
- Secure token-based authentication
- Automatic token refresh
- Role-based access control

## 🛍️ Key Features

### Shopping Experience
- Product browsing with search and filtering
- Shopping cart with quantity management
- Secure checkout process
- Order history and tracking

### Admin Panel
- Product CRUD operations
- Order management
- User management (Super Admin only)
- Real-time statistics

### User Management
- Profile editing
- Password changes
- Order history
- Secure authentication

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables (JWT_SECRET, DATABASE_URL)
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your preferred platform
3. Update the `VITE_API_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This is a development project. For production use, consider:
- Using a production database (PostgreSQL/MySQL)
- Implementing proper security measures
- Adding comprehensive error handling
- Setting up monitoring and logging
- Adding unit and integration tests 
