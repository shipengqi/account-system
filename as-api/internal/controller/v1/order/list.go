package order

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func (c *Controller) List(ctx *gin.Context) {
	log.Info("list orders function called.")

	var r metav1.ListOptions
	if err := ctx.ShouldBindQuery(&r); err != nil {
		response.Fail(ctx, errors.WithCode(err, code.ErrBind))
		return
	}

	r.Extend = make(map[string]string)
	if pid, ok := ctx.GetQuery("project_id"); ok && pid != "" {
		r.Extend["project_id"] = pid
	}
	if vid, ok := ctx.GetQuery("vehicle_id"); ok && vid != "" {
		r.Extend["vehicle_id"] = vid
	}
	if did, ok := ctx.GetQuery("driver_id"); ok && did != "" {
		r.Extend["driver_id"] = did
	}
	if start, ok := ctx.GetQuery("unload_start"); ok && start != "" {
		r.Extend["unload_start"] = start
	}
	if end, ok := ctx.GetQuery("unload_end"); ok && end != "" {
		r.Extend["unload_end"] = end
	}

	users, err := c.svc.Orders().List(ctx, r)
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	response.OKWithData(ctx, users)
}
