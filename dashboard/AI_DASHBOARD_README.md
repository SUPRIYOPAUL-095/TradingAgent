# Modern AI Trading Dashboard

A modern, professional trading dashboard built with Next.js 14, React, and Tailwind CSS. Designed to work seamlessly with a Python backend for AI-powered stock analysis.

## Features

### 🎯 Core Features
- **AI Analysis Form** - Input stock symbol and date to get analysis
- **Decision Cards** - Display BUY/SELL/HOLD decisions with color coding
- **Confidence Progress** - Visual indicator of AI confidence levels
- **Risk Assessment** - Low/Medium/High risk level display
- **AI Explanation Panel** - Detailed bullet-point analysis from AI
- **Price Charts** - Interactive line charts with trend visualization
- **Responsive Design** - Works perfectly on desktop and mobile

### 🎨 UI Components
- Sidebar navigation (Dashboard, Market Analysis, History, Settings)
- Dark professional trading theme (similar to Zerodha/TradingView)
- Smooth animations and transitions
- Glassmorphic design elements
- Custom scrollbars and form elements
- Loading spinners and error handling

### 📊 Pages
- **Dashboard** (`/dashboard`) - Main analysis interface
- **Market Analysis** (`/dashboard/market`) - Market insights
- **History** (`/dashboard/history`) - Past analyses with sortable table
- **Settings** (`/dashboard/settings`) - User preferences
- **Landing Page** (`/home`) - Marketing/intro page

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS 3
- Recharts (charts and visualizations)
- Lucide React (icons)

**Backend Integration:**
- Fetch API for HTTP requests
- Expected backend: `https://tradingagent-yndk.onrender.com/analyze`
- Mock data fallback for development

## Installation

### 1. Install Dependencies

```bash
cd dashboard
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/dashboard`

### 3. Backend Setup (Optional)

Your Python backend should expose an endpoint:

```
POST https://tradingagent-yndk.onrender.com/analyze
```

**Request:**
```json
{
  "company": "TCS",
  "date": "2024-01-25"
}
```

**Response:**
```json
{
  "decision": "BUY",
  "confidence": 78,
  "risk": "Medium",
  "explanation": "Technical indicators show bullish momentum...",
  "company_symbol": "TCS",
  "analysis_date": "2024-01-25"
}
```

**Note:** If backend is not available, the dashboard uses realistic mock data.

## Project Structure

```
dashboard/
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── AnalysisForm.tsx      # Input form for stock analysis
│   ├── DashboardCards.tsx    # Result display cards
│   ├── ChartSection.tsx      # Price trend chart
│   └── index.ts              # Component exports
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── market/page.tsx   # Market analysis page
│   │   ├── history/page.tsx  # Analysis history page
│   │   └── settings/page.tsx # Settings page
│   ├── home/page.tsx         # Landing page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Redirects to dashboard
├── lib/
│   └── types.ts              # TypeScript types & interfaces
├── app/globals.css           # Global styles and animations
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Usage

### 1. Access the Dashboard

```
http://localhost:3000/dashboard
```

### 2. Enter Stock Symbol

- Type stock symbol (e.g., "TCS", "INFY", "RELIANCE")
- Select analysis date
- Click "Run Analysis"

### 3. View Results

The dashboard displays:
- **Decision Card** - BUY/SELL/HOLD with confidence bar
- **Risk Level** - Low/Medium/High assessment
- **AI Explanation** - Detailed analysis points
- **Price Chart** - Historical stock price trend
- **Stats** - High/Low/Average/Change metrics

## Color Scheme

### Decision Colors
- 🟢 **BUY** - Green (#10b981)
- 🔴 **SELL** - Red (#ef4444)
- 🟡 **HOLD** - Yellow (#eab308)

### Theme
- **Primary** - Blue (#3b82f6)
- **Background** - Slate-950 (#020617)
- **Cards** - Slate-800/900
- **Borders** - Slate-700

## API Integration

### Connecting Your Python Backend

Update the fetch URL in `app/dashboard/page.tsx`:

```typescript
const response = await fetch('https://tradingagent-yndk.onrender.com/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    company,
    date,
  }),
})
```

### CORS Setup (Python Backend)

If backend is on different port, enable CORS:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'primary': '#your-color',
      'secondary': '#your-color',
    }
  }
}
```

### Modify Navigation

Edit `components/Sidebar.tsx` to add/remove menu items:

```typescript
const navigation = [
  { name: 'Your Item', href: '/path', icon: YourIcon },
  // ...
]
```

### Change Mock Data

Edit `app/dashboard/page.tsx` for default mock response.

## Performance Tips

- Lint optimization: `npm run lint`
- Build optimization: `npm run build`
- Use Chrome DevTools for debugging
- Check Network tab for API calls

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Build Locally

```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Not Connecting

1. Check if backend is running on `https://tradingagent-yndk.onrender.com`
2. Verify CORS is enabled on backend
3. Check browser console for errors
4. Dashboard uses mock data as fallback

### Styles Not Loading

1. Clear `.next` cache: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Rebuild: `npm run build`

### Port Already in Use

```bash
# Change port
npm run dev -- -p 3001
```

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] User authentication & profiles
- [ ] Saved analysis history (database)
- [ ] Advanced filtering & search
- [ ] Export to CSV/PDF
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Mobile app with React Native

## License

MIT

## Support

For issues or questions, contact the development team or check the code comments.
