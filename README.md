# 📸 Fotofi

> A beautiful, secure event photo gallery platform built with modern web technologies

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Fotofi** is a modern, feature-rich platform that enables event organizers to create beautiful photo galleries where guests can upload and access photos from events. Built with enterprise-grade architecture and security practices.

## ✨ Features

### 🚀 Core Functionality
- **Event Galleries**: Create beautiful, organized photo galleries for your events
- **Guest Photo Upload**: Easy photo upload interface for event guests
- **Photo Access**: Secure passcode-protected galleries for privacy
- **Photo Download**: Guests can download their photos and event memories
- **Responsive Design**: Beautiful, mobile-first interface that works on all devices

### 🔐 Authentication & Security
- **Passcode Protection**: Secure passcode access for event galleries
- **Data Protection**: User data isolation and privacy controls
- **Secure Uploads**: Safe and reliable photo upload system

### 🎨 User Experience
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives
- **Dark/Light Mode**: System-aware theme switching
- **Beautiful Galleries**: Stunning gallery layouts with responsive grids
- **Easy Navigation**: Intuitive interface for browsing and uploading photos
- **Mobile Optimized**: Perfect experience on all devices

## 🏗️ Architecture

### **Robust & Scalable Design**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│                 │    │                 │    │                 │
│ • Next.js 15    │◄──►│ • API Routes    │◄──►│ • PostgreSQL    │
│ • React 19      │    │ • Server Actions│    │ • Prisma ORM    │
│ • TypeScript    │    │ • File Upload   │    │ • Supabase      │
│ • Tailwind CSS  │    │ • Better Auth   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Image Hosting │    │   Email System  │    │   File Storage  │
│                 │    │                 │    │                 │
│ • Image CDN     │    │ • Resend API    │    │ • Static Assets │
│ • Optimization  │    │ • React Email   │    │ • Public Files  │
│ • Thumbnails    │    │ • Notifications │    │ • Photo Storage │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Architectural Decisions**

#### **1. Scalability**
- **Server Components**: Leverage React Server Components for optimal performance
- **Streaming Responses**: Real-time AI responses with progressive loading
- **Database Optimization**: Prisma ORM with connection pooling and query optimization
- **Edge-Ready**: Built for deployment on Vercel Edge Runtime

#### **2. Security**
- **Type Safety**: End-to-end TypeScript for compile-time error prevention
- **Input Validation**: Comprehensive data validation at API boundaries
- **Passcode Protection**: Secure access control for event galleries
- **SQL Injection Protection**: Prisma ORM prevents SQL injection attacks
- **XSS Protection**: React's built-in XSS protection with additional sanitization

#### **3. Extensibility**
- **Modular Architecture**: Component-based design for easy feature additions
- **File Upload System**: Extensible photo upload and storage integration
- **API-First Design**: RESTful APIs ready for mobile apps and integrations
- **Event-Driven**: Hooks system for custom business logic

#### **4. Maintainability**
- **Clean Code**: Consistent coding standards with ESLint and Prettier
- **Component Library**: Reusable UI components with shadcn/ui
- **Documentation**: Comprehensive inline documentation and type definitions
- **Testing Ready**: Architecture supports unit, integration, and E2E testing

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React framework with App Router |
| **React** | 19.1.0 | UI library with latest features |
| **TypeScript** | 5.x | Type safety and developer experience |
| **Tailwind CSS** | 4.x | Utility-first styling framework |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **Radix UI** | Latest | Unstyled, accessible primitives |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma** | 6.16.2 | Type-safe database ORM |
| **Better Auth** | 1.3.13 | Modern authentication library |
| **Resend** | 6.1.0 | Transactional email service |

### **Database & Infrastructure**
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database (via Supabase) |
| **Supabase** | Database hosting and management |
| **Vercel** | Deployment and hosting platform |

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm/pnpm/yarn
- PostgreSQL database (Supabase recommended)
- Resend API key (for emails, optional)

### **Environment Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/jannatkhandev/fotofi-app.git
   cd fotofi-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   
   ```env
   # Database
   DATABASE_URL="your_supabase_connection_string"
   DIRECT_URL="your_supabase_direct_connection_string"
   
   # Authentication
   BETTER_AUTH_SECRET="your_32_character_secret_key"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # Email Service (Optional)
   RESEND_API_KEY="your_resend_api_key"
   EMAIL_FROM="noreply@yourdomain.com"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # (Optional) Seed database with sample data
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
fotofi-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── [event]/           # Dynamic event gallery pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── *.tsx             # Feature components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Database client
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npx prisma studio   # Open Prisma Studio
npx prisma generate # Regenerate Prisma client
npx prisma db push  # Push schema changes

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript checks
```

### **Code Standards**
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Extended Next.js configuration with custom rules
- **Component Structure**: Functional components with hooks
- **File Naming**: kebab-case for files, PascalCase for components
- **Import Order**: External → Internal → Relative imports

### **Adding New Features**

1. **Create Components**: Add to `components/` directory
2. **API Routes**: Add to `app/api/` directory
3. **Database Changes**: Update `prisma/schema.prisma`
4. **Types**: Add TypeScript interfaces in component files or `lib/types.ts`

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables from `.env.local`
3. **Database**: Ensure Supabase database is accessible
4. **Deploy**: Automatic deployment on push to main branch

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

### **Environment Variables for Production**

Ensure these variables are set in your production environment:
- `DATABASE_URL` and `DIRECT_URL`
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`
- `RESEND_API_KEY` and `EMAIL_FROM` (optional)
- `NEXT_PUBLIC_APP_URL`

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style and conventions
- Add TypeScript types for all new code
- Update tests for any new functionality
- Ensure all linting passes before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the excellent React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Prisma](https://prisma.io/) for the fantastic database toolkit
- [Better Auth](https://www.better-auth.com/) for modern authentication

## 📞 Support

If you have any questions or need help:

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions

---

**Built with ❤️ using modern web technologies**