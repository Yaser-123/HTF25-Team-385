# 🌌 Celestia - Digital Time Capsule# 🌌 Celestia - Digital Time Capsule Web App



<div align="center">A modern, secure, and beautiful time capsule application built with Next.js, Clerk, and Neon DB. Preserve your memories and unlock them in the future!



![Celestia Dashboard](./assets/dashboard-screenshot.png)## ✨ Features



**"Where memories meet the future ✨ — Unlock tomorrow, today."**- 🔐 **Secure Authentication** - Powered by Clerk with email/OAuth support

- 🔒 **AES-256 Encryption** - All capsule content is encrypted before storage

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)- ⏰ **Time-Locked Capsules** - Set future unlock dates for your memories

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)- 📸 **Rich Media Support** - Store text, images, and videos (base64 encoded)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS and glassmorphism

[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)](https://clerk.com/)- 🚀 **Serverless Database** - PostgreSQL on Neon with Drizzle ORM

[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E699?style=for-the-badge)](https://neon.tech/)- ✅ **Full CRUD Operations** - Create, read, update, and delete capsules



[🚀 Live Demo](https://celestia-htf25.vercel.app/) • [🐛 Report Bug](https://github.com/Yaser-123/HTF25-Team-385/issues) • [✨ Request Feature](https://github.com/Yaser-123/HTF25-Team-385/issues)## 🛠️ Tech Stack



</div>- **Framework**: Next.js 15 (App Router)

- **Language**: TypeScript

---- **Authentication**: Clerk

- **Database**: Neon PostgreSQL

## 📖 About The Project- **ORM**: Drizzle ORM

- **Styling**: Tailwind CSS

**Celestia** is a modern, secure, and beautiful digital time capsule application that lets you preserve memories, messages, photos, and videos to be unlocked at a future date. Built for **CBIT HacktoberFest '25**, Celestia combines cutting-edge web technologies with thoughtful UX design to create a unique experience for preserving and sharing moments across time.- **Encryption**: Node.js Crypto (AES-256-CBC)



### ✨ Key Highlights## 📋 Prerequisites



- 🔐 **End-to-End Encryption** - Your memories are secured with AES-256 encryption- Node.js 18+ and npm

- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations- A Clerk account ([clerk.com](https://clerk.com))

- 📱 **PWA Ready** - Install on any device, works offline- A Neon account ([neon.tech](https://neon.tech))

- 🖼️ **Multi-Media Support** - Store multiple photos and videos in each capsule

- ⏰ **Auto-Unlock** - Capsules unlock automatically when the time comes## 🚀 Getting Started

- 🎭 **Stunning Animations** - Engaging unlock animations and transitions

- 🔗 **Shareable Links** - Share your capsules with friends and family### 1. Clone the repository



---\`\`\`bash

git clone <your-repo-url>

## 🎯 Featurescd HTF25-Team-385

\`\`\`

### 🔒 Create Time Capsules

<img src="./assets/create-capsule.png" alt="Create Capsule" width="600"/>### 2. Install dependencies



- **Rich Content Editor** - Write messages with markdown support\`\`\`bash

- **Multi-Media Upload** - Add up to 10 photos/videos per capsulenpm install

- **Custom Unlock Dates** - Set any future date for your capsule\`\`\`

- **Privacy Controls** - Keep capsules private or share via link

### 3. Set up environment variables

### 🎬 Immersive Media Experience

<img src="./assets/carousel-demo.gif" alt="Media Carousel" width="600"/>The `.env.local` file is already configured with your API keys:



- **Full-Screen Carousel** - Browse media with smooth transitions- ✅ Clerk authentication keys

- **Keyboard & Swipe Navigation** - Arrow keys and touch gestures- ✅ Neon database connection string

- **Video Support** - Play videos directly in the carousel- ⚠️ **IMPORTANT**: Change the `ENCRYPTION_KEY` to a secure 32-character string in production!

- **Thumbnail Grid** - Quick navigation with visual previews

### 4. Push database schema

### 📱 Responsive Design

<img src="./assets/mobile-view.png" alt="Mobile View" width="300"/>Create the database tables using Drizzle:



- **Mobile-First** - Optimized for all screen sizes\`\`\`bash

- **Touch-Friendly** - Smooth gestures and interactionsnpm run db:push

- **PWA Support** - Install on home screen, works offline\`\`\`



---### 5. Run the development server



## 🛠️ Tech Stack\`\`\`bash

npm run dev

### Frontend\`\`\`

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router

- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScriptOpen [http://localhost:3000](http://localhost:3000) to see your app!

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations## 📁 Project Structure



### Backend & Database\`\`\`

- **[Neon PostgreSQL](https://neon.tech/)** - Serverless Postgres databaseHTF25-Team-385/

- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit├── app/

- **[Clerk](https://clerk.com/)** - Authentication & user management│   ├── api/

│   │   └── capsules/

### Security & PWA│   │       └── route.ts          # API endpoints (GET, POST, PUT, DELETE)

- **AES-256 Encryption** - Client-side content encryption│   ├── sign-in/

- **[next-pwa](https://github.com/shadowwalker/next-pwa)** - Progressive Web App support│   │   └── [[...sign-in]]/

- **Service Workers** - Offline functionality│   │       └── page.tsx           # Sign in page

│   ├── sign-up/

---│   │   └── [[...sign-up]]/

│   │       └── page.tsx           # Sign up page

## 🚀 Getting Started│   ├── globals.css                # Global styles

│   ├── layout.tsx                 # Root layout with ClerkProvider

### Prerequisites│   └── page.tsx                   # Home page

- Node.js 18+ and npm├── components/

- Neon PostgreSQL account ([Sign up free](https://neon.tech/))│   ├── CapsuleCard.tsx            # Capsule display component

- Clerk account ([Sign up free](https://clerk.com/))│   └── CapsuleForm.tsx            # Create capsule form

├── lib/

### Installation│   ├── db/

│   │   ├── index.ts               # Database connection

1. **Clone the repository**│   │   └── schema.ts              # Drizzle schema definition

```bash│   └── encryption.ts              # AES encryption utilities

git clone https://github.com/Yaser-123/HTF25-Team-385.git├── middleware.ts                  # Clerk authentication middleware

cd HTF25-Team-385├── drizzle.config.ts              # Drizzle configuration

```├── .env.local                     # Environment variables

└── package.json

2. **Install dependencies**\`\`\`

```bash

npm install## 🔐 Security Features

```

1. **Authentication**: All routes (except sign-in/sign-up) are protected by Clerk middleware

3. **Set up environment variables**2. **Encryption**: Capsule content is encrypted with AES-256-CBC before database storage

3. **User Isolation**: Users can only access their own capsules (enforced at API level)

Create a `.env.local` file in the root directory:4. **Input Validation**: All API endpoints validate input data

5. **SQL Injection Protection**: Drizzle ORM provides parameterized queries

```bash

# Clerk Authentication Keys## 📝 API Endpoints

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key### GET /api/capsules

Fetch all unlocked capsules for the authenticated user.

# Neon Database Connection String

DATABASE_URL=your_neon_database_url**Response:**

\`\`\`json

# Encryption Secret Key (32 bytes for AES-256){

ENCRYPTION_KEY=your_32_character_secret_key  "capsules": [...],

```  "count": 5

}

4. **Push database schema**\`\`\`

```bash

npm run db:push### POST /api/capsules

```Create a new time capsule.



5. **Run the development server****Request Body:**

```bash\`\`\`json

npm run dev{

```  "content": "{\"text\":\"Hello future!\",\"media\":\"...\",\"mediaType\":\"image\"}",

  "unlockDate": "2025-12-31T00:00:00Z"

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser 🎉}

\`\`\`

---

### PUT /api/capsules

## 📦 Build & DeployUpdate an existing capsule.



### Build for Production**Request Body:**

```bash\`\`\`json

npm run build{

npm start  "id": "capsule-id",

```  "content": "...",

  "unlockDate": "..."

### Deploy to Vercel}

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Yaser-123/HTF25-Team-385)\`\`\`



1. Click the button above or connect your GitHub repo### DELETE /api/capsules?id=capsule-id

2. Add environment variables in Vercel dashboardDelete a capsule.

3. Deploy! 🚀

## 🎨 UI Components

---

### CapsuleForm

## 🗂️ Project Structure- Text input for messages

- File upload for images/videos (converted to base64)

```- Date/time picker for unlock date

HTF25-Team-385/- Form validation and error handling

├── app/                    # Next.js app directory

│   ├── api/               # API routes### CapsuleCard

│   ├── capsule/[id]/      # Dynamic capsule pages- Displays capsule content (text and media)

│   ├── sign-in/           # Authentication pages- Shows creation date and unlock date

│   └── globals.css        # Global styles- Delete functionality with confirmation

├── components/            # React components- Responsive design with animations

│   ├── CapsuleCard.tsx    # Capsule preview cards

│   ├── CapsuleForm.tsx    # Create capsule form## 🚢 Deployment to Vercel

│   ├── MediaCarousel.tsx  # Full-screen media viewer

│   └── UnlockAnimation.tsx # Unlock effect1. Push your code to GitHub

├── lib/                   # Utility functions

│   ├── db/                # Database schema & config2. Import your repository in Vercel

│   └── encryption.ts      # AES-256 encryption

├── public/                # Static assets3. Add environment variables in Vercel dashboard:

│   ├── manifest.json      # PWA manifest   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

│   └── sw.js             # Service worker   - `CLERK_SECRET_KEY`

└── assets/               # Documentation assets   - `DATABASE_URL`

```   - `ENCRYPTION_KEY`



---4. Deploy! Vercel will automatically build and deploy your app



## 🎨 Color Palette## 🛠️ Available Scripts



Celestia uses a carefully crafted blue/green theme:- `npm run dev` - Start development server

- `npm run build` - Build for production

- **Background**: `#1B1B1B` - Deep space black- `npm start` - Start production server

- **Primary**: `#177BE4` - Celestial blue- `npm run lint` - Run ESLint

- **Success**: `#56AD01` - Future green- `npm run db:push` - Push schema changes to database

- **Text**: `#9A999C` - Soft gray- `npm run db:generate` - Generate migration files

- **Borders**: `#9A999C` - Subtle dividers- `npm run db:studio` - Open Drizzle Studio



---## 📚 Database Schema



## 🤝 Contributing### Capsules Table



<div align="center">| Column | Type | Description |

|--------|------|-------------|

### Built with ❤️ by CSOC Community| id | UUID | Primary key |

| userId | TEXT | Clerk user ID |

<img src="./assets/csoc-logo.png" alt="CSOC Logo" width="200"/>| content | TEXT | Encrypted content (JSON string) |

| unlockDate | TIMESTAMP | When the capsule unlocks |

**CBIT Open Source Community**| createdAt | TIMESTAMP | Creation timestamp |



We're a passionate community of developers, designers, and tech enthusiasts at CBIT, dedicated to building open-source projects and fostering a culture of collaboration and learning.## 🔧 Troubleshooting



[Join CSOC](https://csoc.cbit.org.in/) • [GitHub](https://github.com/CSOC-CBIT)### Database Connection Issues

- Verify your `DATABASE_URL` in `.env.local`

</div>- Ensure your Neon database is active



---### Clerk Authentication Issues

- Check your Clerk API keys

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**! 🌟- Verify middleware configuration

- Ensure environment variables are loaded

### How to Contribute

### Build Errors

1. **Fork the Project**- Clear `.next` folder: `rm -rf .next`

2. **Create your Feature Branch**- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

   ```bash

   git checkout -b feature/AmazingFeature## 📄 License

   ```

3. **Commit your Changes**MIT License - feel free to use this project for your own purposes!

   ```bash

   git commit -m 'Add some AmazingFeature'## 🙏 Acknowledgments

   ```

4. **Push to the Branch**- [Next.js](https://nextjs.org/)

   ```bash- [Clerk](https://clerk.com/)

   git push origin feature/AmazingFeature- [Neon](https://neon.tech/)

   ```- [Drizzle ORM](https://orm.drizzle.team/)

5. **Open a Pull Request**- [Tailwind CSS](https://tailwindcss.com/)



### Contribution Guidelines---



- ✅ Follow the existing code styleMade with ❤️ for preserving memories across time

- ✅ Write meaningful commit messages
- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Be respectful and constructive

---

## 👨‍💻 Developer

<div align="center">

<img src="./assets/team-logo.png" alt="Team Logo" width="150"/>

### **T Mohamed Yaser**
*Solo Developer - Team #385*

[![GitHub](https://img.shields.io/badge/GitHub-Yaser--123-181717?style=for-the-badge&logo=github)](https://github.com/Yaser-123)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohamedyaser08-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/mohamedyaser08/)
[![Email](https://img.shields.io/badge/Email-1ammar.yaser%40gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:1ammar.yaser@gmail.com)

*"Building the future, one commit at a time."* 🚀

</div>

---

## 🏆 Hackathon

<div align="center">

### CBIT HacktoberFest '25

**Team #385** | Solo Project

This project was built as part of **CBIT HacktoberFest 2025**, a celebration of open-source development and innovation at Chaitanya Bharathi Institute of Technology.

</div>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[CSOC](https://csoc.cbit.org.in/)** - For fostering the open-source community at CBIT
- **[CBIT](https://www.cbit.ac.in/)** - Chaitanya Bharathi Institute of Technology
- **[Vercel](https://vercel.com/)** - For amazing deployment platform
- **[Neon](https://neon.tech/)** - For serverless PostgreSQL
- **[Clerk](https://clerk.com/)** - For seamless authentication

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with 💙 and ☕ by [Yaser](https://github.com/Yaser-123)**

*Celestia - Where memories meet the future* 🌌

[↑ Back to Top](#-celestia---digital-time-capsule)

</div>
