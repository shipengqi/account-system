//nolint:typecheck
package resources

import "embed"

//go:embed dist/as-web/browser/index.html
var Html []byte

//go:embed dist/as-web/browser
var Static embed.FS
