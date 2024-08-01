package vehicle

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Update(ctx *gin.Context) {
	log.Info("update vehicle function called.")

	var r v1.Vehicle

	if err := ctx.ShouldBindJSON(&r); err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrBind))
		return
	}

	// Save changed fields.
	if err := c.svc.Vehicles().Update(ctx, &r, metav1.UpdateOptions{}); err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OK(ctx)
}
