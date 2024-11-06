package resources

import "embed"

//nolint:all
//go:embed dist/as-web/browser/index.html
var Html []byte

//nolint:all
//go:embed dist/as-web/browser
var Static embed.FS
