package dashboard

import (
	"strconv"

	"github.com/shipengqi/log"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) TimelineExpenditure(ctx *gin.Context) {
	log.Info("get timeline expenditure function called.")

	vs := ctx.QueryArray("vehicles")
	ts := ctx.QueryArray("timeline")
	tyi := -1
	if ty, ok := ctx.GetQuery("type"); ok && ty != "" {
		if conv, err := strconv.Atoi(ty); err == nil {
			tyi = conv
		}
	}

	res, err := c.svc.Dashboard().TimelineExpenditure(ctx, vs, ts, tyi)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}
