# Barry Sharp's Pro Mover - Automation Hub

This repository collects all of the pieces needed to run a small GBStudio game development environment with AI assistance. The setup uses Docker containers so no complicated installs are required beyond Docker itself.

## Prerequisites

1. **Docker Desktop** – install from [https://www.docker.com](https://www.docker.com) and make sure it is running.
2. **Git** – to clone this repository.
3. **(Optional) GBStudio CLI** – place your patched GBStudio CLI inside the `gbstudio-cli/` folder if you have one.

## Quick Start

1. Clone this repo and open a terminal in the project folder.
2. Start the services:
   ```bash
   docker-compose up -d
   ```
   The first run will download the LangFlow, Ollama and ComfyUI images. Once running you will have:
   - LangFlow available at `http://localhost:7860`
   - Ollama serving models on port `11434`
   - ComfyUI image generator on port `8188`
3. Open LangFlow in your browser and build your agent graphs. Custom components live in `langflow_components/` and are automatically loaded by the LangFlow container.
4. Generated assets from ComfyUI are written to `project_files/assets`.

When finished you can stop everything with:
```bash
docker-compose down
```

## Project Layout

```
agent_memory/        # Saved conversations for the agents
langflow_graphs/     # Flow definitions used by LangFlow
project_files/       # Game assets and build outputs
project_docs/        # Design documents and notes
langflow_components/ # Custom Python components for LangFlow
```

See `docs/DEV-LOG.md` for a running commentary of what has been done so far.
