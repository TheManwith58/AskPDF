# AskPDF
A multi-tenant Retrieval-Augmented Generation (RAG) backend API built with Node.js, Express, and PostgreSQL (pgvector) for secure, AI-powered document interaction and hybrid search.
🚀 Getting Started
1. Prerequisites
Node.js (v18+)

Docker Desktop (Highly recommended for database setup)

TypeScript globally installed

2. Installation
Clone the repository and install dependencies.

⚠️ CRITICAL: You must use the --legacy-peer-deps flag to bypass strict version conflicts between dotenv and @langchain/community sub-dependencies.

Bash
npm install --legacy-peer-deps
3. Database & pgvector Setup (Docker Route)
To avoid the complexities of natively compiling C++ extensions on Windows, run the pre-configured pgvector Docker container:

Bash
docker run --name rag-postgres -e POSTGRES_PASSWORD=YourSecurePassword -e POSTGRES_DB=rag_db -p 5432:5432 -d ankane/pgvector
4. Environment Variables
Create a .env file in the root directory.

Code snippet
# Database Connection String
# IMPORTANT: URL-encode any special characters in your password (e.g., @ becomes %40)
DATABASE_URL="postgresql://postgres:YourSecurePassword@localhost:5432/rag_db?schema=public"

# Authentication
JWT_SECRET="your_super_secret_jwt_key_here"
5. Prisma Configuration (Version 7+)
This project uses Prisma 7, which requires a dedicated configuration file outside of the schema.prisma. Ensure prisma.config.ts exists in your root directory:

TypeScript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
6. Generate and Migrate
Initialize your database tables and generate the local Prisma Client:

Bash
# 1. Generate the custom Prisma Client into /prisma/generated/client
npx prisma generate

# 2. Apply migrations to the database
npx prisma migrate dev
(Note: If migrating for the first time natively without Docker, ensure CREATE EXTENSION IF NOT EXISTS vector; is manually added to your initial SQL migration file).

🧠 Important Note: Local Model Adaptation
By default, the DocumentChunk schema is configured for 1536 dimensions (OpenAI standard):

Code snippet
embedding Unsupported("vector(1536)")
If project requirements dictate strictly local model usage (e.g., using Ollama with nomic-embed-text to avoid third-party APIs), you must adjust this dimension size in schema.prisma (e.g., to 768) before running your initial database migration.
