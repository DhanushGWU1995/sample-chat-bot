# PartSelect Chat Assistant - AI-Powered Parts Support

An intelligent chatbot system for PartSelect e-commerce platform, specializing in Refrigerator and Dishwasher parts. Built with Angular frontend, Node.js/Express backend, and AI integration.

## Sample Chatbot Agent

**No API key needed!** The app includes a **Mock AI mode** with pre-written intelligent responses.

```bash
# Backend is already configured for Mock AI
cd backend
npm install
npm run seed
npm run dev
```

See `MOCK_AI_GUIDE.md` for details on switching between Mock AI (free) and Real AI (DeepSeek/OpenAI).

## 📋 Project Overview

This chat agent helps customers:
- Find compatible parts for their appliances
- Get installation instructions
- Troubleshoot common issues
- Check part compatibility with model numbers
- Get instant support for refrigerator and dishwasher parts

## Architecture

### Technology Stack

**Frontend:**
- Angular 17 (Standalone Components)
- TypeScript
- RxJS for reactive state management
- Modern CSS with CSS Variables

**Backend:**
- Node.js with Express
- TypeScript
- SQLite database
- OpenAI SDK for DeepSeek/OpenAI integration

**AI Options:**
- **Mock AI** - Pre-written responses (FREE, no API key needed) 🎭
- **DeepSeek Chat** - Real AI (affordable, requires API key)
- **OpenAI GPT** - Real AI (alternative, requires API key)
- Intent classification
- Context-aware responses
- Entity extraction

### System Design

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│                 │         │                 │         │  Mock AI OR  │
│  Angular        │────────▶│  Express API    │────────▶│  DeepSeek OR │
│  Frontend       │◀────────│  Backend        │◀────────│  OpenAI      │
│                 │         │                 │         └──────────────┘
└─────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │                 │
                            │  SQLite         │
                            │  Database       │
                            │                 │
                            └─────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- DeepSeek API Key (get from https://platform.deepseek.com/)
- Angular CLI (optional, but recommended)

### Installation

#### 1. Clone and Setup Backend

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your DeepSeek API key
# DEEPSEEK_API_KEY=your_key_here
```

#### 2. Initialize Database

```bash
# Seed the database with sample data
npm run seed
```

This creates:
- 5 sample products (refrigerators and dishwashers)
- 8 parts (ice makers, pumps, valves, etc.)
- Compatibility mappings
- Installation guides
- Troubleshooting guides

#### 3. Start Backend Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

#### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

#### 5. Start Frontend

```bash
npm start
# Application runs on http://localhost:4200
```

### Quick Test

1. Open http://localhost:4200
2. Try these example queries:
   - "How can I install part number PS11752778?"
   - "Is this part compatible with my WDT780SAEM1 model?"
   - "The ice maker on my Whirlpool fridge is not working. How can I fix it?"
   - "Dishwasher not draining"

## Database Schema

### Tables

**products** - Appliance models
- id, model_number, name, type, brand, description

**parts** - Replacement parts
- id, part_number, name, description, category, price, in_stock, image_url

**compatibility** - Part-Product relationships
- id, part_id, product_id

**installation_guides** - Step-by-step instructions
- id, part_id, instructions, difficulty, estimated_time, tools_required, video_url

**troubleshooting_guides** - Issue resolution guides
- id, product_type, issue, solution, related_parts

**chat_history** - Conversation logs
- id, session_id, user_message, bot_response, intent, created_at

## AI Integration

### Intent Classification

The system classifies user queries into:

1. **Installation** - How to install parts
2. **Compatibility** - Part-model compatibility checks
3. **Troubleshooting** - Issue diagnosis and resolution
4. **Product Search** - Finding specific parts
5. **General** - General inquiries
6. **Out of Scope** - Non-related queries (redirected) 🛡️

### Scope Limitation (Critical Feature!)

**The chatbot strictly stays within its domain:**
- Checks every query for appliance-related keywords
- If no refrigerator/dishwasher/parts keywords found → marks as out-of-scope
- Politely redirects off-topic questions
- Prevents hallucination and irrelevant responses

**Examples of out-of-scope queries handled:**
- "What's the weather today?" → Redirected
- "What's the best pizza place nearby?" → Redirected
- "Tell me a joke" → Redirected

**In-scope keywords monitored:**
- Appliances: refrigerator, fridge, dishwasher
- Parts: ice maker, water valve, pump, filter, door seal
- Actions: install, repair, fix, troubleshoot
- Brands: Whirlpool, GE, LG, Samsung, Maytag
- Issues: not draining, not cooling, leaking

See `TESTING_OUT_OF_SCOPE.md` for comprehensive test cases.

### Context Gathering

For each intent, the system:
1. Extracts entities (part numbers, model numbers, issues)
2. Queries database for relevant information
3. Builds context for AI model
4. Generates response with specific part recommendations

### Response Generation

The AI model (Mock/DeepSeek/OpenAI):
- Uses system prompts to stay focused on refrigerator/dishwasher parts
- Enforces strict scope limitation
- Formats responses with markdown
- Includes specific part numbers and pricing
- Provides step-by-step instructions
- Recommends related parts

## Frontend Features

### Chat Interface
- Real-time message streaming
- Typing indicators
- Message history
- Quick action buttons
- Responsive design

### Part Display
- Visual part cards
- Stock status
- Pricing information
- Category badges
- Installation guide links

### User Experience
- Keyboard shortcuts (Enter to send)
- Auto-scroll to latest message
- Clear chat functionality
- Session management
- Error handling with fallbacks

## API Endpoints

### Chat Endpoints

```
POST /api/chat/session
- Create new chat session
- Returns: { sessionId, message }

POST /api/chat/message
- Send message to chat agent
- Body: { sessionId, message }
- Returns: { response, intent, suggestedParts }

GET /api/chat/history/:sessionId
- Get chat history
- Returns: { sessionId, messages, createdAt }
```

### Parts Endpoints

```
GET /api/parts
- Get all parts (optional: ?category=X&search=Y)
- Returns: Part[]

GET /api/parts/:partNumber
- Get specific part details
- Returns: Part

GET /api/parts/:partNumber/compatibility
- Get compatible models
- Returns: CompatibilityInfo[]

GET /api/parts/:partNumber/installation
- Get installation guide
- Returns: InstallationGuide

POST /api/parts/check-compatibility
- Check part-model compatibility
- Body: { partNumber, modelNumber }
- Returns: { compatible, partNumber, modelNumber }
```

### Products Endpoints

```
GET /api/products
- Get all products (optional: ?type=X&brand=Y)
- Returns: Product[]

GET /api/products/:modelNumber
- Get specific product
- Returns: Product

GET /api/products/:modelNumber/parts
- Get compatible parts for model
- Returns: Part[]

GET /api/products/troubleshooting/:type
- Get troubleshooting guides
- Returns: TroubleshootingGuide[]
```

## Key Features & Design Decisions

### Extensibility

**Modular Architecture:**
- Separate services for chat, parts, and DeepSeek
- Database-driven content (easy to add new parts/products)
- Intent-based routing for scalability

**Future Extensions:**
- Add more appliance types (washers, dryers)
- Multi-language support
- Voice interface integration
- Image recognition for parts

### Scalability

**Backend:**
- Stateless API design
- Session storage (can migrate to Redis)
- Database connection pooling ready
- Horizontal scaling friendly

**Frontend:**
- Lazy loading ready
- Component-based architecture
- State management with RxJS
- Progressive Web App ready

### User Experience

**Focused Scope:**
- AI trained to decline off-topic queries
- Redirects to refrigerator/dishwasher parts
- Prevents hallucination with database-backed responses

**Visual Design:**
- PartSelect branding (blue color scheme)
- Clean, modern interface
- Mobile-responsive
- Accessibility considerations

**Helpful Features:**
- Quick action buttons for common queries
- Part recommendations in chat
- Visual part cards with pricing
- Installation difficulty indicators

## Sample Data

The database includes:

**Products:**
- Whirlpool WDT780SAEM1 (Dishwasher)
- Whirlpool WRF535SWHZ (Refrigerator)
- GE GDT695SSJSS (Dishwasher)
- GE GFE28GYNFS (Refrigerator)
- LG LFXS26973S (Refrigerator)

**Parts:**
- PS11752778 - Ice Maker Assembly
- PS11755825 - Water Inlet Valve
- PS11754026 - Dishwasher Spray Arm
- PS11768671 - Dishwasher Pump
- And more...

**Troubleshooting:**
- Ice maker not working
- Poor dishwasher cleaning
- Refrigerator not cooling
- Dishwasher not draining

## Testing Scenarios

### Installation Query
```
User: "How can I install part number PS11752778?"
Expected: Detailed installation steps, tools required, estimated time
```

### Compatibility Check
```
User: "Is PS11754026 compatible with my WDT780SAEM1?"
Expected: Compatibility confirmation, part details, pricing
```

### Troubleshooting
```
User: "Ice maker on my Whirlpool fridge is not working"
Expected: Diagnostic steps, potential causes, recommended parts
```

### Out of Scope
```
User: "What's the weather today?"
Expected: Polite redirect to refrigerator/dishwasher parts
```

## Security Considerations

- API key stored in environment variables
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS configuration
- Error handling without exposing internals

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use process manager (PM2, Docker)
3. Configure reverse proxy (nginx)
4. Use production database (PostgreSQL recommended)
5. Set up monitoring and logging

### Frontend
1. Build production bundle: `npm run build`
2. Serve from CDN or static hosting
3. Configure environment-specific API URLs
4. Enable caching and compression

## Future Enhancements

1. **Advanced Features:**
   - Order placement integration
   - Real-time inventory updates
   - Video tutorial integration
   - AR visualization for installation

2. **AI Improvements:**
   - Fine-tuning on PartSelect data
   - Multi-turn conversation context
   - Sentiment analysis
   - Feedback learning

3. **Analytics:**
   - User interaction tracking
   - Popular queries analysis
   - Conversion tracking
   - Performance metrics

## License

MIT License - Feel free to use for educational or commercial purposes.

## Author

Created for Instalily case study evaluation.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review API documentation
3. Examine console logs
4. Verify environment configuration

## Switching Between Modes

### Enable Mock AI (Free Open-source)
1. Edit `backend/.env`
2. Set `USE_MOCK_AI=true`
3. Restart server
4. See: `Using MOCK AI Service (Free - No API calls)`

### Enable Real AI (Paid)
1. Edit `backend/.env`
2. Set `USE_MOCK_AI=false`
3. Ensure API key is set
4. Restart server
5. See: `API key loaded successfully`

## Learning Tool

The Mock AI is also a **learning resource**:
- See example responses in `mock-ai.service.ts`
- Understand intent classification logic
- Learn response formatting patterns
- Study entity extraction techniques

---

**Note:** Remember to add your DeepSeek API key to `backend/.env` before running the application!
