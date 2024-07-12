package project

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Get(ctx *gin.Context) {
	log.Info("get project function called.")

	user, err := c.svc.Projects().Get(ctx, ctx.Param("name"), metav1.GetOptions{})
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, user)
}
