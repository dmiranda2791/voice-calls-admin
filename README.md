# Voice Calls Admin

A modern web application for managing voice calls, built with Next.js 15, React 19, and Supabase.

## 🚀 Features

- Modern UI built with Radix UI components
- Dark/Light theme support
- Responsive design
- Real-time data management with Supabase
- Interactive charts and data visualization
- Type-safe development with TypeScript

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.2
- **UI Library:** React 19
- **Database:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Type Safety:** TypeScript

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd voice-calls-admin
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_anon_key
```

## 🚀 Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
└── lib/          # Utility functions and configurations
```

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for the accessible components
- Supabase for the backend infrastructure
