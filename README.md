# 🏢 Inventory Management System

Modern inventory management application built with Next.js 14, TypeScript, and Firebase.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Firebase Auth with session persistence
- ✅ **Real-time Inventory** - Live sync across all users
- ✅ **Stock Management** - Track entries, exits, and adjustments
- ✅ **Loan Tracking** - Monitor borrowed items and returns
- ✅ **Transaction History** - Complete audit trail of all changes
- ✅ **Protected Routes** - Secure access to sensitive pages
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Advanced Features
- ✅ **Search with Debouncing** - Fast, optimized search (300ms delay)
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Input Validation** - Comprehensive form validation
- ✅ **Type Safety** - Strict TypeScript with zero `any` types
- ✅ **State Management** - Zustand for efficient state handling

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.0 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand
- **UI Components:** React 18

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Real-time Sync:** Firebase onSnapshot

### Development Tools
- **Package Manager:** npm
- **Linter:** ESLint
- **Type Checking:** TypeScript Compiler

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/my-inventory-app.git
cd my-inventory-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Add your Firebase config to `.env.local`

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

### First Time Setup

1. Create a user account via Firebase Console
2. Navigate to `/login` and sign in
3. You'll be redirected to the dashboard

## 📁 Project Structure

```
my-inventory-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── dashboard/page.tsx       # Dashboard (protected)
│   ├── inventory/page.tsx       # Inventory (protected)
│   ├── history/page.tsx         # History (protected)
│   └── loans/page.tsx           # Loans (protected)
│
├── src/
│   ├── components/              # React components
│   │   ├── modals/              # Modal components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── InventoryTable.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication
│   │
│   ├── lib/                     # Core libraries
│   │   ├── firebase.ts          # Firebase init
│   │   ├── firestore.ts         # Firestore services
│   │   └── auth.ts              # Auth service
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useFirebaseInventory.ts
│   │
│   ├── store/                   # State management
│   │   └── inventoryStore.ts    # Zustand store
│   │
│   ├── types/                   # TypeScript types
│   │   └── inventory.ts
│   │
│   └── utils/                   # Utilities
│       ├── debounce.ts
│       └── validation.ts
│
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 📚 Documentation

Comprehensive documentation is available in the project:

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Complete project overview & status
- **[README-AUTH.md](./README-AUTH.md)** - Authentication implementation guide
- **[README-MIGRATION.md](./README-MIGRATION.md)** - Migration progress from vanilla JS
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Security audit findings & resolutions
- **[CRITICAL_FIXES.md](./CRITICAL_FIXES.md)** - Security fixes documentation

## 🔒 Security

### Security Features
- ✅ Firebase credentials in environment variables
- ✅ Protected routes with authentication
- ✅ Input validation and sanitization
- ✅ XSS prevention (React auto-escaping)
- ✅ Error boundaries prevent crashes
- ✅ Strict TypeScript typing
- ✅ No console.logs in production

### Security Audit Status
**Grade: A** - All critical issues resolved

See [AUDIT_REPORT.md](./AUDIT_REPORT.md) for details.

## 🌐 Deployment

### Recommended Platform: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

### Alternative Platforms
- Firebase Hosting
- Netlify
- AWS Amplify
- Cloudflare Pages

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] All tests passing
- [ ] Build succeeds (`npm run build`)
- [ ] Error boundaries tested
- [ ] Authentication flow verified

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Manual Testing Checklist
- [ ] User can log in
- [ ] Protected routes redirect when not authenticated
- [ ] Inventory CRUD operations work
- [ ] Real-time sync updates across tabs
- [ ] Search functionality works
- [ ] Modals open/close correctly
- [ ] Responsive design works on mobile

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use functional components
- Write descriptive commit messages
- Add JSDoc comments for complex functions
- Maintain test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **System Architect** - Initial work and migration

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- Zustand for lightweight state management

## 📞 Support

For support, please open an issue in the GitHub repository.

## 🔄 Recent Updates

**December 11, 2025:**
- ✅ Completed security audit fixes
- ✅ Implemented error boundaries
- ✅ Added input validation module
- ✅ Implemented search debouncing
- ✅ Removed all console.logs
- ✅ Fixed TypeScript strict mode issues

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed changelog.

---

**Status:** ✅ Production Ready  
**Version:** 2.0.0 (Next.js Migration)  
**Last Updated:** December 11, 2025
