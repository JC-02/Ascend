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

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git
- **Windows Users**: PowerShell (use `dev.ps1` script)
- **Mac/Linux Users**: Make (use `Makefile`)

### Quick Start (Windows - PowerShell)

```powershell
# Clone the repository
git clone <repository-url>
cd Ascend

# Copy environment template and configure
cp .env.template .env
# Edit .env with your configuration

# Build and start all services
.\dev.ps1 build

# Initialize MinIO bucket (first time only)
.\dev.ps1 init-minio

# Create initial database migration
.\dev.ps1 migrate-create -Msg "Initial migration: users, sessions, resumes"

# Run migrations
.\dev.ps1 migrate

# View logs
.\dev.ps1 logs backend

# Stop services
.\dev.ps1 down
```

### Quick Start (Mac/Linux)

```bash
# Clone the repository
git clone <repository-url>
cd Ascend

# Copy environment template and configure
cp .env.template .env
# Edit .env with your configuration

# Build and start all services
make build

# Initialize MinIO bucket (first time only)
make init-minio

# Create initial database migration
make migrate-create MSG="Initial migration: users, sessions, resumes"

# Run migrations
make migrate

# View logs
make logs

# Stop services
make down
```

### Available Commands

**Windows (PowerShell):**
```powershell
.\dev.ps1 up              # Start all services
.\dev.ps1 down            # Stop all services
.\dev.ps1 build           # Build and start services
.\dev.ps1 logs [service]  # View service logs
.\dev.ps1 init-minio      # Initialize MinIO bucket
.\dev.ps1 test-services   # Test all infrastructure services
.\dev.ps1 migrate         # Run database migrations
.\dev.ps1 migrate-create -Msg "description"  # Create new migration
.\dev.ps1 migrate-down    # Rollback last migration
```

**Mac/Linux (Make):**
```bash
make up         # Start all services
make down       # Stop all services
make build      # Build and start services
make logs       # View service logs
make init-minio # Initialize MinIO bucket
make test-services  # Test all infrastructure services
make migrate    # Run database migrations
make migrate-create MSG="description"  # Create new migration
make migrate-down  # Rollback last migration
```

## Project Structure

```
Ascend/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Configuration
│   │   ├── db/       # Database models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   └── alembic/      # Database migrations
├── docker-compose.yml # Service orchestration
├── Makefile          # Development commands (Mac/Linux)
├── dev.ps1           # Development commands (Windows)
├── .env.template     # Environment variable template
└── README.md         # This file
```

## Development

All services run in Docker containers and can be started with a single command. The application will be available at:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **MinIO Console:** http://localhost:9001

## License

[License information to be added]
