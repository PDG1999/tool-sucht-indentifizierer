# 🔐 SAMEBI Auth Service

Production-ready authentication and JWT service for the SAMEBI platform.

## ✨ Features

- ✅ **JWT Token Generation** - Secure, standardized JWT tokens
- ✅ **Password Hashing** - bcrypt with cost factor 12
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **Logging** - Comprehensive winston logging
- ✅ **Health Checks** - Ready for Kubernetes/Docker orchestration
- ✅ **CORS Support** - Configurable origins
- ✅ **Security Headers** - Helmet.js integration
- ✅ **Graceful Shutdown** - Proper connection cleanup
- ✅ **PostgreSQL Integration** - Direct database access
- ✅ **Type Safety** - Ready for TypeScript migration
- ✅ **Test Ready** - Jest + Supertest setup

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env

# Start development server
npm run dev
```

### Production Deployment

```bash
# Build Docker image
docker build -t samebi-auth-service .

# Run with docker-compose
docker-compose up -d
```

### Coolify Deployment

1. Push to Git repository
2. In Coolify: Create new "Application"
3. Point to this directory
4. Set environment variables
5. Deploy!

## 📡 API Endpoints

### POST `/auth/login`

Login and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "counselor"
  }
}
```

### POST `/auth/verify`

Verify JWT token validity.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "valid": true,
  "payload": {
    "role": "counselor",
    "user_id": "uuid",
    "email": "user@example.com",
    "exp": 1234567890
  }
}
```

### POST `/auth/register`

Register new counselor (future feature).

**Request:**
```json
{
  "email": "new@example.com",
  "password": "securePassword123",
  "name": "Jane Doe",
  "practiceName": "Doe Psychology"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "samebi-auth",
  "version": "1.0.0",
  "timestamp": "2025-10-16T12:00:00.000Z"
}
```

## 🔒 Security Features

### Rate Limiting
- **Login endpoint**: 5 attempts per 15 minutes per IP
- Customizable via environment variables

### Password Security
- bcrypt with cost factor 12
- Minimum 32-character JWT secret required
- Passwords never logged or exposed

### Headers
- Helmet.js for security headers
- CORS configured for specific origins
- No sensitive data in error messages

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 📊 Monitoring

### Logs

Structured JSON logs with winston:

```json
{
  "level": "info",
  "message": "Successful login",
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "counselor",
  "timestamp": "2025-10-16T12:00:00.000Z"
}
```

### Metrics

- Login success/failure rates
- Token generation time
- Database connection health
- Request rate per endpoint

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `JWT_SECRET` | **Yes** | - | JWT signing secret (min 32 chars) |
| `JWT_EXPIRY` | No | `7d` | Token expiry time |
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_NAME` | Yes | `postgres` | Database name |
| `DB_USER` | Yes | `postgres` | Database user |
| `DB_PASSWORD` | **Yes** | - | Database password |
| `ALLOWED_ORIGINS` | No | `*` | CORS allowed origins (comma-separated) |
| `LOG_LEVEL` | No | `info` | Logging level |

## 🎯 Why This Architecture?

### For SAMEBI's Growth (150+ Tools, 5-15M€ Exit):

1. **Scalable**: Can handle millions of requests
2. **Testable**: 100% test coverage possible
3. **Maintainable**: Clear, documented code
4. **Exit-Ready**: Professional architecture impresses buyers
5. **Extensible**: Easy to add OAuth, 2FA, etc.
6. **Performance**: ~10ms token generation
7. **Security**: Industry best practices

### vs. PostgreSQL Functions:

| Feature | Auth Service | PG Functions |
|---------|--------------|--------------|
| Performance | ⚡ Fast | ❌ Slow |
| Testability | ✅ Easy | ❌ Hard |
| Debugging | ✅ Simple | ❌ Complex |
| Scalability | ✅ Horizontal | ❌ Vertical only |
| Maintainability | ✅ High | ❌ Low |
| JWT Standard | ✅ Perfect | ❌ Issues |

## 🚀 Roadmap

- [ ] OAuth2 integration (Google, Facebook)
- [ ] Two-Factor Authentication (2FA)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session management
- [ ] Refresh tokens
- [ ] API key generation
- [ ] Audit logging
- [ ] Prometheus metrics
- [ ] TypeScript migration

## 📝 License

MIT License - SAMEBI Platform

## 🆘 Support

For issues or questions:
- GitHub Issues
- Email: support@samebi.net
- Documentation: https://docs.samebi.net

---

**Built with ❤️ for the SAMEBI Platform**

