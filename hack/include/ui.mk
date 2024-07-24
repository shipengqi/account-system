.PHONY: ui.build
ui.build:
	@echo "===========> Building UI bundles"
	@cd $(REPO_ROOT)/as-web; \
	npm install --force && \
	npm run build && \
	rm -rf $(REPO_ROOT)/as-api/resources/dist && \
	mv $(REPO_ROOT)/as-web/dist $(REPO_ROOT)/as-api/resources
