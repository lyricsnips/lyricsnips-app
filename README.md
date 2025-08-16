# LyricSnips 🎵

A modern web application for lyric enthusiasts to search, discover, and share their favorite song lyrics with beautiful visual snippets.

## Project Introduction

**What is LyricSnips?**
LyricSnips is a comprehensive lyrics discovery and sharing platform that allows users to search for songs, view lyrics, and create beautiful visual snippets to share with others. The application integrates with YouTube to provide song information and offers an AI-powered chat feature for enhanced user interaction.

**Why did I build it?**
I built LyricSnips to solve the common problem of finding and sharing meaningful lyrics in an engaging way. Traditional lyrics websites often lack visual appeal and sharing capabilities.

**Who was it built for?**

- Music enthusiasts who want to discover and share lyrics
- Social media users looking for beautiful lyric snippets to share
- Developers and designers interested in modern web applications
- Anyone who appreciates the intersection of music and technology

## Deployment Link

**Live Application**: https://lyricsnips-app.vercel.app/


## Additional Links

📋 **Project Wireframe**: https://www.figma.com/design/Dj7zvQJ8y6xoMtETCbHSH0/Untitled?node-id=0-1&t=W4ogDABs1L3Zkdqf-1

🗄️ **ERD (Entity Relationship Diagram)**: [https://dbdiagram.io/d/lyricsnips-ERD-68377fb0c07db17e779bc73c](https://dbdiagram.io/d/lyricsnips-ERD-68377fb0c07db17e779bc73c)

📄  **Project Proposal**: https://drive.google.com/file/d/1lTFaTQKT9gOXNK4JYR_KjkENWIHJJGKV/view?usp=sharing

## Project Tech Stack

### Frontend

- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & Database

- **Next.js API Routes** - Server-side API endpoints
- **Prisma 6.11.1** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js 4.24.11** - Authentication solution

### External APIs & Services

- **Google Generative AI** - AI-powered chat functionality
- **YouTube Data API** - Song and video information
- **AWS S3** - File storage and image hosting

### Development Tools

- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development
- **html-to-image** - Screenshot generation

### Key Libraries

- **bcryptjs** - Password hashing
- **youtube-player** - YouTube video integration
- **html2canvas** - HTML to canvas conversion

## Project Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database
- Google Cloud Platform account (for Generative AI)
- AWS account (for S3 storage)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd lyricsnips
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/lyricsnips"

   # Authentication (NextAuth.js)
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Google Generative AI
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"

   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   S3_BUCKET_NAME="your-s3-bucket-name"

    # YT Music API
    YT_MUSIC_API_URL=https://yt-music-api-548129453770.northamerica-northeast1.run.app
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production (includes Prisma setup)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **User**: Stores user authentication and profile information
- **Share**: Stores shared lyric snippets with metadata

For the complete ERD, visit: [https://dbdiagram.io/d/lyricsnips-ERD-68377fb0c07db17e779bc73c](https://dbdiagram.io/d/lyricsnips-ERD-68377fb0c07db17e779bc73c)

## Features

- 🔍 **Song Search**: Search for songs using YouTube integration
- 📝 **Lyrics Display**: View and interact with song lyrics
- 🎨 **Visual Snippets**: Create beautiful lyric snippets for sharing
- 🤖 **AI Chat**: Interactive chat powered by Google's Generative AI
- 📈 **Trending**: Discover popular and trending songs
- 👥 **User Authentication**: Secure user accounts with NextAuth.js
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🎯 **Share Functionality**: Share your favorite lyrics with unique URLs

