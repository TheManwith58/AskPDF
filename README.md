# AskPDF
A multi-tenant Retrieval-Augmented Generation (RAG) backend API built with Node.js, Express, and PostgreSQL (pgvector) for secure, AI-powered document interaction and hybrid search.

## 🚀 Features

* **Multi-Tenant Architecture:** Users can create and manage isolated projects. Search and AI interactions are strictly scoped to individual projects.
* **Document Processing:** Direct in-memory parsing of PDF and TXT files using LangChain text splitters.
* **Hybrid Search:** Combines semantic similarity (via `pgvector` Cosine Distance) with keyword matching (PostgreSQL Full-Text Search) for highly accurate context retrieval.
* **AI Question Answering:** Powered by OpenAI's `gpt-3.5-turbo` and `text-embedding-3-small`, returning context-aware answers alongside the source document snippets.
* **Feedback Loop:** Built-in endpoints to track and retrieve AI response performance (Helpful / Not Helpful metrics).
* **Robust Security:** JWT-based authentication and route-level ownership validation.

## 🛠️ Tech Stack

* **Backend Framework:** Node.js, Express, TypeScript
* **Database:** PostgreSQL with `pgvector` extension
* **ORM:** Prisma
* **AI & Embeddings:** LangChain, OpenAI API
* **File Handling:** Multer (Memory Storage), pdf-parse

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
* Node.js (v18+)
* PostgreSQL (Ensure the `pgvector` extension is supported/installed)
* An OpenAI API Key

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <your-repository-url>
cd vectorvault
npm install
