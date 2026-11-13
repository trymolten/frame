# Shortcuts for the local Docker stack (docker-compose.yml). `make` lists them.

COMPOSE ?= docker compose
OLLAMA_URL ?= http://localhost:11434
# The model the agents use: OLLAMA_MODEL from the shell, then .env, then the
# app's default.
OLLAMA_MODEL ?= $(or $(shell sed -n 's/^OLLAMA_MODEL=//p' .env 2>/dev/null | tr -d '"'),qwen3:8b)

.DEFAULT_GOAL := help
.PHONY: help up start down logs ps restart rebuild migrate ollama-model \
	sandbox-image sandbox-clean sandbox-test

help: ## List targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN { FS = ":.*## " } { printf "  make %-14s %s\n", $$1, $$2 }'

up: ollama-model ## Start the stack in the foreground (Ctrl-C stops it)
	$(COMPOSE) up

start: ollama-model ## Start the stack in the background
	$(COMPOSE) up --detach

down: ## Stop the stack (data in volumes is kept)
	$(COMPOSE) down

logs: ## Follow the app and Inngest logs
	$(COMPOSE) logs --follow app inngest

ps: ## Show the stack's containers
	$(COMPOSE) ps --all

restart: ## Restart the app (e.g. when a new route isn't picked up)
	$(COMPOSE) restart app

rebuild: ## Rebuild images and node_modules after dependency changes
	$(COMPOSE) up --detach --build --renew-anon-volumes

migrate: ## Apply migrations and regenerate the Prisma client
	$(COMPOSE) run --rm migrate

ollama-model: ## Pull OLLAMA_MODEL into the local Ollama if it's missing
	@if ! curl -sf $(OLLAMA_URL)/api/version >/dev/null; then \
		echo "Ollama isn't running at $(OLLAMA_URL); skipping the model pull."; \
	elif curl -sf $(OLLAMA_URL)/api/show -d '{"model":"$(OLLAMA_MODEL)"}' >/dev/null; then \
		echo "Ollama model $(OLLAMA_MODEL) is ready."; \
	elif command -v ollama >/dev/null; then \
		ollama pull $(OLLAMA_MODEL); \
	else \
		curl -sf $(OLLAMA_URL)/api/pull -d '{"model":"$(OLLAMA_MODEL)","stream":false}'; echo; \
	fi

sandbox-image: ## Build the code sandbox image
	scripts/sandbox/build-image.sh

sandbox-clean: ## Remove leftover sandbox containers
	scripts/sandbox/cleanup.sh

sandbox-test: ## Smoke-test the sandbox provider from the host
	npx tsx scripts/sandbox/smoke-test.ts
