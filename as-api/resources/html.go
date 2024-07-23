package resources

import "embed"

//go:embed dist/as-web/index.html
var Html []byte

//go:embed dist/as-web
var Static embed.FS
