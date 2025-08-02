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
- **AI**: Google AI (Gemini 1.5 Flash) for image analysis and copy generation
- **No Authentication**: Direct API usage without user accounts
- **No Database**: Stateless application with local storage for form persistence

### Core Application Flow
1. Users upload product images via drag-and-drop interface
2. Images are analyzed by Google AI to generate marketplace copy (title/description)
3. Generated content is displayed with copy-to-clipboard functionality
4. Users can copy fields individually and paste to any marketplace
5. Form data persists locally across sessions

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components organized by feature
- `hooks/` - Custom React hooks for state management
- `lib/` - Service modules for external integrations
- `types/` - TypeScript type definitions

### Service Modules (`lib/`)
- `vertex-ai.ts` - AI copy generation using Google AI (Gemini 1.5 Flash)

### Core Data Model
Form data includes: title, description, price, category, brand, model. Data persists locally using localStorage.

### State Management
Uses custom React hooks and localStorage for form persistence. No authentication required - direct API usage.

### API Routes
- `/api/generate-copy` - POST endpoint for AI copy generation from images

### Environment Setup
Minimal setup required. Configure `.env.local` with Google AI API key from https://aistudio.google.com/. See `README.md` for detailed setup instructions.

### Google AI Setup
For AI copy generation to work:
1. Get a free API key from https://aistudio.google.com/
2. Add `GOOGLE_AI_API_KEY` to your `.env.local` file

Note: The application uses `gemini-1.5-flash` model for image analysis and marketplace copy generation.

### Error Handling
The app gracefully handles API errors with user-friendly messages and local error logging for debugging.