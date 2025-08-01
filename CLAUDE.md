# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with slate/violet/sky color scheme
- **Authentication**: Firebase Auth with Google Sign-In
- **Database**: Cloud Firestore
- **AI**: Google Vertex AI (Gemini Pro Vision) for image analysis and copy generation
- **Storage**: Google Cloud Storage for image uploads

### Core Application Flow
1. Users authenticate via Google Sign-In through Firebase Auth
2. Upload product images via drag-and-drop interface
3. Images are analyzed by Vertex AI to generate sales copy (title/description)
4. Items are stored in Firestore with user association
5. Users can view and manage their listings in the dashboard

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components organized by feature
- `contexts/` - React Context providers (AuthContext)
- `lib/` - Service modules for external integrations
- `types/` - TypeScript type definitions

### Service Modules (`lib/`)
- `firebase.ts` - Client-side Firebase configuration
- `firebase-admin.ts` - Server-side Firebase Admin SDK
- `vertex-ai.ts` - AI copy generation using Gemini Pro Vision
- `storage.ts` - Google Cloud Storage operations

### Core Data Model
Items are the primary entity with properties: id, userId, title, description, price, imageUrls, status ('listed'|'sold'), createdAt.

### Authentication Pattern
Uses Firebase Auth with React Context. The AuthProvider wraps the entire app in `app/layout.tsx`. Components use the `useAuth()` hook to access user state and auth methods.

### API Routes
- `/api/generate-copy` - POST endpoint for AI copy generation from images
- `/api/items/create` - POST endpoint for creating new listings
- `/api/items/mark-as-sold` - POST endpoint for updating item status

### Environment Setup
The app includes demo Firebase configuration that allows development without real credentials. For full functionality, configure `.env.local` with actual Firebase and Google Cloud credentials. See `SETUP.md` for detailed setup instructions.

### Google Cloud / Vertex AI Setup
For AI copy generation to work:
1. Install Google Cloud CLI: `brew install --cask google-cloud-sdk`
2. Authenticate: `gcloud auth application-default login`
3. Set project: `gcloud config set project ai-selleasy`
4. Enable Vertex AI API: `gcloud services enable aiplatform.googleapis.com`
5. Enable Gemini model access in Vertex AI Model Garden (manual step required)

Note: The application uses `gemini-1.5-flash` model for image analysis and sales copy generation.

### Error Handling
The app gracefully handles demo mode with fallback configurations and user-friendly error messages when external services are not configured.