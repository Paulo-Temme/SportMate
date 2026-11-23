# Befehlsvertrag aus CLAUDE.md. Läuft mit GNU Make unter Linux (CI) und Windows (Git Bash).
# Jedes Ziel ruft das gleichnamige npm-Skript auf, damit es ohne make genauso geht (npm run <ziel>).
NPM ?= npm

setup:
	$(NPM) ci

lint:
	$(NPM) run lint

typecheck:
	$(NPM) run typecheck

test:
	$(NPM) run test

coverage:
	$(NPM) run coverage

check: lint typecheck test

build:
	$(NPM) run build

e2e:
	$(NPM) run test:e2e

trace:
	$(NPM) run trace

stats:
	$(NPM) run stats

.PHONY: setup lint typecheck test coverage check build e2e trace stats
