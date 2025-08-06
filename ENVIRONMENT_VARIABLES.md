# Environment Variables Configuration

## Backend Environment Variables

### For Railway Deployment
Set these variables in your Railway dashboard (Variables tab):

```
DATABASE_URL = "file:./dev.db"
JWT_SECRET = "cyber-crm-super-secret-jwt-key-2024-production-do-not-share"
NODE_ENV = "production"
PORT = "5000"
```

### For Heroku Deployment
```bash
heroku config:set DATABASE_URL="file:./dev.db"
heroku config:set JWT_SECRET="cyber-crm-super-secret-jwt-key-2024-production-do-not-share"
heroku config:set NODE_ENV="production"
heroku config:set PORT="5000"
```

### For Local Development (.env file in backend folder)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cyber-crm-super-secret-jwt-key-2024-production-do-not-share"
NODE_ENV="development"
PORT=5000
```

## Frontend Environment Variables

### For Vercel Deployment
Set in Vercel dashboard (Environment Variables section):

```
VITE_API_URL = "https://your-railway-app-name.up.railway.app/api"
```

### For Netlify Deployment
Set in Netlify dashboard (Site Settings > Environment Variables):

```
VITE_API_URL = "https://your-railway-app-name.up.railway.app/api"
```

### For Local Development (.env file in frontend folder)
```env
VITE_API_URL="http://localhost:5000/api"
```

## Production Database (PostgreSQL)

If you want to use PostgreSQL in production instead of SQLite:

### Railway with PostgreSQL
1. Add PostgreSQL service in Railway dashboard
2. Use the provided DATABASE_URL:
```
DATABASE_URL = "postgresql://postgres:password@host:port/database"
```

### Heroku with PostgreSQL
```bash
# Add Heroku Postgres addon
heroku addons:create heroku-postgresql:mini

# The DATABASE_URL will be automatically set
```

## Security Notes

⚠️ **Important Security Guidelines:**

1. **JWT_SECRET**: 
   - Use a strong, unique secret for production
   - Never commit secrets to version control
   - Generate using: `openssl rand -base64 32`

2. **Database URLs**:
   - Use environment-specific database URLs
   - Never hardcode database credentials

3. **API URLs**:
   - Use HTTPS in production
   - Match your actual deployment URLs

## Quick Setup Commands

### Generate Secure JWT Secret
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Check Current Environment Variables
```bash
# Railway
railway variables

# Heroku  
heroku config

# Local
cat .env
```

## Example Complete Setup

### 1. Backend .env (for local development)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cyber-crm-super-secret-jwt-key-2024-production-do-not-share"
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### 2. Frontend .env (for local development)
```env
VITE_API_URL="http://localhost:5000/api"
```

### 3. Production Variables (Railway Dashboard)
```
DATABASE_URL = "file:./dev.db"
JWT_SECRET = "cyber-crm-super-secret-jwt-key-2024-production-do-not-share"
NODE_ENV = "production"
PORT = "5000"
```

### 4. Frontend Production (Vercel Dashboard)
```
VITE_API_URL = "https://your-app-name.up.railway.app/api"
```

## Troubleshooting

### Common Issues:
1. **JWT_SECRET not set**: Authentication will fail
2. **Wrong API_URL**: Frontend can't connect to backend
3. **DATABASE_URL format**: Database connection errors
4. **Missing NODE_ENV**: App may not run in production mode

### Verification Commands:
```bash
# Test backend health
curl https://your-backend-url.com/health

# Test frontend build
npm run build && npm run preview
```