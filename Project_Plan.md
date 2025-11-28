Excellent. I will now generate the complete, final, and meticulously detailed MVP development plan, including the previously reviewed epics. This plan is fully aligned with `AscendAI_Canonical_Context.md` (v1.3) and is designed for maximum clarity and zero ambiguity.

Here is the definitive JIRA project plan for the Ascend AI MVP, from start to finish.

---

### **Project: Ascend AI (ASCEND) - Final MVP Plan**

---

### **EPIC-1: Foundational Skeleton & Deployment Pipeline**

**Goal:** Establish a fully containerized, multi-service local development environment with a robust CI/CD pipeline. By the end of this epic, a developer can start all services with one command, and a user can authenticate via OAuth, have their session validated by the backend, and access a protected route, with all changes validated by an automated quality gate.

---

#### **STORY-1.1: [Setup] As a Developer, I need a complete, one-command local development environment.**

- **Description:** This story covers the initial project scaffolding and Docker orchestration to ensure all services can run locally and communicate with each other using a single `docker-compose up` command.
- **Acceptance Criteria (AC):**

  - AC-1: The project is a Git repository with the CCS-specified root structure (`/frontend`, `/backend`, `docker-compose.yml`, etc.).
  - AC-2: `docker-compose up --build` successfully builds and runs all services (frontend, backend, postgres, redis, minio, whisper) without errors.
  - AC-3: All services are accessible on their specified ports (e.g., Frontend: 3000, Backend: 8000, MinIO: 9000).
  - AC-4: The root `.env` and `.env.local` files are present and gitignored, and a complete `.env.template` exists as per the CCS.

- **TASK-1.1.1: Initialize Project Structure & Git Repository**

  - **Description:** Create the initial Git repository and core project layout.
  - **Sub-tasks:**
    - **SUB-1.1.1.1:** Initialize a Git repository with a `main` branch.
    - **SUB-1.1.1.2:** Create the root `.gitignore` file, ensuring it includes `.env`, `.env.local`, `node_modules/`, `__pycache__/`, `.DS_Store`, etc.
    - **SUB-1.1.1.3:** Create the root `README.md` with the project title and a brief overview.
    - **SUB-1.1.1.4:** Create the `/frontend` and `/backend` directories as specified in CCS `<DIRECTORY_STRUCTURE>`.
    - **SUB-1.1.1.5:** Create a root `Makefile` with initial targets for `up`, `down`, `build`, and `logs` to simplify Docker commands.

- **TASK-1.1.2: Create Root `docker-compose.yml`**

  - **Description:** Define the orchestration for all services required for local development.
  - **Developer Notes:** All service definitions must use environment variables for configuration and mount volumes for persistent data where necessary.
  - **Sub-tasks:**
    - **SUB-1.1.2.1:** Define the `postgres` service using the `postgres:latest` image, mapping a volume to `/var/lib/postgresql/data` for persistence and forwarding port 5432.
    - **SUB-1.1.2.2:** Define the `redis` service using the `redis:latest` image.
    - **SUB-1.1.2.3:** Define the `minio` service, including environment variables for root user/password, a volume for data persistence, and port mappings for 9000 (API) and 9001 (Console).
    - **SUB-1.1.2.4:** Define a placeholder `whisper-service` container that will eventually host the transcription model.
    - **SUB-1.1.2.5:** Define the `backend` service, configured to build from `./backend/Dockerfile`, map port 8000, and set `depends_on` for `postgres` and `redis`.
    - **SUB-1.1.2.6:** Define the `frontend` service, configured to build from `./frontend/Dockerfile`, map port 3000, and set `depends_on` for `backend`.

- **TASK-1.1.3: Create Environment Variable Templates**

  - **Description:** Create the template file that documents all necessary environment variables for the project.
  - **Developer Notes:** This file is critical for onboarding and must be a 1:1 match with the CCS `<ENVIRONMENT_VARIABLES>` section.
  - **Sub-tasks:**
    - **SUB-1.1.3.1:** Create a root `.env.template` file.
    - **SUB-1.1.3.2:** Copy and paste the complete list of variables from the CCS into `.env.template`.
    - **SUB-1.1.3.3:** Create a local `.env` file from the template for immediate use, filling in default local values.

- **TASK-1.1.4: Configure MinIO Bucket**
  - **Description:** Create a small script or add a command to the `Makefile` to automatically create the required S3 bucket in MinIO on first run.
  - **Developer Notes:** MinIO does not create buckets automatically. This prevents a common "NoSuchBucket" error during initial setup. Reference `S3_BUCKET_NAME` from the `.env` file.

---

#### **STORY-1.2: [Backend] As a Developer, I need a production-ready FastAPI application structure with a configured database.**

- **Description:** Build the core backend application, including its file structure, configurations, database models, and migration strategy, strictly following the CCS.
- **AC:**

  - AC-1: The backend application runs and serves the FastAPI docs UI at `http://localhost:8000/docs`.
  - AC-2: The initial Alembic migration successfully creates all database tables in PostgreSQL.
  - AC-3: Pydantic settings management correctly loads environment variables from the `.env` file.
  - AC-4: A global exception handler is in place to catch unhandled errors and return a standard JSON error response.

- **TASK-1.2.1: Create Backend Dockerfile and Initial Dependencies**

  - **Description:** Define the container environment for the FastAPI application.
  - **Developer Notes:** Follow the container security protocols in CCS Section 8.6.4, including creating a non-root user.
  - **Sub-tasks:**
    - **SUB-1.2.1.1:** Create `/backend/Dockerfile` with a multi-stage build to keep the final image slim.
    - **SUB-1.2.1.2:** Create `/backend/requirements.txt` and add initial dependencies (using latest stable versions): `fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncpg]`, `psycopg2-binary`, `pydantic-settings`, `alembic`, `pgvector`.
    - **SUB-1.2.1.3:** Create a linter configuration file (e.g., `pyproject.toml` for `ruff`) in the `/backend` directory.

- **TASK-1.2.2: Implement Core Application Structure and Settings**

  - **Description:** Scaffold the backend directory structure and configure environment variable loading.
  - **Sub-tasks:**
    - **SUB-1.2.2.1:** Create the complete directory structure inside `/backend/app/` as defined in CCS `<DIRECTORY_STRUCTURE>`.
    - **SUB-1.2.2.2:** Implement settings management in `/app/core/config.py` to load all backend variables using Pydantic `BaseSettings`.
    - **SUB-1.2.2.3:** In `main.py`, implement a global exception handler to catch any unhandled exceptions and return a `500 Internal Server Error` with a standardized JSON body as per the API contract.

- **TASK-1.2.3: Implement Database Models and Session Management**

  - **Description:** Define all SQLAlchemy ORM models and the async database session factory.
  - **Developer Notes:** Each model must correspond exactly to the SQL schema in the CCS.
  - **Sub-tasks:**
    - **SUB-1.2.3.1:** Configure the asynchronous SQLAlchemy engine and session factory in `/app/db/session.py`.
    - **SUB-1.2.3.2:** Define the `User` model in `/app/db/models/user.py`.
    - **SUB-1.2.3.3:** Define the `Resume` model in `/app/db/models/resume.py`.
    - **SUB-1.2.3.4:** Define the `InterviewSession` model in `/app/db/models/session.py`.
    - **SUB-1.2.3.5:** Define the `Recording` model in `/app/db/models/recording.py`.
    - **SUB-1.2.3.6:** Define the `Feedback` model in `/app/db/models/feedback.py`.
    - **SUB-1.2.3.7:** Define the `KnowledgeBaseChunk` model in `/app/db/models/knowledge_base.py`.

- **TASK-1.2.4: Set Up Database Migration Strategy with Alembic**
  - **Description:** Initialize and configure Alembic to manage all database schema changes.
  - **Developer Notes:** Follow the explicit instructions in CCS Section `DATABASE MIGRATION STRATEGY (Alembic)`.
  - **Sub-tasks:**
    - **SUB-1.2.4.1:** Run `alembic init alembic` inside the `/backend` directory.
    - **SUB-1.2.4.2:** Configure `alembic/env.py` to use the async database URL from `config.py` and target the `Base.metadata`.
    - **SUB-1.2.4.3:** Run `alembic revision --autogenerate -m "Initial schema"` to create the first migration file.
    - **SUB-1.2.4.4:** Review the generated migration file to ensure it matches the CCS schema, then apply it by adding an `entrypoint.sh` script to the backend Dockerfile that runs `alembic upgrade head` before starting the server.

---

#### **STORY-1.3: [Frontend] As a Developer, I need a type-safe Next.js application with foundational UI and state management.**

- **Description:** Scaffold the frontend application according to the CCS, ensuring all core libraries are installed and configured for a scalable and maintainable codebase.
- **AC:**

  - AC-1: The Next.js app runs in its Docker container and is accessible at `http://localhost:3000`.
  - AC-2: TypeScript is configured with `strict: true` and `tsc --noEmit` passes without errors.
  - AC-3: The `shadcn/ui` CLI is installed and the initial set of UI components are available.

- **TASK-1.3.1: Create Frontend Dockerfile and Initialize Project**

  - **Description:** Set up the Next.js project and its container environment.
  - **Developer Notes:** Follow CCS Section 8.6.4 for container security, including a multi-stage build and a non-root user.
  - **Sub-tasks:**
    - **SUB-1.3.1.1:** Create `/frontend/Dockerfile`.
    - **SUB-1.3.1.2:** Initialize a Next.js 14 project in `/frontend` using the App Router and TypeScript.
    - **SUB-1.3.1.3:** Create the CCS-specified directory structure inside `/frontend/src/`.
    - **SUB-1.3.1.4:** Configure ESLint and Prettier for code quality and consistent formatting.

- **TASK-1.3.2: Configure Core Libraries and Tooling**

  - **Description:** Install and configure all foundational frontend libraries as per the CCS.
  - **Sub-tasks:**
    - **SUB-1.3.2.1:** Configure `tsconfig.json` with `"strict": true` and path aliases.
    - **SUB-1.3.2.2:** Install and configure Tailwind CSS 3.x, including `tailwind.config.js` and `globals.css` with the specified design tokens.
    - **SUB-1.3.2.3:** Install TanStack Query v5 and set up the `QueryProvider` in `/src/providers/query-provider.tsx`.
    - **SUB-1.3.2.4:** Install Zustand and create the initial UI store in `/src/stores/ui-store.ts`.
    - **SUB-1.3.2.5:** Install Axios and create the centralized API instance in `/src/lib/api.ts`, including the JWT request interceptor.

- **TASK-1.3.3: Set Up Base UI Components with shadcn/ui**
  - **Description:** Install the core set of UI primitives that will be used throughout the application, as mandated by Directive 9.
  - **Sub-tasks:**
    - **SUB-1.3.3.1:** Initialize `shadcn/ui` in the frontend project.
    - **SUB-1.3.3.2:** Run `npx shadcn-ui@latest add` for the following components: `button`, `card`, `input`, `label`, `dialog`, `alert`, `skeleton`, `toast`, `textarea`, `progress`, `avatar`.

---

#### **STORY-1.4: [Auth] As a User, I want to sign up and log in securely using my Google or GitHub account.**

- **Description:** Implement the full end-to-end authentication flow, from the frontend UI to backend token validation and user creation.
- **AC:**

  - AC-1: A user can click "Login with Google/GitHub" and complete the OAuth flow.
  - AC-2: Upon successful login, a new user is created in the `users` table (or an existing user is retrieved) and the user is redirected to the dashboard.
  - AC-3: A secure, HttpOnly session cookie is set in the browser.
  - AC-4: The frontend can make an authenticated request to a protected backend endpoint (`/auth/verify`), which successfully validates the user and returns their data.

- **TASK-1.4.1: [Backend] Implement Pydantic Schemas for Authentication**

  - **Description:** Create the necessary Pydantic models for user data transfer.
  - **Developer Notes:** These must match the `<PYDANTIC_SCHEMAS_SPECIFICATION>` exactly.
  - **Sub-tasks:**
    - **SUB-1.4.1.1:** Implement `UserBase`, `UserCreate`, and `UserResponse` in `/app/schemas/user.py`.

- **TASK-1.4.2: [Backend] Implement JWT Validation and User Retrieval**

  - **Description:** Build the core security dependency that will protect all backend routes.
  - **Developer Notes:** Reference CCS Section 8.6.3 for the exact implementation pattern to prevent security vulnerabilities.
  - **Sub-tasks:**
    - **SUB-1.4.2.1:** Implement JWT decoding logic in `/app/core/security.py`.
    - **SUB-1.4.2.2:** Implement the `get_current_user` dependency in `/app/core/auth.py`.

- **TASK-1.4.3: [Backend] Create User Verification Endpoint**

  - **Description:** Create the API endpoint that the frontend will use to verify a user's session.
  - **Sub-tasks:**
    - **SUB-1.4.3.1:** Create the router in `/app/api/v1/auth.py`.
    - **SUB-1.4.3.2:** Implement the `POST /api/v1/auth/verify` endpoint, protected by `Depends(get_current_user)`, which returns the `UserResponse`.

- **TASK-1.4.4: [Frontend] Configure NextAuth.js**

  - **Description:** Set up the NextAuth library to handle the OAuth providers and session management.
  - **Sub-tasks:**
    - **SUB-1.4.4.1:** Configure NextAuth options in `/src/lib/auth.ts`.
    - **SUB-1.4.4.2:** Implement the NextAuth API route in `/src/app/api/auth/[...nextauth]/route.ts`.
    - **SUB-1.4.4.3:** Configure the Google and GitHub OAuth providers.
    - **SUB-1.4.4.4:** Implement the `jwt` and `session` callbacks to ensure the database user `id` is encoded into the JWT `sub` claim.

- **TASK-1.4.5: [Frontend] Build Authentication UI and Protected Layouts**

  - **Description:** Create the user-facing login page and the logic to protect dashboard pages.
  - **Sub-tasks:**
    - **SUB-1.4.5.1:** Create a simple login page at `/src/app/(auth)/login/page.tsx` with "Login with Google" and "Login with GitHub" buttons.
    - **SUB-1.4.5.2:** Create a protected layout at `/src/app/(dashboard)/layout.tsx` that checks for a valid session and redirects to `/login` if unauthenticated.
    - **SUB-1.4.5.3:** Create a placeholder dashboard page at `/src/app/(dashboard)/page.tsx`.

- **TASK-1.4.6: [Test] Verify End-to-End Authentication Flow**
  - **Description:** Write automated tests to confirm the entire authentication and session validation process works.
  - **Sub-tasks:**
    - **SUB-1.4.6.1:** **[Backend]** Write an integration test in `/backend/tests/api/v1/test_auth.py` that uses a mock JWT to call `/auth/verify` and asserts a `200 OK` response.
    - **SUB-1.4.6.2:** **[Backend]** Write a test case for an invalid/expired token that asserts a `401 Unauthorized` response.

---

### **EPIC-2: Core Data Ingestion & Session Creation**

**Goal:** Allow a user to upload a resume and job description, which initiates the creation of an interview session. The system must parse the resume, store all data securely, and asynchronously trigger the AI question generation workflow.

---

#### **STORY-2.1: [Resume] As a User, I want to upload my resume and have it processed by the system.**

- **Description:** Build the functionality for a user to securely upload a resume file, which is then stored, parsed, and its metadata saved to the database.
- **AC:**

  - AC-1: The user can only upload `.pdf` or `.docx` files under 5MB.
  - AC-2: A successful upload stores the file in MinIO (`resumes/<user_id>/<resume_id>.ext`) and creates a record in the `resumes` table.
  - AC-3: A Celery task is enqueued to parse the text from the uploaded file.
  - AC-4: The UI provides clear feedback for success, failure (with specific error messages), and loading states.

- **TASK-2.1.1: [Backend] Implement MinIO Storage Service**

  - **Description:** Create a reusable service for interacting with the S3-compatible object store.
  - **Sub-tasks:**
    - **SUB-2.1.1.1:** Implement an `S3Service` in `/app/services/storage.py` with methods for `upload_file` and `download_file`.

- **TASK-2.1.2: [Backend] Implement Resume Upload Endpoint**

  - **Description:** Create the API endpoint to handle file uploads.
  - **Developer Notes:** Follow CCS Section 8.5.5 for file upload security.
  - **Sub-tasks:**
    - **SUB-2.1.2.1:** Implement the `POST /api/v1/resumes` endpoint in `/app/api/v1/resumes.py`.
    - **SUB-2.1.2.2:** Implement strict validation for file size and MIME type using the `python-magic` library.
    - **SUB-2.1.2.3:** Use the `S3Service` to upload the validated file to MinIO.
    - **SUB-2.1.2.4:** Create a record in the `resumes` table with `parsing_status: 'pending'`.
    - **SUB-2.1.2.5:** Dispatch a new Celery task `workers.parsing.parse_resume_text(resume_id: str)`.
    - **SUB-2.1.2.6:** Return a `201 Created` with the `ResumeUploadResponse` schema.

- **TASK-2.1.3: [Celery] Implement Resume Parsing Task**

  - **Description:** Create the background task to extract text from resume files.
  - **Sub-tasks:**
    - **SUB-2.1.3.1:** Create `/app/workers/parsing.py` and define the `parse_resume_text` task.
    - **SUB-2.1.3.2:** Add `python-docx` and `pypdf` to `requirements.txt`.
    - **SUB-2.1.3.3:** In the task, download the file from MinIO, use the appropriate library to extract raw text, and update the `resumes` table.

- **TASK-2.1.4: [Frontend] Build Resume Upload UI**

  - **Description:** Create the user interface for uploading a resume.
  - **Sub-tasks:**
    - **SUB-2.1.4.1:** Create a dedicated upload page at `/src/app/(dashboard)/upload/page.tsx`.
    - **SUB-2.1.4.2:** Build a form using `shadcn/ui` `Input type="file"` and `Button` components.
    - **SUB-2.1.4.3:** Create a `useUploadResume` mutation hook in `/src/hooks/use-upload.ts` using TanStack Query.
    - **SUB-2.1.4.4:** Implement UI feedback for loading, success (using a toast), and specific error states.

- **TASK-2.1.5: [Test] Write Tests for Resume Upload**
  - **Description:** Create backend tests to validate the entire resume upload and parsing flow.
  - **Sub-tasks:**
    - **SUB-2.1.5.1:** **[Backend]** Test the `/api/v1/resumes` endpoint with a valid file upload, asserting a `201` response and that a Celery task was enqueued.
    - **SUB-2.1.5.2:** **[Backend]** Test the endpoint with an oversized file, asserting a `413 Payload Too Large` response.
    - **SUB-2.1.5.3:** **[Backend]** Test the endpoint with an invalid file type (e.g., `.txt`), asserting a `400 Bad Request` response.

---

#### **STORY-2.2: [Session] As a User, I want to start an interview session by providing a job description.**

- **Description:** Create the workflow to initiate an interview session, which is an asynchronous process that eventually leads to a set of generated questions.
- **AC:**

  - AC-1: A user can submit a job description (50-5000 chars) and a selected resume ID.
  - AC-2: The backend immediately returns a `202 Accepted` response with a `session_id`.
  - AC-3: A new record is created in the `interview_sessions` table with `status: 'processing'`.
  - AC-4: The `workers.session.generate_interview_questions` Celery task is successfully enqueued.

- **TASK-2.2.1: [Backend] Implement Session Creation Endpoint**

  - **Description:** Create the API endpoint to kick off the session generation workflow.
  - **Sub-tasks:**
    - **SUB-2.2.1.1:** Implement the `POST /api/v1/sessions` endpoint in `/app/api/v1/sessions.py`.
    - **SUB-2.2.1.2:** Use the `SessionCreateRequest` Pydantic schema for validation.
    - **SUB-2.2.1.3:** Perform an **authorization check** to ensure the `resume_id` belongs to the `current_user`.
    - **SUB-2.2.1.4:** Create the `interview_sessions` record in the database.
    - **SUB-2.2.1.5:** Dispatch the Celery task with the new `session_id`.
    - **SUB-2.2.1.6:** Return the `202 Accepted` response using the `SessionCreateResponse` schema.

- **TASK-2.2.2: [Backend] Implement Session Status Polling Endpoint**

  - **Description:** Create an endpoint for the frontend to check the status of a session.
  - **Sub-tasks:**
    - **SUB-2.2.2.1:** Implement the `GET /api/v1/sessions/{session_id}` endpoint.
    - **SUB-2.2.2.2:** **[Security]** Implement an authorization check to ensure the session belongs to the current user.
    - **SUB-2.2.2.3:** Return the full session details using the `SessionDetailResponse` schema.

- **TASK-2.2.3: [Frontend] Enhance UI for Session Creation and Polling**

  - **Description:** Add the job description input and handle the redirection and polling logic.
  - **Sub-tasks:**
    - **SUB-2.2.3.1:** Add a `Textarea` for the job description to the upload page.
    - **SUB-2.2.3.2:** Create a `useCreateSession` mutation hook.
    - **SUB-2.2.3.3:** Upon successful mutation, redirect the user to `/sessions/[sessionId]`.
    - **SUB-2.2.3.4:** On the `sessions/[sessionId]` page, use `useQuery` with a `refetchInterval` to poll the status endpoint.
    - **SUB-2.2.3.5:** Display a skeleton loader while the session status is `processing`.

- **TASK-2.2.4: [Test] Write Tests for Session Creation**
  - **Description:** Create backend tests to validate the session creation logic.
  - **Sub-tasks:**
    - **SUB-2.2.4.1:** **[Backend]** Test the `POST /api/v1/sessions` endpoint with a valid request, asserting a `202` response.
    - **SUB-2.2.4.2:** **[Backend]** Test the same endpoint with a `resume_id` belonging to a different user, asserting a `403 Forbidden` response.
    - **SUB-2.2.4.3:** **[Backend]** Test the `GET /api/v1/sessions/{session_id}` endpoint, asserting a `200 OK` and the correct data shape.

---

### **EPIC-3: RAG & Agentic AI Core**

**Goal:** Construct the "brain" of the application. This includes seeding the vector database, implementing the modular LLM services, and building the ReAct agent with its required tools to generate interview questions.

---

#### **STORY-3.1: [RAG] As the System, I need a reliable knowledge base to provide evidence-backed feedback.**

- **Description:** Populate the PostgreSQL vector store with expert knowledge from Markdown files to ground the AI's responses.
- **AC:**

  - AC-1: The seeding script can be run to populate the `knowledge_base_chunks` table.
  - AC-2: Each row in the table contains the source document, chunked text, and a 768-dimension embedding vector.
  - AC-3: The `--reset` flag successfully truncates the table before seeding.

- **TASK-3.1.1: [Content] Create Knowledge Base Source Files**

  - **Description:** Create the initial Markdown files that will serve as the RAG knowledge base.
  - **Developer Notes:** Files must be placed in `/backend/knowledge_base_docs/`.
  - **Sub-tasks:**
    - **SUB-3.1.1.1:** Create `star_method.md`.
    - **SUB-3.1.1.2:** Create `resume_best_practices.md`.
    - **SUB-3.1.1.3:** Create `behavioral_questions.md`.
    - **SUB-3.1.1.4:** Create `communication_guide.md`.
    - **SUB-3.1.1.5:** Create `system_design_principles.md`.

- **TASK-3.1.2: [AI/Backend] Implement Embedding Generation Service**

  - **Description:** Create the service responsible for converting text to vector embeddings.
  - **Sub-tasks:**
    - **SUB-3.1.2.1:** Add `sentence-transformers` to `requirements.txt`.
    - **SUB-3.1.2.2:** Implement the `EmbeddingService` in `/app/services/embedding.py` to load and use the `sentence-transformers/all-mpnet-base-v2` model.

- **TASK-3.1.3: [AI/Backend] Implement Knowledge Base Seeding Script**
  - **Description:** Create the script to process the Markdown files and populate the vector DB.
  - **Developer Notes:** Follow the implementation guide in the CCS.
  - **Sub-tasks:**
    - **SUB-3.1.3.1:** Implement the script at `/backend/scripts/seed_knowledge_base.py`.
    - **SUB-3.1.3.2:** Use a token-based text splitter to chunk documents to 512 tokens with a 50-token overlap.
    - **SUB-3.1.3.3:** Loop through chunks, generate embeddings, and insert them into the `knowledge_base_chunks` table.

---

#### **STORY-3.2: [LLM] As a Developer, I need a swappable LLM provider architecture.**

- **Description:** Implement the specified Provider/Interface pattern to allow switching between a local self-hosted LLM and the OpenAI API.
- **AC:**

  - AC-1: The `LLMProvider` abstract base class is defined exactly as in the CCS.
  - AC-2: `LocalLLMProvider` and `OpenAIProvider` both implement all methods of the ABC.
  - AC-3: The application correctly instantiates one of the providers based on the `LLM_PROVIDER` environment variable.

- **TASK-3.2.1: [AI/Backend] Implement LLM Provider Interface and Implementations**
  - **Description:** Create the modular architecture for interacting with LLMs.
  - **Sub-tasks:**
    - **SUB-3.2.1.1:** Define the `LLMProvider` ABC in `/app/services/llm/base.py`.
    - **SUB-3.2.1.2:** Implement `LocalLLMProvider` in `/app/services/llm/local.py` using `httpx`.
    - **SUB-3.2.1.3:** Implement `OpenAIProvider` in `/app/services/llm/openai.py` using the `openai` library.
    - **SUB-3.2.1.4:** Implement retry logic with exponential backoff for both providers.
    - **SUB-3.2.1.5:** Create a factory function in `/app/services/llm/__init__.py` to select the provider based on the environment variable.

---

#### **STORY-3.3: [Agent] As the System, I need a ReAct agent to intelligently generate interview questions.**

- **Description:** Create the LangChain ReAct agent and its tools, and integrate it into the session creation Celery task.
- **AC:**

  - AC-1: All specified agent tools are implemented and function correctly.
  - AC-2: The `generate_interview_questions` task successfully uses the agent to generate 5-8 relevant questions.
  - AC-3: The generated questions are saved to the `interview_sessions` table, and the session status is updated to `complete`.

- **TASK-3.3.1: [AI/Backend] Implement Agent Tools**

  - **Description:** Create the functions that the agent will use to gather information.
  - **Developer Notes:** All database-accessing tools must be `async`.
  - **Sub-tasks:**
    - **SUB-3.3.1.1:** Implement `get_resume_text` in `/app/services/agent.py`.
    - **SUB-3.3.1.2:** Implement `get_job_description_text`.
    - **SUB-3.3.1.3:** Implement `rag_knowledge_search` to perform a vector similarity search.
    - **SUB-3.3.1.4:** Create placeholder implementations for `get_transcript` and `analyze_delivery_metrics`.

- **TASK-3.3.2: [AI/Backend] Implement Agent Factory and Celery Task Logic**

  - **Description:** Integrate the agent into the background task for question generation.
  - **Sub-tasks:**
    - **SUB-3.3.2.1:** Implement the agent factory function in `/app/services/agent.py`.
    - **SUB-3.3.2.2:** Upgrade the `workers.session.generate_interview_questions` task in `/app/workers/session.py` to invoke the agent.
    - **SUB-3.3.2.3:** Parse the agent's response, validate it, and update the `interview_sessions` record, setting the status to `complete`.

- **TASK-3.3.3: [Test] Write Tests for Question Generation**
  - **Description:** Test the Celery task and agent logic.
  - **Sub-tasks:**
    - **SUB-3.3.3.1:** **[Backend]** Write a unit test for the `generate_interview_questions` task, mocking the agent and its response to ensure the database is updated correctly.

---

### **EPIC-4: End-to-End Audio Processing Pipeline**

**Goal:** Enable users to record audio answers, have them securely uploaded, and processed by a self-hosted transcription service, making the transcript available for the next stage.

---

#### **STORY-4.1: [Recording] As a User, I want a seamless in-browser experience to record my answers.**

- **Description:** Build the frontend UI and logic for recording audio and uploading it for processing.
- **AC:**

  - AC-1: The session page displays one question at a time from the `generated_questions`.
  - AC-2: The user can start, stop, and re-record their audio answer.
  - AC-3: After confirming, the audio file is uploaded, a `recordings` entry is created, and the transcription task is triggered.
  - AC-4: The UI shows a "processing" state for the submitted answer.

- **TASK-4.1.1: [Frontend] Build the Interview Interface**

  - **Description:** Create the page where the user practices their interview.
  - **Sub-tasks:**
    - **SUB-4.1.1.1:** Build the UI in `/src/app/(dashboard)/sessions/[sessionId]/page.tsx`.
    - **SUB-4.1.1.2:** Implement state management to track the current question and recording state.
    - **SUB-4.1.1.3:** Create a recording component in `/src/components/features/recording/` using the `MediaRecorder` API.

- **TASK-4.1.2: [Backend] Implement Recording Submission Endpoint**
  - **Description:** Create the endpoint to handle the audio upload.
  - **Sub-tasks:**
    - **SUB-4.1.2.1:** Implement `POST /api/v1/sessions/{session_id}/recordings` in `/app/api/v1/sessions.py`.
    - **SUB-4.1.2.2:** Validate the audio file size and type.
    - **SUB-4.1.2.3:** Upload the audio to MinIO.
    - **SUB-4.1.2.4:** Create the `recordings` table entry with `transcription_status: 'pending'`.
    - **SUB-4.1.2.5:** Dispatch the `workers.transcription.process_recording` task.

---

#### **STORY-4.2: [Transcription] As the System, I need to accurately transcribe user audio using a self-hosted service.**

- **Description:** Set up the Whisper microservice and create the Celery task that orchestrates the transcription process.
- **AC:**

  - AC-1: The `whisper.cpp` service is containerized and accessible from the Celery worker.
  - AC-2: The `process_recording` task successfully downloads the audio, gets a transcript, and updates the database.
  - AC-3: The `workers.feedback.generate_feedback_report` task is enqueued upon successful transcription.

- **TASK-4.2.1: [DevOps] Configure Whisper Microservice**

  - **Description:** Add the pre-built `whisper.cpp` container to the Docker Compose setup.
  - **Sub-tasks:**
    - **SUB-4.2.1.1:** Add the `whisper.cpp` service to `docker-compose.yml` and configure the `WHISPER_SERVICE_URL`.

- **TASK-4.2.2: [Celery] Implement Transcription Task**
  - **Description:** Create the background task to handle audio transcription.
  - **Sub-tasks:**
    - **SUB-4.2.2.1:** Implement the `workers.transcription.process_recording` task in `/app/workers/transcription.py`.
    - **SUB-4.2.2.2:** Download the audio file from MinIO.
    - **SUB-4.2.2.3:** Make an async POST request to the Whisper service.
    - **SUB-4.2.2.4:** Update the `recordings` table with the transcript and set `transcription_status` to `complete`.
    - **SUB-4.2.2.5:** Chain the `generate_feedback_report` task.

---

### **EPIC-5: The "Magic Moment" - Feedback Generation & Display**

**Goal:** Deliver the core value proposition: a detailed, AI-generated feedback report based on the user's transcribed answer, and display it in a clear, interactive UI.

---

#### **STORY-5.1: [Feedback] As the System, I need to generate a comprehensive, structured feedback report using the ReAct agent.**

- **Description:** Implement the final, most complex Celery task which uses the agent to analyze the transcript and generate the full `FeedbackReport`.
- **AC:**

  - AC-1: The `analyze_delivery_metrics` tool is fully implemented with the CCS-specified scoring logic.
  - AC-2: The `generate_feedback_report` task uses the agent with the precise `AGENT_SYSTEM_PROMPT_SPECIFICATION`.
  - AC-3: The agent's final JSON output successfully parses into the `FeedbackReport` Pydantic schema.
  - AC-4: The report is saved to the `feedback` table, and the `recording`/`session` statuses are updated to `complete`.

- **TASK-5.1.1: [AI/Backend] Fully Implement Agent Tools and Pydantic Schemas**

  - **Description:** Complete the implementation of all agent tools and feedback-related data models.
  - **Sub-tasks:**
    - **SUB-5.1.1.1:** Fully implement the `analyze_delivery_metrics` agent tool in `/app/services/agent.py`.
    - **SUB-5.1.1.2:** Implement all feedback-related Pydantic schemas (`STARAnalysis`, `DeliveryMetrics`, `FeedbackReport`) in `/app/schemas/feedback.py`.

- **TASK-5.1.2: [Celery] Implement Feedback Generation Task**
  - **Description:** Create the background task that generates the AI feedback.
  - **Sub-tasks:**
    - **SUB-5.1.2.1:** Implement the `workers.feedback.generate_feedback_report` task in `/app/workers/feedback.py`.
    - **SUB-5.1.2.2:** Initialize the ReAct agent with the specified system prompt from the CCS.
    - **SUB-5.1.2.3:** Invoke the agent, parse its JSON output into the `FeedbackReport` model.
    - **SUB-5.1.2.4:** Insert the new `Feedback` record into the database.
    - **SUB-5.1.2.5:** Implement the logic to update the parent `interview_sessions` status to `complete` if all recordings are done.

---

#### **STORY-5.2: [UI] As a User, I want to view my feedback report in a clear, actionable, and visually appealing format.**

- **Description:** Build the frontend components to render the structured feedback data received from the API.
- **AC:**

  - AC-1: The session page dynamically displays the feedback report once the session status is `complete`.
  - AC-2: All sections of the report (STAR, Delivery, Recommendations, Overall Score) are displayed.
  - AC-3: Numerical scores are presented with intuitive visualizations.

- **TASK-5.2.1: [Backend] Enhance Session and Recording Endpoints**

  - **Description:** Ensure the API endpoints correctly join and serialize the full feedback data.
  - **Sub-tasks:**
    - **SUB-5.2.1.1:** Implement the `GET /api/v1/recordings/{recording_id}` endpoint.
    - **SUB-5.2.1.2:** Update the `GET /sessions/{session_id}` endpoint to correctly join and return all nested recording and feedback data.

- **TASK-5.2.2: [Frontend] Create Feedback Display Components**
  - **Description:** Build the UI components to render the feedback report.
  - **Developer Notes:** Follow Directive 9 for UI/UX consistency.
  - **Sub-tasks:**
    - **SUB-5.2.2.1:** Create a main `FeedbackReport` component in `/src/components/features/session/`.
    - **SUB-5.2.2.2:** Create a `DeliveryMetrics` sub-component that uses `shadcn/ui` `Progress` bars or a simple charting library to visualize scores.
    - **SUB-5.2.2.3:** Integrate the `FeedbackReport` component into the `sessions/[sessionId]` page, conditionally rendering it when the data is available.

---

### **EPIC-6: Final Polish, Testing & Launch Readiness**

**Goal:** Harden the application by implementing comprehensive testing, refining the user experience, automating CI/CD, and preparing all necessary documentation and marketing materials for a portfolio launch.

---

#### **STORY-6.1: [UX/UI] As a User, I expect a polished, responsive, and error-free experience.**

- **Description:** Address all aspects of the user-facing experience, from loading states to error handling and visual consistency.
- **AC:**

  - AC-1: Every data-fetching view has a clear loading state (e.g., skeleton loaders).
  - AC-2: All user actions that trigger an API call provide immediate feedback.
  - AC-3: The application is fully responsive and usable on mobile devices.

- **TASK-6.1.1: [Frontend] Implement Consistent Loading and Error States**

  - **Description:** Ensure the user is never left with a blank or unresponsive screen.
  - **Sub-tasks:**
    - **SUB-6.1.1.1:** Implement skeleton loading components for the main dashboard, session page, and feedback report.
    - **SUB-6.1.1.2:** Implement a global toast notification system using `shadcn/ui` `Toast` for displaying user feedback (e.g., "Upload successful," "Error creating session").
    - **SUB-6.1.1.3:** Create a generic "empty state" component for when there are no sessions or recordings to display.

- **TASK-6.1.2: [Frontend] Build Main Dashboard and Finalize Layout**
  - **Description:** Create the central hub for the user and ensure a consistent layout across the app.
  - **Sub-tasks:**
    - **SUB-6.1.2.1:** Build the main dashboard page at `/src/app/(dashboard)/page.tsx` to list and link to past interview sessions using `Card` components.
    - **SUB-6.1.2.2:** Create a consistent header and navigation component to be used across all authenticated pages.

---

#### **STORY-6.2: [DevOps] As a Developer, I need an automated CI/CD pipeline to ensure code quality.**

- **Description:** Create GitHub Actions workflows to automate linting, testing, and build processes.
- **AC:**

  - AC-1: A push or pull request to any branch triggers the linting and testing workflows.
  - AC-2: A failing test or linting error causes the workflow to fail, blocking merges.

- **TASK-6.2.1: [DevOps] Create Backend CI Workflow**

  - **Description:** Automate quality checks for the FastAPI application.
  - **Sub-tasks:**
    - **SUB-6.2.1.1:** Create `.github/workflows/backend-ci.yml`.
    - **SUB-6.2.1.2:** Add a job to run `ruff check` and `ruff format --check`.
    - **SUB-6.2.1.3:** Add a job to run `pytest` against a test database service defined in the workflow.

- **TASK-6.2.2: [DevOps] Create Frontend CI Workflow**
  - **Description:** Automate quality checks for the Next.js application.
  - **Sub-tasks:**
    - **SUB-6.2.2.1:** Create `.github/workflows/frontend-ci.yml`.
    - **SUB-6.2.2.2:** Add a job to run ESLint and Prettier (or `ruff`).
    - **SUB-6.2.2.3:** Add a job to run `tsc --noEmit` to verify TypeScript types.
    - **SUB-6.2.2.4:** Add a job to run unit tests with Jest/RTL.

---

#### **STORY-6.3: [Test] As a Developer, I must ensure the application's core logic is reliable.**

- **Description:** Write a suite of unit and integration tests to cover critical application functionality and achieve the coverage goals set in the CCS.
- **AC:**

  - AC-1: Backend test coverage meets or exceeds 80%.
  - AC-2: Frontend test coverage meets or exceeds 70%.
  - AC-3: All critical user flows (auth, upload, session creation) are covered by integration tests.

- **TASK-6.3.1: [Backend] Write Comprehensive Integration Tests**

  - **Description:** Test the behavior of all API endpoints.
  - **Sub-tasks:**
    - **SUB-6.3.1.1:** Write integration tests for the `auth`, `resumes`, and `sessions` API routers, using an async test client and a dedicated test database.
    - **SUB-6.3.1.2:** Include tests for authorization failures (e.g., trying to access another user's resources).

- **TASK-6.3.2: [Frontend] Write Unit and Component Tests**
  - **Description:** Test critical frontend logic and components.
  - **Sub-tasks:**
    - **SUB-6.3.2.1:** Write unit tests for the state management and API hooks (`use-session.ts`, `use-upload.ts`).
    - **SUB-6.3.2.2:** Write component tests for the `FeedbackReport` and `Recording` components, mocking the data they receive.

---

#### **STORY-6.4: [Launch] As the Project Owner, I need to prepare all materials for a successful portfolio launch.**

- **Description:** Finalize all public-facing documentation and marketing content.
- **AC:**

  - AC-1: The `README.md` is complete and provides clear instructions for setting up and running the project locally.
  - AC-2: A detailed technical blog post is drafted.
  - AC-3: A collection of high-quality screenshots and a short demo video are created.

- **TASK-6.4.1: [Documentation] Finalize Project Documentation**

  - **Description:** Thoroughly document the project in the root `README.md`.
  - **Sub-tasks:**
    - **SUB-6.4.1.1:** Add an architecture overview diagram or description.
    - **SUB-6.4.1.2:** Detail the full tech stack.
    - **SUB-6.4.1.3:** Provide step-by-step instructions for local setup, including prerequisites.

- **TASK-6.4.2: [Content] Create Launch Marketing Materials**
  - **Description:** Prepare the content as described in the Blueprint's Go-to-Market strategy.
  - **Sub-tasks:**
    - **SUB-6.4.2.1:** Write the full draft of the technical blog post.
    - **SUB-6.4.2.2:** Record a concise (2-3 minute) video demonstrating the full user journey from upload to feedback.
    - **SUB-6.4.2.3:** Take high-quality screenshots of the key UI elements (Dashboard, Upload, Session, Feedback Report).
