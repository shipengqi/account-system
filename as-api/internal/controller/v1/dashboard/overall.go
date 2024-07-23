package dashboard

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) OverallExpenditure(ctx *gin.Context) {
	log.Info("get overall expenditure function called.")

	res, err := c.svc.Dashboard().OverallExpenditure(ctx)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}

func (c *Controller) OverallRevenueAndPayroll(ctx *gin.Context) {
	log.Info("get overall revenue and payroll function called.")

	res, err := c.svc.Dashboard().OverallRevenueAndPayroll(ctx)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, res)
}
