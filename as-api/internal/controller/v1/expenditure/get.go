package expenditure

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) Get(ctx *gin.Context) {
	log.Info("get expenditure function called.")
	idstr := ctx.Param("id")
	id, err := strconv.Atoi(idstr)
	if err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrInvalidType))
	}
	user, err := c.svc.Expenditures().Get(ctx, id, metav1.GetOptions{})
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, user)
}
