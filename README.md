# 🤖 Agent Chat

> A robust, scalable, and secure AI-powered chat platform built with modern web technologies

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Agent Chat** is a modern, feature-rich platform that enables users to interact with AI agents, create custom agents, and manage conversations seamlessly. Built with enterprise-grade architecture and security practices.

## ✨ Features

### 🚀 Core Functionality
- **Interactive AI Chat**: Real-time streaming conversations with AI agents
- **Custom Agent Creation**: Build and configure your own AI agents with custom prompts
- **Agent Discovery**: Browse and interact with public agents created by the community
- **Conversation Management**: Persistent chat history with full conversation tracking
- **Responsive Design**: Beautiful, mobile-first interface that works on all devices

### 🔐 Authentication & Security
- **Multi-Provider Authentication**: Email/password, GitHub OAuth, and demo login
- **Session Management**: Secure session handling with automatic expiration
- **Email Verification**: Account verification with automated email flows
- **Password Reset**: Self-service password recovery system
- **Data Protection**: User data isolation and privacy controls

### 🎨 User Experience
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives
- **Dark/Light Mode**: System-aware theme switching
- **Search & Discovery**: Advanced agent search with real-time filtering
- **Sidebar Navigation**: Dynamic navigation showing user's agents and recent chats
- **Markdown Support**: Rich text rendering for AI responses

## 🏗️ Architecture

### **Robust & Scalable Design**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│                 │    │                 │    │                 │
│ • Next.js 15    │◄──►│ • API Routes    │◄──►│ • PostgreSQL    │
│ • React 19      │    │ • Server Actions│    │ • Prisma ORM    │
│ • TypeScript    │    │ • AI SDK v5     │    │ • Supabase      │
│ • Tailwind CSS  │    │ • Better Auth   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Services   │    │   Email System  │    │   File Storage  │
│                 │    │                 │    │                 │
│ • Google AI     │    │ • Resend API    │    │ • Static Assets │
│ • Gemini 2.5    │    │ • React Email   │    │ • Public Files  │
│ • Streaming     │    │ • Verification  │    │                 │
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
- **Authentication**: Industry-standard OAuth and session management
- **SQL Injection Protection**: Prisma ORM prevents SQL injection attacks
- **XSS Protection**: React's built-in XSS protection with additional sanitization

#### **3. Extensibility**
- **Modular Architecture**: Component-based design for easy feature additions
- **Plugin System**: Extensible AI provider integration
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
| **AI SDK** | 5.0.48 | AI model integration and streaming |
| **Google AI** | 2.0.15 | Gemini model integration |
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
- Google AI API key
- Resend API key (for emails)

### **Environment Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agent-chat.git
   cd agent-chat
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
   
   # AI Services
   GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_api_key"
   
   # Email Service
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

### **🎮 Demo Access**

Use the "Login with Demo User" button on the login page with these credentials:
- **Email**: `jannatkhandev@gmail.com`
- **Password**: `abcd1234`

## 📁 Project Structure

```
agent-chat/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── agents/        # Agent management endpoints
│   │   ├── chat/          # Chat streaming endpoint
│   │   ├── conversations/ # Conversation management
│   │   └── auth/          # Authentication endpoints
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── chat/[id]/         # Dynamic chat pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── agent-*.tsx       # Agent-related components
│   ├── app-*.tsx         # App layout components
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
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `RESEND_API_KEY` and `EMAIL_FROM`
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
- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration capabilities

## 📞 Support

If you have any questions or need help:

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions

---

**Built with ❤️ using modern web technologies**