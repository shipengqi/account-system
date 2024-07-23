package dashboard

import (
	"github.com/shipengqi/log"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) TimelineProfit(ctx *gin.Context) {
	log.Info("get timeline profit function called.")

	vs := ctx.QueryArray("vehicles")
	ts := ctx.QueryArray("timeline")

	res, err := c.svc.Dashboard().TimelineProfit(ctx, vs, ts)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}
