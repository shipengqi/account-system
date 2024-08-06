package queryutil

import "github.com/gin-gonic/gin"

func GetQueryOrder(ctx *gin.Context, orderKey string) string {
	if order, ok := ctx.GetQuery(orderKey); ok && order != "" {
		if order == "ascend" {
			order = "asc"
		} else {
			order = "desc"
		}
		return order
	}
	return ""
}
