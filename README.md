# AI Sell-Easy

A modern web application that uses AI to generate attractive descriptions for your marketplace listings. Upload your photos, let AI create the perfect title and description, then copy-paste to your favorite marketplace.

## ✨ Features

- 🤖 **AI Generation**: Uses Google AI (Gemini 1.5 Flash) to analyze images and generate descriptions
- 📸 **Image Upload**: Support for multiple images with drag-and-drop
- 📋 **Easy Copy**: Buttons to copy each field directly
- 🌐 **Marketplace Ready**: Generated content works for any marketplace (eBay, Facebook, Craigslist, etc.)
- 📱 **Responsive Design**: Modern interface that works on all devices
- ⚡ **Ultra-fast**: No authentication, no database required

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)  
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Lucide React (icons), Framer Motion (animations)
- **AI**: Google AI (Gemini 1.5 Flash)
- **Hosting**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google AI API Key (free at https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-selleasy.git
   cd ai-selleasy
   ```

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

### How to get Google AI API Key

1. Go to https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Select your Google Cloud project
5. Copy the generated key to your `.env.local`

## 📖 How to Use

1. **Upload your images** 📸
2. **Click "Generate with AI"** 🤖 
3. **Copy the fields one by one** 📋
4. **Open your marketplace** 🔗
5. **Paste and publish** ✨

## 🔧 API Endpoints

- `/api/generate-copy` - AI description generation

## 🚀 Deploy on Vercel

See detailed guide in [DEPLOY.md](./DEPLOY.md)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy
```

**Required configuration:**
- `GOOGLE_AI_API_KEY` environment variable in Vercel Dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for providing the Gemini 1.5 Flash model
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework