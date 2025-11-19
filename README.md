# Ascend AI

**Privacy-First AI Career Coaching Platform**

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

### Quick Start

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

# View logs
make logs

# Stop services
make down
```

### Available Make Commands

```bash
make up         # Start all services
make down       # Stop all services
make build      # Build and start services
make logs       # View service logs
make init-minio # Initialize MinIO bucket (run after first 'make up')
```

## Project Structure

```
Ascend/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker-compose.yml # Service orchestration
├── Makefile          # Development commands
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
