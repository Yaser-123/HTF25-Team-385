# 🌌 Celestia - Digital Time Capsule Web App

A modern, secure, and beautiful time capsule application built with Next.js, Clerk, and Neon DB. Preserve your memories and unlock them in the future!

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk with email/OAuth support
- 🔒 **AES-256 Encryption** - All capsule content is encrypted before storage
- ⏰ **Time-Locked Capsules** - Set future unlock dates for your memories
- 📸 **Rich Media Support** - Store text, images, and videos (base64 encoded)
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS and glassmorphism
- 🚀 **Serverless Database** - PostgreSQL on Neon with Drizzle ORM
- ✅ **Full CRUD Operations** - Create, read, update, and delete capsules

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Encryption**: Node.js Crypto (AES-256-CBC)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Clerk account ([clerk.com](https://clerk.com))
- A Neon account ([neon.tech](https://neon.tech))

## 🚀 Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd HTF25-Team-385
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

The `.env.local` file is already configured with your API keys:

- ✅ Clerk authentication keys
- ✅ Neon database connection string
- ⚠️ **IMPORTANT**: Change the `ENCRYPTION_KEY` to a secure 32-character string in production!

### 4. Push database schema

Create the database tables using Drizzle:

\`\`\`bash
npm run db:push
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

\`\`\`
HTF25-Team-385/
├── app/
│   ├── api/
│   │   └── capsules/
│   │       └── route.ts          # API endpoints (GET, POST, PUT, DELETE)
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx           # Sign in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx           # Sign up page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout with ClerkProvider
│   └── page.tsx                   # Home page
├── components/
│   ├── CapsuleCard.tsx            # Capsule display component
│   └── CapsuleForm.tsx            # Create capsule form
├── lib/
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   └── schema.ts              # Drizzle schema definition
│   └── encryption.ts              # AES encryption utilities
├── middleware.ts                  # Clerk authentication middleware
├── drizzle.config.ts              # Drizzle configuration
├── .env.local                     # Environment variables
└── package.json
\`\`\`

## 🔐 Security Features

1. **Authentication**: All routes (except sign-in/sign-up) are protected by Clerk middleware
2. **Encryption**: Capsule content is encrypted with AES-256-CBC before database storage
3. **User Isolation**: Users can only access their own capsules (enforced at API level)
4. **Input Validation**: All API endpoints validate input data
5. **SQL Injection Protection**: Drizzle ORM provides parameterized queries

## 📝 API Endpoints

### GET /api/capsules
Fetch all unlocked capsules for the authenticated user.

**Response:**
\`\`\`json
{
  "capsules": [...],
  "count": 5
}
\`\`\`

### POST /api/capsules
Create a new time capsule.

**Request Body:**
\`\`\`json
{
  "content": "{\"text\":\"Hello future!\",\"media\":\"...\",\"mediaType\":\"image\"}",
  "unlockDate": "2025-12-31T00:00:00Z"
}
\`\`\`

### PUT /api/capsules
Update an existing capsule.

**Request Body:**
\`\`\`json
{
  "id": "capsule-id",
  "content": "...",
  "unlockDate": "..."
}
\`\`\`

### DELETE /api/capsules?id=capsule-id
Delete a capsule.

## 🎨 UI Components

### CapsuleForm
- Text input for messages
- File upload for images/videos (converted to base64)
- Date/time picker for unlock date
- Form validation and error handling

### CapsuleCard
- Displays capsule content (text and media)
- Shows creation date and unlock date
- Delete functionality with confirmation
- Responsive design with animations

## 🚢 Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
   - `ENCRYPTION_KEY`

4. Deploy! Vercel will automatically build and deploy your app

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:studio` - Open Drizzle Studio

## 📚 Database Schema

### Capsules Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | TEXT | Clerk user ID |
| content | TEXT | Encrypted content (JSON string) |
| unlockDate | TIMESTAMP | When the capsule unlocks |
| createdAt | TIMESTAMP | Creation timestamp |

## 🔧 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env.local`
- Ensure your Neon database is active

### Clerk Authentication Issues
- Check your Clerk API keys
- Verify middleware configuration
- Ensure environment variables are loaded

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for preserving memories across time
