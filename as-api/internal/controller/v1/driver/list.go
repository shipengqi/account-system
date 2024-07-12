package driver

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) List(ctx *gin.Context) {
	log.Info("list drivers function called.")

	var r metav1.ListOptions
	if err := ctx.ShouldBindQuery(&r); err != nil {
		response.Fail(ctx, errors.WithCode(err, code.ErrBind))
		return
	}

	users, err := c.svc.Drivers().List(ctx, r)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, users)
}
