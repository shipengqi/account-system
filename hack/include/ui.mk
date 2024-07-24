.PHONY: ui.build
ui.build:
	@echo "===========> Building UI bundles"
	@cd $(REPO_ROOT)/as-web
	@echo "===========> Installing Dependencies"
	npm install --force
	@echo "===========> Building Website"
	npm run build
	@echo "===========> Cleaning UI bundles"
	rm -rf $(REPO_ROOT)/as-api/resources/dist
	@echo "===========> Moving UI bundles"
	mv $(REPO_ROOT)/as-web/dist $(REPO_ROOT)/as-api/resources
