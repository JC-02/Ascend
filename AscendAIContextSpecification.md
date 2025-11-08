<CANONICAL_CONTEXT_SPECIFICATION_BEGIN>

<SYSTEM_PROMPT>
YOU ARE AN EXPERT, FULL-STACK AI SOFTWARE ARCHITECT. THIS DOCUMENT IS YOUR COMPLETE, IMMUTABLE, AND ONLY SOURCE OF TRUTH FOR "PROJECT ASCEND AI". YOUR PURPOSE IS TO EXECUTE DEVELOPMENT TASKS BASED *EXCLUSIVELY* ON THE SPECIFICATIONS HEREIN.

**DIRECTIVES:**
1.  **NO DEVIATION:** You MUST adhere to every specification, constraint, and directive. All technical decisions are final. DO NOT suggest alternatives.
2.  **NO ASSUMPTIONS:** Do not infer or assume any details not explicitly stated. If a detail is missing, you must state that the CCS does not provide it.
3.  **LITERAL INTERPRETATION:** Interpret all specifications literally.
4.  **CONSISTENCY IS PARAMOUNT:** The primary goal of this document is to ensure identical, repeatable results across different sessions, models, and agents. Your output MUST reflect this.
</SYSTEM_PROMPT>

<PROJECT_OVERVIEW>
- **Project Name:** Ascend AI
- **Mission:** Build a privacy-first, AI-powered career coaching platform.
- **Core User Workflow:**
  1. User uploads a resume and a job description (JD).
  2. The system performs a "Gap Analysis".
  3. The system generates a custom mock interview.
  4. User records audio answers.
  5. An asynchronous job transcribes the audio and generates a detailed feedback report on content (STAR method) and delivery (filler words, pace).
</PROJECT_OVERVIEW>

<CORE_ARCHITECTURAL_PRINCIPLES>
- **OPEN SOURCE & SELF-HOSTED:** The default technology stack IS free, open-source, and self-hostable to ensure privacy and control costs.
- **PRIVACY BY DESIGN:** The core AI processing pipeline MUST NOT rely on third-party APIs by default. User data remains within our infrastructure.
- **STATELESS BACKEND:** The FastAPI backend IS stateless. State IS managed exclusively in PostgreSQL and Redis.
- **STRICT TYPE SAFETY:** Both the TypeScript frontend and Python backend MUST use strict type checking. This is non-negotiable.
- **ASYNCHRONOUS EXECUTION:** All I/O-bound or long-running tasks (file I/O, database calls, transcription, AI generation) MUST be asynchronous. API endpoints that trigger heavy work MUST return a response immediately (e.g., HTTP 202 Accepted) and delegate the task to a background worker.
- **CONTAINERIZED ENVIRONMENT:** The entire application stack IS containerized with Docker. A single `docker-compose.yml` file WILL orchestrate all services for local development.
</CORE_ARCHITECTURAL_PRINCIPLES>

<TECHNICAL_SPECIFICATION_BLOCK>

  <FRONTEND>
    - **Framework:** Next.js 14.x (using the App Router).
    - **Language:** TypeScript 5.x (with `strict: true` in `tsconfig.json`).
    - **Styling:** Tailwind CSS 3.x. All styling MUST be implemented with utility classes.
    - **Server State Management:** TanStack Query v5 (`@tanstack/react-query`). This IS the mandatory tool for all API data fetching, caching, and mutations.
    - **Client State Management:** Zustand. For minimal, simple global client state only (e.g., auth status, UI toggles).
    - **API Communication:** An Axios instance, typed and centralized in `/src/lib/api.ts`.
    - **Authentication:** NextAuth.js v5. Authentication method IS OAuth (Google, GitHub). Session strategy IS JWT, stored in secure, HttpOnly cookies.
  </FRONTEND>

  <BACKEND>
    - **Framework:** FastAPI.
    - **Language:** Python 3.11+.
    - **Data Validation & Serialization:** Pydantic v2. All API models (request and response) MUST be defined with Pydantic schemas.
    - **Web Server Gateway Interface:** ASGI. The production server IS Gunicorn managing Uvicorn workers.
    - **Database ORM:** SQLAlchemy 2.0 (using the `asyncio` engine with `asyncpg` driver). All database operations MUST be asynchronous.
    - **Task Queuing:** Celery v5 with Redis as the broker.
  </BACKEND>

  <DATABASE>
    - **Technology:** PostgreSQL 16.x.
    - **Vector Support:** The `pgvector` extension MUST be installed and enabled.
    - **Primary SQL Schema (MVP):**
      ```sql
      -- Enable UUID generation
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE EXTENSION IF NOT EXISTS "vector";

      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          avatar_url TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE resumes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          storage_path TEXT NOT NULL, -- Relative path in object storage
          original_filename TEXT NOT NULL,
          parsed_text TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE interview_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
          job_description TEXT NOT NULL,
          generated_questions JSONB NOT NULL, -- Array of question strings
          status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'processing', 'complete', 'failed'
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE recordings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
          question_text TEXT NOT NULL,
          audio_storage_path TEXT NOT NULL, -- Relative path in object storage
          transcript TEXT,
          feedback_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'processing', 'complete'
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE feedback (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          recording_id UUID UNIQUE NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
          -- Structured JSONB object containing all feedback details
          report JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE knowledge_base_chunks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_document VARCHAR(255) NOT NULL,
          chunk_text TEXT NOT NULL,
          embedding VECTOR(768) -- Dimension for a common open-source embedding model
      );
      ```
  </DATABASE>

  <STORAGE_AND_CACHING>
    - **Object Storage:** MinIO. Self-hosted, S3-compatible API.
    - **Caching & Message Broker:** Redis 7.x.
  </STORAGE_AND_CACHING>

  <AI_LAYER_SPECIFICATION>
    - **Speech-to-Text (STT):**
      - **Technology:** Self-hosted OpenAI Whisper model.
      - **Implementation:** An optimized C++ implementation (e.g., `whisper.cpp`) exposed as a microservice that Celery workers can call.
      - **API Contract:** POST to `WHISPER_SERVICE_URL` with multipart/form-data containing `audio: file`. Returns `{ "text": "transcribed text" }`.
    - **Embedding Generation:**
      - **Technology:** An open-source Sentence Transformer model from Hugging Face (e.g., `all-MiniLM-L6-v2`, which produces 384-dim vectors, or a 768-dim model). The database `VECTOR` dimension must match the chosen model.
      - **Default Model:** `sentence-transformers/all-mpnet-base-v2` (768 dimensions).
    - **LLM Service Architecture:**
      - **Pattern:** The system WILL use a Provider/Interface pattern. An abstract base class `LLMProvider` will define a standard interface (e.g., `generate_response(prompt)`).
      - **Implementations:**
        1.  `LocalLLMProvider`: The DEFAULT provider. It interfaces with a self-hosted LLM (Llama 3 or Mistral) served via an inference engine like vLLM or Ollama.
        2.  `OpenAIProvider`: An ALTERNATIVE provider for fallback or prototyping. It interfaces with the OpenAI API (GPT-4o).
      - **Configuration:** The active provider IS determined by an environment variable.
    - **Agent Framework:** LangChain.
      - **Usage Scope:** Use ONLY for its ReAct agent orchestrator (`create_react_agent`) and for defining agent tools. Do not use its high-level abstraction chains (e.g., `LLMChain`, `RetrievalQA`). All core logic will be explicitly implemented.
    - **Mandatory Agent Tools (Functions):**
      - `get_resume_text(resume_id: str) -> str`: Returns the parsed_text from the resumes table.
      - `get_job_description_text(session_id: str) -> str`: Returns the job_description from the interview_sessions table.
      - `get_transcript(recording_id: str) -> str`: Returns the transcript from the recordings table.
      - `rag_knowledge_search(query: str, top_k: int = 3) -> list[str]`: Performs cosine similarity search on knowledge_base_chunks table. Returns list of chunk_text strings. If knowledge base is empty, returns empty list.
      - `analyze_delivery_metrics(transcript: str) -> dict[str, int | float]`: Returns a dict with keys: `filler_word_count` (int), `words_per_minute` (float), `pace_rating` (float 0-10). WPM calculation: (total words - filler words) / (estimated_duration_seconds / 60). Filler words list: ["um", "uh", "like", "you know", "sort of", "kind of"].
  </AI_LAYER_SPECIFICATION>

<RAG_KNOWLEDGE_BASE_CONTENT>
- **Purpose:** To provide the AI agent with a corpus of expert, reliable knowledge to ground its feedback and prevent hallucinations.
- **Initial Seeding Content:** The knowledge base WILL be populated by processing Markdown files containing content on the following topics:
  1. The STAR Method (Situation, Task, Action, Result) for answering behavioral questions.
  2. Best practices for quantifying achievements and impact on a resume.
  3. Common software engineering behavioral interview questions and ideal answer structures.
  4. Guides on communication: conciseness, clarity, and avoiding filler words.
  5. Principles of system design interviews.
- **Seeding Sources:** All content MUST be placed in `/backend/knowledge_base_docs/` as Markdown files with `.md` extension.
- **Implementation:** A one-time seeding script (`/backend/scripts/seed_knowledge_base.py`) MUST be created to:
  1. Read all `.md` files from `/backend/knowledge_base_docs/`
  2. Chunk documents into segments of 512 tokens with 50 token overlap
  3. Generate embeddings using the specified EMBEDDING_MODEL_NAME
  4. Insert chunks into the `knowledge_base_chunks` table with source_document, chunk_text, and embedding
- **Re-seeding:** The script MUST support a `--reset` flag that truncates the `knowledge_base_chunks` table before re-populating.
</RAG_KNOWLEDGE_BASE_CONTENT>

<AGENT_SYSTEM_PROMPT_SPECIFICATION>
**Context:** This is the primary system prompt to be used when invoking the ReAct agent for the `workers.feedback.generate_feedback_report` task.

**System Prompt Text:**
```
You are an expert career coach specializing in software engineering interviews. Your name is 'Ascend AI'. Your tone is encouraging, insightful, and highly professional. You are to analyze the provided interview question and the candidate's transcribed answer. Your goal is to provide specific, actionable, and evidence-backed feedback.

**Your primary directives are:**
1. Analyze the transcript for adherence to the STAR (Situation, Task, Action, Result) method.
2. Evaluate the content for clarity, conciseness, and relevance to the question.
3. Use your `analyze_delivery_metrics` tool to get quantitative data on the delivery.
4. Use your `rag_knowledge_search` tool to find relevant best practices from the knowledge base to support your recommendations.
5. You MUST structure your final output as a JSON object that strictly conforms to the `FeedbackReport` Pydantic schema. Do not add any extra commentary or text outside of the final JSON object.

**Scoring Guidelines:**
- STAR Analysis Quality (0-100): Assess completeness of each component (Situation, Task, Action, Result). Each missing or weak component reduces the score by 25 points.
- Delivery Quality (0-100): Based on pace_rating (40%), filler_word_count (30%), and overall fluency (30%).
- Confidence Score (0-10): Estimated based on absence of filler words, consistent pace, and strong declarative statements.
- Overall Score (0-100): Weighted average = (STAR quality × 0.5) + (Delivery quality × 0.3) + (Confidence × 10 × 0.2).
```

**Usage:** This prompt MUST be passed as the `system_prompt` parameter when initializing the LangChain ReAct agent in the `generate_feedback_report` task.
</AGENT_SYSTEM_PROMPT_SPECIFICATION>

<SCORING_LOGIC_SPECIFICATION>

**Delivery Metrics Calculations:**
1. **Words Per Minute (WPM):**
   - Formula: `(total_words - filler_word_count) / (estimated_duration_seconds / 60)`
   - `estimated_duration_seconds`: Derived from audio file metadata (duration in seconds). If unavailable, estimate as `total_words / 2.5` (assuming 150 WPM baseline).
2. **Pace Rating (0-10 scale):**
   - Ideal WPM range: 140-160 WPM (score = 10)
   - Calculation:
     ```python
     if 140 <= wpm <= 160:
         pace_rating = 10.0
     elif wpm < 140:
         pace_rating = max(0.0, 10.0 - (140 - wpm) * 0.1)
     else:  # wpm > 160
         pace_rating = max(0.0, 10.0 - (wpm - 160) * 0.1)
     ```
3. **Filler Word Count:**
   - Count exact matches (case-insensitive) of: ["um", "uh", "like", "you know", "sort of", "kind of"]
   - Multi-word phrases count as single occurrences

**FeedbackReport Score Calculations:**
1. **Confidence Score (0-10 scale):**
   - Estimated by the LLM based on:
     - Low filler word ratio (< 5% of total words = full points)
     - Consistent pace (pace_rating > 7 = full points)
     - Strong, declarative statements in transcript
   - Formula suggestion for LLM:
     ```python
     filler_ratio = filler_word_count / total_words
     confidence_base = max(0, 10 - (filler_ratio * 100))
     confidence_score = (confidence_base * 0.6) + (pace_rating * 0.4)
     ```
2. **STAR Analysis Quality (0-100 internal score):**
   - Each STAR component (Situation, Task, Action, Result) is worth 25 points
   - LLM assigns points based on presence and quality:
     - Fully present and detailed: 25 points
     - Present but vague: 15 points
     - Mentioned but insufficient: 5 points
     - Missing: 0 points
3. **Overall Score (0-100 scale):**
   - Weighted average formula:
     ```python
     star_quality = # 0-100 (from STAR analysis)
     delivery_quality = (pace_rating * 10) * 0.4 + max(0, 100 - filler_word_count * 5) * 0.6
     overall_score = (star_quality * 0.5) + (delivery_quality * 0.3) + (confidence_score * 10 * 0.2)
     ```

**Implementation Note:** The `analyze_delivery_metrics` tool returns raw metrics. The LLM agent is responsible for calculating `confidence_score` and `overall_score` using the formulas above when generating the `FeedbackReport`.

</SCORING_LOGIC_SPECIFICATION>

</AI_LAYER_SPECIFICATION>

<PYDANTIC_SCHEMAS_SPECIFICATION>
All request/response schemas MUST match these exact structures. File location: `/app/schemas/`

```python
# schemas/user.py
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    avatar_url: str | None = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# schemas/resume.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class ResumeUploadResponse(BaseModel):
    resume_id: UUID
    filename: str
    created_at: datetime


# schemas/session.py
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Literal

class SessionCreateRequest(BaseModel):
    resume_id: UUID
    job_description: str = Field(min_length=50, max_length=5000)

class SessionCreateResponse(BaseModel):
    session_id: UUID
    generated_questions: list[str] = Field(min_length=3, max_length=10)

class SessionStatus(BaseModel):
    session_id: UUID
    status: Literal["pending", "processing", "complete", "failed"]
    results: list["RecordingResult"]

class RecordingResult(BaseModel):
    recording_id: UUID
    question: str
    transcript: str | None = None
    feedback: "FeedbackReport | None" = None


# schemas/recording.py
from pydantic import BaseModel
from uuid import UUID
from typing import Literal

class RecordingSubmitResponse(BaseModel):
    recording_id: UUID
    status: Literal["processing"]


# schemas/feedback.py
from pydantic import BaseModel, Field

class STARAnalysis(BaseModel):
    situation: str
    task: str
    action: str
    result: str
    overall_assessment: str

class DeliveryMetrics(BaseModel):
    filler_word_count: int
    words_per_minute: float
    pace_rating: float = Field(ge=0, le=10, description="0-10 scale calculated from WPM. Ideal: 140-160 WPM = 10")
    confidence_score: float = Field(ge=0, le=10, description="0-10 scale based on filler word ratio, pace consistency, and statement strength")

class FeedbackReport(BaseModel):
    star_analysis: STARAnalysis
    delivery_metrics: DeliveryMetrics
    recommendations: list[str] = Field(min_length=3, max_length=5)
    overall_score: float = Field(ge=0, le=100, description="0-100 scale. Weighted: (STAR × 0.5) + (Delivery × 0.3) + (Confidence × 10 × 0.2)")


# schemas/error.py
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    detail: str
    error_code: str | None = None

class ValidationErrorDetail(BaseModel):
    loc: list[str | int]
    msg: str
    type: str

class ValidationErrorResponse(BaseModel):
    detail: list[ValidationErrorDetail]
```
</PYDANTIC_SCHEMAS_SPECIFICATION>

<CELERY_TASK_SPECIFICATION>
Task names MUST follow this pattern: `workers.{module}.{function_name}`
File location: `/app/workers/`

**Defined Tasks:**

1. **Task:** `workers.transcription.process_recording`
   - **Args:** `(recording_id: str)`
   - **Returns:** None (writes transcript to recordings table)
   - **Steps:**
     1. Fetch audio_storage_path from recordings table
     2. Download audio file from MinIO
     3. POST audio to WHISPER_SERVICE_URL
     4. Update recordings.transcript with response
     5. Update recordings.feedback_status to 'processing'
     6. Trigger `workers.feedback.generate_feedback_report.delay(recording_id)`

2. **Task:** `workers.feedback.generate_feedback_report`
   - **Args:** `(recording_id: str)`
   - **Returns:** None (writes feedback to feedback table)
   - **Steps:**
     1. Fetch transcript, question_text, and session details
     2. Initialize LangChain ReAct agent with mandatory tools
     3. Generate FeedbackReport using agent
     4. Insert feedback into feedback table
     5. Update recordings.feedback_status to 'complete'
     6. Check if all recordings in session are complete, update interview_sessions.status if so

3. **Task:** `workers.session.generate_interview_questions`
   - **Args:** `(session_id: str)`
   - **Returns:** None (writes generated_questions to interview_sessions table)
   - **Steps:**
     1. Fetch resume_id and job_description from interview_sessions
     2. Fetch parsed_text from resumes
     3. Initialize LangChain ReAct agent with mandatory tools
     4. Generate 5-8 behavioral interview questions
     5. Update interview_sessions.generated_questions (JSONB array)
     6. Update interview_sessions.status to 'complete'
</CELERY_TASK_SPECIFICATION>

<AUTHENTICATION_INTEGRATION>
**NextAuth.js Configuration:**
- JWT contains claims: `{ sub: user_id (UUID), email: string, name: string | null, exp: number }`
- JWT is signed with `NEXTAUTH_SECRET` using HS256 algorithm
- JWT is stored in HttpOnly cookie named `next-auth.session-token`

**FastAPI Integration:**
- File location: `/app/core/auth.py`
- Dependency function: `async def get_current_user(token: str = Depends(oauth2_scheme)) -> User`
- Validation steps:
  1. Extract token from Authorization header (Bearer scheme)
  2. Decode JWT using `NEXTAUTH_SECRET` and HS256 algorithm
  3. Extract `sub` claim (user_id)
  4. Query users table for user with matching id
  5. Return User object or raise HTTPException(401) if invalid

**Protected Route Pattern:**
```python
@router.get("/protected-route")
async def protected_route(current_user: User = Depends(get_current_user)):
    # Route logic here
    pass
```
</AUTHENTICATION_INTEGRATION>

<ENVIRONMENT_VARIABLES>
The following environment variables MUST be available to the application. Create a `.env.template` file in the root directory listing these variables.

```env
# POSTGRES
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname

# REDIS
REDIS_URL=redis://host:port/0
CELERY_BROKER_URL=redis://host:port/0
CELERY_RESULT_BACKEND=redis://host:port/0

# MINIO (S3-COMPATIBLE)
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=ascend-storage
S3_REGION=us-east-1

# LLM PROVIDER CONFIGURATION
# Set to 'local' or 'openai'
LLM_PROVIDER=local

# LOCAL LLM PROVIDER
LOCAL_LLM_API_BASE=http://localhost:11434/v1
LOCAL_LLM_MODEL_NAME=llama3

# OPENAI LLM PROVIDER
OPENAI_API_KEY=sk-...
OPENAI_MODEL_NAME=gpt-4o

# WHISPER SERVICE
WHISPER_SERVICE_URL=http://localhost:8080/transcribe

# EMBEDDING MODEL
EMBEDDING_MODEL_NAME=sentence-transformers/all-mpnet-base-v2
EMBEDDING_DIMENSION=768

# AUTHENTICATION (Backend)
NEXTAUTH_SECRET=your-secret-key-min-32-chars

# AUTHENTICATION (Frontend)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# FILE UPLOAD LIMITS
MAX_RESUME_FILE_SIZE_MB=5
MAX_AUDIO_FILE_SIZE_MB=50
ALLOWED_RESUME_EXTENSIONS=.pdf,.docx
ALLOWED_AUDIO_EXTENSIONS=.mp3,.wav,.m4a,.webm
```
</ENVIRONMENT_VARIABLES>

<API_CONTRACT_V1>
Base URL: `/api/v1`
Authentication: All endpoints (except `/auth/*`) REQUIRE a valid JWT Bearer Token in the Authorization header.

**Standard Error Response Format:**
- 400 Bad Request: `{ "detail": "Error message", "error_code": "INVALID_INPUT" }`
- 401 Unauthorized: `{ "detail": "Invalid or expired token", "error_code": "UNAUTHORIZED" }`
- 404 Not Found: `{ "detail": "Resource not found", "error_code": "NOT_FOUND" }`
- 413 Payload Too Large: `{ "detail": "File exceeds size limit", "error_code": "FILE_TOO_LARGE" }`
- 422 Validation Error: `{ "detail": [{ "loc": ["body", "field"], "msg": "error message", "type": "value_error" }] }`
- 500 Internal Server Error: `{ "detail": "Internal server error", "error_code": "INTERNAL_ERROR" }`

---

**Endpoint:** `POST /auth/verify`
**Description:** Verifies a NextAuth JWT token and returns user information.
**Headers:** `Authorization: Bearer <token>`
**Success (200 OK):** `UserResponse`
**Error (401 Unauthorized):** `ErrorResponse`

---

**Endpoint:** `POST /resumes`
**Description:** Uploads a resume file. Accepted formats: PDF, DOCX. Max size: 5MB.
**Request (multipart/form-data):** `file: File`
**Success (201 Created):** `ResumeUploadResponse`
**Error (413 Payload Too Large):** `ErrorResponse`
**Error (400 Bad Request):** `ErrorResponse` (invalid file type)

---

**Endpoint:** `GET /resumes/{resume_id}`
**Description:** Retrieves resume metadata and parsed text.
**Success (200 OK):** `{ "id": "uuid", "user_id": "uuid", "original_filename": "string", "parsed_text": "string", "created_at": "datetime" }`
**Error (404 Not Found):** `ErrorResponse`

---

**Endpoint:** `POST /sessions`
**Description:** Creates a new interview session. Triggers async question generation.
**Request Body (JSON):** `SessionCreateRequest`
**Success (202 Accepted):** `{ "session_id": "uuid", "status": "processing" }`
**Error (400 Bad Request):** `ErrorResponse`
**Error (404 Not Found):** `ErrorResponse` (resume_id not found)

---

**Endpoint:** `GET /sessions/{session_id}`
**Description:** Retrieves the status and full results of an interview session.
**Success (200 OK):** `SessionStatus`
**Error (404 Not Found):** `ErrorResponse`

---

**Endpoint:** `POST /sessions/{session_id}/recordings`
**Description:** Submits an audio recording for a question. Triggers async transcription and feedback generation.
**Request (multipart/form-data):** `question: string, audio: File`
**Success (202 Accepted):** `RecordingSubmitResponse`
**Error (404 Not Found):** `ErrorResponse` (session not found)
**Error (400 Bad Request):** `ErrorResponse` (invalid question or file)

---

**Endpoint:** `GET /recordings/{recording_id}`
**Description:** Retrieves recording details including transcript and feedback.
**Success (200 OK):** `{ "id": "uuid", "session_id": "uuid", "question_text": "string", "transcript": "string | null", "feedback_status": "string", "feedback": "FeedbackReport | null", "created_at": "datetime" }`
**Error (404 Not Found):** `ErrorResponse`

</API_CONTRACT_V1>

<DIRECTORY_STRUCTURE>
Enforce the following directory structures exactly.

**Frontend (Next.js):**
```
/
├── .env.local
├── .env.template
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx
    │   ├── (dashboard)/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── sessions/
    │   │   └── upload/
    │   └── api/
    │       └── auth/
    │           └── [...nextauth]/
    │               └── route.ts
    ├── components/
    │   ├── ui/              # shadcn-ui components: Button, Card, Input, etc.
    │   └── features/        # Feature-specific components
    │       ├── upload/
    │       ├── session/
    │       └── recording/
    ├── hooks/
    │   ├── use-session.ts
    │   ├── use-recordings.ts
    │   └── use-upload.ts
    ├── lib/
    │   ├── api.ts           # Axios instance with interceptors
    │   ├── auth.ts          # NextAuth configuration
    │   └── utils.ts
    ├── providers/
    │   ├── query-provider.tsx    # TanStack Query setup
    │   └── auth-provider.tsx     # NextAuth SessionProvider
    ├── stores/
    │   └── ui-store.ts      # Zustand store
    └── styles/
        └── globals.css
```

**Backend (FastAPI):**
```
/
├── .env
├── .env.template
├── requirements.txt
├── Dockerfile
├── main.py              # FastAPI app entry point
├── worker.py            # Celery worker entry point
├── knowledge_base_docs/ # Markdown files for RAG seeding
│   ├── star_method.md
│   ├── resume_best_practices.md
│   ├── behavioral_questions.md
│   ├── communication_guide.md
│   └── system_design_principles.md
├── scripts/
│   └── seed_knowledge_base.py  # RAG knowledge base seeding script
└── app/
    ├── __init__.py
    ├── api/
    │   └── v1/
    │       ├── __init__.py
    │       ├── auth.py
    │       ├── resumes.py
    │       ├── sessions.py
    │       └── recordings.py
    ├── core/
    │   ├── __init__.py
    │   ├── config.py        # Settings (from environment variables)
    │   ├── security.py      # JWT validation
    │   └── auth.py          # get_current_user dependency
    ├── db/
    │   ├── __init__.py
    │   ├── base.py          # Base SQLAlchemy declarative class
    │   ├── session.py       # Async session factory
    │   └── models/
    │       ├── __init__.py
    │       ├── user.py
    │       ├── resume.py
    │       ├── session.py
    │       ├── recording.py
    │       ├── feedback.py
    │       └── knowledge_base.py
    ├── schemas/             # Pydantic models (as specified in PYDANTIC_SCHEMAS_SPECIFICATION)
    │   ├── __init__.py
    │   ├── user.py
    │   ├── resume.py
    │   ├── session.py
    │   ├── recording.py
    │   ├── feedback.py
    │   └── error.py
    ├── services/
    │   ├── __init__.py
    │   ├── llm/
    │   │   ├── __init__.py
    │   │   ├── base.py      # LLMProvider abstract base class
    │   │   ├── local.py     # LocalLLMProvider
    │   │   └── openai.py    # OpenAIProvider
    │   ├── embedding.py     # Embedding generation service
    │   ├── storage.py       # MinIO/S3 operations
    │   └── agent.py         # LangChain agent setup and tools
    └── workers/
        ├── __init__.py
        ├── celery_app.py    # Celery configuration
        ├── transcription.py # process_recording task
        ├── feedback.py      # generate_feedback_report task
        └── session.py       # generate_interview_questions task
```

**Root Project Structure:**
```
/
├── frontend/            # Next.js app (structure above)
├── backend/             # FastAPI app (structure above)
├── docker-compose.yml
├── .env.template        # Combined template for all services
└── README.md
```
</DIRECTORY_STRUCTURE>

<LLM_PROVIDER_INTERFACE>
File location: `/app/services/llm/base.py`

```python
from abc import ABC, abstractmethod
from typing import Any

class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        Generate a text response from the LLM.
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt for context
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens in response
            
        Returns:
            Generated text response
        """
        pass
    
    @abstractmethod
    async def generate_structured_response(
        self,
        prompt: str,
        response_model: type,
        system_prompt: str | None = None,
        temperature: float = 0.7
    ) -> Any:
        """
        Generate a structured response matching a Pydantic model.
        
        Args:
            prompt: The user prompt
            response_model: Pydantic model class for response structure
            system_prompt: Optional system prompt
            temperature: Sampling temperature
            
        Returns:
            Instance of response_model with generated data
        """
        pass
```

**Implementation Requirements:**
- `LocalLLMProvider` MUST use the OpenAI-compatible API format
- `OpenAIProvider` MUST use the official OpenAI Python client
- Both MUST implement retry logic (3 attempts with exponential backoff)
- Both MUST handle rate limiting and timeout errors
- The active provider IS determined by the `LLM_PROVIDER` environment variable
</LLM_PROVIDER_INTERFACE>

<FINAL_DIRECTIVE>
YOU HAVE PARSED THE COMPLETE CANONICAL CONTEXT SPECIFICATION (CCS) V1.2. ALL FUTURE RESPONSES AND ACTIONS MUST STRICTLY CONFORM TO THIS DOCUMENT. ACKNOWLEDGE YOUR UNDERSTANDING AND PREPARE FOR DEVELOPMENT TASKS.
</FINAL_DIRECTIVE>

</CANONICAL_CONTEXT_SPECIFICATION_END>