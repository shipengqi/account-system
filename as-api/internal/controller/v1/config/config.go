package config

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/component-base/version"
	"github.com/shipengqi/log"

	svcv1 "github.com/shipengqi/asapi/internal/service/v1"
	"github.com/shipengqi/asapi/internal/store"
	"github.com/shipengqi/asapi/pkg/response"
)

// Controller create a user handler used to handle request for user resource.
type Controller struct {
	svc svcv1.Interface
}

// New creates a user Controller.
func New(store store.Factory) *Controller {
	return &Controller{
		svc: svcv1.NewService(store),
	}
}

func (c *Controller) GetBuildInfo(ctx *gin.Context) {
	log.Info("get basic build information function called.")

	response.OKWithData(ctx, version.Get())
}
