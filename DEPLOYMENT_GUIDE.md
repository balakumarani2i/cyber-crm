# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- Git repository access
- Domain name (optional)
- Environment variables configured

## Backend Deployment Options

### Option 1: Render (Free & Recommended)

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub account

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select backend folder
   - Configure:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Node Version**: 18

3. **Configure Environment Variables**
   ```
   DATABASE_URL = file:./dev.db
   JWT_SECRET = cyber-crm-super-secret-jwt-key-2024-production-do-not-share
   NODE_ENV = production
   PORT = 10000
   ```

4. **Database Setup**
   - Add build command: `npm install && npm run db:generate && npm run db:push && npm run build`

### Option 2: Railway Deployment

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend directory
   cd backend
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   ```

3. **Configure Environment Variables**
   ```bash
   # Set environment variables in Railway dashboard or use CLI
   railway variables
   
   railway run npm run db:push
   railway run npm run db:seed
   ```

### Option 3: Cyclic (Free Alternative)

1. **Create Cyclic Account**
   - Visit [cyclic.sh](https://cyclic.sh)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "Deploy Now"
   - Connect GitHub repository
   - Select backend folder
   - Auto-deploys on git push

3. **Configure Environment Variables**
   ```
   DATABASE_URL = file:./dev.db
   JWT_SECRET = cyber-crm-super-secret-jwt-key-2024-production-do-not-share
   NODE_ENV = production
   ```

### Option 4: Koyeb (Free Tier)

1. **Create Koyeb Account**
   - Visit [koyeb.com](https://koyeb.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Create new app
   - Connect GitHub repository
   - Configure build settings

### Option 5: Heroku (Limited Free)

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-crm-backend
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set DATABASE_URL="postgresql://..."
   heroku config:set JWT_SECRET="your-super-secret-jwt-key"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Frontend Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variable:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app/api`)

4. **Update API Configuration**
   ```typescript
   // src/utils/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

### Option 2: Netlify Deployment

1. **Build the Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - In Netlify dashboard, go to Site Settings > Environment Variables
   - Add `VITE_API_URL` with your backend URL

## Database Migration (Production)

### For PostgreSQL (Recommended for Production)

1. **Update Database URL**
   ```bash
   # Railway
   railway variables set DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Heroku
   heroku config:set DATABASE_URL="postgresql://user:password@host:port/database"
   ```

2. **Update Prisma Schema**
   ```prisma
   // prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
   }
   
   datasource db {
     provider = "postgresql"  // Changed from sqlite
     url      = env("DATABASE_URL")
   }
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run db:seed
   ```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://..."  # PostgreSQL for production

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV="production"

# CORS
FRONTEND_URL="https://your-frontend-domain.com"
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL="https://your-backend-domain.com/api"
```

## SSL/HTTPS Configuration

### Automatic SSL (Recommended)
- **Vercel**: Automatic SSL certificates
- **Netlify**: Automatic SSL certificates
- **Railway**: Automatic SSL certificates

### Custom Domain Setup

1. **Add Custom Domain**
   - In your deployment platform dashboard
   - Add your domain name
   - Follow DNS configuration instructions

2. **Update CORS Configuration**
   ```typescript
   // backend/src/server.ts
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-custom-domain.com'
     ],
     credentials: true
   }));
   ```

## Performance Optimizations

### Backend Optimizations
```typescript
// Add compression middleware
import compression from 'compression';
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

### Frontend Optimizations
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@headlessui/react']
        }
      }
    }
  }
});
```

## Monitoring and Logging

### Backend Monitoring
```typescript
// Add request logging
import morgan from 'morgan';
app.use(morgan('combined'));

// Add error tracking
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  // Add error tracking service here (e.g., Sentry)
  res.status(500).json({ error: 'Internal server error' });
});
```

### Health Check Endpoint
```typescript
// Add health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Security Checklist

### Backend Security
- ✅ JWT secret is secure and environment-specific
- ✅ CORS is configured for production domains only
- ✅ Rate limiting is enabled
- ✅ Input validation with Zod
- ✅ Helmet middleware for security headers
- ✅ HTTPS enforced in production

### Frontend Security
- ✅ API URLs use HTTPS
- ✅ No sensitive data in client-side code
- ✅ Content Security Policy headers
- ✅ XSS protection enabled

## Backup Strategy

### Database Backups
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups
- Set up daily database backups
- Store backups in cloud storage (AWS S3, Google Cloud)
- Test restore procedures regularly

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check frontend URL in backend CORS configuration
   - Verify environment variables are set correctly

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Ensure migrations are run

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify values don't contain special characters

### Debug Commands
```bash
# Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET

# Test database connection
npx prisma db pull

# Check API health
curl https://your-backend-url.com/health

# Test frontend build
npm run build
npm run preview
```

## Rollback Strategy

### Quick Rollback
1. **Vercel**: Use deployment history to rollback
2. **Railway**: Redeploy previous version
3. **Database**: Restore from backup if needed

### Gradual Rollback
1. Keep previous version running
2. Update DNS to point to previous version
3. Monitor for issues
4. Complete rollback if necessary

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] User authentication works
- [ ] All CRUD operations function
- [ ] Database connections are stable
- [ ] SSL certificates are active
- [ ] Monitoring is configured
- [ ] Backups are scheduled
- [ ] Error tracking is working
- [ ] Performance metrics are acceptable
- [ ] Security headers are present

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor application performance
- Review error logs weekly
- Update dependencies monthly
- Test backup/restore procedures
- Review security configurations
- Monitor SSL certificate expiration

### Emergency Contacts
- Deployment platform support
- Database provider support
- Domain registrar support
- SSL certificate provider

## Cost Optimization

### Free Tier Limits
- **Render**: 750 hours/month (always-on with paid plan)
- **Cyclic**: Unlimited deployments, 1GB storage
- **Koyeb**: 512MB RAM, 2.5GB transfer/month
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month

### Scaling Considerations
- Monitor usage against free tier limits
- Plan for paid tiers when approaching limits
- Optimize database queries to reduce costs
- Implement caching to reduce API calls