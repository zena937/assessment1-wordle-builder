# Phoneme Activity Builder

A web application for Speech Pathology students and teachers to create phoneme-based Wordle and Word Search classroom activities.

## About

This application allows teachers to build phoneme-based activities that can be downloaded as standalone HTML files.

### Assessment 2 - Full-Stack Implementation

This project extends the frontend builder from Assessment 1 with:
- **Backend API** - RESTful endpoints for word and activity management
- **Database** - SQLite with Prisma ORM
- **Docker** - Containerized application for reproducibility
- **Full CRUD** - Create, Read, Update, Delete operations

## 🚀 Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Prisma ORM** - Database access
- **SQLite** - Lightweight database
- **Bootstrap 5** - Responsive UI
- **Docker** - Containerization

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check - returns 200 OK |
| `/api/words` | GET | Retrieve all words |
| `/api/words` | POST | Create a new word |
| `/api/words/[id]` | GET | Get a single word |
| `/api/words/[id]` | PUT | Update a word |
| `/api/words/[id]` | DELETE | Delete a word |
| `/api/activities` | GET | Retrieve all activities |
| `/api/activities` | POST | Create a new activity |
| `/api/activities/[id]` | GET | Get a single activity |
| `/api/activities/[id]` | PUT | Update an activity |
| `/api/activities/[id]` | DELETE | Delete an activity |

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up database
npx prisma migrate dev --name init

# Seed database with sample words
npx prisma db seed

# Start development server
npm run dev