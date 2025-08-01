# AI Sell-Easy

Application web moderne qui utilise l'IA pour générer des descriptions attrayantes pour vos annonces Ricardo. Téléchargez vos photos, laissez l'IA créer le titre et la description parfaits, puis copiez-collez sur Ricardo.

## Features

- 🤖 **Génération IA**: Utilise Google AI (Gemini 1.5 Flash) pour analyser les images et générer des descriptions
- 📸 **Upload d'images**: Support de plusieurs images avec drag-and-drop
- 📋 **Copie facile**: Boutons pour copier chaque champ directement
- 🌐 **Intégration Ricardo**: Lien direct vers la création d'annonce Ricardo
- 📱 **Design responsive**: Interface moderne qui fonctionne sur tous les appareils
- ⚡ **Ultra-rapide**: Aucune authentification, aucune base de données

## Technology Stack

- **Framework**: Next.js 14 (App Router)  
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Lucide React (icons), Framer Motion (animations)
- **AI**: Google AI (Gemini 1.5 Flash)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google AI API Key (gratuite sur https://aistudio.google.com/)

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

4. Configure your `.env.local`:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_from_aistudio
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Comment obtenir la clé Google AI

1. Allez sur https://aistudio.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Get API Key" → "Create API Key"
4. Sélectionnez votre projet Google Cloud
5. Copiez la clé générée dans votre `.env.local`

1. **Téléchargez vos images** 📸
2. **Cliquez "Générer avec IA"** 🤖 
3. **Copiez les champs un par un** 📋
4. **Cliquez "Ouvrir Ricardo.ch"** 🔗
5. **Collez sur Ricardo** ✨

## API Endpoint

- `/api/generate-copy` - Génération IA des descriptions

## Déploiement sur Vercel

Voir le guide détaillé dans [DEPLOY.md](./DEPLOY.md)

```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
npm run deploy
```

**Configuration requise :**
- Variable `GOOGLE_AI_API_KEY` dans Vercel Dashboard

## License

This project is licensed under the MIT License.

