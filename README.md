# Lenny RAG Agent - Web UI

Simple web chat interface for the Lenny RAG Agent with real-time streaming and source citations.

## Features

- Real-time WebSocket streaming
- Clean, modern chat interface
- Source citations with relevance scores
- Mobile responsive design
- Auto-connect on page load
- Error handling

## How to Use Locally

1. Open `index.html` in your web browser
2. The app auto-connects to the WebSocket
3. Type your question and press Enter or click Send
4. View the streaming response with citations

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from the FE directory:
```bash
cd FE
vercel
```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **lenny-rag-agent** (or your choice)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. Vercel will deploy and give you a URL like: `https://lenny-rag-agent.vercel.app`

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Set **Root Directory** to `FE`
5. Click "Deploy"

### Option 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/YOUR-REPO&project-name=lenny-rag-agent&root-directory=FE)

(Update the URL with your actual repository)

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `app.js` - WebSocket logic and UI updates
- `README.md` - This file

## WebSocket URL

The default WebSocket URL is:
```
wss://x1au0p5av1.execute-api.ap-south-1.amazonaws.com/prod/
```

You can change this in the UI or edit `index.html` to update the default.

## Example Questions

- What are Lenny's top tips for product management?
- How do you measure product-market fit?
- What are the best practices for user onboarding?
- How should I think about career growth as a PM?

## Technical Details

The UI handles these WebSocket message types:
- `status` - Status updates (e.g., "Retrieving context...")
- `chunk` - Streaming response chunks
- `complete` - Response complete with sources
- `error` - Error messages

Sources include:
- Title
- URL (clickable link)
- Relevance score (0.0 to 1.0)
