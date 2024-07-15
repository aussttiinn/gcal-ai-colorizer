SRC_DIR := src

.PHONY: all
.DEFAULT_GOAL := help

.PHONY: install
install:
	npm install -g @google/clasp

.PHONY: js
js:
	@for file in $(wildcard $(SRC_DIR)/*.gs); do \
		new_file=$${file%.gs}.js; \
		mv -v "$$file" "$$new_file"; \
	done
	@echo "Switched .gs files to .js"

.PHONY: gs
gs:
	@for file in $(wildcard $(SRC_DIR)/*.js); do \
		new_file=$${file%.js}.gs; \
		mv -v "$$file" "$$new_file"; \
	done
	@echo "Switched .js files to .gs"

.PHONY: deploy
deploy: js
	clasp push
	@echo "Project deployed using clasp"