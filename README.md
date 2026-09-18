# Branded Short-Link & Bio-Link Hub

A high-performance URL shortening engine and customizable "Link-in-Bio" hub manager. Built as a Bitly + Linktree hybrid, it allows users to create branded short links, track click telemetry, and build a personalized profile page for their audiences.

## Features

- **High-Speed URL Redirection Engine:**
  - Auto-generates unique 6-character short codes.
  - Supports custom vanity slugs (e.g., `/r/summer-sale`).
  - Strict duplicate alias collision detection and valid URL format enforcement.
  - Asynchronous click telemetry logging on all `302 Found` redirects.

- **Click Analytics & Metrics Aggregation:**
  - Captures rich click metadata: timestamp, HTTP referrer, device type (Mobile, Desktop, Tablet), and IP hash.
  - Dashboard visualizing total clicks over time and top referrers using Recharts.

- **Link Library Studio:**
  - Management data-table displaying destination URLs, short links, and click counts.
  - Includes 1-click copy, QR code generation modals, and secure delete actions.
  - Full server-side pagination and search across the user's link library.

- **"Link-in-Bio" Hub Customizer & Public Page:**
  - Visual builder to configure avatar, `displayName`, `bio`, and social link buttons.
  - Theme selector supporting Light, Dark Slate, and Gradient aesthetics.
  - Mobile-responsive public route (`/bio/:username`) rendering the personalized profile.

- **Enterprise-Grade Auth & Security:**
  - **Pair Token Auth:** Short-lived JWT Access Token (15m) + Long-lived Refresh Token (7d) stored securely in `httpOnly` cookies.
  - Full authentication flows: Signup with simulated Email Verification, Login with token rotation, and Forgot/Reset Password.
  - Configured `express-rate-limit` on critical creation and redirect routes to prevent abuse.

- **Premium UI / UX:**
  - Frontend components built exclusively using `coss.com/ui` (Shadcn/Radix primitives).
  - Elegant "Dark Zinc" aesthetic utilizing CSS variables, responsive sidebars, and accessible dialogs.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, `coss.com/ui` (Shadcn), Lucide Icons, Recharts, Axios
- **Backend:** Node.js, Express.js, Mongoose, JWT, Express Rate Limit, Zod
- **Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Backend Setup
1. Navigate to the server directory:
   \`\`\`bash
   cd server
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file based on \`.env.example\` and fill in your MongoDB URI and JWT secrets.
4. (Optional) Run the database seed to generate dummy data:
   \`\`\`bash
   npm run seed
   \`\`\`
5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the client directory:
   \`\`\`bash
   cd client
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation
Postman or Swagger documentation for the `/api/auth`, `/api/links`, `/api/bio`, and `/api/analytics` endpoints is implemented directly via Express router structures.
