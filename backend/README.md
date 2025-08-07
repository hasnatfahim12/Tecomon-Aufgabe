### 1. Backend setup

```bash
# Switch to the backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

> 💡 Example `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/widgets
NODE_ENV=development
WEATHER_API_URL=https://api.open-meteo.com/v1
CACHE_TTL_MINUTES=5
```
