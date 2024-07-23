package dashboard

import (
	"github.com/shipengqi/log"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) TimelineExpenditure(ctx *gin.Context) {
	log.Info("get timeline expenditure function called.")

	vs := ctx.QueryArray("vehicles")
	ts := ctx.QueryArray("timeline")

	res, err := c.svc.Dashboard().TimelineExpenditure(ctx, vs, ts)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}
