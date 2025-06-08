# BSPM LangFlow Phase 1: Knowledge Base (RAG) Setup

## Objective
Establish a local vectorized knowledge base using FAISS and Ollama embeddings to support intelligent, context-aware AI agents throughout the Barry Sharp's Pro Mover development pipeline.

---

## 🗂️ Directory Structure
Ensure your project has the following folders:

```
/bs-pro-mover-vite-modal/
├── docs/               ← Source markdown/txt documents (game design, rules, etc.)
├── vectorstore/        ← Auto-generated FAISS index (created by LangFlow)
```

---

## ✅ Step-by-Step Instructions

### Step 1: Prepare Input Documents
Place all GDDs, rulesets, and internal documentation into `./docs/` as `.md` or `.txt` files.

---

### Step 2: Start LangFlow
```bash
langflow run
```
Visit [http://127.0.0.1:7860](http://127.0.0.1:7860) in your browser.

---

### Step 3: Create RAG_Builder Flow

**Components:**

- `DirectoryLoader`
  - Folder Path: `./docs`
  - Glob: `**/*.md`

- `RecursiveCharacterTextSplitter`
  - Chunk Size: `1000`
  - Chunk Overlap: `200`

- `OllamaEmbeddings`
  - Model: `nomic-embed-text`

- `FAISS`
  - Folder Path: `./vectorstore`
  - Index Name: `barrysharp_kb`

**Wiring:**
```
DirectoryLoader ➝ TextSplitter ➝ FAISS
                          ▲            ▲
                    OllamaEmbeddings ─┘
```

---

### Step 4: Validate Vectorstore Creation

Check for:
- `barrysharp_kb.faiss`
- `barrysharp_kb.pkl`

in `./vectorstore/`

---

### Step 5: Create RAG_Tester Flow (Optional)

Test queries using:
- `TextInput ➝ OllamaEmbeddings ➝ FAISS ➝ PromptTemplate ➝ ChatOllama ➝ TextOutput`

Prompt Template:
```
Based on this context:
{context}

Answer this question: {question}
```

---

## ✅ Outcome

Upon completion, your knowledge base will be accessible to any LangFlow agent using the FAISS retriever. All future flows can load `barrysharp_kb` as a shared context repository.

This is the foundation for memory-aware, role-aligned GBStudio collaborators.

xo TBESQ
