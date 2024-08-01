# ==============================================================================
# Makefile helper functions for generate necessary files
#

.PHONY: gen.run
gen.run: gen.clean gen.errcode

.PHONY: gen.errcode
gen.errcode: gen.errcode.code gen.errcode.doc

.PHONY: gen.errcode.code
gen.errcode.code: tools.verify.jaguar
	@echo "===========> Generating apiserver error code go source files"
	@jaguar tool codegen --types=int ${REPO_ROOT}/as-api/pkg/code

.PHONY: gen.errcode.doc
gen.errcode.doc: tools.verify.jaguar
	@echo "===========> Generating error code markdown documentation"
	@jaguar tool codegen --types=int --doc \
		--output ${REPO_ROOT}/docs/api/error_code_generated.md ${REPO_ROOT}/as-api/pkg/code

.PHONY: gen.clean
gen.clean:
	@rm -rf ./api/client/{clientset,informers,listers}
	@$(FIND) -type f -name '*_generated.go' -delete
