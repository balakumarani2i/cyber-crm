# Cyber CRM System

A modern, AI-assisted CRM system with a futuristic cyber/neon theme built using React, Node.js, and Prisma.

## 🚀 Live Demo
- **Application URL**: [To be deployed]
- **Admin Credentials**: 
  - Email: `admin@crm.com`
  - Password: `admin123`

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: React hooks
- **Icons**: Lucide React
- **Charts**: Recharts

## 📋 Features

### Core Functionality
- ✅ Customer Management (CRUD operations)
- ✅ Deal Pipeline with drag-and-drop
- ✅ Task Management with priorities
- ✅ Dashboard with analytics
- ✅ User Authentication
- ✅ Responsive design

### UI/UX Features
- 🎨 Cyber/Neon theme with animations
- 🌟 Holographic effects and glowing elements
- 📱 Mobile-responsive design
- 🔍 Search functionality
- 📊 Data visualization

## 🏗 Architecture

### Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  company   String?
  address   String?
  status    String   @default("PROSPECT")
  createdAt DateTime @default(now())
  deals     Deal[]
  tasks     Task[]
}

model Deal {
  id          String   @id @default(cuid())
  title       String
  value       Float?
  stage       String   @default("LEAD")
  description String?
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime
  priority    String   @default("MEDIUM")
  status      String   @default("PENDING")
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  createdAt   DateTime @default(now())
}
```

### API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/deals` - List deals
- `POST /api/deals` - Create deal
- `PUT /api/deals/:id` - Update deal
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crm-system
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🤖 AI Development Process

This project was built using AI-assisted development with Amazon Q Developer, demonstrating:

- **Rapid Prototyping**: Quick component generation and API setup
- **Problem Solving**: Real-time debugging and issue resolution
- **Code Quality**: Consistent patterns and best practices
- **Documentation**: Auto-generated documentation and comments

## 📁 Project Structure

```
crm-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎨 Design System

The application features a unique cyber/neon aesthetic with:
- **Color Palette**: Cyan, purple, pink neon colors
- **Typography**: Modern, tech-inspired fonts
- **Animations**: Pulse, glow, and floating effects
- **Components**: Glassmorphism and holographic elements

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation with Zod
- SQL injection prevention with Prisma

## 📊 Performance Optimizations

- Lazy loading of components
- Optimized database queries
- Efficient state management
- Responsive image loading
- CSS optimization with Tailwind

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Run database migrations
3. Deploy application

### Frontend Deployment (Vercel/Netlify)
1. Build the application
2. Configure environment variables
3. Deploy static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.