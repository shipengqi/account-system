package internal

import (
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/internal/config"
	"github.com/shipengqi/asapi/internal/store/mysql"
	genericapiserver "github.com/shipengqi/asapi/pkg/server"
	"github.com/shipengqi/asapi/pkg/shutdown"
	"github.com/shipengqi/asapi/pkg/shutdown/managers"
)

type ApiServer struct {
	gs               *shutdown.GracefulShutdown
	genericAPIServer *genericapiserver.GenericAPIServer
}

func CreateAPIServer(cfg *config.Config) (*ApiServer, error) {
	gs := shutdown.New()
	gs.AddShutdownManager(managers.NewPosixSignalManager())

	genericCfg, err := cfg.BuildGenericServerConfig()
	if err != nil {
		return nil, err
	}
	genericServer, err := genericapiserver.New(genericCfg)
	if err != nil {
		return nil, err
	}
	_, err = mysql.GetMySQLFactoryOr(cfg.MySQLOptions)
	if err != nil {
		return nil, err
	}

	server := &ApiServer{
		gs:               gs,
		genericAPIServer: genericServer,
	}

	return server, nil
}

func (s *ApiServer) PreRun() *ApiServer {
	initRouter(s.genericAPIServer.Engine)

	s.gs.AddShutdownCallback(shutdown.ShutdownFunc(func(string) error {
		mysqlStore, _ := mysql.GetMySQLFactoryOr(nil)
		if mysqlStore != nil {
			_ = mysqlStore.Close()
		}

		s.genericAPIServer.Close()

		return nil
	}))

	return s
}

func (s *ApiServer) Run() error {
	// start shutdown managers
	if err := s.gs.Start(); err != nil {
		log.Fatalf("start shutdown manager failed: %s", err.Error())
	}

	return s.genericAPIServer.Run()
}
