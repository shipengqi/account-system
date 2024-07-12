package driver

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Create(ctx *gin.Context) {
	log.Info("driver create function called.")

	var u v1.Driver

	if err := ctx.ShouldBindJSON(&u); err != nil {
		response.Fail(ctx, err)
		return
	}

	if err := c.svc.Drivers().Create(ctx, &u, metav1.CreateOptions{}); err != nil {
		response.Fail(ctx, err)
		return
	}
	response.OKWithData(ctx, u)
}
