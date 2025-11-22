# Ascend AI

**Privacy-First AI Career Coaching Platform**

## ⚠️ IMPORTANT SECURITY NOTICE

**Before running this project:**
1. Copy `.env.template` to `.env`
2. Replace ALL placeholder values with your own credentials
3. **NEVER commit the `.env` file** - it's already in `.gitignore`
4. If you've accidentally committed credentials, rotate them immediately

---

## Project Overview

Ascend AI is a privacy-first, AI-powered career coaching platform that provides evidence-backed feedback on resumes and mock interviews. It serves as a personal, 24/7 career coach that analyzes resumes against job descriptions, generates tailored mock interviews, and uses an advanced AI engine to provide immediate, in-depth feedback on both the content and delivery of practice answers.

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript and App Router
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for server state management
- **NextAuth.js** for authentication

### Backend
- **FastAPI** (Python) with async/await
- **PostgreSQL** with pgvector for embeddings
- **Redis** for caching and message queue
- **Celery** for background task processing
- **MinIO** for S3-compatible object storage

### AI Layer
- **LangChain** for agent orchestration
- **OpenAI GPT-4o** / **Local LLM** (Llama 3/Mistral)
- **Whisper** for speech-to-text transcription
- **RAG** (Retrieval-Augmented Generation) for evidence-backed feedback

---

## Getting Started

### Prerequisites
- **Docker** and **Docker Compose** (v2.0+)
- **Git**
- **Windows Users**: PowerShell (use `dev.ps1` script)
- **Mac/Linux Users**: Make (use `Makefile`)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Ascend
```

### Step 2: Configure Environment Variables

```bash
# Copy the environment template
cp .env.template .env
```

Edit the `.env` file and configure the following:

#### Required Configuration

**Database & Infrastructure** (defaults work for local development):
```bash
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/ascend_db
REDIS_URL=redis://redis:6379/0
```

**MinIO S3 Storage** (defaults work for local development):
```bash
S3_ACCESS_KEY_ID=minio_access_key
S3_SECRET_ACCESS_KEY=minio_secret_key
S3_BUCKET_NAME=ascend-resumes
```

**NextAuth Secret** (REQUIRED - generate a secure random string):
```bash
# Generate using one of these commands:
# openssl rand -base64 32
# OR
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**OAuth Providers** (REQUIRED for authentication):
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Step 3: Set Up OAuth Authentication

Authentication requires OAuth credentials from Google and GitHub. Follow these steps:

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **OAuth consent screen**
   - Select **External** user type
   - Fill in app name: `Ascend AI`
   - Add your email for support and developer contact
   - Click **Save and Continue** through all steps
4. Navigate to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Select **Web application**
7. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copy the **Client ID** and **Client Secret** to your `.env` file

#### GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the application details:
   - **Application name**: `Ascend AI`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Click **Generate a new client secret**
6. Copy the **Client ID** and **Client Secret** to your `.env` file

⚠️ **Important**: The client secret is only shown once. Save it immediately!

### Step 4: Build and Run

**Windows (PowerShell):**
```powershell
# Build and start all services (one command!)
.\dev.ps1 build

# Run database migrations
.\dev.ps1 migrate

# View logs
.\dev.ps1 logs

# Stop services
.\dev.ps1 down
```

**Mac/Linux:**
```bash
# Build and start all services (one command!)
make build

# Run database migrations
make migrate

# View logs
make logs

# Stop services
make down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (login: minio_access_key / minio_secret_key)

### Step 5: Test the Application

1. Open http://localhost:3000
2. Click **Get Started**
3. Sign in with Google or GitHub
4. You'll be redirected to the dashboard

---

## Available Commands

### Windows (PowerShell)

```powershell
.\dev.ps1 up              # Start all services
.\dev.ps1 down            # Stop all services
.\dev.ps1 build           # Build and start services
.\dev.ps1 logs [service]  # View service logs
.\dev.ps1 test-services   # Test all infrastructure services
.\dev.ps1 migrate         # Run database migrations
.\dev.ps1 migrate-create -Msg "description"  # Create new migration
.\dev.ps1 migrate-down    # Rollback last migration
```

### Mac/Linux (Make)

```bash
make up                   # Start all services
make down                 # Stop all services
make build                # Build and start services
make logs                 # View service logs
make test-services        # Test all infrastructure services
make migrate              # Run database migrations
make migrate-create MSG="description"  # Create new migration
make migrate-down         # Rollback last migration
```

---

## Project Structure

```
Ascend/
├── frontend/              # Next.js 14 application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and configs
│   │   └── stores/       # State management
│   └── Dockerfile        # Frontend container
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Configuration & auth
│   │   ├── db/           # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── workers/      # Celery tasks
│   ├── alembic/          # Database migrations
│   ├── tests/            # Test suite
│   └── Dockerfile        # Backend container
├── docker-compose.yml     # Service orchestration
├── Makefile              # Development commands (Mac/Linux)
├── dev.ps1               # Development commands (Windows)
├── .env.template         # Environment variable template
└── README.md             # This file
```

---

## Development Workflow

### Running Tests

**Backend Tests:**
```bash
# Run all tests
docker compose exec backend pytest

# Run with coverage
docker compose exec backend pytest --cov=app --cov-report=html

# Run specific test file
docker compose exec backend pytest tests/api/v1/test_auth.py -v
```

**Frontend Tests:**
```bash
# Run tests (when implemented)
cd frontend
npm test
```

### Database Migrations

**Create a new migration:**
```bash
# Mac/Linux
make migrate-create MSG="Add new table"

# Windows
.\dev.ps1 migrate-create -Msg "Add new table"
```

**Apply migrations:**
```bash
# Mac/Linux
make migrate

# Windows
.\dev.ps1 migrate
```

**Rollback last migration:**
```bash
# Mac/Linux
make migrate-down

# Windows
.\dev.ps1 migrate-down
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Troubleshooting

### OAuth "Redirect URI mismatch" Error

**Problem**: OAuth provider rejects the redirect URL

**Solution**: 
- Verify the callback URL exactly matches:
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`
- Check for trailing slashes (should not have any)
- Ensure protocol is `http://` for localhost (not `https://`)

### "Invalid client" Error

**Problem**: Client ID or Secret is incorrect

**Solution**:
- Double-check your `.env` file has the correct values
- Ensure there are no extra spaces or quotes
- Regenerate the client secret if needed

### Services Not Starting

**Problem**: Docker containers fail to start

**Solution**:
```bash
# Check service status
docker compose ps

# View error logs
docker compose logs backend
docker compose logs frontend

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

### Database Connection Issues

**Problem**: Backend can't connect to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is healthy
docker compose ps postgres

# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres
```

---

## Production Deployment

### Environment Variables for Production

Update your production `.env` file:

```bash
# Use production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1

# Use strong, unique secrets
NEXTAUTH_SECRET=<generate-new-secret-for-production>

# Update OAuth redirect URLs in Google/GitHub consoles
# Google: https://yourdomain.com/api/auth/callback/google
# GitHub: https://yourdomain.com/api/auth/callback/github
```

### Security Checklist

- [ ] Use HTTPS in production (never HTTP)
- [ ] Rotate all secrets and API keys
- [ ] Use different OAuth apps for production
- [ ] Enable CORS only for your domain
- [ ] Set up proper database backups
- [ ] Configure rate limiting appropriately
- [ ] Review and update security headers
- [ ] Enable monitoring and logging

---

## Contributing

This is a personal portfolio project. Contributions are not currently accepted.

---

## License

**Copyright © 2025 Jordan. All Rights Reserved.**

This project is proprietary software created for portfolio and demonstration purposes.

### Terms of Use

**Permitted:**
- ✅ Viewing the source code for educational purposes
- ✅ Running the application locally for personal evaluation
- ✅ Referencing the architecture and design patterns in your own projects

**Prohibited:**
- ❌ Commercial use of any kind
- ❌ Redistribution or republishing of the code
- ❌ Creating derivative works or forks
- ❌ Using the code in production environments
- ❌ Removing or modifying copyright notices

**Disclaimer:**
This software is provided "as is" without warranty of any kind, express or implied. The author is not liable for any damages arising from the use of this software.

For licensing inquiries or permissions beyond this scope, please contact the repository owner.

---

## Acknowledgments

Built with modern web technologies and best practices:
- Next.js, React, TypeScript
- FastAPI, Python, PostgreSQL
- Docker, Redis, MinIO
- OpenAI, LangChain, Whisper

---

**Questions or Issues?** Please open an issue on the GitHub repository.
