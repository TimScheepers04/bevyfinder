# 🔒 Security Guide for BevyFinder

## Overview
This document outlines the security measures implemented in BevyFinder to protect against common web vulnerabilities.

## 🛡️ Security Features Implemented

### 1. **Content Security Policy (CSP)**
- Prevents XSS attacks by controlling resource loading
- Restricts script sources to trusted domains
- Blocks inline scripts and styles (with exceptions for necessary functionality)

### 2. **Security Headers**
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

### 3. **Input Validation & Sanitization**
- All user inputs are sanitized to remove HTML tags and dangerous characters
- Express-validator for comprehensive input validation
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Email normalization and validation

### 4. **Authentication & Authorization**
- JWT tokens with configurable expiration
- Password hashing with bcryptjs
- Account locking after failed login attempts
- Role-based access control (admin, user)
- Email verification requirement

### 5. **Rate Limiting**
- API rate limiting (100 requests per 15 minutes per IP)
- Authentication rate limiting (5 attempts per 15 minutes per IP)
- Configurable limits via environment variables

### 6. **CORS Configuration**
- Strict origin validation
- Development vs production environment handling
- Credentials support for authenticated requests

### 7. **Environment Security**
- Environment variable validation on startup
- JWT secret strength validation (32+ characters)
- MongoDB connection string validation
- Port number validation

## 🔧 Security Configuration

### Environment Variables
```bash
# Required for security
MONGODB_URI=mongodb://localhost:27017/bevyfinder
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRE=7d
NODE_ENV=production
PORT=3000

# Optional security settings
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://bevyfinder.com,https://www.bevyfinder.com
```

### Production Security Checklist
- [ ] Use HTTPS only
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Regularly update dependencies
- [ ] Monitor logs for suspicious activity
- [ ] Implement proper error handling
- [ ] Use secure MongoDB connection

## 🚨 Security Best Practices

### For Developers
1. **Never commit secrets** to version control
2. **Validate all inputs** before processing
3. **Use parameterized queries** to prevent injection
4. **Implement proper error handling** without exposing sensitive information
5. **Keep dependencies updated** regularly
6. **Use HTTPS** in production
7. **Implement logging** for security events

### For Deployment
1. **Use environment variables** for all configuration
2. **Enable HTTPS** with valid SSL certificates
3. **Configure firewall** rules appropriately
4. **Monitor application logs** for suspicious activity
5. **Regular security audits** of the codebase
6. **Backup data** regularly with encryption

## 🔍 Security Testing

### Manual Testing Checklist
- [ ] Test XSS prevention with script injection attempts
- [ ] Verify CSRF protection (if implemented)
- [ ] Test SQL injection prevention
- [ ] Verify rate limiting functionality
- [ ] Test authentication bypass attempts
- [ ] Verify input validation and sanitization
- [ ] Test authorization controls

### Automated Testing
```bash
# Run security tests
npm test

# Check for vulnerable dependencies
npm audit

# Fix security vulnerabilities
npm audit fix
```

## 📞 Security Contact

If you discover a security vulnerability, please:
1. **Do not** create a public issue
2. **Email** security@bevyfinder.com
3. **Include** detailed steps to reproduce
4. **Wait** for acknowledgment before public disclosure

## 🔄 Security Updates

This document is updated regularly as new security measures are implemented. Last updated: August 2024

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/) 