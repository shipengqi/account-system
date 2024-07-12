package vehicle

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Get(ctx *gin.Context) {
	log.Info("get vehicle function called.")

	user, err := c.svc.Vehicles().Get(ctx, ctx.Param("number"), metav1.GetOptions{})
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, user)
}
