# Smart Chat Setup Instructions

## 🚀 Quick Setup

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add:

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### 3. Start the Application
```bash
npm run dev
```

## 🎯 Features

### Smart Chat Interface
- **Modern UI/UX**: Beautiful, responsive chat interface with dark mode support
- **Real-time Analysis**: AI analyzes your ERP data and provides instant insights
- **Context-Aware**: Understands your purchase orders, landing rates, and business metrics
- **Interactive**: Copy responses, clear chat, suggested queries

### Data Integration
- **Purchase Orders**: Analyzes open and completed POs
- **Landing Rates**: Provides insights on product pricing and performance
- **Vendor Analytics**: Tracks vendor performance and trends
- **Business Metrics**: Calculates fill rates, total values, and more

### Sample Queries
Try asking:
- "What's the total value of open purchase orders?"
- "Show me the top 5 vendors by PO value"
- "What's the average fill rate for open POs?"
- "Which products have the highest landing rates?"
- "How many POs are pending vs completed?"
- "Analyze the vendor performance trends"

## 🔧 Technical Details

### Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Service**: Google Gemini 1.5 Flash
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui

### Files Created
- `src/pages/SmartChat.tsx` - Main chat interface
- `src/services/gemini.ts` - AI service integration
- `src/types/chat.ts` - TypeScript type definitions

## 🛡️ Security Notes
- Never commit your `.env` file to version control
- Keep your API key secure and rotate it regularly
- The API key is only used client-side for AI requests

## 🎨 UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme switching
- **Loading States**: Smooth loading animations
- **Message Actions**: Copy, clear, and interaction features
- **Data Overview**: Quick stats cards showing your data
- **Suggested Queries**: Helpful starting points for new users

Enjoy your new AI-powered ERP assistant! 🤖✨
