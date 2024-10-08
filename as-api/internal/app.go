package internal

import (
	"github.com/shipengqi/jcli"
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/internal/config"
	"github.com/shipengqi/asapi/internal/options"
)

const desc = `The as-api API server validates and configures data for the api objects.
The API Server services REST operations to do the api objects management.

Find more asapi-apiserver information at:
    https://github.com/shipengqi/asapi`

func NewApp() *jcli.App {
	opts := options.New()
	application := jcli.New("as-api API Server",
		jcli.WithCliOptions(opts),
		jcli.WithDesc(desc),
		jcli.WithRunFunc(run(opts)),
	)
	return application
}

func run(opts *options.Options) jcli.RunFunc {
    // setting up the global logger before the application runs
    log.Configure(opts.Log)
	return func() error {
		defer func() { _ = log.Close() }()

		cfg, err := config.CreateConfigFromOptions(opts)
		if err != nil {
			return err
		}

		return Run(cfg)
	}
}

// Run runs the specified APIServer. This should never exit.
func Run(cfg *config.Config) error {
	server, err := CreateAPIServer(cfg)
	if err != nil {
		return err
	}

	return server.PreRun().Run()
}
