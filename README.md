# 🛒 BuyEasy - Modern E-Commerce Platform

A full-stack e-commerce application built with Next.js 15, featuring a complete shopping experience with authentication, payments, and admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.16.1-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Customer Features

- 🛍️ **Product Browsing** - Browse products with advanced filtering (category, price, rating)
- 🔍 **Search & Sort** - Full-text search with multiple sorting options
- 🛒 **Shopping Cart** - Session-based cart with persistent user carts
- ⭐ **Reviews & Ratings** - Submit and view product reviews
- 💳 **Multiple Payment Methods** - PayPal, Stripe, and Cash on Delivery
- 📧 **Email Receipts** - Automated purchase receipts via Resend
- 📱 **Responsive Design** - Mobile-first UI with dark mode support
- 🔐 **Authentication** - Secure login/signup with NextAuth.js

### Admin Features

- 📊 **Dashboard** - Sales overview with charts (Recharts)
- 📦 **Product Management** - CRUD operations for products
- 🖼️ **Image Upload** - Multi-image upload via UploadThing
- 📋 **Order Management** - View and manage customer orders
- 👥 **User Management** - Admin role management
- 📈 **Analytics** - Sales trends and revenue tracking

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15.5.2 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State**: React Context + Server Actions
- **Charts**: Recharts

### Backend

- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma 6.16.1 with Neon Adapter
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Payments**: PayPal SDK, Stripe
- **Email**: Resend + React Email
- **File Upload**: UploadThing

### DevOps

- **Hosting**: Vercel
- **Database**: Neon PostgreSQL
- **CI/CD**: Vercel Deployments
- **Monitoring**: Prisma Accelerate

## 📋 Prerequisites

- Node.js 18.x or higher
- npm/yarn/pnpm
- PostgreSQL database (Neon account recommended)
- Accounts for third-party services:
  - [Neon](https://neon.tech) - Database
  - [UploadThing](https://uploadthing.com) - File uploads
  - [PayPal Developer](https://developer.paypal.com) - Payments
  - [Stripe](https://stripe.com) - Payments
  - [Resend](https://resend.com) - Email

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/lemonade0109/buy-easy.git
cd buy-easy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=BuyEasy
NEXT_PUBLIC_APP_DESCRIPTION=Your one-stop shop for everything!
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# Payment Methods
NEXT_PUBLIC_PAYMENT_METHODS=PayPal, Stripe, Cash on Delivery
NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD=PayPal

# PayPal
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# UploadThing (no quotes!)
UPLOADTHING_TOKEN=eyJhcGlLZXk...
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=your-app-id

# Resend (no quotes!)
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=onboarding@resend.dev
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx tsx db/seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📧 Email Development

Preview and develop email templates:

```bash
npm run email
```

Open [http://localhost:3001](http://localhost:3001) to see the email preview.

## 🏗️ Project Structure

```
buy-easy/
├── app/                    # Next.js App Router
│   ├── (root)/            # Public-facing pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── shared/           # Shared components
│   └── ui/               # UI components (shadcn)
├── lib/                   # Utility functions
│   ├── actions/          # Server actions
│   ├── constants/        # Constants
│   └── validator.ts      # Zod schemas
├── db/                    # Database utilities
├── email/                 # Email templates
├── prisma/               # Prisma schema & migrations
├── public/               # Static assets
└── types/                # TypeScript types
```

## 🔑 Key Features Explained

### Authentication

Uses NextAuth.js v5 with credentials provider. Supports:

- Email/password authentication
- Session management with JWT
- Protected routes via middleware
- Role-based access (user/admin)

### Cart System

- Session-based carts for guests (cookie-based)
- Persistent carts for authenticated users
- Automatic cart merging on login
- Real-time price calculations

### Payment Processing

- **PayPal**: Sandbox integration with client SDK
- **Stripe**: Test mode with Stripe Elements
- **Cash on Delivery**: Manual processing
- Order confirmation emails via Resend

### Image Upload

- Multi-image upload via UploadThing
- Automatic optimization
- CDN delivery
- Secure file handling

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important environment variables for production:**

- Set `NEXT_PUBLIC_SERVER_URL` to your production URL
- Use production API keys for PayPal, Stripe, etc.
- Set `AUTH_SECRET` and `AUTH_TRUST_HOST=true`
- Remove quotes from `UPLOADTHING_TOKEN` and `RESEND_API_KEY`

### Database Migration

```bash
# Production migration
npx prisma migrate deploy
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run email` - Start email preview server
- `npm test` - Run tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Jubril**

- GitHub: [@lemonade0109](https://github.com/lemonade0109)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform
- [Neon](https://neon.tech/) - Serverless Postgres

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

Made with ❤️ by Jubril
