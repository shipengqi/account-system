package vehicle

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Delete(ctx *gin.Context) {
	log.Info("delete vehicle function called.")

	idstr := ctx.Query("id")
	id, err := strconv.Atoi(idstr)
	if err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrInvalidType))
	}
	if err = c.svc.Vehicles().Delete(ctx, id, metav1.DeleteOptions{Unscoped: true}); err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OK(ctx)
}
