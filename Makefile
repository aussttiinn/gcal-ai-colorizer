SRC_DIR := src

.PHONY: all
.DEFAULT_GOAL := help

.PHONY: install
install:
	npm install -g @google/clasp

.PHONY: deploy
deploy: js
	clasp push
	@echo "Project deployed using clasp"