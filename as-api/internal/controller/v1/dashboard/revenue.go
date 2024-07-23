package dashboard

import (
	"github.com/shipengqi/log"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) TimelineRevenueAndPayroll(ctx *gin.Context) {
	log.Info("get timeline revenue and payroll function called.")

	vs := ctx.QueryArray("vehicles")
	ts := ctx.QueryArray("timeline")

	res, err := c.svc.Dashboard().TimelineRevenueAndPayroll(ctx, vs, ts)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}
