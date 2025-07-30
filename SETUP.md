# Setup Instructions

## Current Status
The app is configured with demo Firebase credentials that will allow you to run the development server without errors, but authentication and database functionality will not work.

## To fully set up the application:

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication with Google provider
4. Enable Firestore Database
5. Get your Firebase config from Project Settings > General > Your apps
6. Replace the demo values in `.env.local` with your actual Firebase config

### 2. Google Cloud Setup
1. Enable the following APIs in Google Cloud Console:
   - Vertex AI API
   - Cloud Storage API
   - Firestore API
2. Create a service account key for Firebase Admin
3. Add the service account details to `.env.local`

### 3. eBay API Setup (Optional)
1. Create an eBay developer account
2. Get your client ID, secret, and refresh token
3. Add these to `.env.local`

### 4. Install Dependencies
```bash
npm install
# or
yarn install
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

## Demo Mode
The app will run in demo mode with the current configuration. You'll see the UI but authentication won't work with real Google accounts.