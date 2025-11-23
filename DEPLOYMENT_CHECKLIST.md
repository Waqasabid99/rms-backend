# Production Deployment Checklist

Use this checklist to ensure your Restaurant Management System is production-ready.

## Pre-Deployment

### Security

- [ ] Change default admin password from `Admin@123`
- [ ] Change default staff password from `Staff@123`
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Review and update Supabase RLS policies
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure secure CORS origins
- [ ] Remove any test/debug code
- [ ] Enable rate limiting on API endpoints
- [ ] Set up API key rotation schedule
- [ ] Configure security headers (already using Helmet)

### Environment Variables

Backend (.env):
- [ ] Set `NODE_ENV=production`
- [ ] Update `RESTAURANT_DB_URI` to production MongoDB
- [ ] Verify `SUPABASE_URL` points to production
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is production key
- [ ] Set strong `JWT_SECRET`
- [ ] Remove any development-only variables
- [ ] Add production-specific variables

Frontend (.env):
- [ ] Update `VITE_API_URL` to production API endpoint
- [ ] Verify all environment variables are prefixed with `VITE_`

### Database

- [ ] Backup production database
- [ ] Verify all migrations are applied
- [ ] Check database indexes are optimized
- [ ] Verify RLS policies are working
- [ ] Test database connection pooling
- [ ] Set up automated backups (daily recommended)
- [ ] Configure database monitoring

### Code Review

- [ ] Remove console.log statements
- [ ] Remove commented code
- [ ] Review error messages (no sensitive data exposed)
- [ ] Check for hardcoded credentials
- [ ] Verify all TODO comments are addressed
- [ ] Run linting checks
- [ ] Check for security vulnerabilities

## Build & Test

### Backend

```bash
cd backend

# Install dependencies
npm ci --production

# Run tests (if available)
npm test

# Check for vulnerabilities
npm audit

# Test build
npm start
```

- [ ] Backend builds successfully
- [ ] All tests pass
- [ ] No critical vulnerabilities
- [ ] Server starts without errors

### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Preview production build
npm run preview
```

- [ ] Frontend builds successfully
- [ ] No build warnings or errors
- [ ] Bundle size is acceptable
- [ ] Preview works correctly

## Deployment

### Backend Deployment

- [ ] Choose hosting platform (AWS, Heroku, DigitalOcean, etc.)
- [ ] Configure process manager (PM2 recommended)
- [ ] Set up environment variables on host
- [ ] Configure port and domain
- [ ] Set up SSL certificate
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Test API endpoints
- [ ] Verify database connection

**PM2 Setup (Recommended):**
```bash
npm install -g pm2
pm2 start index.js --name restaurant-api
pm2 startup
pm2 save
```

### Frontend Deployment

- [ ] Choose hosting platform (Vercel, Netlify, AWS S3, etc.)
- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up CDN (optional but recommended)
- [ ] Test all routes
- [ ] Verify API connectivity

**Common Platforms:**

Vercel:
```bash
npm install -g vercel
vercel --prod
```

Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Database Setup

MongoDB:
- [ ] Set up production MongoDB instance
- [ ] Configure connection string with authentication
- [ ] Enable encryption at rest
- [ ] Set up replication (recommended)
- [ ] Configure automatic backups

Supabase:
- [ ] Verify production Supabase project
- [ ] Update connection strings
- [ ] Check RLS policies
- [ ] Enable database backups
- [ ] Monitor database performance

## Post-Deployment

### Verification

- [ ] Test login with admin account
- [ ] Test login with staff account
- [ ] Verify role-based access control
- [ ] Test all CRUD operations
- [ ] Verify file upload (if applicable)
- [ ] Test email notifications (if applicable)
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Verify SSL certificate
- [ ] Check API response times

### Monitoring

- [ ] Set up application monitoring (New Relic, Datadog, etc.)
- [ ] Configure error tracking (Sentry, Rollbar, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up performance monitoring
- [ ] Configure alert notifications
- [ ] Monitor database performance

### Documentation

- [ ] Update API documentation URL
- [ ] Create admin user guide
- [ ] Create staff user guide
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review failed login attempts

### Weekly
- [ ] Review performance metrics
- [ ] Check database backups
- [ ] Review security alerts
- [ ] Monitor API usage

### Monthly
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Database optimization
- [ ] Clean up old logs
- [ ] Review user feedback

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Update documentation

## Rollback Plan

In case of deployment issues:

1. **Backend Rollback:**
   ```bash
   pm2 stop restaurant-api
   git checkout <previous-commit>
   npm install
   pm2 start restaurant-api
   ```

2. **Frontend Rollback:**
   - Revert to previous deployment on hosting platform
   - Or redeploy previous build

3. **Database Rollback:**
   - Restore from latest backup
   - Revert migrations if needed

## Security Hardening

### Backend
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Configure CORS properly
- [ ] Enable HTTP security headers
- [ ] Add input sanitization
- [ ] Implement request logging
- [ ] Set up intrusion detection

### Frontend
- [ ] Add Content Security Policy
- [ ] Enable HTTPS only
- [ ] Implement XSS protection
- [ ] Add CSRF tokens (if needed)
- [ ] Sanitize user inputs
- [ ] Implement secure cookies

### Database
- [ ] Enable encryption at rest
- [ ] Use encrypted connections
- [ ] Implement audit logging
- [ ] Regular security scans
- [ ] Principle of least privilege
- [ ] Regular password rotation

## Performance Optimization

### Backend
- [ ] Enable response compression
- [ ] Implement caching (Redis recommended)
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Configure connection pooling
- [ ] Enable CDN for static assets

### Frontend
- [ ] Minimize bundle size
- [ ] Enable code splitting
- [ ] Lazy load routes
- [ ] Optimize images
- [ ] Enable browser caching
- [ ] Use CDN for assets

## Compliance

- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent
- [ ] Data export functionality
- [ ] Data deletion functionality

## Disaster Recovery

- [ ] Document backup procedures
- [ ] Test restore procedures
- [ ] Create disaster recovery plan
- [ ] Identify critical systems
- [ ] Define RTO (Recovery Time Objective)
- [ ] Define RPO (Recovery Point Objective)
- [ ] Train team on recovery procedures

## Final Checks

Before going live:

- [ ] All items in this checklist completed
- [ ] Team trained on new system
- [ ] Support documentation ready
- [ ] Monitoring and alerts configured
- [ ] Backup systems tested
- [ ] Rollback plan documented
- [ ] Emergency contacts updated
- [ ] Stakeholders notified

## Go-Live

1. Schedule maintenance window
2. Notify users of deployment
3. Take final backup
4. Deploy backend
5. Deploy frontend
6. Run smoke tests
7. Monitor for issues
8. Be ready to rollback if needed

## Post-Launch

### First 24 Hours
- Monitor closely
- Watch error rates
- Check performance metrics
- Be available for issues

### First Week
- Gather user feedback
- Monitor usage patterns
- Address any issues
- Optimize performance

### First Month
- Review analytics
- Address user requests
- Plan improvements
- Schedule retrospective

---

## Support Contacts

Document your key contacts:

- **DevOps Lead:** [Name/Contact]
- **Backend Developer:** [Name/Contact]
- **Frontend Developer:** [Name/Contact]
- **Database Admin:** [Name/Contact]
- **Security Team:** [Name/Contact]
- **Hosting Provider:** [Contact/Support]

## Resources

- [SETUP.md](./SETUP.md) - Setup instructions
- [README.md](./README.md) - Project overview
- API Documentation: [Production URL]/api-docs
- Monitoring Dashboard: [URL]
- Error Tracking: [URL]

---

**Last Updated:** [Date]
**Deployment Version:** [Version]
**Deployed By:** [Name]
