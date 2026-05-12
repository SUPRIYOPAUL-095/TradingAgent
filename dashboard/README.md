# Trading Dashboard

A full-stack trading dashboard web application built with Next.js 14, Tailwind CSS, and PostgreSQL (Timescale).

## Features

✨ **Core Features**
- 📊 Real-time trading decisions dashboard with decision distribution pie chart
- 📈 Time-series visualization of trading decisions
- 🔍 Detailed analysis view showing all agent reports
- 📝 Form to trigger new stock analysis by symbol and date
- 🔄 Auto-polling every 30 seconds for real-time updates
- 🎨 Dark mode financial-themed UI with Tailwind CSS
- 📱 Responsive design for desktop and mobile

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- Recharts (financial charts)
- TypeScript

**Backend:**
- Next.js API Routes
- Node-Postgres (pg)
- PostgreSQL/Timescale

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
POSTGRES_HOST=h87yw4v3gw.rrklcji0qs.tsdb.cloud.timescale.com
POSTGRES_PORT=35106
POSTGRES_DATABASE=tsdb
POSTGRES_USER=tsdbadmin
POSTGRES_PASSWORD=akfia051wy8ymprn
POSTGRES_SSL=require
API_POLLING_INTERVAL=30000
```

### 3. Database Setup

Ensure your PostgreSQL/Timescale database has these tables:

```sql
CREATE TABLE final_trading_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_symbol VARCHAR(20) NOT NULL,
  trade_date TIMESTAMP NOT NULL,
  decision VARCHAR(10) NOT NULL,
  analysis_id VARCHAR(100),
  confidence DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(100) NOT NULL,
  report_date TIMESTAMP NOT NULL,
  agent_name VARCHAR(100) NOT NULL,
  report TEXT NOT NULL,
  analysis_id VARCHAR(100),
  score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trading_decisions_analysis_id ON final_trading_decisions(analysis_id);
CREATE INDEX idx_agent_reports_analysis_id ON agent_reports(analysis_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

## Project Structure

```
dashboard/
├── app/
│   ├── api/
│   │   ├── trading-decisions/
│   │   │   ├── route.ts          # GET/POST all decisions
│   │   │   └── [id]/route.ts     # GET decisions by analysis ID
│   │   ├── agent-reports/
│   │   │   ├── route.ts          # GET/POST all reports
│   │   │   └── [id]/route.ts     # GET reports by analysis ID
│   │   └── analysis/
│   │       ├── route.ts          # POST new analysis request
│   │       └── [id]/route.ts     # GET analysis with decisions & reports
│   ├── analyze/
│   │   └── page.tsx              # New analysis form page
│   ├── analysis/
│   │   └── [id]/page.tsx         # Analysis detail page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard home page
│   └── globals.css               # Global styles
├── lib/
│   ├── db.ts                     # Database connection
│   └── types.ts                  # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Pages

### Dashboard (`/`)
- Overview of trading decisions
- Decision distribution pie chart
- Time-series chart of decisions over time
- Filterable table of recent decisions
- Quick stats cards (total, BUY, SELL signals)
- Real-time polling every 30 seconds

### New Analysis (`/analyze`)
- Form to submit stock symbol and analysis date
- Triggers backend analysis pipeline
- Redirects to analysis details on success

### Analysis Details (`/analysis/[id]`)
- Trading decision summary
- All agent reports with color coding
- Agent scores and detailed analysis text
- Real-time updates while analysis is processing

## API Endpoints

### Trading Decisions
- `GET /api/trading-decisions` - Get all decisions
- `POST /api/trading-decisions` - Create new decision
- `GET /api/trading-decisions/[id]` - Get decisions by analysis ID

### Agent Reports
- `GET /api/agent-reports` - Get all reports
- `POST /api/agent-reports` - Create new report
- `GET /api/agent-reports/[id]` - Get reports by analysis ID

### Analysis
- `POST /api/analysis` - Queue new analysis
- `GET /api/analysis/[id]` - Get complete analysis with decisions and reports

## Color Coding

- 🟢 **BUY** - Green
- 🔴 **SELL** - Red
- 🟡 **HOLD** - Yellow

## UI Components

- Custom badges for decision status
- Trading cards with glassmorphic design
- Responsive navigation sidebar
- Dark theme with blue accents
- Skeleton loaders during data fetch
- Real-time updates with spinner feedback

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Export decision history to CSV
- [ ] Advanced filtering and search
- [ ] User authentication
- [ ] Historical performance analytics
- [ ] Alert system for specific decisions
- [ ] Mobile app with push notifications
- [ ] Machine learning model confidence scores

## Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## License

MIT

## Support

For issues or questions, please contact the development team.
