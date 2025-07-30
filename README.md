# AI Sell-Easy

A modern web application that uses AI to generate compelling sales copy for eBay listings. Upload photos of your items, let AI create the perfect title and description, and manage your listings all in one place.

## Features

- 🤖 **AI-Powered Copy Generation**: Uses Google Vertex AI (Gemini Pro Vision) to analyze product images and generate compelling sales copy
- 📸 **Multi-Image Upload**: Support for multiple product images with drag-and-drop functionality
- 🔐 **Firebase Authentication**: Secure Google Sign-In integration
- 📊 **Real-time Dashboard**: View and manage all your listings in one place
- 🛒 **eBay Integration**: Automatically post listings to eBay (sandbox/production)
- 🌐 **Public Item Pages**: Shareable public pages for each listing
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern Design System**: Uses Tailwind CSS with a consistent color palette

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Libraries**: Lucide React (icons), Framer Motion (animations)
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **File Storage**: Google Cloud Storage
- **AI**: Google Vertex AI (Gemini Pro Vision)
- **Hosting**: Google Cloud Run

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with the following APIs enabled:
  - Firebase
  - Cloud Firestore
  - Cloud Storage
  - Vertex AI
- eBay Developer Account (for eBay integration)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   - Firebase configuration
   - Google Cloud credentials
   - eBay API credentials

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket

# eBay API Configuration
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
EBAY_REFRESH_TOKEN=your_ebay_refresh_token
EBAY_SANDBOX=true
```

## Features Overview

### Dashboard
- View all your listings in a clean grid layout
- See item status (listed/sold)
- Quick actions for each item
- Responsive design with hover effects

### New Listing
- Drag-and-drop image uploader
- AI-powered copy generation
- Real-time form validation
- Preview functionality

### Public Item Pages
- Beautiful image galleries with navigation
- Responsive design
- Direct links to eBay listings
- Status indicators for sold items

### API Endpoints
- `/api/items/create` - Create new listings
- `/api/items/mark-as-sold` - Update item status
- `/api/generate-copy` - AI copy generation
- `/api/post-to-ebay` - eBay integration
- `/api/webhooks/ebay` - eBay webhook handler

## Design System

The application follows a consistent design system:

- **Colors**: Slate (backgrounds/text), Violet & Sky (accents)
- **Typography**: Inter font family
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Layout**: Responsive with modern CSS Grid/Flexbox

## Deployment

The application is designed to be deployed on Google Cloud Run:

1. Build the application:
   ```bash
   npm run build
   ```

2. Create a Docker image
3. Deploy to Google Cloud Run
4. Configure environment variables
5. Set up domain and SSL

## License

This project is licensed under the MIT License.