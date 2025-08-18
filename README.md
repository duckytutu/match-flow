# 🏓 Pickleball Tournament Management System

A comprehensive tournament management system built with modern web technologies for organizing and managing pickleball tournaments, events, and matches.

## 🚀 Project Overview

This project is a full-stack web application designed to streamline the management of pickleball tournaments. It provides features for tournament creation, event management, player registration, match scheduling, score tracking, and administrative oversight.

### Key Features

- **Tournament Management**: Create and manage multiple tournaments with different formats
- **Event Registration**: Players can register for specific events within tournaments
- **Match Management**: Schedule and track matches with real-time score updates
- **User Management**: Role-based access control (Admin, Organizer, Player)
- **Bracket Generation**: Automatic tournament bracket creation and management
- **Responsive Design**: Modern UI that works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS 10.x (Node.js framework)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 17 with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator & Class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest with supertest

### Frontend
- **Framework**: Next.js 15.x with React 19
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form
- **HTTP Client**: Axios

### Development & Build Tools
- **Monorepo**: Nx 21.2.2
- **Package Manager**: Yarn
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: 18.x or higher
- **Yarn**: Latest version
- **Docker**: 20.x or higher
- **Docker Compose**: 2.x or higher
- **PostgreSQL**: 17.x (if running locally without Docker)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pickleball-POC
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

Copy the environment files and configure them:

```bash
cp env.example .env
cp apps/backend/env.example apps/backend/.env
```

Update the environment variables with your configuration.

### 4. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Or start specific services
docker-compose up postgres backend
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
yarn dev

# Or start individually
yarn dev:frontend    # Frontend on http://localhost:3000
yarn dev:backend     # Backend on http://localhost:8000
```

## 🗄️ Database Setup

### Initial Setup

```bash
# Run migrations
cd apps/backend
yarn migration:run

# Seed the database with initial data
yarn seed:run
```

### Database Commands

```bash
# Generate new migration
yarn migration:generate -- -n MigrationName

# Run migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Seed database
yarn seed:run
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run e2e tests
yarn e2e

# Run tests with coverage
yarn test:cov
```

## 🏗️ Project Structure

```
pickleball-POC/
├── apps/
│   ├── backend/                 # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/           # Authentication & authorization
│   │   │   ├── tournaments/    # Tournament management
│   │   │   ├── events/         # Event management
│   │   │   ├── matches/        # Match scheduling & scoring
│   │   │   ├── users/          # User management
│   │   │   └── entities/       # Database models
│   │   └── migrations/         # Database migrations
│   └── frontend/               # Next.js React application
│       ├── src/
│       │   ├── app/            # Next.js app router pages
│       │   ├── components/     # Reusable UI components
│       │   ├── hooks/          # Custom React hooks
│       │   └── store/          # State management
│       └── public/             # Static assets
├── libs/                        # Shared libraries
│   ├── shared/                 # Common utilities
│   └── ui/                     # Shared UI components
├── docker-compose.yml          # Docker services configuration
└── nx.json                     # Nx monorepo configuration
```

## 🔧 Available Scripts

### Root Level
- `yarn dev` - Start both frontend and backend in development mode
- `yarn build` - Build all applications
- `yarn test` - Run all tests
- `yarn lint` - Lint all code
- `yarn format` - Format code with Prettier

### Backend
- `yarn start:dev` - Start backend in development mode
- `yarn migration:run` - Run database migrations
- `yarn seed:run` - Seed database with initial data

### Frontend
- `yarn dev` - Start frontend development server
- `yarn build` - Build production bundle
- `yarn start` - Start production server

## 🌐 API Endpoints

The backend provides RESTful API endpoints for:

- **Authentication**: `/auth/login`, `/auth/register`
- **Users**: `/users` (CRUD operations)
- **Tournaments**: `/tournaments` (CRUD operations)
- **Events**: `/tournament-events` (CRUD operations)
- **Matches**: `/matches` (CRUD operations)
- **Scores**: `/scores` (CRUD operations)

API documentation is available at `/api` when the backend is running.

## 🔐 Authentication & Authorization

The system implements role-based access control with three main roles:

- **Admin**: Full system access, user management, tournament approval
- **Organizer**: Tournament and event management, match scheduling
- **Player**: Event registration, match participation, score viewing

## 🐳 Docker Configuration

The project includes Docker configuration for easy development and deployment:

- **PostgreSQL 17**: Database service
- **Backend**: NestJS API server
- **Frontend**: Next.js application (commented out in docker-compose.yml)

## 📱 Frontend Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface using shadcn/ui components
- **Real-time Updates**: Live data synchronization with React Query
- **Form Validation**: Robust form handling with React Hook Form
- **State Management**: Efficient state management with Zustand

## 🔍 Development Tools

- **Nx**: Monorepo management and build optimization
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **TypeScript**: Type safety and developer experience

## 📊 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Intelligent caching with React Query
- **Optimization**: Nx build optimization and caching
- **Bundle Analysis**: Webpack bundle analysis tools

## 🚀 Deployment

### Production Build

```bash
# Build all applications
yarn build

# Start production servers
yarn start:prod
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the existing documentation
- Review the codebase structure
- Open an issue on GitHub
- Contact the development team

## 🔄 Version History

- **v0.1.0** - Initial release with basic tournament management
- **v0.0.1** - Backend API foundation
- **v0.0.0** - Project initialization

---

**Built with ❤️ using modern web technologies**
