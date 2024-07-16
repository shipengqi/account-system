package dashboard

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Expenditure(ctx *gin.Context) {
	log.Info("get overall expenditure function called.")

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

func (c *Controller) Revenue(ctx *gin.Context) {
	log.Info("get overall revenue function called.")

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

func (c *Controller) Profit(ctx *gin.Context) {
	log.Info("get overall net profit function called.")

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

func (c *Controller) Payroll(ctx *gin.Context) {
	log.Info("get overall payroll function called.")

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
