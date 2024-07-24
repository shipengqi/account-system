package internal

import (
	"embed"
	"io/fs"
	"path"

	"github.com/shipengqi/asapi/resources"
)

type Resource struct {
	fs   embed.FS
	path string
}

func NewResource(staticPath string) *Resource {
	return &Resource{
		fs:   resources.Static,
		path: staticPath,
	}
}

func (r *Resource) Open(name string) (fs.File, error) {
	// rewrite the static files path
	fullName := path.Join(r.path, name)
	return r.fs.Open(fullName)
}
