package driver

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Get(ctx *gin.Context) {
	log.Info("get driver function called.")

	idstr := ctx.Param("id")
	id, err := strconv.Atoi(idstr)
	if err != nil {
		response.Fail(ctx, err)
	}
	user, err := c.svc.Drivers().Get(ctx, id, metav1.GetOptions{})
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, user)
}
