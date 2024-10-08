.PHONY: ui.build
ui.build:
	@echo "===========> Building UI bundles"
	@cd $(REPO_ROOT)/as-web; npm install --force
	@echo "===========> Building Website"
	@cd $(REPO_ROOT)/as-web; npm run build
	@echo "===========> Cleaning UI bundles"
	@rm -rf $(REPO_ROOT)/as-api/resources/dist
	@echo "===========> Moving UI bundles"
	@mv $(REPO_ROOT)/as-web/dist $(REPO_ROOT)/as-api/resources
