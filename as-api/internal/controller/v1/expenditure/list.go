package expenditure

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) List(ctx *gin.Context) {
	log.Info("list expenditures function called.")

	var r metav1.ListOptions
	if err := ctx.ShouldBindQuery(&r); err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrBind))
		return
	}

	r.Extend = make(map[string]string)
	if ty, ok := ctx.GetQuery("type"); ok && ty != "" {
		r.Extend["type"] = ty
	}
	if vid, ok := ctx.GetQuery("vehicle_id"); ok && vid != "" {
		r.Extend["vehicle_id"] = vid
	}
	if start, ok := ctx.GetQuery("expend_start"); ok && start != "" {
		r.Extend["expend_start"] = start
	}
	if end, ok := ctx.GetQuery("expend_end"); ok && end != "" {
		r.Extend["expend_end"] = end
	}
	if order, ok := ctx.GetQuery("expend_at_order"); ok && order != "" {
		if order == "ascend" {
			order = "asc"
		} else {
			order = "desc"
		}
		r.Order = order
	}

	users, err := c.svc.Expenditures().List(ctx, r)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, users)
}
